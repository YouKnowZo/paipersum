# Auth0 Setup Guide for PaiperSum

This guide walks you through setting up Auth0 authentication for PaiperSum so users don't have to create an account every time they log in.

## Why Auth0?

- **Persistent accounts**: Users sign in once and their account persists across devices and sessions
- **Social login**: Google, Apple, LinkedIn, Microsoft login with one click
- **Security**: Enterprise-grade security without building it yourself
- **Free tier**: 7,000 active users/month for free

## Step 1: Create an Auth0 Account

1. Go to [https://auth0.com](https://auth0.com)
2. Sign up for a free account
3. Create a new tenant (e.g., `paipersum`)

## Step 2: Create a Single Page Application

1. In the Auth0 dashboard, go to **Applications** → **Applications**
2. Click **+ Create Application**
3. Name it `PaiperSum Web`
4. Select **Single Page Web Applications**
5. Click **Create**

### Configure the Application

In the application settings, add:

**Allowed Callback URLs:**
```
http://localhost:5173,
http://localhost:3000,
https://paipersum.com,
https://www.paipersum.com
```

**Allowed Logout URLs:**
```
http://localhost:5173,
http://localhost:3000,
https://paipersum.com,
https://www.paipersum.com
```

**Allowed Web Origins:**
```
http://localhost:5173,
http://localhost:3000,
https://paipersum.com,
https://www.paipersum.com
```

**Save changes!**

## Step 3: Create an API (for backend)

1. Go to **Applications** → **APIs**
2. Click **+ Create API**
3. Name: `PaiperSum API`
4. Identifier: `https://api.paipersum.com`
5. Signing Algorithm: `RS256`
6. Click **Create**

## Step 4: Get Your Credentials

### Frontend (SPA) Credentials:
From **Applications** → **PaiperSum Web** → **Settings**:
- **Domain**: `your-tenant.auth0.com`
- **Client ID**: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Backend (API) Credentials:
From **Applications** → **APIs** → **PaiperSum API**:
- **Identifier (Audience)**: `https://api.paipersum.com`

For Machine-to-Machine:
1. Go to **Applications** → **Create Application**
2. Select **Machine to Machine Applications**
3. Name it `PaiperSum Backend`
4. Select your API and grant all permissions
5. Get the **Client ID** and **Client Secret**

## Step 5: Configure Environment Variables

### Frontend (.env in apps/web/)
```env
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your_spa_client_id
```

### Backend (.env in apps/api/)
```env
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=your_backend_client_id
AUTH0_CLIENT_SECRET=your_backend_client_secret
AUTH0_AUDIENCE=https://api.paipersum.com
```

## Step 6: Enable Social Connections (Optional)

For Google/Apple/LinkedIn login:

1. Go to **Authentication** → **Social**
2. Enable desired connections:
   - **Google**: Needs Google Cloud Console OAuth credentials
   - **Apple**: Needs Apple Developer account
   - **LinkedIn**: Needs LinkedIn Developer app

### Quick Google Setup:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Go to **APIs & Services** → **Credentials**
4. Create **OAuth 2.0 Client ID**
5. Add Auth0 callback URL: `https://your-tenant.auth0.com/login/callback`
6. Copy Client ID and Secret to Auth0

## Step 7: Test Your Setup

1. Start your development server:
```bash
cd apps/web && npm run dev
```

2. Click "Sign in / Create account"
3. Click "Continue with Auth0"
4. You should be redirected to Auth0 login page
5. After login, you should be redirected back and logged in

## Troubleshooting

### "Callback URL mismatch"
- Make sure your current URL is in the "Allowed Callback URLs"
- Include both `http://localhost:5173` and `http://localhost:3000`

### "Invalid client_id"
- Double-check the VITE_AUTH0_CLIENT_ID in your .env
- Make sure you're using the SPA application's Client ID

### "Access denied"
- Check that your API is enabled for the application
- Verify the AUTH0_AUDIENCE matches your API identifier

### Users still have to login each time
1. Check that localStorage is not being cleared
2. Verify the user sync endpoint is working: `POST /api/users/sync`
3. Check browser console for errors

## Database Persistence

The current implementation stores users in memory. For production:

1. **PostgreSQL** (recommended):
```python
# In apps/api/users.py, replace in-memory store with:
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

engine = create_engine(os.getenv("DATABASE_URL"))
```

2. **MongoDB**:
```python
from motor.motor_asyncio import AsyncIOMotorClient

client = AsyncIOMotorClient(os.getenv("MONGODB_URI"))
db = client.paipersum
users_collection = db.users
```

3. **Supabase** (easiest):
- Create a free Supabase project
- Use the built-in auth + PostgreSQL

## Security Checklist

- [ ] Store secrets in environment variables, never in code
- [ ] Use HTTPS in production
- [ ] Enable Auth0 Brute Force Protection
- [ ] Set up Auth0 Attack Protection
- [ ] Configure proper CORS origins
- [ ] Set appropriate token expiration times
- [ ] Enable MFA for admin accounts

## Support

- Auth0 Docs: https://auth0.com/docs
- Community: https://community.auth0.com
- PaiperSum Issues: https://github.com/paipersum/paipersum/issues
