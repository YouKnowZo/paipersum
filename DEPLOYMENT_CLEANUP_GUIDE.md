# 🔧 Deployment Cleanup Guide

## Problem
Your Vercel deployment is failing because:
- **Root Directory** is set to `frontend` (which doesn't exist)
- The correct root directory should be `apps/web`
- You may have multiple deployment projects that need consolidation

## ✅ Solution: Single Working Deployment + Backup

### Step 1: Fix Vercel Project Settings (5 minutes)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Find your paipersum project (or create a new one)

2. **Update Root Directory**
   - Click on your project
   - Go to **Settings** → **General**
   - Scroll to **Root Directory**
   - Change from `frontend` to `apps/web`
   - Click **Save**

3. **Verify Build Settings**
   - Go to **Settings** → **General**
   - Ensure these settings match:
     ```
     Framework Preset: Vite
     Root Directory: apps/web
     Build Command: npm run build
     Output Directory: dist
     Install Command: npm install
     ```

4. **Redeploy**
   - Go to **Deployments** tab
   - Click the **"..."** menu on the latest deployment
   - Click **Redeploy**
   - Wait 2-3 minutes

### Step 2: Clean Up Duplicate Projects (10 minutes)

If you have multiple Vercel projects:

1. **Identify Active Project**
   - Go to https://vercel.com/dashboard
   - List all projects
   - Find the one connected to your main GitHub branch

2. **Delete Old/Unused Projects**
   - For each old project:
     - Click on project → **Settings** → **General**
     - Scroll to bottom → **Delete Project**
     - Type project name to confirm
     - Click **Delete**

3. **Keep One Main Project**
   - Keep the project that:
     - Is connected to your main GitHub repo
     - Has the correct domain (paipersum.com)
     - Has the latest code

### Step 3: Set Up Backup Deployment (Optional)

A backup deployment is useful for testing or as a fallback:

#### Option A: Vercel Preview Deployment (Recommended - Free)
- Automatically creates preview deployments for each branch
- No additional setup needed
- Access via: `your-project-git-branch-name.vercel.app`

#### Option B: Separate Vercel Project (For Manual Backup)
1. Create a new Vercel project
2. Connect to the same GitHub repo
3. Use a different branch (e.g., `backup` or `staging`)
4. Configure the same settings as main project
5. Use different domain: `staging.paipersum.com`

### Step 4: Verify Deployment

After fixing the root directory:

1. **Check Build Logs**
   - Go to **Deployments** tab
   - Click on latest deployment
   - Check **Build Logs** for errors
   - Should see: `✓ Built in Xs`

2. **Test the Site**
   - Visit your deployment URL
   - Should load without errors
   - Test file upload functionality

3. **Check Domain**
   - Go to **Settings** → **Domains**
   - Verify `paipersum.com` is configured
   - Should show "Valid Configuration"

## 🎯 Recommended Deployment Setup

### Primary Deployment (Production)
- **Platform**: Vercel
- **Root Directory**: `apps/web`
- **Branch**: `main` (or your primary branch)
- **Domain**: `paipersum.com` + `www.paipersum.com`
- **Auto-deploy**: Enabled
- **Status**: ✅ Active

### Backup Deployment (Optional)
- **Platform**: Vercel Preview (automatic)
- **Root Directory**: `apps/web`
- **Branch**: `backup` or `staging`
- **Domain**: `staging.paipersum.com` (optional)
- **Auto-deploy**: Enabled
- **Status**: ✅ Backup

## 🐛 Troubleshooting

### Issue: "Root Directory does not exist"
**Solution**: 
1. Double-check the path is `apps/web` (not `frontend`)
2. Make sure `apps/web` exists in your repository
3. Verify you're on the correct branch

### Issue: Build fails after fixing root directory
**Solution**:
1. Check build logs for specific errors
2. Verify `apps/web/package.json` exists
3. Ensure all dependencies are listed in `package.json`
4. Try deploying from a clean branch

### Issue: Multiple projects causing confusion
**Solution**:
1. Delete all unused projects
2. Keep only the one connected to your main branch
3. Rename it to something clear: `paipersum-production`

### Issue: Domain not working
**Solution**:
1. Go to **Settings** → **Domains**
2. Verify domain is added
3. Check DNS records match Vercel's requirements
4. Wait 5-10 minutes for DNS propagation

## 📋 Quick Checklist

- [ ] Root Directory changed from `frontend` to `apps/web` in Vercel
- [ ] Build settings verified
- [ ] Old/unused projects deleted
- [ ] Latest deployment successful
- [ ] Site loads without errors
- [ ] Domain configured correctly
- [ ] Backup deployment set up (optional)

## 🚀 After Cleanup

Once cleanup is complete:
- ✅ One primary deployment (production)
- ✅ Optional backup deployment (staging/preview)
- ✅ All deployments working correctly
- ✅ Clear project structure

## 📞 Need Help?

If you're still having issues:
1. Check Vercel documentation: https://vercel.com/docs
2. Check build logs in Vercel dashboard
3. Verify your repository structure matches expected paths
4. Test locally first: `cd apps/web && npm run build`

---

**Note**: The `vercel.json` file in your repo now has the correct `rootDirectory` set. However, Vercel project settings override the config file, so you still need to update the Root Directory in the Vercel dashboard.
