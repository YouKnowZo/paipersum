# 💳 Implementing Stripe Payments

**Time:** 4-6 hours  
**Cost:** $0 setup (2.9% + 30¢ per transaction)  
**Difficulty:** Medium

**Prerequisites:** Auth must be working first (see IMPLEMENT_AUTH.md)

---

## Step 1: Stripe Account Setup (15 minutes)

1. Go to https://stripe.com and sign up
2. **Skip** business verification for now (can do later)
3. Stay in **TEST MODE** (toggle in top-right)
4. Go to Developers → API Keys
5. Copy:
   ```
   Publishable key: pk_test_...
   Secret key: sk_test_...
   ```

---

## Step 2: Create Products in Stripe (10 minutes)

1. Go to Products → Add Product
2. Create **Pro Plan**:
   - Name: `PaiperSum Pro`
   - Description: `Unlimited document analysis`
   - Pricing: `$12.00 USD / month`
   - Recurring payment
   - Click "Add pricing"
3. Copy the **Price ID** (starts with `price_...`)

---

## Step 3: Install Stripe in Backend (5 minutes)

```bash
cd apps/api
pip install stripe python-dotenv
```

Add to `requirements.txt`:
```
stripe==11.1.1
```

---

## Step 4: Create Stripe Endpoints (1 hour)

Create `apps/api/billing.py`:
```python
from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
import stripe
import os
from auth import get_current_user, supabase

router = APIRouter(prefix="/billing", tags=["billing"])

# Configure Stripe
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')
STRIPE_PRICE_ID = os.getenv('STRIPE_PRICE_ID')  # Your Pro plan price ID
WEBHOOK_SECRET = os.getenv('STRIPE_WEBHOOK_SECRET')

class CreateCheckoutSessionRequest(BaseModel):
    success_url: str
    cancel_url: str

@router.post('/create-checkout-session')
async def create_checkout_session(
    req: CreateCheckoutSessionRequest,
    user = Depends(get_current_user)
):
    """Create Stripe checkout session for Pro subscription"""
    try:
        # Get or create Stripe customer
        customer_id = await get_or_create_customer(user)
        
        # Create checkout session
        session = stripe.checkout.Session.create(
            customer=customer_id,
            payment_method_types=['card'],
            line_items=[{
                'price': STRIPE_PRICE_ID,
                'quantity': 1,
            }],
            mode='subscription',
            success_url=req.success_url + '?session_id={CHECKOUT_SESSION_ID}',
            cancel_url=req.cancel_url,
            metadata={
                'user_id': user.id
            }
        )
        
        return {'checkout_url': session.url}
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post('/create-portal-session')
async def create_portal_session(user = Depends(get_current_user)):
    """Create customer portal session for managing subscription"""
    try:
        customer_id = await get_or_create_customer(user)
        
        session = stripe.billing_portal.Session.create(
            customer=customer_id,
            return_url=os.getenv('FRONTEND_URL', 'http://localhost:5173'),
        )
        
        return {'portal_url': session.url}
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post('/webhook')
async def stripe_webhook(request: Request):
    """Handle Stripe webhooks"""
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, WEBHOOK_SECRET
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    # Handle different event types
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        await handle_successful_payment(session)
        
    elif event['type'] == 'customer.subscription.updated':
        subscription = event['data']['object']
        await handle_subscription_update(subscription)
        
    elif event['type'] == 'customer.subscription.deleted':
        subscription = event['data']['object']
        await handle_subscription_cancelled(subscription)
    
    return {'status': 'success'}

async def get_or_create_customer(user):
    """Get or create Stripe customer for user"""
    # Check if user already has customer_id in database
    result = supabase.table('users').select('stripe_customer_id').eq('id', user.id).execute()
    
    if result.data and result.data[0].get('stripe_customer_id'):
        return result.data[0]['stripe_customer_id']
    
    # Create new customer
    customer = stripe.Customer.create(
        email=user.email,
        metadata={'user_id': user.id}
    )
    
    # Save customer ID to database
    supabase.table('users').update({
        'stripe_customer_id': customer.id
    }).eq('id', user.id).execute()
    
    return customer.id

async def handle_successful_payment(session):
    """Mark user as Pro after successful payment"""
    user_id = session['metadata']['user_id']
    customer_id = session['customer']
    subscription_id = session['subscription']
    
    # Update user to Pro status
    supabase.table('users').update({
        'subscription_status': 'active',
        'subscription_id': subscription_id,
        'stripe_customer_id': customer_id,
    }).eq('id', user_id).execute()

async def handle_subscription_update(subscription):
    """Handle subscription status changes"""
    customer_id = subscription['customer']
    status = subscription['status']
    
    # Find user by customer ID
    result = supabase.table('users').select('id').eq('stripe_customer_id', customer_id).execute()
    
    if result.data:
        user_id = result.data[0]['id']
        supabase.table('users').update({
            'subscription_status': status
        }).eq('id', user_id).execute()

async def handle_subscription_cancelled(subscription):
    """Handle subscription cancellation"""
    customer_id = subscription['customer']
    
    # Find user and mark as inactive
    result = supabase.table('users').select('id').eq('stripe_customer_id', customer_id).execute()
    
    if result.data:
        user_id = result.data[0]['id']
        supabase.table('users').update({
            'subscription_status': 'cancelled'
        }).eq('id', user_id).execute()

@router.get('/subscription-status')
async def get_subscription_status(user = Depends(get_current_user)):
    """Get current user's subscription status"""
    result = supabase.table('users').select('subscription_status, subscription_id').eq('id', user.id).execute()
    
    if not result.data:
        return {'status': 'free', 'subscription_id': None}
    
    data = result.data[0]
    status = data.get('subscription_status', 'free')
    subscription_id = data.get('subscription_id')
    
    # If they have an active subscription, get details from Stripe
    if subscription_id and status == 'active':
        subscription = stripe.Subscription.retrieve(subscription_id)
        return {
            'status': subscription.status,
            'current_period_end': subscription.current_period_end,
            'cancel_at_period_end': subscription.cancel_at_period_end,
        }
    
    return {'status': status}
```

