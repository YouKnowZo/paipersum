# Complete Deployment Guide for PaiperSum

## Overview

This guide will walk you through deploying PaiperSum to:
1. **GitHub** - Version control and code hosting
2. **Vercel** - Frontend hosting (React app)
3. **Render** - Backend hosting (FastAPI)

**Total Time:** 30-60 minutes  
**Cost:** $0/month to start (free tiers)

---

## Prerequisites

Before starting, ensure you have:
- [ ] GitHub account (free at github.com)
- [ ] Vercel account (free at vercel.com)
- [ ] Render account (free at render.com)
- [ ] Domain name (optional - paipersum.com)
- [ ] Stripe API keys (for payments)
- [ ] OpenAI or Anthropic API key (for AI analysis)

---

## Part 1: GitHub Deployment

### Step 1: Initialize Git (if not already done)

```bash
cd /workspace
git init
git add .
git commit -m "Initial commit: Professional PaiperSum launch"
```

### Step 2: Create GitHub Repository

1. Go to: https://github.com/new
2. Repository name: `paipersum.com`
3. Description: "Professional legal document analysis platform"
4. **Privacy:** Private (recommended initially)
5. **DO NOT** initialize with README (you already have files)
6. Click "Create repository"

### Step 3: Push to GitHub

```bash
# Add GitHub as remote
git remote add origin https://github.com/YOUR_USERNAME/paipersum.com.git

# Push code
git branch -M main
git push -u origin main
```

**Note:** Replace `YOUR_USERNAME` with your actual GitHub username.

### Step 4: Verify

1. Go to: https://github.com/YOUR_USERNAME/paipersum.com
2. Verify all files are uploaded
3. Check that commit message is correct

---

## Part 2: Vercel Deployment (Frontend)

### Step 1: Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

### Step 2: Deploy via Vercel Website (Recommended)

1. Go to: https://vercel.com/new
2. Click "Import Project"
3. Select "Import Git Repository"
4. Paste your GitHub URL or select from list
5. Choose repository: `paipersum.com`

### Step 3: Configure Build Settings

**Framework Preset:** Vite  
**Root Directory:** `apps/web`  
**Build Command:** `npm run build`  
**Output Directory:** `dist`  
**Install Command:** `npm install`

### Step 4: Add Environment Variables

Click "Environment Variables" and add:

```
VITE_API_URL=https://your-backend.onrender.com
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_key_here
```

**Note:** You'll update `VITE_API_URL` after deploying backend in Part 3.

### Step 5: Deploy

1. Click "Deploy"
2. Wait 2-3 minutes
3. Copy your Vercel URL: `https://paipersum.vercel.app`

### Step 6: Add Custom Domain (Optional)

1. Go to: Project Settings → Domains
2. Add: `paipersum.com` and `www.paipersum.com`
3. Follow DNS instructions (see Domain Setup section below)

---

## Part 3: Render Deployment (Backend)

### Step 1: Create Render Account

1. Go to: https://render.com
2. Sign up with GitHub
3. Authorize Render to access repositories

### Step 2: Create New Web Service

1. Click "New +" → "Web Service"
2. Connect GitHub repository: `paipersum.com`
3. Click "Connect"

### Step 3: Configure Web Service

**Name:** `paipersum-api`  
**Region:** Oregon (US West) or closest to your users  
**Branch:** `main`  
**Root Directory:** `apps/api` or `backend` (depending on your structure)  
**Runtime:** Python 3  
**Build Command:**
```bash
pip install -r requirements.txt
```

**Start Command:**
```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

**Plan:** Free (to start)

### Step 4: Add Environment Variables

Click "Environment" tab and add:

```
OPENAI_API_KEY=sk-your-openai-key-here
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
DATABASE_URL=postgresql://user:pass@host/db
ALLOWED_ORIGINS=https://paipersum.vercel.app,https://paipersum.com
```

### Step 5: Deploy

1. Click "Create Web Service"
2. Wait 5-10 minutes for first deployment
3. Copy your Render URL: `https://paipersum-api.onrender.com`

