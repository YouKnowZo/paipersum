# Vercel Deployment Fix

## Issue
The web page shows "Index of /" instead of the React app.

## Solution

The `vercel.json` configuration has been updated. However, for best results with Vercel monorepo setup, configure these settings in the Vercel Dashboard:

### Vercel Dashboard Settings:

1. **Root Directory**: `apps/web`
2. **Build Command**: `npm run build`
3. **Output Directory**: `dist`
4. **Install Command**: `npm install`
5. **Framework Preset**: Vite

### Alternative: Create `vercel.json` in `apps/web/`

If the root-level `vercel.json` doesn't work, create one in `apps/web/vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Step-by-Step Fix:

1. Go to Vercel Dashboard → Your Project → Settings
2. Under "Build & Development Settings":
   - **Root Directory**: `apps/web`
   - **Framework Preset**: Vite (or leave blank, Vercel will detect)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. Delete or rename the root `vercel.json` temporarily to test

4. Redeploy

### If Still Not Working:

Check that:
- ✅ `apps/web/dist/index.html` exists after build
- ✅ `apps/web/package.json` has correct build script
- ✅ Build logs show successful build
- ✅ Root directory is set to `apps/web` in Vercel settings

### Quick Test:

After updating Vercel settings, trigger a new deployment. The app should load correctly instead of showing directory listing.