Update `apps/api/main.py`:
```python
from billing import router as billing_router

app.include_router(billing_router)
```

---

## Step 5: Update Supabase Database (10 minutes)

In Supabase SQL Editor, run:
```sql
-- Add subscription fields to users
alter table auth.users add column if not exists stripe_customer_id text;
alter table auth.users add column if not exists subscription_status text default 'free';
alter table auth.users add column if not exists subscription_id text;

-- Create index
create index if not exists users_stripe_customer_id_idx on auth.users(stripe_customer_id);
```

---

## Step 6: Create Frontend Pricing Page (1 hour)

Create `apps/web/src/components/PricingModal.tsx`:
```typescript
import { useState } from 'react'
import axios from 'axios'

export default function PricingModal({ 
  onClose, 
  currentPlan = 'free' 
}: { 
  onClose: () => void
  currentPlan?: string
}) {
  const [loading, setLoading] = useState(false)
  const API_URL = import.meta.env.VITE_API_URL

  const handleUpgrade = async () => {
    setLoading(true)
    try {
      const response = await axios.post(`${API_URL}/billing/create-checkout-session`, {
        success_url: `${window.location.origin}?upgraded=true`,
        cancel_url: window.location.origin,
      }, {
        headers: {
          'Authorization': `Bearer ${await getToken()}` // Get from Supabase auth
        }
      })
      
      window.location.href = response.data.checkout_url
    } catch (error) {
      alert('Failed to create checkout session')
    } finally {
      setLoading(false)
    }
  }

  const handleManageBilling = async () => {
    setLoading(true)
    try {
      const response = await axios.post(`${API_URL}/billing/create-portal-session`, {}, {
        headers: {
          'Authorization': `Bearer ${await getToken()}`
        }
      })
      
      window.location.href = response.data.portal_url
    } catch (error) {
      alert('Failed to open billing portal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl shadow-lg max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Choose Your Plan</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Free Plan */}
          <div className="border-2 rounded-xl p-6">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold mb-2">Free</h3>
              <div className="text-4xl font-bold mb-2">$0</div>
              <div className="text-gray-600 text-sm">per month</div>
            </div>
            
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">30 documents per month</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Basic analysis</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">PDF export</span>
              </li>
            </ul>

            {currentPlan === 'free' && (
              <div className="text-center py-2 text-gray-600 font-medium">
                Current Plan
              </div>
            )}
          </div>

          {/* Pro Plan */}
          <div className="border-2 border-brand-blue rounded-xl p-6 bg-gradient-to-br from-brand-blue/5 to-brand-blue/10 relative">
            <div className="absolute top-0 right-0 bg-brand-blue text-white px-3 py-1 rounded-bl-lg rounded-tr-lg text-xs font-bold">
              POPULAR
            </div>
            
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold mb-2">Pro</h3>
              <div className="text-4xl font-bold mb-2 text-brand-blue">$12</div>
              <div className="text-gray-600 text-sm">per month</div>
            </div>
            
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-brand-blue mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">Unlimited documents</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-brand-blue mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">Advanced analysis</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-brand-blue mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">Document history</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-brand-blue mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">Priority support</span>
              </li>
            </ul>

            {currentPlan === 'active' ? (
              <button
                onClick={handleManageBilling}
                disabled={loading}
                className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Manage Billing'}
              </button>
            ) : (
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full px-4 py-3 bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90 font-medium disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Upgrade to Pro'}
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-600">
          <p>Cancel anytime. No questions asked. Powered by Stripe.</p>
        </div>
      </div>
    </div>
  )
}

// Helper to get auth token
async function getToken() {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token || ''
}
```

