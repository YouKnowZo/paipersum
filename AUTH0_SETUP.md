# 🔐 Auth0 Setup Guide

## Quick Start

### 1. Create Auth0 Account
1. Go to [https://auth0.com](https://auth0.com)
2. Sign up for a free account (up to 7,000 users)
3. Choose your region

### 2. Create Application
1. Go to **Applications** → **Applications** in the dashboard
2. Click **Create Application**
3. Name it "PaiperSum Web"
4. Choose **Single Page Application**
5. Click **Create**

### 3. Configure Application
1. Go to **Settings** tab
2. Copy these values:
   - **Domain**: `your-tenant.auth0.com`
   - **Client ID**: `xxxxxxxxxxxxx`
3. Scroll down to **Allowed Callback URLs**:
   - Add: `http://localhost:5173` (development)
   - Add: `https://yourdomain.com` (production)
4. Scroll to **Allowed Logout URLs**:
   - Add: `http://localhost:5173` (development)
   - Add: `https://yourdomain.com` (production)
5. Scroll to **Allowed Web Origins**:
   - Add: `http://localhost:5173` (development)
   - Add: `https://yourdomain.com` (production)
6. Click **Save Changes**

### 4. Create API (Optional but Recommended)
1. Go to **Applications** → **APIs**
2. Click **Create API**
3. Name: `PaiperSum API`
4. Identifier: `https://api.paipersum.com` (or your API URL)
5. Signing Algorithm: `RS256`
6. Click **Create**

### 5. Configure Environment Variables

Create `/workspace/apps/web/.env`:

```bash
# API Configuration
VITE_API_URL=http://localhost:8000

# Auth0 Configuration
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id-here
VITE_AUTH0_AUDIENCE=https://api.paipersum.com
```

### 6. Test Authentication
1. Start your dev server: `npm run dev`
2. Click "Sign in / Create account"
3. You should be redirected to Auth0 login
4. Sign up or log in
5. You should be redirected back to your app

## Production Setup

### 1. Update Callback URLs
In Auth0 dashboard, update:
- **Allowed Callback URLs**: `https://yourdomain.com`
- **Allowed Logout URLs**: `https://yourdomain.com`
- **Allowed Web Origins**: `https://yourdomain.com`

### 2. Environment Variables
Set these in your hosting platform (Vercel, Netlify, etc.):
- `VITE_AUTH0_DOMAIN`
- `VITE_AUTH0_CLIENT_ID`
- `VITE_AUTH0_AUDIENCE`

## Troubleshooting

### "Invalid redirect_uri"
- Make sure callback URL is in **Allowed Callback URLs**
- Check for trailing slashes
- Use exact URL (http vs https matters)

### "Access denied"
- Check **Allowed Web Origins**
- Verify CORS settings in backend

### Users not persisting
- Check backend `/users/me` endpoint
- Verify JWT token is being sent
- Check backend logs for errors

## Security Best Practices

1. **Never commit `.env` files** - Already in `.gitignore`
2. **Use different Auth0 apps** for dev/prod
3. **Enable MFA** for admin accounts
4. **Set up rate limiting** in Auth0 dashboard
5. **Monitor failed logins** in Auth0 logs

## Next Steps

After Auth0 is configured:
1. Test login/logout flow
2. Verify user data is saved to backend
3. Test account page loads user data
4. Deploy to production with production Auth0 app
