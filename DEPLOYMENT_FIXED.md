# 🚀 Deployment Configuration - FIXED

## 🔧 Issue Resolved

**Problem**: Vercel deployment failed with error: "The specified Root Directory 'frontend' does not exist"

**Solution**: The project structure uses `apps/web/` for the frontend, not `frontend/`. The deployment configuration has been fixed.

---

## ✅ Current Deployment Setup (CLEAN & WORKING)

### 🌐 Frontend Deployment - Vercel

**Service**: Vercel  
**Configuration**: `vercel.json`  
**Backup**: `vercel.backup.json`  
**Purpose**: React/Vite web application  

#### Required Vercel Dashboard Settings:

1. **Root Directory**: Leave EMPTY or set to `/` (NOT "frontend")
2. **Framework Preset**: Vite
3. **Build Command**: (Handled by vercel.json)
4. **Output Directory**: (Handled by vercel.json)
5. **Install Command**: (Handled by vercel.json)

#### Environment Variables to Set in Vercel:

```bash
VITE_API_URL=https://your-api-domain.railway.app
```

#### How to Deploy:

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy from root directory
vercel

# Or for production
vercel --prod
```

---

### 🔌 Backend API Deployment - Railway

**Service**: Railway  
**Configuration**: `railway.json`  
**Backup**: `railway.backup.json`  
**Purpose**: FastAPI backend application  

#### Required Railway Settings:

1. **Root Directory**: `/` (NOT any subdirectory)
2. **Start Command**: (Handled by railway.json)
3. **Build Command**: (Handled by railway.json)

#### Environment Variables to Set in Railway:

```bash
# Database
DATABASE_URL=postgresql://...

# Redis
REDIS_URL=redis://...

# Storage (S3/MinIO)
S3_ENDPOINT=https://...
S3_ACCESS_KEY=...
S3_SECRET_KEY=...
S3_BUCKET=paipersum

# CORS
ALLOWED_ORIGINS=https://your-vercel-domain.vercel.app

# API Keys
OPENAI_API_KEY=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
```

#### How to Deploy:

```bash
# Install Railway CLI (if not already installed)
npm i -g @railway/cli

# Login and link project
railway login
railway link

# Deploy
railway up
```

---

## 📋 Deployment Checklist

### First-Time Setup:

- [ ] **Vercel Project**:
  - [ ] Create new project from GitHub repo
  - [ ] Set Root Directory to `/` (empty)
  - [ ] Add environment variable `VITE_API_URL`
  - [ ] Enable automatic deployments from main branch
  - [ ] Delete any other frontend deployments

- [ ] **Railway Project**:
  - [ ] Create new project from GitHub repo
  - [ ] Add PostgreSQL database service
  - [ ] Add Redis service
  - [ ] Configure all environment variables
  - [ ] Enable automatic deployments from main branch
  - [ ] Delete any other backend deployments

- [ ] **Connect Services**:
  - [ ] Update `VITE_API_URL` in Vercel with Railway API URL
  - [ ] Update `ALLOWED_ORIGINS` in Railway with Vercel frontend URL
  - [ ] Test cross-origin requests

---

## 🗑️ Cleanup Instructions

### Remove Redundant Deployments:

#### In Vercel:
1. Go to your project dashboard
2. Click "Settings" → "Deployments"
3. Delete all deployments except:
   - **Production**: Main deployment (from main/master branch)
   - **Preview**: Latest preview (optional, for testing)

#### In Railway:
1. Go to your project dashboard
2. Delete any duplicate services
3. Keep only:
   - **API Service**: FastAPI backend
   - **Database**: PostgreSQL
   - **Redis**: Redis cache
   - **Storage**: S3/MinIO (if using Railway for storage)

---

## 🏗️ Project Structure

```
/workspace/
├── apps/
│   ├── web/              # Frontend (Vite + React) → Deploy to Vercel
│   │   ├── src/
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── api/              # Backend (FastAPI) → Deploy to Railway
│       ├── main.py
│       ├── requirements-deploy.txt
│       └── ...
│
├── vercel.json           # ✅ Vercel config (ACTIVE)
├── vercel.backup.json    # 💾 Backup config
├── railway.json          # ✅ Railway config (ACTIVE)
├── railway.backup.json   # 💾 Backup config
└── docker-compose.yml    # 🐳 Local development only
```

---

## 🧪 Local Development

For local development, use Docker Compose:

```bash
# Start all services (frontend, backend, db, redis, minio)
docker-compose up

# Or start individually
docker-compose up db redis minio  # Infrastructure only
cd apps/api && uvicorn main:app --reload  # Backend
cd apps/web && npm run dev  # Frontend
```

---

## 🔄 Deployment Workflow

### Recommended Git Branch Strategy:

```
main (production)
├── staging (preview deployments)
└── feature/* (development)
```

### Deployment Triggers:

- **Push to `main`**: Deploys to production (both Vercel and Railway)
- **Pull Request**: Creates preview deployment (Vercel only)
- **Manual**: Use CLI commands for manual deploys

---

## 🚨 Troubleshooting

### Vercel Build Fails:

1. **Check Root Directory**: Must be `/` or empty
2. **Check Build Logs**: Look for npm errors in build output
3. **Verify package.json**: Ensure all dependencies are listed
4. **Check Node Version**: Vercel uses Node 18 by default

### Railway Deployment Fails:

1. **Check Environment Variables**: All required vars must be set
2. **Check Dependencies**: Verify requirements-deploy.txt is complete
3. **Check Logs**: Use `railway logs` to see runtime errors
4. **Database Connection**: Verify DATABASE_URL is correct

### CORS Errors:

1. **Frontend can't reach API**: Check `VITE_API_URL` in Vercel
2. **API blocks requests**: Check `ALLOWED_ORIGINS` in Railway
3. **Use exact URLs**: Include protocol (https://) and no trailing slashes

---

## 📞 Support Commands

```bash
# Vercel
vercel logs [deployment-url]     # View deployment logs
vercel env ls                     # List environment variables
vercel domains ls                 # List domains

# Railway
railway logs                      # View live logs
railway variables                 # List environment variables
railway status                    # Check service status
```

---

## ✨ Best Practices

1. **Single Source of Truth**: One production deployment per service
2. **Environment Variables**: Never commit secrets to git
3. **Preview Deployments**: Use for testing before merging to main
4. **Monitoring**: Set up error tracking (e.g., Sentry)
5. **Backups**: Keep database backups (Railway handles this automatically)
6. **Rollback**: Use git tags for easy rollback (`git tag v1.0.0`)

---

## 📝 Summary of Changes Made

✅ Fixed `vercel.json` - Added caching headers and region specification  
✅ Fixed `railway.json` - Added health checks and multiple workers  
✅ Created backup configurations (`*.backup.json`)  
✅ Documented proper Vercel settings (Root Directory = `/`)  
✅ Provided cleanup instructions for redundant deployments  
✅ Added comprehensive troubleshooting guide  

**Next Steps:**
1. Update Vercel Root Directory setting to `/` (empty)
2. Redeploy on Vercel
3. Clean up old deployments as per instructions above
4. Verify both services are communicating correctly

---

**Last Updated**: 2025-11-01  
**Status**: ✅ Fixed and Ready for Deployment
