# 💳 Stripe Payment Integration Guide for PaiperSum

Complete guide to accepting payments and managing subscriptions with Stripe.

---

## Why Stripe?

**Benefits**:
- ✅ Industry standard for payments
- ✅ Handles all payment complexity
- ✅ Supports subscriptions natively
- ✅ PCI compliance handled
- ✅ Built-in fraud detection
- ✅ 135+ currencies supported
- ✅ Excellent documentation

**Cost**:
- 2.9% + 30¢ per successful charge
- No monthly fees
- No setup fees
- First $1M free processing for startups (apply at Stripe Atlas)

---

## Step 1: Create Stripe Account

1. Go to [https://stripe.com](https://stripe.com)
2. Click "Start now" (free to sign up)
3. Create your account
4. Complete business verification (required for live mode)
   - Business name: PaiperSum or your legal entity
   - Business type: LLC / Sole Proprietor / etc.
   - EIN/SSN for tax purposes

---

## Step 2: Get API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Click "Developers" in left sidebar
3. Click "API keys"
4. You'll see:
   - **Publishable key**: Starts with `pk_test_...` (safe to expose in frontend)
   - **Secret key**: Starts with `sk_test_...` (NEVER expose, backend only)

### Test Mode vs Live Mode
- **Test Mode**: Use test cards, no real money
- **Live Mode**: Real cards, real money (activate after testing)

Use toggle in top-right to switch modes.

---

## Step 3: Create Products and Prices

### Via Dashboard (Easier):

1. Go to **Products** → **Add product**

**Pro Monthly Subscription**:
- Name: `PaiperSum Pro`
- Description: `Unlimited document analyses, PDF exports, priority support`
- Pricing:
  - Model: `Recurring`
  - Price: `$20.00`
  - Billing period: `Monthly`
  - Currency: `USD`
- Click **Save product**
- **Copy the Price ID** (starts with `price_...`)

**Pro Yearly Subscription** (Optional - 17% discount):
- Same product, add new price
- Price: `$200.00`
- Billing period: `Yearly`
- Copy this Price ID too

### Via API (Automated):

```bash
# Create product
curl https://api.stripe.com/v1/products \
  -u sk_test_YOUR_SECRET_KEY: \
  -d name="PaiperSum Pro" \
  -d description="Unlimited analyses"

# Create price (monthly)
curl https://api.stripe.com/v1/prices \
  -u sk_test_YOUR_SECRET_KEY: \
  -d product=prod_YOUR_PRODUCT_ID \
  -d unit_amount=2000 \
  -d currency=usd \
  -d "recurring[interval]"=month
```

---

## Step 4: Set Up Webhooks

Webhooks notify your backend when payments succeed/fail.

### Create Webhook Endpoint:

1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Endpoint URL: `https://api.paipersum.com/stripe-webhook`
   - For local testing: use [Stripe CLI](#local-testing-with-stripe-cli)
4. Select events to listen to:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`
5. Click **Add endpoint**
6. **Copy the Webhook Signing Secret** (starts with `whsec_...`)

---

## Step 5: Environment Variables

### Backend (.env)
```bash
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_PUBLISHABLE_KEY=pk_test_51...
STRIPE_WEBHOOK_SECRET=whsec_...

# Price IDs
STRIPE_PRICE_MONTHLY=price_1...
STRIPE_PRICE_YEARLY=price_1...

# Other
STRIPE_SUCCESS_URL=https://paipersum.com/success
STRIPE_CANCEL_URL=https://paipersum.com/pricing
```

### Frontend (.env.local)
```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51...
VITE_API_URL=http://localhost:8000
```

---

## Step 6: Backend Implementation

### Install Stripe SDK

```bash
cd apps/api
pip install stripe
```

Add to `requirements.txt`:
```txt
stripe==7.4.0
```

### Create Stripe Service

Create `apps/api/stripe_service.py`:

```python
import stripe
import os
from typing import Optional

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

PRICE_MONTHLY = os.getenv("STRIPE_PRICE_MONTHLY")
PRICE_YEARLY = os.getenv("STRIPE_PRICE_YEARLY")

def create_checkout_session(
    user_email: str,
    user_id: str,
    price_id: str = PRICE_MONTHLY,
    success_url: str = "https://paipersum.com/success",
    cancel_url: str = "https://paipersum.com/pricing"
):
    """Create Stripe Checkout session for subscription"""
    try:
        session = stripe.checkout.Session.create(
            customer_email=user_email,
            client_reference_id=user_id,  # Your user ID
            payment_method_types=['card'],
            line_items=[{
                'price': price_id,
                'quantity': 1,
            }],
            mode='subscription',
            success_url=success_url + '?session_id={CHECKOUT_SESSION_ID}',
            cancel_url=cancel_url,
            metadata={
                'user_id': user_id,
            },
            # Auto-apply promo codes
            allow_promotion_codes=True,
        )
        return session
    except Exception as e:
        print(f"Error creating checkout session: {e}")
        raise

def create_customer_portal_session(customer_id: str, return_url: str = "https://paipersum.com/account"):
    """Create portal session for customer to manage subscription"""
    try:
        session = stripe.billing_portal.Session.create(
            customer=customer_id,
            return_url=return_url,
        )
        return session
    except Exception as e:
        print(f"Error creating portal session: {e}")
        raise

def cancel_subscription(subscription_id: str):
    """Cancel a subscription"""
    try:
        stripe.Subscription.delete(subscription_id)
    except Exception as e:
        print(f"Error canceling subscription: {e}")
        raise

def get_subscription(subscription_id: str):
    """Get subscription details"""
    try:
        return stripe.Subscription.retrieve(subscription_id)
    except Exception as e:
        print(f"Error retrieving subscription: {e}")
        raise
```

### Update API Routes

Add to `apps/api/main.py`:

```python
from fastapi import Header, HTTPException
from stripe_service import (
    create_checkout_session,
    create_customer_portal_session
)
import stripe
import os

@app.post("/api/create-checkout-session")
async def api_create_checkout(
    price_id: str,
    user_id: str,
    user_email: str
):
    """Create Stripe checkout session"""
    try:
        session = create_checkout_session(
            user_email=user_email,
            user_id=user_id,
            price_id=price_id
        )
        return {"checkout_url": session.url, "session_id": session.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/create-portal-session")
async def api_create_portal(
    customer_id: str,
    return_url: str = "https://paipersum.com/account"
):
    """Create customer portal session"""
    try:
        session = create_customer_portal_session(customer_id, return_url)
        return {"portal_url": session.url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/stripe-webhook")
async def stripe_webhook(
    request: Request,
    stripe_signature: str = Header(None)
):
    """Handle Stripe webhooks"""
    payload = await request.body()
    sig_header = stripe_signature
    webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, webhook_secret
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        raise HTTPException(status_code=400, detail="Invalid signature")
    
    # Handle different event types
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        user_id = session.get('client_reference_id')
        customer_id = session.get('customer')
        subscription_id = session.get('subscription')
        
        # Update user in database
        # db.query(User).filter(User.id == user_id).update({
        #     'is_pro': True,
        #     'stripe_customer_id': customer_id,
        #     'stripe_subscription_id': subscription_id,
        #     'subscription_status': 'active'
        # })
        
        print(f"✅ Subscription created for user {user_id}")
    
    elif event['type'] == 'customer.subscription.updated':
        subscription = event['data']['object']
        status = subscription['status']
        subscription_id = subscription['id']
        
        # Update subscription status
        # db.query(User).filter(
        #     User.stripe_subscription_id == subscription_id
        # ).update({'subscription_status': status})
        
        print(f"📝 Subscription {subscription_id} updated to {status}")
    
    elif event['type'] == 'customer.subscription.deleted':
        subscription = event['data']['object']
        subscription_id = subscription['id']
        
        # Mark user as no longer pro
        # db.query(User).filter(
        #     User.stripe_subscription_id == subscription_id
        # ).update({
        #     'is_pro': False,
        #     'subscription_status': 'canceled'
        # })
        
        print(f"❌ Subscription {subscription_id} canceled")
    
    elif event['type'] == 'invoice.payment_failed':
        invoice = event['data']['object']
        customer_id = invoice['customer']
        
        # Send email to customer about failed payment
        # email_service.send_payment_failed(customer_id)
        
        print(f"⚠️ Payment failed for customer {customer_id}")
    
    return {"status": "success"}
```

---

## Step 7: Frontend Implementation

### Install Stripe.js

```bash
cd apps/web
npm install @stripe/stripe-js
```

### Create Stripe Hook

Create `apps/web/src/hooks/useStripe.ts`:

```typescript
import { loadStripe, Stripe } from '@stripe/stripe-js'
import { useState, useEffect } from 'react'

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
)

export function useStripe() {
  const [stripe, setStripe] = useState<Stripe | null>(null)
  
  useEffect(() => {
    stripePromise.then(setStripe)
  }, [])
  
  return stripe
}

export async function createCheckoutSession(
  userEmail: string,
  userId: string,
  priceId: string
) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/create-checkout-session`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_email: userEmail,
        user_id: userId,
        price_id: priceId,
      }),
    }
  )
  
  if (!response.ok) {
    throw new Error('Failed to create checkout session')
  }
  
  const data = await response.json()
  return data.checkout_url
}

export async function createPortalSession(customerId: string) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/create-portal-session`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer_id: customerId }),
    }
  )
  
  if (!response.ok) {
    throw new Error('Failed to create portal session')
  }
  
  const data = await response.json()
  return data.portal_url
}
```

### Update Upgrade Button

In `App.tsx`, replace the upgrade button:

```typescript
import { createCheckoutSession } from './hooks/useStripe'

