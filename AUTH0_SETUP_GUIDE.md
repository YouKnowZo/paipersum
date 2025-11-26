# 🔐 Auth0 Setup Guide for PaiperSum

This guide will walk you through setting up Auth0 for proper user authentication.

---

## Step 1: Create Auth0 Account

1. Go to [https://auth0.com](https://auth0.com)
2. Click "Sign Up" (it's FREE for up to 7,000 active users)
3. Create your account with email or Google

---

## Step 2: Create Your Application

1. After logging in, go to **Applications** → **Applications**
2. Click **"Create Application"**
3. Choose:
   - Name: `PaiperSum Web`
   - Application Type: **Single Page Application**
4. Click **Create**

---

## Step 3: Configure Application Settings

### Allowed Callback URLs
Add these URLs (separated by commas):
```
http://localhost:5173,
https://paipersum.com,
https://www.paipersum.com,
https://app.paipersum.com
```

### Allowed Logout URLs
Add the same URLs:
```
http://localhost:5173,
https://paipersum.com,
https://www.paipersum.com,
https://app.paipersum.com
```

### Allowed Web Origins
Add the same URLs again:
```
http://localhost:5173,
https://paipersum.com,
https://www.paipersum.com,
https://app.paipersum.com
```

### Allowed Origins (CORS)
Add the same URLs:
```
http://localhost:5173,
https://paipersum.com,
https://www.paipersum.com,
https://app.paipersum.com
```

Click **Save Changes** at the bottom.

---

## Step 4: Get Your Credentials

From your application settings page, copy these values:

1. **Domain** (e.g., `your-tenant.us.auth0.com`)
2. **Client ID** (e.g., `abc123xyz456...`)

---

## Step 5: Create Auth0 API

1. Go to **Applications** → **APIs**
2. Click **"Create API"**
3. Configure:
   - Name: `PaiperSum API`
   - Identifier: `https://api.paipersum.com` (This is your audience)
   - Signing Algorithm: `RS256`
4. Click **Create**

---

## Step 6: Configure Social Connections (Optional but Recommended)

### Enable Google Sign-In:
1. Go to **Authentication** → **Social**
2. Find **Google** and click it
3. Toggle it **ON**
4. (Optional) Use Auth0's dev keys for testing, or add your own:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create OAuth 2.0 credentials
   - Add redirect URI: `https://your-tenant.us.auth0.com/login/callback`
5. Click **Save**

### Enable Other Providers (Optional):
- GitHub
- LinkedIn
- Microsoft
- Apple

---

## Step 7: Update Environment Variables

### For Development (apps/web/.env.local)
Create this file if it doesn't exist:

```bash
# Auth0 Configuration
VITE_AUTH0_DOMAIN=your-tenant.us.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id-from-step-4
VITE_AUTH0_AUDIENCE=https://api.paipersum.com

# API URL
VITE_API_URL=http://localhost:8000
```

### For Production (Vercel/Netlify Environment Variables)
Add these to your hosting platform:

```bash
VITE_AUTH0_DOMAIN=your-tenant.us.auth0.com
VITE_AUTH0_CLIENT_ID=your-production-client-id
VITE_AUTH0_AUDIENCE=https://api.paipersum.com
VITE_API_URL=https://api.paipersum.com
```

---

## Step 8: Backend API Configuration

### Install Dependencies (apps/api)
```bash
cd apps/api
pip install python-jose[cryptography] python-multipart
```

### Update requirements.txt
```txt
python-jose[cryptography]==3.3.0
python-multipart==0.0.6
```

---

## Step 9: Test Your Setup

1. Start your backend:
   ```bash
   cd apps/api
   python -m uvicorn main:app --reload
   ```

2. Start your frontend:
   ```bash
   cd apps/web
   npm run dev
   ```

3. Open http://localhost:5173

4. Click "Sign in / Create account"

5. You should see Auth0's login screen

6. Sign up with email or Google

7. You should be redirected back to your app, logged in!

---

## Step 10: Verify JWT Tokens in Backend

The backend needs to verify Auth0 tokens. This is already implemented in the codebase, but here's what's happening:

```python
# Backend verifies tokens like this:
from jose import jwt
from jose.exceptions import JWTError

def verify_token(token: str):
    # Get Auth0 public key
    jwks_url = f'https://{AUTH0_DOMAIN}/.well-known/jwks.json'
    
    # Verify and decode token
    payload = jwt.decode(
        token,
        key,
        algorithms=["RS256"],
        audience=AUTH0_AUDIENCE,
        issuer=f"https://{AUTH0_DOMAIN}/"
    )
    return payload
```

---

## Troubleshooting

### Issue: "Callback URL mismatch"
**Solution**: Make sure you added ALL callback URLs in Auth0 settings, including the exact port (5173 for Vite).

### Issue: "Invalid state"
**Solution**: Clear your browser cookies and try again. This happens if you changed Auth0 settings mid-session.

### Issue: "CORS error"
**Solution**: Add your frontend URL to "Allowed Web Origins" in Auth0 application settings.

### Issue: "Token verification failed"
**Solution**: 
- Check that `VITE_AUTH0_AUDIENCE` matches your API identifier in Auth0
- Verify backend has correct `AUTH0_DOMAIN` and `AUTH0_AUDIENCE` env vars

---

## Security Best Practices

### ✅ DO:
- Use HTTPS in production (Auth0 requires it)
- Enable MFA (Multi-Factor Authentication) in Auth0 dashboard
- Set session timeout appropriately (default: 7 days)
- Use "offline_access" scope only if you need refresh tokens
- Rotate client secrets regularly

### ❌ DON'T:
- Don't commit `.env` files to git
- Don't use Auth0 test credentials in production
- Don't disable HTTPS redirect in production
- Don't store tokens in localStorage (Auth0 SDK handles this)

---

## Cost Breakdown

### Auth0 Free Tier:
- **7,000 active users/month** - FREE
- Unlimited logins
- Social connections
- Email/password authentication
- MFA available

### If You Exceed Free Tier:
- **Essential**: $23/month (starting at 500 active users)
- **Professional**: $228/month (starting at 500 active users)
- **Enterprise**: Custom pricing

**For PaiperSum**: Free tier is perfect for first 6-12 months.

---

## Migration Plan (Current → Auth0)

### Phase 1: Dual Auth (Week 1)
- ✅ Auth0 works alongside localStorage
- Users can sign in with Auth0 OR continue with localStorage
- No breaking changes

### Phase 2: Encourage Migration (Week 2-4)
- Show banner: "Create a real account to sync across devices!"
- Offer migration: Convert localStorage accounts to Auth0
- Track migration rate

### Phase 3: Deprecate localStorage (Month 2)
- Require Auth0 for new users
- Keep localStorage read-only for existing users
- Show upgrade prompts

### Phase 4: Full Migration (Month 3)
- All users on Auth0
- Remove localStorage auth code
- Clean up codebase

---

## Quick Reference

### Important URLs:
- **Auth0 Dashboard**: https://manage.auth0.com
- **Auth0 Docs**: https://auth0.com/docs
- **Auth0 React SDK**: https://github.com/auth0/auth0-react

### Environment Variables Checklist:
- [ ] `VITE_AUTH0_DOMAIN`
- [ ] `VITE_AUTH0_CLIENT_ID`
- [ ] `VITE_AUTH0_AUDIENCE`
- [ ] `VITE_API_URL`

### Backend Environment Variables:
- [ ] `AUTH0_DOMAIN`
- [ ] `AUTH0_AUDIENCE`
- [ ] `AUTH0_ALGORITHMS=["RS256"]`

---

## Next Steps After Auth0 Setup

1. ✅ Users can now sign up and log in properly
2. ✅ Sessions persist across devices
3. ✅ Backend can verify user identity
4. 🔄 Next: Setup PostgreSQL database (see DATABASE_SETUP_GUIDE.md)
5. 🔄 Next: Integrate Stripe payments (see STRIPE_SETUP_GUIDE.md)

---

**Questions? Issues?**  
- Auth0 Community: https://community.auth0.com
- Auth0 Support: https://support.auth0.com

**Setup Time**: 15-30 minutes  
**Difficulty**: Easy  
**Cost**: FREE (up to 7,000 users)

Let's get your authentication production-ready! 🚀
