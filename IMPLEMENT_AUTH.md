# 🔐 Implementing User Authentication (Supabase)

**Time:** 3-5 hours  
**Cost:** $0 (free tier)  
**Difficulty:** Medium

---

## Step 1: Set Up Supabase (15 minutes)

1. Go to https://supabase.com and sign up (free)
2. Click "New Project"
   - Name: `paipersum`
   - Database Password: (generate strong one, save it)
   - Region: Closest to you
3. Wait 2 minutes for project to provision
4. Go to Settings → API
5. Copy these values:
   ```
   Project URL: https://xxxxx.supabase.co
   anon public key: eyJhbG...
   service_role key: eyJhbG... (keep secret!)
   ```

---

## Step 2: Install Supabase in Frontend (5 minutes)

```bash
cd apps/web
npm install @supabase/supabase-js
```

Create `apps/web/src/lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helpers
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  if (error) throw error
  return data
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  if (error) throw error
}
```

---

## Step 3: Create Auth UI Components (1 hour)

Create `apps/web/src/components/AuthModal.tsx`:
```typescript
import { useState } from 'react'
import { signUp, signIn, resetPassword } from '../lib/supabase'

type Mode = 'signin' | 'signup' | 'reset'

export default function AuthModal({ onClose, onSuccess }: { 
  onClose: () => void
  onSuccess: () => void 
}) {
  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      if (mode === 'signin') {
        await signIn(email, password)
        onSuccess()
      } else if (mode === 'signup') {
        await signUp(email, password)
        setMessage('Check your email to confirm your account!')
      } else if (mode === 'reset') {
        await resetPassword(email)
        setMessage('Password reset email sent!')
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {mode === 'signin' && 'Sign In'}
            {mode === 'signup' && 'Create Account'}
            {mode === 'reset' && 'Reset Password'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
              placeholder="you@example.com"
            />
          </div>

          {mode !== 'reset' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                placeholder="••••••••"
              />
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          {message && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90 disabled:opacity-50 font-medium"
          >
            {loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm space-y-2">
          {mode === 'signin' && (
            <>
              <button onClick={() => setMode('reset')} className="text-brand-blue hover:underline">
                Forgot password?
              </button>
              <div>
                Don't have an account?{' '}
                <button onClick={() => setMode('signup')} className="text-brand-blue hover:underline font-medium">
                  Sign up
                </button>
              </div>
            </>
          )}
          
          {mode === 'signup' && (
            <div>
              Already have an account?{' '}
              <button onClick={() => setMode('signin')} className="text-brand-blue hover:underline font-medium">
                Sign in
              </button>
            </div>
          )}

          {mode === 'reset' && (
            <button onClick={() => setMode('signin')} className="text-brand-blue hover:underline">
              Back to sign in
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
```

---

## Step 4: Add Auth to App (30 minutes)

Update `apps/web/src/App.tsx` to include auth:

```typescript
import { useState, useEffect } from 'react'
import { supabase, getCurrentUser, signOut } from './lib/supabase'
import AuthModal from './components/AuthModal'
// ... rest of imports

export default function App() {
  const [user, setUser] = useState<any>(null)
  const [showAuth, setShowAuth] = useState(false)
  // ... existing state

  useEffect(() => {
    // Check for existing session
    getCurrentUser().then(setUser)

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setUser(null)
  }

  // Update HeaderBar to show user
  const header = (
    <div className="w-full flex items-center gap-4">
      {/* ... existing header content ... */}
      <div className="ml-auto flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-ink-600">{user.email}</span>
            <button onClick={handleSignOut} className="text-sm px-3 py-1.5 border rounded-lg hover:bg-paper-100">
              Sign Out
            </button>
          </>
        ) : (
          <button 
            onClick={() => setShowAuth(true)}
            className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90"
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  )

  return (
    <>
      <Consent />
      {showAuth && (
        <AuthModal 
          onClose={() => setShowAuth(false)}
          onSuccess={() => setShowAuth(false)}
        />
      )}
      <AppShell header={header} sidebar={sidebar}>
        {/* ... rest of app ... */}
      </AppShell>
    </>
  )
}
```

---

## Step 5: Add Environment Variables

Create `apps/web/.env.local`:
```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
VITE_API_URL=http://localhost:8000
```

---

## Step 6: Protect API Routes (1 hour)

Install Supabase in backend:
```bash
cd apps/api
pip install supabase
```

Create `apps/api/auth.py`:
```python
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import create_client, Client
import os

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_KEY')

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify JWT token and return user"""
    token = credentials.credentials
    
    try:
        # Verify token with Supabase
        user = supabase.auth.get_user(token)
        
        if not user:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        return user
        
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

# Optional: Make endpoint require login
# from fastapi import Depends
# @app.post('/analyze', dependencies=[Depends(get_current_user)])
```

---

## Step 7: Add Usage Tracking (1 hour)

In Supabase Dashboard, go to SQL Editor and run:

```sql
-- Create usage tracking table
create table if not exists usage (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  action text not null,  -- 'analyze_text', 'analyze_file', 'export_pdf'
  created_at timestamp with time zone default now()
);

-- Create index for fast lookups
create index usage_user_id_idx on usage(user_id);
create index usage_created_at_idx on usage(created_at);

-- Function to count usage this month
create or replace function get_monthly_usage(uid uuid)
returns bigint as $$
  select count(*)
  from usage
  where user_id = uid
  and action = 'analyze_text'
  and created_at >= date_trunc('month', current_date);
$$ language sql security definer;
```

Update `apps/api/main.py` to track usage:
```python
from auth import supabase, get_current_user

@app.post('/analyze', response_model=AnalyzeOut)
async def analyze(inp: AnalyzeIn, user = Depends(get_current_user)):
    # Check usage limit (free tier: 30/month)
    result = supabase.rpc('get_monthly_usage', {'uid': user.id}).execute()
    usage_count = result.data
    
    # Check if user has pro subscription (implement later)
    is_pro = False  # TODO: Check subscription status
    
    if not is_pro and usage_count >= 30:
        raise HTTPException(
            status_code=429,
            detail="Monthly limit reached. Upgrade to Pro for unlimited analyses."
        )
    
    # Track this usage
    supabase.table('usage').insert({
        'user_id': user.id,
        'action': 'analyze_text'
    }).execute()
    
    # ... rest of analyze logic ...
```

---

## Step 8: Deploy With Auth (30 minutes)

Update Render environment variables:
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbG... (the service_role key)
```

Update Vercel environment variables:
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG... (the anon public key)
```

Redeploy both:
```bash
# Frontend
cd apps/web
vercel --prod

# Backend - just git push, Render auto-deploys
```

---

## Step 9: Test Auth Flow (15 minutes)

1. Visit https://paipersum.com
2. Click "Sign In"
3. Click "Create Account"
4. Enter email/password
5. Check email for confirmation
6. Click confirmation link
7. Sign in
8. See your email in header
9. Analyze a document (usage tracked)
10. Sign out

**If everything works → Auth is done! ✅**

---

## Troubleshooting

**"Invalid token" error:**
- Make sure SUPABASE_SERVICE_KEY is set in Render
- Check token is being sent in Authorization header

**Email confirmation not received:**
- Check spam folder
- In Supabase → Authentication → Email Templates → confirm it's enabled
- For development, disable email confirmation in Supabase settings

**CORS errors:**
- Add your domain to Supabase → Settings → API → CORS
- Or disable CORS in Supabase for testing

---

## Next: Add Payments

Once auth works, move to `IMPLEMENT_PAYMENTS.md`
