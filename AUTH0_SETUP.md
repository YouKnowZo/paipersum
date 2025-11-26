# Auth0 Setup Guide for PaiperSum

## Overview

PaiperSum now supports Auth0 for secure, enterprise-grade authentication. This guide will help you set up Auth0 for both development and production.

## Prerequisites

1. An Auth0 account (sign up at https://auth0.com - free tier available)
2. MongoDB database (for user persistence)
3. Backend server running

## Step 1: Create Auth0 Application

1. Log in to your Auth0 Dashboard
2. Go to **Applications** → **Applications**
3. Click **Create Application**
4. Choose **Regular Web Application**
5. Name it "PaiperSum" (or your preferred name)

## Step 2: Configure Auth0 Application

### Application Settings

1. **Allowed Callback URLs**:
   - Development: `http://localhost:5173`
   - Production: `https://yourdomain.com`
   
2. **Allowed Logout URLs**:
   - Development: `http://localhost:5173`
   - Production: `https://yourdomain.com`

3. **Allowed Web Origins**:
   - Development: `http://localhost:5173`
   - Production: `https://yourdomain.com`

4. **Allowed Origins (CORS)**:
   - Development: `http://localhost:5173`
   - Production: `https://yourdomain.com`

### Advanced Settings

1. Go to **Settings** → **Advanced Settings**
2. Under **OAuth**, enable:
   - ✅ Refresh Token
   - ✅ Refresh Token Rotation
   - ✅ Refresh Token Rotation Grace Period

## Step 3: Create Auth0 API (Optional but Recommended)

1. Go to **Applications** → **APIs**
2. Click **Create API**
3. Name: `PaiperSum API`
4. Identifier: `https://api.paipersum.com` (or your API URL)
5. Signing Algorithm: `RS256`
6. Click **Create**

## Step 4: Configure Environment Variables

### Backend (.env)

Create or update `/workspace/backend/.env`:

```bash
# Auth0 Configuration
AUTH0_SECRET=your-auth0-secret-here  # Generate with: openssl rand -hex 32
AUTH0_CLIENT_ID=your-client-id-from-auth0-dashboard
AUTH0_CLIENT_SECRET=your-client-secret-from-auth0-dashboard
AUTH0_ISSUER_BASE_URL=https://your-tenant.auth0.com
AUTH0_AUDIENCE=https://api.paipersum.com  # Optional: your API identifier
BASE_URL=http://localhost:5000  # Your backend URL

# MongoDB
MONGODB_URI=mongodb://localhost:27017/paipersum  # Or your MongoDB connection string

# CORS
ALLOWED_ORIGINS=http://localhost:5173  # Your frontend URL

# Cookie Domain (production only)
COOKIE_DOMAIN=yourdomain.com
```

### Frontend (.env)

Create or update `/workspace/apps/web/.env`:

```bash
# API URL
VITE_API_URL=http://localhost:5000

# Auth0 Configuration
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id-from-auth0-dashboard
VITE_AUTH0_AUDIENCE=https://api.paipersum.com  # Optional: your API identifier
```

## Step 5: Generate Auth0 Secret

Run this command to generate a secure secret:

```bash
openssl rand -hex 32
```

Use this value for `AUTH0_SECRET` in your backend `.env` file.

## Step 6: Test Authentication

1. Start your backend:
   ```bash
   cd backend
   npm install
   npm start
   ```

2. Start your frontend:
   ```bash
   cd apps/web
   npm install
   npm run dev
   ```

3. Navigate to `http://localhost:5173`
4. Click "Sign in / Create account"
5. You should be redirected to Auth0 login page
6. After logging in, you'll be redirected back to the app

## Step 7: Verify User Sync

After logging in, check your MongoDB database:

```bash
mongosh
use paipersum
db.users.find().pretty()
```

You should see a user document with:
- `auth0Id`: The Auth0 user ID (sub claim)
- `email`: User's email
- `name`: User's name
- `subscriptionTier`: "free" (default)

## Troubleshooting

### Issue: "Auth0 not configured - using development mode"

**Solution**: Make sure all Auth0 environment variables are set in both backend and frontend `.env` files.

### Issue: "Redirect URI mismatch"

**Solution**: Check that your callback URLs in Auth0 dashboard match exactly:
- No trailing slashes
- Correct protocol (http vs https)
- Correct port numbers

### Issue: "CORS error"

**Solution**: 
1. Add your frontend URL to `ALLOWED_ORIGINS` in backend `.env`
2. Check Auth0 dashboard → Application Settings → Allowed Origins (CORS)

### Issue: "User not syncing with backend"

**Solution**:
1. Check MongoDB connection string
2. Verify backend `/api/v1/users/sync` endpoint is accessible
3. Check browser console for errors
4. Verify Auth0 token is being sent (check Network tab)

### Issue: "Session not persisting"

**Solution**:
1. Ensure cookies are enabled in browser
2. Check `AUTH0_SECRET` is set correctly
3. For production, ensure `secure: true` in cookie settings (handled automatically)

## Fallback Mode (No Auth0)

If Auth0 is not configured, the app will automatically fall back to localStorage-based authentication. This is fine for development but **not recommended for production**.

## Production Checklist

- [ ] Auth0 application created and configured
- [ ] All environment variables set
- [ ] MongoDB database configured
- [ ] HTTPS enabled (required for Auth0 in production)
- [ ] Callback URLs updated for production domain
- [ ] CORS origins updated
- [ ] Cookie domain set for production
- [ ] Auth0 secret is strong and secure
- [ ] Rate limiting configured
- [ ] Error monitoring set up (Sentry, etc.)

## Security Best Practices

1. **Never commit `.env` files** - They're in `.gitignore`
2. **Use strong secrets** - Generate with `openssl rand -hex 32`
3. **Enable MFA** - In Auth0 dashboard → Users → Enable MFA
4. **Set up rate limiting** - Already configured in backend
5. **Monitor failed logins** - Use Auth0 logs dashboard
6. **Regular security audits** - Review Auth0 security reports

## Support

If you encounter issues:
1. Check Auth0 logs: Dashboard → Monitoring → Logs
2. Check backend logs for errors
3. Verify all environment variables are set correctly
4. Ensure MongoDB is running and accessible

## Additional Resources

- [Auth0 Documentation](https://auth0.com/docs)
- [express-openid-connect Documentation](https://github.com/auth0/express-openid-connect)
- [@auth0/auth0-react Documentation](https://auth0.com/docs/libraries/auth0-react)
