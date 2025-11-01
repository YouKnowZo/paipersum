# 🔧 Quick Fix: "Root Directory 'frontend' does not exist"

## Immediate Solution (2 minutes)

1. **Open Vercel Dashboard**
   - Go to: https://vercel.com/dashboard
   - Login if needed

2. **Select Your Project**
   - Click on the project showing the error

3. **Go to Settings**
   - Click **Settings** in the top navigation
   - Click **General** in the left sidebar

4. **Fix Root Directory**
   - Scroll down to **Root Directory** field
   - **Clear the field completely** (delete any value)
   - The field should be **empty**
   - Click **Save**

5. **Redeploy**
   - Go to **Deployments** tab
   - Find the failed deployment
   - Click the **three dots** (...) menu
   - Click **Redeploy**
   - Leave "Use existing Build Cache" **OFF**
   - Click **Redeploy**

6. **Wait**
   - Build should complete successfully in 2-3 minutes

## Why This Happens

Vercel project settings can override the `vercel.json` configuration. When the Root Directory is set to "frontend" in project settings, but the actual frontend code is in `apps/web/`, Vercel looks for a non-existent directory.

The `vercel.json` file in your repo already has the correct configuration:
- Build Command: `cd apps/web && npm install && npm run build`
- Output Directory: `apps/web/dist`

By leaving Root Directory empty, Vercel uses the repository root and follows `vercel.json` automatically.

## Verification

After redeploying, you should see:
- ✅ Build completes successfully
- ✅ Site is accessible at `https://your-project.vercel.app`
- ✅ No errors about missing directories

## Prevention

To prevent this in the future:
- Always leave Root Directory **empty** in Vercel settings when using `vercel.json`
- Let `vercel.json` handle all path configurations
- Don't manually set root directories if a config file exists

## Need More Help?

See `VERCEL_DEPLOYMENT_SETTINGS.md` for detailed configuration guide.
