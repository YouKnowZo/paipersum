# PaiperSum Deployment Guide

## 🚀 Quick Deploy (5 Minutes)

### Prerequisites
- GitHub account
- Vercel account (free)
- Render account (free)

### Step 1: Deploy API to Render

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy PaiperSum V2"
   git push origin main
   ```

2. **Create Render Web Service**
   - Go to https://render.com/
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Use these settings:
     - **Name:** paipersum-api
     - **Runtime:** Python 3
     - **Build Command:** `cd apps/api && pip install -r requirements.txt`
     - **Start Command:** `cd apps/api && uvicorn main_v2:app --host 0.0.0.0 --port $PORT`
     - **Plan:** Free
   - Add environment variables:
     - `ADMIN_TOKEN` = (generate secure token)
     - `ALLOWED_ORIGINS` = `*` (or your domain)
   - Click "Create Web Service"
   - Wait 2-3 minutes for deployment
   - Copy your API URL: `https://paipersum-api.onrender.com`

### Step 2: Deploy Frontend to Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd apps/web
   vercel --prod
   ```

4. **Set Environment Variable**
   - In Vercel dashboard, go to your project
   - Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://paipersum-api.onrender.com`
   - Redeploy

### Step 3: Configure Custom Domain (Optional)

#### Vercel (Frontend)
1. Go to Vercel project settings
2. Domains → Add Domain
3. Enter `paipersum.com`
4. Follow DNS instructions

#### Render (API)
1. Go to Render service settings
2. Custom Domains → Add Domain
3. Enter `api.paipersum.com`
4. Follow DNS instructions

### Step 4: DNS Configuration (Namecheap/Cloudflare)

Add these DNS records:

```
Type    Host    Value                           TTL
A       @       76.76.21.21 (Vercel IP)        Auto
CNAME   api     paipersum-api.onrender.com     Auto
CNAME   www     cname.vercel-dns.com           Auto
```

### Step 5: Test Deployment

```bash
# Test API
curl https://paipersum-api.onrender.com/health

# Test Frontend
curl https://paipersum.com
```

## 🔒 Security Setup

### Generate Admin Token
```bash
openssl rand -hex 32
```
Add to Render environment variables as `ADMIN_TOKEN`

### Enable HTTPS
- Vercel: Automatic
- Render: Automatic with custom domain

### Configure CORS
Update `ALLOWED_ORIGINS` in Render:
```
https://paipersum.com,https://www.paipersum.com
```

## 📊 Monitoring Setup

### Sentry (Error Tracking)
1. Create account at https://sentry.io
2. Create new project
3. Add to Render env vars:
   - `SENTRY_DSN` = your Sentry DSN
4. Errors will auto-report

### Uptime Monitoring
- Use UptimeRobot (free)
- Monitor: https://paipersum.com/health
- Monitor: https://paipersum-api.onrender.com/health

## 🔄 CI/CD Pipeline

GitHub Actions automatically deploys on push to `main` branch.

### Setup Secrets
Add to GitHub repository secrets:
- `VERCEL_TOKEN` (from Vercel account)
- `VERCEL_ORG_ID` (from Vercel)
- `VERCEL_PROJECT_ID` (from Vercel)

## 💰 Cost Breakdown

| Service | Plan | Cost |
|---------|------|------|
| Render (API) | Free | $0/mo |
| Vercel (Web) | Hobby | $0/mo |
| GitHub | Free | $0/mo |
| **Total** | | **$0/mo** |

### Scaling Costs
- Render Starter: $7/mo (better performance)
- Vercel Pro: $20/mo (team features)
- Database (if needed): PostgreSQL on Render $7/mo

## 🐛 Troubleshooting

### API not responding
```bash
# Check Render logs
render logs -s paipersum-api

# Check health endpoint
curl https://paipersum-api.onrender.com/health
```

### Frontend showing old version
```bash
# Clear Vercel cache
vercel --prod --force
```

### CORS errors
- Verify `ALLOWED_ORIGINS` includes your frontend URL
- Check browser console for specific error

## 📞 Support

- Issues: https://github.com/yourusername/paipersum/issues
- Email: support@paipersum.com
- Admin: alonzolockett@paipersum.com

## ✅ Post-Deployment Checklist

- [ ] API health check returns 200
- [ ] Frontend loads and displays correctly
- [ ] Analysis feature works
- [ ] File upload works
- [ ] Admin dashboard accessible
- [ ] Custom domain configured
- [ ] HTTPS enabled
- [ ] Error tracking enabled
- [ ] Uptime monitoring configured
- [ ] Legal pages accessible (/terms.html, /privacy.html)
- [ ] Email addresses configured
- [ ] Backup strategy in place