// In your component:
const handleUpgrade = async () => {
  if (!user) {
    setShowAuth(true)
    return
  }
  
  try {
    const priceId = import.meta.env.VITE_STRIPE_PRICE_MONTHLY
    const checkoutUrl = await createCheckoutSession(
      user.email,
      user.id,
      priceId
    )
    
    // Redirect to Stripe Checkout
    window.location.href = checkoutUrl
  } catch (error) {
    console.error('Failed to create checkout:', error)
    alert('Failed to start checkout. Please try again.')
  }
}

// Then use it:
<button onClick={handleUpgrade} className="...">
  Upgrade to Pro →
</button>
```

---

## Step 8: Success Page

Create `apps/web/src/pages/SuccessPage.tsx`:

```typescript
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

export default function SuccessPage() {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
  
  useEffect(() => {
    // Optionally verify the session on your backend
    if (sessionId) {
      // Mark user as pro in your database
      // fetch('/api/verify-session', { body: { session_id: sessionId } })
    }
  }, [sessionId])
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to Pro!
        </h1>
        <p className="text-gray-600 mb-6">
          Your subscription is now active. Enjoy unlimited document analyses!
        </p>
        <a
          href="/"
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg transition inline-block"
        >
          Start Analyzing →
        </a>
      </div>
    </div>
  )
}
```

---

## Step 9: Customer Portal (Manage Subscription)

In account page, add button to manage subscription:

```typescript
import { createPortalSession } from '../hooks/useStripe'

