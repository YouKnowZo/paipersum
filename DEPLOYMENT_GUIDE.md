# 🚀 PaiperSum Deployment Guide

Complete guide for deploying PaiperSum to production on multiple platforms.

---

## 📋 Pre-Deployment Checklist

- [x] Build completes successfully (`npm run build`)
- [x] All tests pass
- [x] Environment variables configured
- [x] SEO meta tags implemented
- [x] Analytics integrated
- [x] Security headers configured
- [x] Error tracking setup (Sentry recommended)
- [x] Performance optimized

---

## 🌐 Vercel Deployment (Recommended)

### Why Vercel?
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Zero-config deployments
- ✅ Automatic previews for branches
- ✅ Perfect for React/Vite apps
- ✅ Free tier is generous

### Step-by-Step Deployment

#### Method 1: GitHub Integration (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for production deployment"
   git push origin Main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "Add New Project"
   - Import your repository
   - Framework Preset: Vite
   - Root Directory: `apps/web`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install --legacy-peer-deps`

3. **Configure Environment Variables:**
   ```
   VITE_API_URL=https://api.paipersum.com
   ```

4. **Deploy:**
   - Click "Deploy"
   - Wait 1-2 minutes
   - Your site is live! 🎉

#### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy from /workspace/apps/web
cd apps/web
vercel

# Follow prompts:
# - Project name: paipersum
# - Set up and deploy: Yes
# - Framework: Vite
# - Build command: npm run build
# - Output directory: dist

# Production deployment
vercel --prod
```

### Custom Domain Setup

1. **Buy Domain** (Namecheap, GoDaddy, Google Domains)
   - Recommended: paipersum.com

2. **Add to Vercel:**
   - Project Settings → Domains
   - Add `paipersum.com` and `www.paipersum.com`

3. **Update DNS Records:**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

4. **Wait for SSL** (automatic, 1-2 minutes)

---

## 🚢 Alternative Deployment Options

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
cd apps/web
netlify deploy --prod

# Or connect via GitHub (similar to Vercel)
```

**Netlify Configuration** (`netlify.toml`):
```toml
[build]
  command = "npm run build"
  publish = "dist"
  base = "apps/web"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
```

### Cloudflare Pages

1. **Connect GitHub repo**
2. **Build settings:**
   - Build command: `npm run build`
   - Build output: `apps/web/dist`
   - Root directory: `apps/web`

3. **Benefits:**
   - Free unlimited bandwidth
   - Excellent performance
   - Built-in analytics

### AWS Amplify

```bash
# Install Amplify CLI
npm i -g @aws-amplify/cli

# Configure
amplify configure

# Initialize
amplify init

# Add hosting
amplify add hosting

# Publish
amplify publish
```

### DigitalOcean App Platform

1. Create new app from GitHub
2. Select repository and branch (Main)
3. Configure:
   - Type: Static Site
   - Source Directory: `/apps/web`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Deploy (auto-builds on push)

---

## 🔧 Backend API Deployment

### FastAPI Backend (apps/api/)

#### Fly.io (Recommended for API)

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login
flyctl auth login

# Launch app
cd apps/api
flyctl launch

# Deploy
flyctl deploy

# Check status
flyctl status

# View logs
flyctl logs
```

#### Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize
cd apps/api
railway init

# Deploy
railway up
```

#### Render

1. Go to [render.com](https://render.com)
2. New Web Service
3. Connect GitHub
4. Configure:
   - Name: paipersum-api
   - Root Directory: `apps/api`
   - Runtime: Python 3.11
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Environment Variables:
   ```
   ALLOWED_ORIGINS=https://paipersum.com
   JWT_SECRET=your-secret-key
   STRIPE_SECRET=sk_live_xxx
   ```

---

## 🗄️ Database Setup

### PostgreSQL (for user data, optional for MVP)

#### Supabase (Easiest)
```bash
# Free tier: 500MB, 2 CPU cores
# Go to supabase.com
# Create project
# Get connection string
# Add to env: DATABASE_URL
```

#### Neon (Serverless Postgres)
```bash
# Go to neon.tech
# Create project (free tier)
# Copy connection string
```

#### Railway Postgres
```bash
railway add postgresql
# Automatic DATABASE_URL
```

### Redis (for rate limiting, caching)

#### Upstash (Serverless Redis)
```bash
# Go to upstash.com
# Create database
# Get REDIS_URL
# Free tier: 10K commands/day
```

---

## 📊 Monitoring & Analytics

### Essential Services

1. **Sentry** (Error Tracking)
   ```bash
   npm install @sentry/react @sentry/vite-plugin
   
   # Add to main.tsx:
   Sentry.init({
     dsn: "YOUR_SENTRY_DSN",
     environment: "production",
     tracesSampleRate: 0.1,
   });
   ```

2. **Google Analytics 4**
   - Update `G-XXXXXXXXXX` in index.html
   - Get ID from analytics.google.com

3. **Hotjar** (User behavior)
   ```html
   <!-- Add to index.html -->
   <script>
     (function(h,o,t,j,a,r){
       h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
       h._hjSettings={hjid:YOUR_SITE_ID,hjsv:6};
       a=o.getElementsByTagName('head')[0];
       r=o.createElement('script');r.async=1;
       r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
       a.appendChild(r);
     })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
   </script>
   ```

4. **Plausible** (Privacy-friendly analytics)
   - Alternative to Google Analytics
   - GDPR compliant
   - $9/month

---

## 🔒 Security Configuration

### Environment Variables

**Development (.env.local):**
```bash
VITE_API_URL=http://localhost:8000
```

**Production (Vercel):**
```bash
VITE_API_URL=https://api.paipersum.com
```

### API Keys Security
- ❌ Never commit API keys to git
- ✅ Use environment variables
- ✅ Rotate keys regularly
- ✅ Use different keys for dev/prod

### CORS Configuration
```python
# apps/api/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://paipersum.com", "https://www.paipersum.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 🚨 CI/CD Pipeline