---

## Step 7: Show Usage Limits (30 minutes)

Create `apps/web/src/components/UsageCounter.tsx`:
```typescript
import { useEffect, useState } from 'react'
import axios from 'axios'
import { supabase } from '../lib/supabase'

export default function UsageCounter({ onUpgrade }: { onUpgrade: () => void }) {
  const [usage, setUsage] = useState<{ used: number, limit: number } | null>(null)
  const [isPro, setIsPro] = useState(false)

  useEffect(() => {
    fetchUsage()
  }, [])

  const fetchUsage = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/usage`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      })

      setUsage(response.data)
      setIsPro(response.data.limit === -1) // -1 means unlimited
    } catch (error) {
      console.error('Failed to fetch usage')
    }
  }

  if (!usage || isPro) return null

  const percentage = (usage.used / usage.limit) * 100
  const remaining = usage.limit - usage.used

  return (
    <div className="bg-white border rounded-xl p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">Monthly Usage</span>
        <span className="text-xs text-gray-600">{usage.used} / {usage.limit} documents</span>
      </div>

      <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
        <div 
          className={`h-2 transition-all ${percentage >= 90 ? 'bg-red-500' : percentage >= 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      {remaining <= 5 && (
        <div className="text-sm text-red-600 mb-2">
          ⚠️ Only {remaining} documents left this month
        </div>
      )}

      {remaining === 0 && (
        <button
          onClick={onUpgrade}
          className="w-full px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90 font-medium text-sm"
        >
          Upgrade to Pro for Unlimited
        </button>
      )}
    </div>
  )
}
```

---

## Step 8: Set Up Webhook (15 minutes)

1. In Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://your-api.onrender.com/billing/webhook`
4. Events to send:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the **Signing secret** (starts with `whsec_...`)

---

## Step 9: Add Environment Variables

**Render (API):**
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=https://paipersum.com
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbG...
```

---

## Step 10: Test Payment Flow (30 minutes)

1. Deploy updates
2. Visit https://paipersum.com
3. Sign in
4. Click "Upgrade to Pro"
5. Use test card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits
6. Complete checkout
7. Verify:
   - Redirected back to site
   - Shows as Pro user
   - No usage limits
8. In Stripe Dashboard:
   - See new subscription
   - See new customer

**If all works → Payments done! ✅**

---

## Step 11: Go Live (When Ready)

1. In Stripe, complete business verification
2. Switch from Test Mode to Live Mode
3. Create products again in Live Mode
4. Update environment variables with **LIVE** keys
5. Re-deploy

---

## Next Steps

- Add "Upgrade" prompts when users hit limits
- Send welcome email to new Pro users
- Add billing page to show invoices
- Implement annual billing (20% discount)

**Total time to revenue: 4-6 hours of focused work!**
