# 🚀 Deploy PaiperSum to GitHub → paipersum.com

**Complete guide to push your code to GitHub and deploy it to your domain.**

---

## ✅ PRE-FLIGHT CHECK

Run this test first:
```bash
python3 test_app.py
```

**If you see:** ✅ ALL TESTS PASSED - READY TO DEPLOY!  
**Then proceed.**

---

## 📦 Step 1: Push to GitHub (5 minutes)

### Option A: New Repository (Recommended)

```bash
# 1. Create repo on GitHub
# Go to https://github.com/new
# Name: paipersum
# Make it PUBLIC (so free hosting works)
# Don't initialize with README (we have one)

# 2. Push your code
cd /workspace
git remote add origin https://github.com/YOUR-USERNAME/paipersum.git
git branch -M main
git push -u origin main

# 3. Verify
# Visit: https://github.com/YOUR-USERNAME/paipersum
# You should see all files
```

### Option B: Existing Repository

```bash
# If you already have a repo
cd /workspace
git remote set-url origin https://github.com/YOUR-USERNAME/paipersum.git
git branch -M main
git push -u origin main --force  # ⚠️ This OVERWRITES remote
```

---

## 🌐 Step 2: Deploy Frontend to Vercel (10 minutes)

###  2A: Connect GitHub to Vercel

1. Go to https://vercel.com/signup
2. Click "Continue with GitHub"
3. Authorize Vercel
4. Click "Import Project"
5. Select your `paipersum` repository

### 2B: Configure Project

**IMPORTANT**: The `vercel.json` file automatically configures most settings. However:

**Framework Preset:** Vite (auto-detected)  
**Root Directory:** Leave EMPTY (⚠️ Do NOT set to "frontend" or "apps/web" - vercel.json handles paths automatically)  
**Build Command:** Auto-detected from vercel.json  
**Output Directory:** Auto-detected from vercel.json  
**Install Command:** Auto-detected from vercel.json

**If you see an error about "Root Directory 'frontend' does not exist"**:
1. Go to Project Settings → General → Root Directory
2. Clear the field (set to empty)
3. Save and redeploy