### Step 6: Update Frontend Environment Variable

1. Go back to Vercel
2. Project Settings → Environment Variables
3. Update `VITE_API_URL` to your Render URL:
   ```
   VITE_API_URL=https://paipersum-api.onrender.com
   ```
4. Trigger redeployment (Deployments → 3 dots → Redeploy)

---

## Part 4: Domain Setup (paipersum.com)

### If Using Namecheap

1. Log in to Namecheap
2. Go to Domain List → Manage for `paipersum.com`
3. Click "Advanced DNS"

**Add These Records:**

#### For Vercel (Frontend)

| Type  | Host | Value                    | TTL  |
|-------|------|--------------------------|------|
| A     | @    | 76.76.21.21              | Auto |
| CNAME | www  | cname.vercel-dns.com     | Auto |

#### For Email (Optional)

| Type | Host | Value                  | Priority | TTL  |
|------|------|------------------------|----------|------|
| MX   | @    | mx1.forwardemail.net   | 10       | Auto |
| MX   | @    | mx2.forwardemail.net   | 20       | Auto |
| TXT  | @    | v=spf1 include:spf.forwardemail.net ~all | | Auto |

### If Using Other DNS Provider

**Cloudflare:**
1. Add site to Cloudflare
2. Update nameservers at registrar
3. Add A record: @ → 76.76.21.21
4. Add CNAME record: www → cname.vercel-dns.com

**GoDaddy:**
1. Go to DNS Management
2. Add A record: @ → 76.76.21.21
3. Add CNAME: www → cname.vercel-dns.com

**Propagation Time:** 1-24 hours (usually 1-2 hours)

---

## Part 5: Database Setup

### Option 1: Render PostgreSQL (Free)

1. In Render, click "New +" → "PostgreSQL"
2. Name: `paipersum-db`
3. Database: `paipersum`
4. User: `paipersum`
5. Region: Same as web service
6. Plan: Free
7. Click "Create Database"
8. Copy "Internal Database URL"
9. Add to backend environment variables as `DATABASE_URL`

### Option 2: Supabase (Better Free Tier)

1. Go to: https://supabase.com
2. Create new project: "paipersum"
3. Copy connection string
4. Add to backend environment variables

### Option 3: Neon (Recommended for Scale)

1. Go to: https://neon.tech
2. Create project: "paipersum"
3. Copy connection string
4. Better performance and scaling

---

## Part 6: Stripe Integration

### Step 1: Get API Keys

1. Go to: https://dashboard.stripe.com/apikeys
2. Copy "Publishable key" (starts with `pk_`)
3. Copy "Secret key" (starts with `sk_`)
4. Add to environment variables

### Step 2: Create Products & Prices

```bash
# In Stripe Dashboard
1. Go to Products
2. Click "Add product"
3. Name: "PaiperSum Pro"
4. Description: "Unlimited document analysis"
5. Price: $20.00 USD
6. Billing: Monthly
7. Save and copy Price ID (starts with price_)
```

### Step 3: Set Up Webhooks

1. Go to: Developers → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://paipersum-api.onrender.com/stripe/webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy webhook signing secret (starts with `whsec_`)
6. Add to backend environment variables

---

## Part 7: Environment Variables Reference

### Frontend (Vercel - apps/web/.env)

```bash
VITE_API_URL=https://paipersum-api.onrender.com
VITE_STRIPE_PUBLIC_KEY=pk_live_your_publishable_key
```

### Backend (Render - apps/api/.env)

```bash
# Required
OPENAI_API_KEY=sk-your-openai-key
STRIPE_SECRET_KEY=sk_live_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Optional
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key
DATABASE_URL=postgresql://user:pass@host:port/database
ALLOWED_ORIGINS=https://paipersum.com,https://www.paipersum.com
REDIS_URL=redis://default:password@host:port

# Stripe Price IDs
STRIPE_PRICE_PRO_MONTHLY=price_your_price_id
STRIPE_PRICE_PRO_ANNUAL=price_your_annual_id
```

---

## Part 8: Post-Deployment Checklist

### Testing

