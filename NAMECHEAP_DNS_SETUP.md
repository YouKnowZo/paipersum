# 🌐 Setting Up paipersum.com with Namecheap

**You own:** paipersum.com on Namecheap  
**You want:** Point it to your deployed app  
**Time:** 10 minutes

---

## 🎯 Choose Your Deployment First

You need to deploy your app BEFORE configuring DNS. Pick one:

### Option A: Vercel (Easiest - Recommended)
- Free tier
- Automatic SSL
- CDN included
- Best for frontend

### Option B: Render.com (Good for Full-Stack)
- Free tier
- Hosts API + Web together
- Automatic SSL

### Option C: Your Own Server
- Full control
- You manage everything
- Need to configure nginx + SSL

---

## 📍 Option A: Vercel + Render (Recommended)

### Step 1: Deploy Frontend to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd apps/web
vercel login
vercel --prod
```

**Vercel will give you a URL like:**
- `https://paipersum-abc123.vercel.app`

### Step 2: Deploy Backend to Render

1. Go to https://render.com and sign up
2. Click "New +" → "Web Service"
3. Connect GitHub repo
4. Settings:
   - Name: `paipersum-api`
   - Root Directory: `apps/api`
   - Build: `pip install -r requirements.txt`
   - Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Instance: **Free**
5. Deploy

**Render will give you a URL like:**
- `https://paipersum-api.onrender.com`

### Step 3: Update Vercel Environment Variable

1. Go to Vercel Dashboard → Your Project → Settings
2. Environment Variables
3. Add:
   ```
   VITE_API_URL = https://paipersum-api.onrender.com
   ```
4. Redeploy: `vercel --prod`

### Step 4: Configure Namecheap DNS for Vercel

1. **Log in to Namecheap**
   - Go to https://namecheap.com
   - Sign in
   - Go to Domain List
   - Click "Manage" next to paipersum.com

2. **Go to Advanced DNS**
   - Click "Advanced DNS" tab

3. **Delete Existing Records** (if any)
   - Remove any A Records
   - Remove any CNAME Records (except www if you want it)

4. **Add Vercel DNS Records**

   **For apex domain (paipersum.com):**
   ```
   Type: A Record
   Host: @
   Value: 76.76.21.21
   TTL: Automatic
   ```

   **For www subdomain (www.paipersum.com):**
   ```
   Type: CNAME Record
   Host: www
   Value: cname.vercel-dns.com.
   TTL: Automatic
   ```

   **NOTE:** Don't forget the trailing dot (`.`) in `cname.vercel-dns.com.`

5. **Add to Vercel**
   - Go to Vercel Dashboard → Your Project → Settings → Domains
   - Click "Add"
   - Enter: `paipersum.com`
   - Click "Add"
   - Enter: `www.paipersum.com`
   - Click "Add"
   - Vercel will verify (takes 1-5 minutes)

6. **Wait for DNS Propagation**
   - Takes 10-60 minutes
   - Check: `nslookup paipersum.com`
   - Should show: `76.76.21.21`

7. **Test**
   - Visit: https://paipersum.com
   - Should load your app!
   - SSL is automatic (may take a few minutes)

---

## 📍 Option B: Render.com Only (API + Web Together)

### Step 1: Deploy Web as Static Site

1. Go to Render Dashboard
2. Click "New +" → "Static Site"
3. Connect GitHub repo
4. Settings:
   - Name: `paipersum-web`
   - Root Directory: `apps/web`
   - Build: `npm install && npm run build`
   - Publish Directory: `dist`
   - Environment: `VITE_API_URL=https://paipersum-api.onrender.com`
5. Deploy

**Render will give you:**
- `https://paipersum-web.onrender.com`

### Step 2: Configure Namecheap DNS for Render

1. **Log in to Namecheap**
2. **Advanced DNS tab**
3. **Delete existing records**
4. **Add CNAME for Render:**

   ```
   Type: CNAME Record
   Host: @
   Value: paipersum-web.onrender.com
   TTL: Automatic
   ```

   **AND for www:**
   ```
   Type: CNAME Record
   Host: www
   Value: paipersum-web.onrender.com
   TTL: Automatic
   ```

   **⚠️ IMPORTANT:** Some DNS providers don't allow CNAME on apex (@). If you get an error:

   **Use A Record instead:**
   1. Ping `paipersum-web.onrender.com` to get IP
   2. Add A Record:
      ```
      Type: A Record
      Host: @
      Value: [IP from ping]
      TTL: Automatic
      ```

5. **Add Custom Domain in Render**
   - Go to Render Dashboard → paipersum-web → Settings
   - Custom Domain → Add
   - Enter: `paipersum.com`
   - Enter: `www.paipersum.com`
   - Render will verify

6. **Enable SSL**
   - Render automatically provisions Let's Encrypt SSL
   - Takes 5-10 minutes
   - Free forever

7. **Test**
   - Wait 10-60 minutes for DNS
   - Visit: https://paipersum.com
   - Should work!

---

## 📍 Option C: Your Own Server (VPS)