const handleManageSubscription = async () => {
  if (!user?.stripeCustomerId) return
  
  try {
    const portalUrl = await createPortalSession(user.stripeCustomerId)
    window.location.href = portalUrl
  } catch (error) {
    console.error('Failed to open portal:', error)
  }
}

// In your JSX:
{user.isPro && (
  <button onClick={handleManageSubscription} className="...">
    Manage Subscription
  </button>
)}
```

The portal allows customers to:
- Update payment method
- View invoices
- Cancel subscription
- Update billing address

---

## Local Testing with Stripe CLI

### Install Stripe CLI

**Mac**:
```bash
brew install stripe/stripe-cli/stripe
```

**Windows**:
```bash
scoop install stripe
```

**Linux**:
```bash
wget https://github.com/stripe/stripe-cli/releases/latest/download/stripe_linux_amd64.tar.gz
tar -xvf stripe_linux_amd64.tar.gz
sudo mv stripe /usr/local/bin
```

### Login to Stripe
```bash
stripe login
```

### Forward Webhooks to Localhost
```bash
stripe listen --forward-to localhost:8000/stripe-webhook
```

This gives you a webhook signing secret starting with `whsec_...`  
Add it to your `.env` as `STRIPE_WEBHOOK_SECRET`

### Test Webhooks
```bash
stripe trigger checkout.session.completed
```

---

## Test Cards

Use these in test mode:

**Success**:
- Card: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

**Decline**:
- Card: `4000 0000 0000 0002`

**Requires Authentication** (3D Secure):
- Card: `4000 0025 0000 3155`

**More test cards**: [https://stripe.com/docs/testing](https://stripe.com/docs/testing)

---

## Going Live

### 1. Activate Live Mode
1. Complete business verification in Stripe Dashboard
2. Add bank account for payouts
3. Set up tax settings

### 2. Switch Keys
Replace test keys with live keys:
- `pk_test_...` → `pk_live_...`
- `sk_test_...` → `sk_live_...`

### 3. Create Live Products
Recreate your products in live mode (they don't copy over)

### 4. Update Webhook Endpoint
Point to your production URL: `https://api.paipersum.com/stripe-webhook`