**Environment Variables:**
```
VITE_API_URL = https://YOUR-API-URL.onrender.com
```
(You'll get this URL in next step, come back and update it)

### 2C: Deploy

Click "Deploy"

Wait 2-3 minutes.

You'll get: `https://paipersum-xxx.vercel.app`

---

## 🔧 Step 3: Deploy Backend to Render (10 minutes)

### 3A: Connect GitHub to Render

1. Go to https://render.com/signup
2. Click "Continue with GitHub"
3. Authorize Render
4. Click "New +" → "Web Service"
5. Select your `paipersum` repository

### 3B: Configure Service

**Name:** `paipersum-api`  
**Region:** Oregon (US West) - or closest to you  
**Branch:** `main`  
**Root Directory:** `apps/api`  
**Runtime:** Python 3  
**Build Command:** `pip install -r requirements.txt`  
**Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`  
**Instance Type:** **Free**

**Environment Variables:**
Click "Advanced" → Add Environment Variables:
```
ALLOWED_ORIGINS = https://paipersum.com,https://www.paipersum.com,https://paipersum-xxx.vercel.app
```
(Replace with your actual Vercel URL)

### 3C: Deploy

Click "Create Web Service"

Wait 3-5 minutes.

You'll get: `https://paipersum-api.onrender.com`

**⚠️ IMPORTANT:** Copy this URL!

### 3D: Update Vercel

1. Go back to Vercel Dashboard
2. Your Project → Settings → Environment Variables
3. Edit `VITE_API_URL`:
   ```
   VITE_API_URL = https://paipersum-api.onrender.com
   ```
4. Redeploy:
   - Go to Deployments tab
   - Click "..." on latest deployment
   - Click "Redeploy"

---

## 🌐 Step 4: Point paipersum.com to Vercel (10 minutes)

### 4A: Add Domain in Vercel

1. Vercel Dashboard → Your Project → Settings → Domains
2. Click "Add"
3. Enter: `paipersum.com`
4. Click "Add"
5. Enter: `www.paipersum.com`
6. Click "Add"

Vercel will show you DNS configuration.

### 4B: Configure Namecheap DNS

1. Log in to Namecheap: https://namecheap.com
2. Dashboard → Domain List
3. Click "Manage" next to paipersum.com
4. Click "Advanced DNS" tab

### 4C: Delete Old Records

Delete any existing:
- A Records
- CNAME Records (except parking page)

### 4D: Add New Records

**Record 1 - Apex Domain:**
```
Type: A Record
Host: @
Value: 76.76.21.21
TTL: Automatic
```

**Record 2 - WWW Subdomain:**
```
Type: CNAME Record
Host: www
Value: cname.vercel-dns.com.
TTL: Automatic
```

**⚠️ Important:** Don't forget the trailing dot (`.`) in `cname.vercel-dns.com.`

### 4E: Save

Click "Save All Changes"

---

## ⏳ Step 5: Wait for DNS Propagation (10-60 minutes)

### Check DNS Status

```bash
# Check if DNS updated
nslookup paipersum.com

# Should show: 76.76.21.21
```

**OR** use online tool:
- https://dnschecker.org/#A/paipersum.com

**Green checkmarks everywhere = Ready!**

---

## ✅ Step 6: Verify Everything Works (5 minutes)

### Test Checklist

Visit: https://paipersum.com

- [ ] Site loads (no errors)
- [ ] SSL/HTTPS works (green padlock)
- [ ] Click "I Understand & Accept" - modal closes
- [ ] Paste sample text:
  ```
  I agree to indemnify and hold harmless the company.
  This agreement automatically renews. Disputes go to
  binding arbitration. You waive class action rights.
  ```
- [ ] Click "Analyze" - should show risk score
- [ ] See clauses detected
- [ ] Click "Export PDF" - should download
- [ ] Visit `/terms.html` - Terms of Service loads
- [ ] Visit `/privacy.html` - Privacy Policy loads
- [ ] Test on mobile - responsive layout
- [ ] Share link - preview looks good

**If all checked → YOU'RE LIVE! 🎉**

---

## 🐛 Troubleshooting

### Issue: Site not loading

**Check DNS:**
```bash
nslookup paipersum.com
```

- If shows old IP → Wait longer (up to 24 hours, usually 1 hour)
- If shows Namecheap IP → DNS records not saved
- If shows nothing → Typo in domain name

**Check Vercel:**
- Vercel Dashboard → Domains
- Should show "Valid Configuration" with green checkmark
- If red X → Check DNS records match exactly

### Issue: "This site can't be reached"

**Vercel not verified yet:**
1. Wait 5-10 minutes after adding domain
2. Click "Refresh" in Vercel Domains tab
3. Should change from "Pending" to "Valid"

### Issue: API calls failing (Network Error)

**Check API is running:**
```bash
curl https://paipersum-api.onrender.com/health
```

Should return: `{"status":"healthy"}`

**If not:**
- Go to Render Dashboard
- Check if API deployed successfully
- Check logs for errors

**Check CORS:**
- Make sure `ALLOWED_ORIGINS` in Render includes your domain
- Restart API after changing: Render auto-restarts on env var changes

### Issue: SSL not working (Not Secure)

**Vercel SSL:**
- Automatic and free
- Takes 5-10 minutes after DNS propagates
- If still broken after 1 hour, contact Vercel support

**Check redirect:**
- Make sure you're visiting `https://` not `http://`
- Vercel auto-redirects HTTP → HTTPS

### Issue: API is slow (first request takes 30+ seconds)

**Render Free Tier spins down after 15 minutes of inactivity**

This is normal. Solutions:
1. Upgrade to paid tier ($7/mo) for always-on
2. Use UptimeRobot (free) to ping API every 14 minutes
3. Tell users "First load may be slow"

**Set up UptimeRobot:**
1. Go to https://uptimerobot.com (free)
2. Add monitor: `https://paipersum-api.onrender.com/health`
3. Interval: 5 minutes
4. Now API stays warm!

### Issue: Changes not showing

**Clear cache:**
- Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- Or open incognito window

**Redeploy:**
- Vercel: Go to Deployments → Redeploy
- Render: Auto-deploys on git push

---

## 🔄 Making Updates

### Update Code

```bash
# 1. Make changes locally
# Edit files in apps/web or apps/api

# 2. Test locally
docker-compose up -d
# Visit http://localhost:5173

# 3. Commit and push
git add .
git commit -m "Update: describe your changes"
git push origin main

# 4. Auto-deploys!
# Vercel: 2-3 minutes
# Render: 3-5 minutes
```

### View Logs

**Vercel:**
- Dashboard → Your Project → Deployments → Click deployment → View Logs

**Render:**
- Dashboard → paipersum-api → Logs tab

---

## 💰 Free Tier Limits

### Vercel (Frontend)
- ✅ **Bandwidth:** 100GB/month (≈ 10,000 visitors)
- ✅ **Builds:** Unlimited
- ✅ **Domains:** 1 custom domain
- ✅ **SSL:** Free forever
- ⚠️ **Limit:** If you exceed, $20/month Pro plan

### Render (Backend)
- ✅ **Hours:** 750/month (24/7 for 1 service)
- ✅ **RAM:** 512MB
- ✅ **Bandwidth:** 100GB/month
- ⚠️ **Spin down:** After 15 min inactivity (use UptimeRobot)
- ⚠️ **Limit:** If you exceed, $7/month paid plan

**Both together: $0/month until you grow! 🎉**

---

## 📊 Monitoring (Recommended)

### Set Up Analytics (Free)

**Option 1: Plausible (Privacy-friendly)**
```html
<!-- Add to apps/web/index.html before </head> -->
<script defer data-domain="paipersum.com" src="https://plausible.io/js/script.js"></script>
```

**Option 2: Google Analytics**
```html
<!-- Google Analytics script -->
```

### Set Up Error Tracking (Free)

**Sentry (5,000 events/month free)**

1. Create account: https://sentry.io
2. Create project: JavaScript + Python
3. Get DSN (looks like: `https://xxx@sentry.io/xxx`)
4. Add to environment variables:
   - Vercel: `VITE_SENTRY_DSN=xxx`
   - Render: `SENTRY_DSN=xxx`
5. Redeploy both

Now you get alerts when things break!

### Set Up Uptime Monitoring (Free)

**UptimeRobot (50 monitors free)**

1. Go to https://uptimerobot.com
2. Add Monitor:
   - Type: HTTPS
   - URL: `https://paipersum.com`
   - Interval: 5 minutes
3. Add Monitor:
   - Type: HTTPS
   - URL: `https://paipersum-api.onrender.com/health`
   - Interval: 5 minutes
4. Get alerts via email if site goes down

---

## ✅ Post-Launch Checklist

After paipersum.com is live:

- [ ] Test from different devices (phone, tablet, laptop)
- [ ] Test from different browsers (Chrome, Safari, Firefox)
- [ ] Test from different locations (ask friend to try)
- [ ] Set up analytics (Plausible or Google Analytics)
- [ ] Set up error tracking (Sentry)
- [ ] Set up uptime monitoring (UptimeRobot)
- [ ] Share on Twitter/LinkedIn
- [ ] Post on Reddit (r/SaaS, r/sideproject)
- [ ] Post on HackerNews (Show HN)
- [ ] Post on Indie Hackers
- [ ] Email 10 friends to test
- [ ] Collect feedback in Google Form
- [ ] Fix reported bugs
- [ ] Add most-requested features

---

## 🎉 YOU'RE LIVE!

**Your site is now:**
- ✅ Live at https://paipersum.com
- ✅ SSL secured
- ✅ Fast (Vercel CDN)
- ✅ Free hosting
- ✅ Auto-deploys on git push
- ✅ Legal compliant
- ✅ Professional looking

**Next steps:**
1. Share it everywhere
2. Get users
3. Collect feedback
4. Add auth + payments (follow guides)
5. Start making money!

**Congratulations! 🚀**

---

## 📞 Support

**If stuck:**
1. Check Vercel docs: https://vercel.com/docs
2. Check Render docs: https://render.com/docs
3. Ask in their Discord servers (very helpful!)
4. Post on r/SaaS or r/webdev
5. Check STATUS.md for known issues

**Remember:** Every founder gets stuck. Don't give up! 💪