- [ ] Visit your domain: https://paipersum.com
- [ ] Test document upload
- [ ] Test text analysis
- [ ] Test user signup
- [ ] Test Pro upgrade (use Stripe test mode)
- [ ] Test on mobile
- [ ] Check all links work
- [ ] Verify analytics are tracking

### Security

- [ ] HTTPS enabled (automatic with Vercel)
- [ ] Environment variables secured
- [ ] API keys in production mode
- [ ] CORS configured correctly
- [ ] Rate limiting enabled

### Monitoring

- [ ] Set up Vercel analytics
- [ ] Configure Render alerts
- [ ] Add uptime monitoring (UptimeRobot)
- [ ] Set up error tracking (Sentry)

### SEO

- [ ] Verify sitemap.xml exists
- [ ] robots.txt configured
- [ ] Meta tags correct
- [ ] Open Graph images
- [ ] Submit to Google Search Console

---

## Part 9: Continuous Deployment

### Automatic Deployments (Configured by Default)

**Vercel:**
- Pushes to `main` branch → Auto-deploy to production
- Pull requests → Auto-deploy preview
- All branches → Preview deployments

**Render:**
- Pushes to `main` branch → Auto-deploy to production
- Can configure manual deploys if preferred

### Deployment Workflow

```bash
# Make changes locally
git add .
git commit -m "Add new feature"
git push origin main

# Vercel and Render automatically deploy
# Check deployment status:
# - Vercel: https://vercel.com/your-username/paipersum
# - Render: https://dashboard.render.com
```

---

## Part 10: Monitoring & Maintenance

### Analytics

**Vercel Analytics (Free):**
- Automatic page views
- Web vitals
- Geography data

**Plausible (Recommended - $9/month):**
1. Sign up: plausible.io
2. Add tracking script to index.html
3. Privacy-friendly, GDPR compliant

**PostHog (Free tier available):**
1. Sign up: posthog.com
2. Install npm package
3. Product analytics + session recording

### Uptime Monitoring

**UptimeRobot (Free):**
1. Go to: uptimerobot.com
2. Add monitors for:
   - https://paipersum.com
   - https://paipersum-api.onrender.com/health
3. Set email alerts

**Better Uptime ($10/month):**
- More reliable
- Status page included
- SMS alerts

### Error Tracking

**Sentry (Free tier):**
```bash
# Frontend
npm install @sentry/react

# Add to main.tsx:
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
});
```

### Log Management

**Render Logs:**
- Built-in log viewer
- Last 7 days free
- Longer retention on paid plans

**Better Logging:**
- Papertrail (free tier available)
- Logtail by Better Stack

---

## Part 11: Cost Breakdown

### Free Tier (Months 1-3)

| Service          | Cost    | Limits                          |
|------------------|---------|---------------------------------|
| Vercel           | $0      | 100GB bandwidth, unlimited sites|
| Render           | $0      | 750 hours/month, sleeps if idle |
| GitHub           | $0      | Unlimited public/private repos  |
| Render PostgreSQL| $0      | 1GB storage, 97 hours/month     |
| **Total**        | **$0**  |                                 |

**Note:** Render free tier sleeps after 15 min inactivity (cold starts)

### Recommended Paid Plan (After Revenue)

| Service          | Cost/month | Benefit                         |
|------------------|------------|---------------------------------|
| Vercel Pro       | $20        | Better analytics, support       |
| Render Starter   | $7         | No sleeping, better performance |
| Supabase Pro     | $25        | Better database                 |
| Plausible        | $9         | Privacy-friendly analytics      |
| **Total**        | **$61**    |                                 |

**Upgrade When:** Revenue > $1,000/month

---

## Part 12: Scaling Considerations

### When to Upgrade

**Traffic Indicators:**
- \>10,000 visits/month → Upgrade hosting
- \>1,000 analyses/day → Consider caching
- \>100 concurrent users → Add load balancing

**Cost Indicators:**
- AI costs > $500/month → Optimize prompts
- Database > 1GB → Upgrade or clean old data

### Performance Optimization