### Step 1: Set Up Server

**Requirements:**
- Ubuntu 22.04 server
- Public IP address
- SSH access

**Providers:**
- DigitalOcean: $6/mo
- Vultr: $6/mo
- Linode: $5/mo
- AWS Lightsail: $5/mo

### Step 2: Configure Namecheap DNS

1. **Get your server IP** (e.g., `143.198.50.25`)

2. **Log in to Namecheap → Advanced DNS**

3. **Add A Records:**

   **Apex domain:**
   ```
   Type: A Record
   Host: @
   Value: 143.198.50.25  (your server IP)
   TTL: Automatic
   ```

   **WWW subdomain:**
   ```
   Type: A Record
   Host: www
   Value: 143.198.50.25  (your server IP)
   TTL: Automatic
   ```

   **API subdomain (optional):**
   ```
   Type: A Record
   Host: api
   Value: 143.198.50.25  (your server IP)
   TTL: Automatic
   ```

4. **Save all records**

### Step 3: Set Up Server

SSH into your server:

```bash
ssh root@143.198.50.25

# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose-plugin -y

# Install nginx
apt install nginx -y

# Install Certbot (SSL)
apt install certbot python3-certbot-nginx -y

# Clone your repo
cd /opt
git clone https://github.com/YOUR-USERNAME/paipersum.git
cd paipersum

# Set up environment
cp .env.example .env
nano .env  # Edit with your values

# Start services
docker-compose up -d --build

# Check status
docker-compose ps
```

### Step 4: Configure Nginx

Create nginx config:

```bash
nano /etc/nginx/sites-available/paipersum.com
```

Paste this:

```nginx
server {
    listen 80;
    server_name paipersum.com www.paipersum.com;

    # API
    location /api/ {
        proxy_pass http://127.0.0.1:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Frontend
    location / {
        proxy_pass http://127.0.0.1:5173/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Enable and test:

```bash
ln -s /etc/nginx/sites-available/paipersum.com /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### Step 5: Get SSL Certificate

```bash
# This is FREE and automatic
certbot --nginx -d paipersum.com -d www.paipersum.com

# Follow prompts:
# - Enter email
# - Agree to terms
# - Choose: Redirect HTTP to HTTPS

# Test auto-renewal
certbot renew --dry-run
```

### Step 6: Test

```bash
# Check if site is up
curl https://paipersum.com/api/health

# Should return: {"status":"healthy"}
```

Visit: https://paipersum.com

---

## ✅ Verification Checklist

After DNS is configured (wait 10-60 minutes), test:

- [ ] `https://paipersum.com` loads
- [ ] `https://www.paipersum.com` redirects to `https://paipersum.com`
- [ ] SSL certificate shows (green padlock)
- [ ] Document analysis works
- [ ] PDF export works
- [ ] No mixed content warnings
- [ ] Mobile site works
- [ ] `/terms.html` accessible
- [ ] `/privacy.html` accessible

---

## 🐛 Troubleshooting

### DNS not updating
```bash
# Check DNS propagation
nslookup paipersum.com
dig paipersum.com

# If showing old IP, wait longer (up to 24 hours max)
# Usually takes 10-60 minutes
```

### "DNS_PROBE_FINISHED_NXDOMAIN" error
- DNS not propagated yet, wait
- Or typo in DNS records
- Or DNS records not saved

### Site loads but no SSL (not secure)
**On Vercel/Render:**
- Wait 5-10 minutes for SSL provisioning
- Should be automatic

**On your own server:**
- Run `certbot --nginx -d paipersum.com -d www.paipersum.com` again
- Check nginx is running: `systemctl status nginx`

### API calls failing (CORS errors)
**Update API environment variable:**
```bash
ALLOWED_ORIGINS=https://paipersum.com,https://www.paipersum.com
```

Then restart:
- Render: Auto-redeploys
- Vercel: Already set
- Your server: `docker-compose restart api`

### "Mixed content" warnings
- All API calls must use HTTPS
- Check `VITE_API_URL` uses `https://`
- No `http://` in any links

---

## 🎯 Recommended Setup

**BEST:** Vercel (frontend) + Render (API)
- Easiest
- Free
- Auto SSL
- Fast globally
- No server management

**Time to deploy:** 30 minutes  
**Cost:** $0

**Once working, you can always migrate to your own server later.**

---

## 📧 DNS Configuration Summary

### For Vercel:
```
Type    Host    Value                   TTL
A       @       76.76.21.21            Auto
CNAME   www     cname.vercel-dns.com.  Auto
```

### For Render:
```
Type    Host    Value                           TTL
CNAME   @       paipersum-web.onrender.com     Auto
CNAME   www     paipersum-web.onrender.com     Auto
```

### For Your Server:
```
Type    Host    Value               TTL
A       @       YOUR.SERVER.IP     Auto
A       www     YOUR.SERVER.IP     Auto
```

---

**You're 30 minutes away from paipersum.com being live!** 🚀

Pick Option A (Vercel + Render) for fastest results.
