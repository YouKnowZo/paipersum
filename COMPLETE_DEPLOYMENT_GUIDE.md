# 🚀 Complete Deployment Guide - paipersum.com

## 🎉 GREAT NEWS!

Your backend is **MUCH LIGHTER** than the original requirements.txt suggested! 

**Key Discovery:**
- Your backend uses **smart rule-based logic**, NOT heavy ML models
- The torch/transformers libraries in requirements.txt are **not actually used**
- This means you can deploy for **$5-10/month** instead of $50-100/month!

## 📋 What You Have

### Frontend (apps/web/)
- ✅ Modern React app with Vite
- ✅ Professional UI
- ✅ All features implemented
- ✅ Ready to deploy

### Backend (apps/api/)
- ✅ FastAPI server with awesome features:
  - Clear recommendations (Sign/Negotiate/Walk Away)
  - Cost scenario calculator
  - Negotiation email templates
  - Industry benchmarking
  - PDF export
  - Document type auto-detection

## 🎯 Complete Deployment (2 Parts)

### Part 1: Deploy Backend (15-20 minutes)

#### Option A: Railway (Recommended - Easiest)

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub
   - Free $5 credit, then $5/month after

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Select your `paipersum` repository
   - Railway will detect the `railway.json` configuration

3. **Configure Build**
   - Root Directory: `apps/api`
   - Build Command: `pip install -r requirements-deploy.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - (These should be auto-filled from railway.json)

4. **Deploy**
   - Click "Deploy"
   - Wait 3-5 minutes for build
   - Copy the deployment URL (e.g., `https://your-app.railway.app`)

5. **Test Your Backend**
   - Visit: `https://your-app.railway.app/`
   - You should see: `{"name": "PaiperSum Enhanced API", "version": "2.0.0", ...}`
   - Also test: `https://your-app.railway.app/health`

#### Option B: Render (Alternative)

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub
   - Free tier available (with limitations)

2. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Name: `paipersum-api`

3. **Configure**
   - Environment: Python 3
   - Build Command: `cd apps/api && pip install -r requirements-deploy.txt`
   - Start Command: `cd apps/api && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Instance Type: Starter ($7/month) or Free (sleeps after inactivity)

4. **Deploy**
   - Click "Create Web Service"
   - Wait 5-10 minutes
   - Copy your service URL

#### Option C: Fly.io (Most Control)

1. **Install Fly CLI**
   ```bash
   # Windows (PowerShell)
   iwr https://fly.io/install.ps1 -useb | iex
   
   # Then login
   fly auth login
   ```

2. **Create Fly App**
   ```bash
   cd apps/api
   fly launch --no-deploy
   # Name: paipersum-api
   # Region: Choose closest to you
   ```

3. **Deploy**
   ```bash
   fly deploy
   ```

4. **Get URL**
   ```bash
   fly status
   # Copy the hostname (e.g., paipersum-api.fly.dev)
   ```

---

### Part 2: Deploy Frontend to Vercel (5 minutes)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Login with GitHub

2. **Find/Import Project**
   - If already connected: Click on "paipersum" project
   - If not: Click "Add New..." → "Project" → Select `paipersum` repo

3. **Add Environment Variable**
   - Go to Project Settings → Environment Variables
   - Add new variable:
     - Name: `VITE_API_URL`
     - Value: `https://your-backend-url.railway.app` (or Render/Fly URL)
     - Apply to: All Environments
   - Click "Save"

4. **Redeploy**
   - Go to Deployments tab
   - Click three dots (...) on latest deployment
   - Click "Redeploy"
   - Turn OFF "Use existing Build Cache"
   - Click "Redeploy"

5. **Add Custom Domain**
   - Go to Project Settings → Domains
   - Click "Add Domain"
   - Enter: `paipersum.com`
   - Also add: `www.paipersum.com`

6. **Configure DNS**
   At your domain registrar (NameCheap, GoDaddy, etc.):
   ```
   Type: A
   Name: @
   Value: 76.76.19.19
   TTL: 3600

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   TTL: 3600
   ```

---

## ✅ Testing Your Deployment

### Test Backend
```bash
# Test health endpoint
curl https://your-backend-url.railway.app/health

# Test analysis (replace with your URL)
curl -X POST https://your-backend-url.railway.app/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "This agreement auto-renews annually. Cancellation fee is $500."}'
```

### Test Frontend
1. Visit https://paipersum.com
2. Click "Analyze Document Free"
3. Paste some contract text
4. Click "Analyze Now"
5. Should see full analysis with recommendations!

---

## 💰 Costs Breakdown

### Minimal Setup (Recommended for Launch)
- **Backend**: Railway Hobby ($5/month) or Render Free (with sleep)
- **Frontend**: Vercel Hobby (FREE)
- **Domain**: Already own paipersum.com
- **Total**: $0-5/month

### Professional Setup (When You Have Users)
- **Backend**: Railway Pro ($20/month) or Render Starter ($7/month)
- **Frontend**: Vercel Pro ($20/month - for analytics & more)
- **Database**: Railway PostgreSQL (included in Pro)
- **Total**: $27-40/month

### What You DON'T Need
- ❌ GPU instances ($100+/month)
- ❌ Heavy ML hosting ($50+/month)
- ❌ Complex Kubernetes setup
- ❌ Database initially (uses in-memory data)

---

## 🔧 Troubleshooting

### Backend Won't Start
**Error: "Module not found"**
- Make sure you're using `requirements-deploy.txt` not `requirements.txt`
- The deploy file excludes the unused ML libraries

**Error: "Port already in use"**
- Railway/Render set PORT automatically via $PORT variable
- Make sure start command uses `--port $PORT`

### Frontend Can't Connect to Backend
**Error: "Network Error" in browser console**
1. Check VITE_API_URL environment variable is set in Vercel
2. Make sure you redeployed AFTER adding the env variable
3. Check backend CORS allows your frontend domain
4. Test backend URL directly in browser

**Error: "Request failed with status code 404"**
- Backend URL might be wrong
- Check the backend is actually running (visit /health endpoint)

### DNS Issues
**paipersum.com not working**
- DNS can take 10-30 minutes to propagate
- Use https://dnschecker.org to verify DNS records
- Make sure you added both @ and www records

---

## 📊 Monitoring & Maintenance

### Backend Logs
**Railway:**
- Go to your service → Logs tab
- See real-time logs of API requests

**Render:**
- Go to your service → Logs
- Check for errors

### Frontend Analytics
**Vercel:**
- Go to Project → Analytics
- See traffic, performance, errors

### Performance Tips
1. Backend will sleep after 15 min inactivity on free tier (Render)
2. First request after sleep takes 10-30 seconds (cold start)
3. Upgrade to paid tier to avoid sleeping
4. Railway doesn't sleep on Hobby plan

---

## 🎯 What Features Work Now

After deploying both frontend and backend:

✅ **Full Analysis**
- Upload PDFs, Word docs, or paste text
- Get risk score (0-100)
- See