### GitHub Actions (Already configured)

**Workflow: `.github/workflows/deploy.yml`**

Triggers:
- Push to Main branch → Auto-deploy to production
- Pull request → Preview deployment
- Manual dispatch → Deploy any branch

**Status Checks:**
- ✅ Build succeeds
- ✅ Tests pass
- ✅ Linting passes

---

## 📈 Performance Optimization

### Vercel Edge Config

```javascript
// vercel.json already configured with:
// - Static asset caching (1 year)
// - Gzip compression
// - Security headers
```

### Image Optimization

```bash
# Install sharp for image optimization
npm install sharp

# Use Vercel Image Optimization
# import { Image } from '@vercel/image'
```

### Code Splitting

```javascript
// Lazy load heavy components
const EnhancedSummaryPage = lazy(() => import('./pages/EnhancedSummaryPage'))
```

---

## 🧪 Staging Environment

### Setup Staging on Vercel

1. Create `staging` branch
2. Connect to Vercel (separate project)
3. Domain: `staging.paipersum.com`
4. Test features before production

### Preview Deployments

- Every PR gets unique URL
- Test before merging
- Share with team/stakeholders

---

## 📦 Deployment Commands Summary

```bash
# Frontend (Vercel)
cd apps/web
npm run build          # Test build locally
vercel                 # Deploy to preview
vercel --prod          # Deploy to production

# Backend (Fly.io)
cd apps/api
flyctl deploy

# Full stack update
git add .
git commit -m "Release v1.0.0"
git push origin Main
# Vercel auto-deploys frontend
# Fly.io auto-deploys backend (if configured)
```

---

## 🆘 Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf node_modules dist .next
npm install --legacy-peer-deps
npm run build
```

### 404 Errors

- Check `vercel.json` redirects
- Ensure SPA routing configured
- Verify dist directory

### API Connection Issues

- Check CORS settings
- Verify API_URL environment variable
- Test API endpoint directly
- Check browser console for errors

### Performance Issues

- Enable caching headers
- Compress images (use WebP)
- Code split large components
- Use CDN for static assets

---

## 🎯 Post-Deployment Checklist

- [ ] Site loads successfully
- [ ] All pages accessible
- [ ] Forms submit correctly
- [ ] API calls working
- [ ] Analytics tracking
- [ ] Error tracking active
- [ ] HTTPS certificate valid
- [ ] Custom domain configured
- [ ] SEO tags visible (view source)
- [ ] Mobile responsive
- [ ] Fast load time (< 3s)
- [ ] No console errors

---

## 📞 Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Vite Docs:** https://vitejs.dev
- **Discord:** Join PaiperSum Discord for help
- **GitHub Issues:** Report bugs/issues

---

## 🚀 Next Steps After Deployment

1. **Submit to Directories:**
   - Product Hunt
   - Hacker News
   - Reddit (relevant subreddits)
   - BetaList
   - AlternativeTo

2. **Setup Monitoring:**
   - Uptime monitoring (UptimeRobot, Better Uptime)
   - Performance monitoring (Lighthouse CI)
   - Error alerts (Sentry Slack integration)

3. **Marketing:**
   - Social media announcement
   - Email newsletter to waitlist
   - Press release
   - Influencer outreach

4. **Iterate:**
   - Monitor analytics
   - Collect user feedback
   - A/B test pricing
   - Add requested features

---

**🎉 Congratulations! You're now live at paipersum.com!**

**Time to generate that wealth! 💰**

