# Deploy Frontend to Vercel - 5 Minute Guide

## 🚀 Quick Deploy (Frontend Only)

### Step 1: Create Vercel Account
1. Go to https://vercel.com/signup
2. Sign up with GitHub (easiest option)
3. Authorize Vercel to access your repositories

### Step 2: Import Project
1. Click "Add New..." → "Project"
2. Select the `paipersum` repository
3. Vercel will auto-detect it's a monorepo

### Step 3: Configure Build Settings

**IMPORTANT**: The `vercel.json` file in the repo root automatically configures these settings. However, you MUST ensure:

1. **Root Directory**: Leave EMPTY (do NOT set to "frontend" or "apps/web")
   - The vercel.json file handles the build paths automatically
   - Setting a root directory will override vercel.json and cause errors

2. Vercel will auto-detect these from vercel.json:
   - Framework Preset: Vite
   - Build Command: `cd apps/web && npm install && npm run build`
   - Output Directory: `apps/web/dist`
   - Install Command: `npm install --prefix apps/web`

**If you see an error about "Root Directory 'frontend' does not exist"**, go to:
- Project Settings → General → Root Directory
- Clear the field (set to empty)
- Save and redeploy

### Step 4: Deploy
1. Click "Deploy"
2. Wait 2-3 minutes
3. Your site will be live at `your-project.vercel.app`

### Step 5: Custom Domain (Optional)
1. Go to Project Settings → Domains
2. Add `paipersum.com`
3. Update DNS records:
   ```
   A Record: @ → 76.76.19.19
   CNAME: www → cname.vercel-dns.com
   ```

## ⚠️ Important Notes

### Backend API
The frontend currently tries to connect to `http://localhost:8000` for the API. For production:

**Option 1: Mock API (Quick)**
1. Update `apps/web/src/App.tsx` to use mock data
2. No backend needed, frontend works standalone
3. Users can see the UI, can't analyze real documents

**Option 2: Deploy Backend (Complex)**
1. Deploy backend to Railway/Render/Fly.io
2. Update frontend API URL to backend URL
3. Configure environment variables
4. Full functionality, but costs $20-50/month

### Environment Variables
If you need them, add in Vercel dashboard:
```
VITE_API_URL=https://your-backend-url.com
VITE_STRIPE_KEY=your_stripe_key
```

## 📱 After Deployment

Your site will be at:
- Production: `https://paipersum.com` (after DNS setup)
- Preview: `https://your-project.vercel.app`

Vercel automatically:
- ✅ Provides SSL/HTTPS
- ✅ Sets up CDN globally
- ✅ Creates preview deployments for PRs
- ✅ Monitors performance

## 💰 Cost
- **Hobby Plan**: FREE (perfect for starting)
  - Unlimited deployments
  - Automatic HTTPS
  - Global CDN
  - 100GB bandwidth/month

- **Pro Plan**: $20/month (upgrade later)
  - More bandwidth
  - Password protection
  - Advanced analytics

## 🎯 What Works Without Backend

Even without the backend API, your deployed frontend will:
- ✅ Load and display properly
- ✅ Show the professional UI
- ✅ Accept file uploads
- ❌ Can't actually analyze documents (needs backend API)

## 🚀 Quick Deploy Commands

If you prefer CLI:
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd apps/web
vercel

# Production deploy
vercel --prod
```

## ✅ Checklist

Before deploying:
- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] Repository connected to Vercel
- [ ] Build settings configured
- [ ] Environment variables set (if needed)
- [ ] Deploy button clicked
- [ ] Site tested
- [ ] Custom domain configured (optional)

## 🔗 Useful Links

- Vercel Dashboard: https://vercel.com/dashboard
- Vercel Docs: https://vercel.com/docs
- Vite Deploy Guide: https://vitejs.dev/guide/static-deploy.html
- Your Repo: https://github.com/YouKnowZo/paipersum

That's it! Your frontend will be live in minutes. 🎉
