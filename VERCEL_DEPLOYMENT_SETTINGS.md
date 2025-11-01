# Vercel Deployment Settings - REQUIRED CONFIGURATION

## ⚠️ CRITICAL: Root Directory Must Be Correct

**The root directory in Vercel Project Settings MUST be left empty or set to `.` (root), NOT "frontend"**

The frontend code is located in `apps/web/`, and `vercel.json` handles the build configuration automatically.

## Vercel Project Settings Checklist

When setting up or updating your Vercel project, ensure these settings:

### General Settings
- **Root Directory**: Leave EMPTY or set to `.` (period/root)
  - ❌ WRONG: `frontend`
  - ❌ WRONG: `apps/web`
  - ✅ CORRECT: (empty) or `.`

### Build & Development Settings
- **Framework Preset**: Vite (or auto-detect)
- **Build Command**: (auto-detected from vercel.json)
- **Output Directory**: (auto-detected from vercel.json)
- **Install Command**: (auto-detected from vercel.json)

### How to Update Root Directory in Vercel Dashboard

1. Go to your Vercel project: https://vercel.com/dashboard
2. Click on your project
3. Go to **Settings** → **General**
4. Scroll to **Root Directory**
5. **Clear the field** (leave it empty) or set it to `.`
6. Click **Save**
7. Trigger a new deployment

## Current Working Configuration

The `vercel.json` file contains all necessary build settings:
- Builds from `apps/web/`
- Outputs to `apps/web/dist`
- Uses Vite framework
- Handles SPA routing

**No manual root directory configuration needed when vercel.json is present.**

## Backup Deployment Configuration

If you need to deploy manually without vercel.json:

### Option 1: Deploy from apps/web directory
```bash
cd apps/web
vercel --prod
```

### Option 2: Deploy from root with root directory set
- Root Directory: `apps/web`
- Build Command: `npm install && npm run build`
- Output Directory: `dist`
- Framework: Vite

## Troubleshooting

### Error: "Root Directory 'frontend' does not exist"
**Solution**: Update Vercel project settings:
1. Settings → General → Root Directory
2. Clear the field (set to empty)
3. Save and redeploy

### Error: Build fails
**Solution**: Ensure vercel.json is in the repository root and committed.

## Single Deployment Setup

For a single working deployment:
1. **Primary**: Vercel (Frontend) - Root Directory: (empty)
2. **Backup**: Keep vercel.json in repo for automatic configuration

The vercel.json file ensures consistent deployments across all environments.