**Frontend:**
- Enable Vercel Edge caching
- Optimize images
- Code splitting
- Service Worker for offline

**Backend:**
- Add Redis for caching
- Database query optimization
- Consider background jobs (Celery)
- CDN for static assets

**AI Costs:**
- Cache common analyses
- Optimize prompts for token usage
- Consider fine-tuned models
- Batch processing for efficiency

---

## Part 13: Backup & Disaster Recovery

### Database Backups

**Render PostgreSQL:**
- Automatic daily backups (paid plans)
- Manual backups: Export SQL

**Supabase:**
- Automatic backups included
- Point-in-time recovery (paid)

**Manual Backup Script:**
```bash
# Run weekly
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
# Upload to S3 or Google Drive
```

### Code Backups

- GitHub is primary backup
- Consider private GitHub backup
- Download repository monthly

### Secrets Backup

- Store environment variables in password manager
- Document all API keys
- Keep recovery codes secure

---

## Part 14: Troubleshooting

### Common Issues

#### "Error: Cannot find module"
```bash
# Frontend
cd apps/web
npm install
npm run build

# Backend
cd apps/api
pip install -r requirements.txt
```

#### "CORS Error"
- Check ALLOWED_ORIGINS in backend
- Verify frontend URL is correct
- Check Render logs

#### "Stripe Webhook Failed"
- Verify webhook URL is correct
- Check webhook secret matches
- Test with Stripe CLI

#### "Database Connection Failed"
- Verify DATABASE_URL is correct
- Check database is running
- Verify IP whitelist (if applicable)

#### "Cold Starts on Render"
- Upgrade to paid plan ($7/month)
- Or implement keep-alive ping

### Getting Help

**Vercel:**
- Docs: vercel.com/docs
- Discord: vercel.com/discord
- Support: vercel.com/support

**Render:**
- Docs: render.com/docs
- Discord: render.com/discord
- Support: render.com/support

**Community:**
- Stack Overflow
- Reddit: r/webdev, r/SaaS
- Discord servers for React, FastAPI

---

## Part 15: Next Steps After Deployment

1. **Test Everything**
   - All features work
   - Payments process correctly
   - Mobile responsive

2. **Set Up Monitoring**
   - Analytics
   - Error tracking
   - Uptime monitoring

3. **Launch Marketing**
   - Product Hunt
   - Social media
   - Blog posts

4. **Collect Feedback**
   - User surveys
   - Support tickets
   - Feature requests

5. **Iterate**
   - Weekly releases
   - Bug fixes
   - New features

---

## Quick Reference Commands

### Deploy Frontend
```bash
cd apps/web
npm install
npm run build
# Push to GitHub (auto-deploys to Vercel)
git add .
git commit -m "Update"
git push
```

### Deploy Backend
```bash
cd apps/api
pip install -r requirements.txt
# Push to GitHub (auto-deploys to Render)
git add .
git commit -m "Update"
git push
```

### Check Logs
```bash
# Vercel
vercel logs

# Render
# Use dashboard: https://dashboard.render.com
```

### Run Locally
```bash
# Frontend
cd apps/web
npm run dev
# Visit: http://localhost:5173

# Backend
cd apps/api
uvicorn main:app --reload
# Visit: http://localhost:8000
```

---

## Success Metrics

After deployment, track:

- [ ] Site is live and accessible
- [ ] SSL certificate valid (https)
- [ ] All pages load < 3 seconds
- [ ] Mobile responsive
- [ ] Payment processing works
- [ ] Analytics tracking
- [ ] Error rate < 1%
- [ ] Uptime > 99%

---

## Conclusion

You now have:
- ✅ Code on GitHub
- ✅ Frontend on Vercel
- ✅ Backend on Render
- ✅ Custom domain configured
- ✅ Payments with Stripe
- ✅ Monitoring in place

**Your site is LIVE!** 🎉

Focus on:
1. Getting first 100 users
2. Collecting feedback
3. Rapid iteration

**Remember:** Done is better than perfect. Launch, learn, iterate.

---

*Last Updated: 2025-10-30*  
*Questions? Check docs or reach out to communities*
