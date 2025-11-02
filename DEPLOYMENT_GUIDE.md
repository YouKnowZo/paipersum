# 🚀 PaiperSum Universal - Deployment Guide

## Quick Deploy Checklist

### ✅ Completed
- [x] Code committed to GitHub
- [x] All features implemented
- [x] Error-free codebase
- [x] Quality assessment completed
- [x] Revenue projections documented

### 🚀 Ready to Deploy

## Vercel Deployment (Frontend)

### Step 1: Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository: `paipersum`

### Step 2: Configure Build Settings
- **Framework Preset**: Vite
- **Root Directory**: `apps/web`
- **Build Command**: `npm install && npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 3: Environment Variables
Add these environment variables in Vercel:
```
VITE_API_URL=https://your-api-url.onrender.com
```

### Step 4: Deploy
Click "Deploy" - Vercel will automatically build and deploy!

**Live URL**: `https://paipersum.vercel.app` (or your custom domain)

---

## Render Deployment (Backend API)

### Step 1: Create New Web Service
1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository

### Step 2: Configure Service
- **Name**: `paipersum-api`
- **Environment**: Python 3
- **Region**: Choose closest to your users
- **Branch**: `cursor/build-modular-document-ingest-and-summarization-pipeline-ba80`
- **Root Directory**: `apps/api`

### Step 3: Build & Start Commands
**Build Command**:
```bash
pip install -r requirements-deploy.txt
```

**Start Command**:
```bash
cd apps/api && uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Step 4: Environment Variables
Add these in Render dashboard:
```
PYTHON_VERSION=3.11
PORT=8000
```

### Step 5: Deploy
Click "Create Web Service" - Render will build and deploy!

**Note**: First deployment may take 10-15 minutes as it downloads ML models (BART, SentenceTransformers)

**Live URL**: `https://paipersum-api.onrender.com`

---

## Domain Configuration

### Update Frontend API URL
1. Go to Vercel dashboard
2. Settings → Environment Variables
3. Update `VITE_API_URL` to your Render backend URL
4. Redeploy frontend

### Custom Domain (Optional)
1. **Vercel**: Add custom domain in project settings
2. **Render**: Add custom domain in service settings
3. Update DNS records as instructed

---

## Post-Deployment Checklist

### Backend Verification
- [ ] API health check: `GET https://your-api.onrender.com/health`
- [ ] Test upload endpoint: `POST /api/upload`
- [ ] Test summarization: `POST /api/summarize-file`
- [ ] Check logs for errors

### Frontend Verification
- [ ] Homepage loads correctly
- [ ] Mode switching works (Legal/Universal)
- [ ] File upload works
- [ ] Summarization displays results
- [ ] Browser extension connects to API

### Performance Testing
- [ ] Test with small PDF (<1MB)
- [ ] Test with DOCX file
- [ ] Test with image (OCR)
- [ ] Check response times

### Monitoring Setup
- [ ] Set up error tracking (Sentry recommended)
- [ ] Set up analytics (Plausible/Google Analytics)
- [ ] Monitor API response times
- [ ] Set up uptime monitoring

---

## Troubleshooting

### Backend Issues

**Problem**: Models not loading
**Solution**: First deployment takes longer. Wait 10-15 minutes for models to download.

**Problem**: Memory errors
**Solution**: Upgrade Render plan or optimize model loading (use smaller models).

**Problem**: OCR not working
**Solution**: Ensure Tesseract is installed. May need custom Dockerfile.

### Frontend Issues

**Problem**: API calls failing
**Solution**: Check CORS settings, verify API URL is correct.

**Problem**: Build errors
**Solution**: Ensure Node.js version is 18+ in Vercel settings.

---

## Next Steps After Deployment

1. **Monitor Performance**: Watch Render logs for errors
2. **Test Thoroughly**: Test all document types
3. **Set Up Analytics**: Track user behavior
4. **Marketing**: Share on Product Hunt, Twitter, LinkedIn
5. **Gather Feedback**: Iterate based on user feedback

---

## Cost Estimates

### Free Tier (Perfect for Launch)
- **Vercel**: Free (unlimited for personal projects)
- **Render**: Free tier (750 hours/month)
- **Total**: $0/month

### Paid Tier (As You Grow)
- **Vercel Pro**: $20/month (if needed)
- **Render**: $7/month (starter plan)
- **Total**: ~$27/month

### Scaling Costs
- **Render**: $25/month (standard plan)
- **Database**: $0-25/month (Supabase free tier)
- **Total**: ~$50/month at scale

---

## Support

For deployment issues:
1. Check Render logs
2. Check Vercel build logs
3. Review error messages
4. Check environment variables

**Ready to launch! 🚀**