### 5. Test with Real Card
Make a real $1 payment to verify everything works, then refund it

---

## Handling Edge Cases

### Failed Payments
```python
# In webhook handler:
elif event['type'] == 'invoice.payment_failed':
    # Send email
    # Update user status to 'past_due'
    # Give 3-day grace period
    pass
```

### Subscription Upgrades
```python
def upgrade_subscription(subscription_id: str, new_price_id: str):
    stripe.Subscription.modify(
        subscription_id,
        items=[{
            'id': subscription_item_id,
            'price': new_price_id,
        }],
        proration_behavior='always_invoice',  # Prorate immediately
    )
```

### Refunds
```python
def refund_payment(payment_intent_id: str, amount: Optional[int] = None):
    stripe.Refund.create(
        payment_intent=payment_intent_id,
        amount=amount,  # None = full refund
    )
```

---

## Pricing Best Practices

### Recommended Tiers:

**Free Tier**:
- 5 analyses/month
- Basic features
- Conversion goal: 3-5%

**Pro Tier** - $20/month:
- Unlimited analyses
- All features
- PDF export
- Priority support
- Target: 70% of paid users

**Business Tier** - $79/month:
- Everything in Pro
- Team accounts (5 users)
- API access
- Custom branding
- Target: 20% of paid users

**Enterprise** - Custom:
- Volume licensing
- White-label
- Dedicated support
- Target: 10% of paid users

### Psychological Pricing Tips:
- ✅ Use $19.99 instead of $20 (feels cheaper)
- ✅ Offer annual plan with discount (2 months free)
- ✅ Show "most popular" badge on mid-tier
- ✅ Display savings prominently
- ✅ Use social proof ("Join 1,000+ Pro users")

---

## Analytics & Metrics

### Key Stripe Metrics to Track:

1. **MRR** (Monthly Recurring Revenue)
2. **Churn Rate** (% customers who cancel)
3. **LTV** (Lifetime Value per customer)
4. **CAC** (Customer Acquisition Cost)
5. **Conversion Rate** (free → paid)

### Stripe Dashboard Shows:
- Revenue trends
- Active subscriptions
- Failed payments
- Customer lifetime value
- Churn analysis

---

## Troubleshooting

### "No such customer"
**Solution**: Customer ID doesn't exist. Double-check the ID.

### "Webhook signature verification failed"
**Solution**: Webhook secret doesn't match. Re-copy from Stripe Dashboard.

### "Payment method required"
**Solution**: Customer needs to add payment method before subscribing.

### "Rate limit exceeded"
**Solution**: You're making too many API requests. Implement caching.

---

## Security Checklist

### ✅ DO:
- Store secret key in environment variables
- Verify webhook signatures
- Use HTTPS in production
- Implement idempotency keys for payment operations
- Log all payment events
- Handle failed payments gracefully

### ❌ DON'T:
- Don't expose secret key in frontend
- Don't store credit card numbers (Stripe does this)
- Don't skip webhook signature verification
- Don't process payments without user confirmation
- Don't forget to handle edge cases (failed payments, cancellations)

---

## Cost Breakdown

### Stripe Fees:
- **2.9% + $0.30** per successful card charge
- **0.5%** for international cards
- **1%** for currency conversion
- **No monthly fees**

### Example Costs:

**Monthly ($20 subscription)**:
- Gross: $20.00
- Stripe fee: -$0.88 (2.9% + $0.30)
- Net: $19.12

**Yearly ($200 subscription)**:
- Gross: $200.00
- Stripe fee: -$6.10
- Net: $193.90

### Tips to Reduce Costs:
- Encourage annual subscriptions (fewer transactions)
- Use ACH payments ($0.80 flat fee, better for high-value)
- Negotiate rates after $80K/month volume

---

## Next Steps

1. ✅ Sign up for Stripe
2. ✅ Create products and prices
3. ✅ Set up webhooks
4. ✅ Implement checkout flow
5. ✅ Test with test cards
6. ✅ Handle webhook events
7. ✅ Go live!

---

## Resources

- **Stripe Dashboard**: https://dashboard.stripe.com
- **Stripe Docs**: https://stripe.com/docs
- **Test Cards**: https://stripe.com/docs/testing
- **Webhooks Guide**: https://stripe.com/docs/webhooks
- **Support**: https://support.stripe.com

**Setup Time**: 1-3 hours  
**Difficulty**: Moderate  
**Cost**: 2.9% + $0.30 per transaction  
**Worth It**: Absolutely!

Let's start making money! 💰
