# Deployment Guide - PaiperSum

Complete guide for deploying PaiperSum to production.

## Prerequisites

1. GitHub repository set up
2. Render account (free tier available)
3. Vercel account (free tier available)
4. Stripe account (for payments)
5. OpenAI/Anthropic API keys (optional, free tiers available)

## Step 1: Environment Variables

### API (Render)

Set these in Render dashboard:

```bash
ALLOWED_ORIGINS=https://paipersum.com,https://www.paipersum.com
ADMIN_SECRET=<generate-secure-random-string>
OPENAI_API_KEY=sk-xxx (optional)
ANTHROPIC_API_KEY=sk-ant-xxx (optional)
STRIPE_SECRET_KEY=sk_live_xxx (for production)
STRIPE_WEBHOOK_SECRET=whsec_xxx
SENTRY_DSN=https://xxx@sentry.io/xxx (optional)
```

### Web (Vercel)

Set these in Vercel dashboard:

```bash
VITE_API_URL=https://paipersum-api.onrender.com
```

## Step 2: Deploy API to Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `paipersum-api`
   - **Environment**: `Python 3`
   - **Build Command**: `cd apps/api && pip install -r requirements.txt`
   - **Start Command**: `cd apps/api && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Root Directory**: Leave empty (or use `apps/api`)
5. Add environment variables (from Step 1)
6. Click "Create Web Service"
7. Wait for deployment to complete
8. Copy the service URL (e.g., `https://paipersum-api.onrender.com`)

## Step 3: Deploy Web to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Vercel will auto-detect `vercel.json`
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `apps/web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add environment variables (from Step 1)
7. Click "Deploy"
8. Wait for deployment
9. Copy the deployment URL (e.g., `https://paipersum.com`)

## Step 4: Update API URL

1. Go back to Vercel dashboard
2. Update `VITE_API_URL` environment variable to your Render API URL
3. Redeploy

## Step 5: Set Up Custom Domain (Optional)

### Render (API)
1. Go to Render dashboard → Your service → Settings
2. Click "Custom Domains"
3. Add `api.paipersum.com`
4. Follow DNS instructions

### Vercel (Web)
1. Go to Vercel dashboard → Your project → Settings → Domains
2. Add `paipersum.com` and `www.paipersum.com`
3. Follow DNS instructions

## Step 6: GitHub Actions Setup

1. Go to GitHub repository → Settings → Secrets and variables → Actions
2. Add secrets:
   - `RENDER_API_KEY` - Get from Render dashboard → Account Settings → API Keys
   - `RENDER_API_SERVICE_ID` - Found in Render service URL
   - `VERCEL_TOKEN` - Get from Vercel dashboard → Settings → Tokens
   - `VERCEL_ORG_ID` - Found in Vercel dashboard URL
   - `VERCEL_PROJECT_ID` - Found in Vercel project settings

## Step 7: Stripe Webhook Setup

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://paipersum-api.onrender.com/stripe-webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `customer.subscription.updated`
4. Copy webhook signing secret
5. Add to Render environment variables as `STRIPE_WEBHOOK_SECRET`

## Step 8: Admin Dashboard Access

1. Generate admin token:
   ```python
   import hashlib
   admin_secret = "your-secret-from-env"
   token = "your-chosen-token"
   token_hash = hashlib.sha256(token.encode()).hexdigest()
   # Compare with ADMIN_SECRET hash
   ```

2. Access dashboard:
   - URL: `https://paipersum-api.onrender.com/admin/dashboard`
   - Header: `Authorization: Bearer YOUR_TOKEN`

## Step 9: Verify Deployment

1. Check API health: `https://paipersum-api.onrender.com/health`
2. Check API docs: `https://paipersum-api.onrender.com/docs`
3. Test web app: `https://paipersum.com`
4. Test analysis functionality
5. Check admin dashboard (with token)

## Troubleshooting

### API not starting
- Check Render logs
- Verify Python version (3.11+)
- Check environment variables

### Web app can't connect to API
- Verify `VITE_API_URL` is correct
- Check CORS settings in API
- Verify API is running

### Admin dashboard not accessible
- Verify `ADMIN_SECRET` is set
- Check token hash matches
- Verify authorization header format

## Monitoring

- **Render**: Built-in logs and metrics
- **Vercel**: Built-in analytics
- **Sentry**: Error tracking (if configured)
- **Admin Dashboard**: Security events and threats

## Scaling

### Render
- Upgrade to paid plan for better performance
- Enable auto-scaling
- Use Redis for rate limiting (production)

### Vercel
- Automatic scaling included
- Edge network for global performance

## Security Checklist

- [ ] All environment variables set
- [ ] `ADMIN_SECRET` is strong and unique
- [ ] HTTPS enabled (automatic on Render/Vercel)
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Security headers configured
- [ ] Stripe webhooks verified
- [ ] Admin dashboard protected
- [ ] Regular security updates

## Support

For deployment issues:
- Check logs in Render/Vercel dashboards
- Review GitHub Actions workflow runs
- Contact support@paipersum.com
