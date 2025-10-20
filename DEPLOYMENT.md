# 🚀 Deploying PaiperSum to paipersum.com

Complete guide to deploy PaiperSum to your production domain.

---

## Prerequisites

✅ You own: **paipersum.com**
✅ You have: Server/VPS (DigitalOcean, AWS, etc.) OR platform account (Vercel, Railway)
✅ You need: Domain DNS access

---

## 🎯 OPTION 1: Full-Stack VPS Deployment (Recommended)

### Step 1: Provision Server

**DigitalOcean Droplet** (Recommended - $12/month):
```bash
# Create Ubuntu 22.04 droplet with:
# - 2GB RAM minimum
# - 2 vCPUs
# - 50GB SSD
# - Enable monitoring
```

**OR AWS EC2**:
```bash
# t3.small instance (2GB RAM)
# Ubuntu 22.04 LTS
# Security group: Allow 80, 443, 22
```

### Step 2: Server Setup

SSH into your server:
```bash
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose-plugin -y

# Install Git
apt install git -y

# Install Nginx
apt install nginx -y

# Install Certbot for SSL
apt install certbot python3-certbot-nginx -y
```

### Step 3: Clone Repository

```bash
cd /opt
git clone https://github.com/YOUR-USERNAME/paipersum.git
cd paipersum

# Create production environment file
cp .env.example .env
nano .env
```

**Edit `.env` with production values:**
```bash
# Generate secret: openssl rand -hex 32
JWT_SECRET=your-generated-secret-here
STRIPE_SECRET=sk_live_xxx  # Get from Stripe dashboard
STRIPE_WEBHOOK_SECRET=whsec_xxx
SENTRY_DSN=https://xxx@sentry.io/xxx  # Optional but recommended
ALLOWED_ORIGINS=https://paipersum.com,https://www.paipersum.com

# Database (auto-created by docker-compose)
DATABASE_URL=postgresql+psycopg://ps:CHANGE_THIS_PASSWORD@db:5432/paipersum
REDIS_URL=redis://redis:6379

# Email (choose one)
SENDGRID_API_KEY=SG.xxx  # Or
MAILGUN_API_KEY=xxx
```

### Step 4: Start Services

```bash
# Build and start
docker-compose -f docker-compose.yml up -d --build

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### Step 5: Configure Nginx

```bash
nano /etc/nginx/sites-available/paipersum.com
```

Paste this configuration:
```nginx
# API Backend
upstream api {
    server 127.0.0.1:8000;
}

# Web Frontend  
upstream web {
    server 127.0.0.1:4173;
}

# Redirect www to non-www
server {
    listen 80;
    server_name www.paipersum.com;
    return 301 https://paipersum.com$request_uri;
}

# Main server block
server {
    listen 80;
    server_name paipersum.com;
    
    # Let's Encrypt verification
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    
    # Redirect HTTP to HTTPS (will be enabled after SSL)
    # return 301 https://$server_name$request_uri;
    
    # API routes
    location /api/ {
        proxy_pass http://api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Health check
    location /health {
        proxy_pass http://api/health;
    }
    
    # Docs (optional, remove in production)
    location /docs {
        proxy_pass http://api/docs;
    }
    
    # Frontend (React app)
    location / {
        proxy_pass http://web/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        # WebSocket support for HMR (dev only)
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
    
    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
```

Enable site:
```bash
ln -s /etc/nginx/sites-available/paipersum.com /etc/nginx/sites-enabled/
nginx -t  # Test configuration
systemctl reload nginx
```

### Step 6: Configure DNS

In your domain registrar (Namecheap, GoDaddy, etc.):

```
Type    Name    Value                   TTL
A       @       YOUR_SERVER_IP          3600
A       www     YOUR_SERVER_IP          3600
CNAME   api     paipersum.com           3600
```

Wait 5-10 minutes for DNS propagation. Test:
```bash
nslookup paipersum.com
```

### Step 7: Enable SSL (HTTPS)

```bash
# Get SSL certificate
certbot --nginx -d paipersum.com -d www.paipersum.com

# Follow prompts:
# - Enter email
# - Agree to terms
# - Choose: Redirect HTTP to HTTPS

# Auto-renewal is configured automatically
# Test renewal:
certbot renew --dry-run
```

### Step 8: Build Production Frontend

```bash
cd /opt/paipersum/apps/web

# Update API URL for production
echo "VITE_API_URL=https://paipersum.com/api" > .env.production

# Rebuild
docker-compose up -d --build web
```

### Step 9: Verify Deployment

```bash
# Check all services
docker-compose ps

# Test API
curl https://paipersum.com/api/health

# Test frontend
curl -I https://paipersum.com

# View logs
docker-compose logs -f api web
```

---

## 🎯 OPTION 2: Serverless Deployment (Vercel + Railway)

### Frontend on Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd apps/web
vercel --prod

# Configure:
# - Project name: paipersum-web
# - Framework: Vite
# - Build command: npm run build
# - Output directory: dist
```

**Set Environment Variables in Vercel Dashboard:**
```
VITE_API_URL=https://your-api-url.railway.app
```

**Configure Custom Domain:**
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add `paipersum.com` and `www.paipersum.com`
3. Update DNS as instructed

### Backend on Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy API
cd apps/api
railway init
railway up

# Add environment variables in Railway dashboard
```

---

## 🎯 OPTION 3: Managed Platform (Easiest)

### Render.com (Recommended for beginners)

1. **Create Account**: https://render.com
2. **Connect GitHub**: Link your PaiperSum repository

3. **Deploy API**:
   - New → Web Service
   - Repository: your-paipersum-repo
   - Root Directory: `apps/api`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Add environment variables from `.env.example`

4. **Deploy Web**:
   - New → Static Site
   - Repository: your-paipersum-repo
   - Root Directory: `apps/web`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - Environment variable: `VITE_API_URL=https://your-api.onrender.com`

5. **Add PostgreSQL**:
   - New → PostgreSQL
   - Copy connection string to API environment variables

6. **Custom Domain**:
   - Go to Settings → Custom Domain
   - Add `paipersum.com`
   - Update DNS with provided records

---

## 🔧 Post-Deployment Checklist

### Required:
- [ ] SSL certificate installed (HTTPS working)
- [ ] DNS pointing to correct servers
- [ ] Environment variables configured
- [ ] Database initialized
- [ ] Health checks passing (`/health` returns 200)
- [ ] Legal pages accessible (`/terms.html`, `/privacy.html`)
- [ ] Test document analysis end-to-end
- [ ] Browser extension points to production API

### Monitoring:
- [ ] Set up Sentry error tracking
- [ ] Configure uptime monitoring (UptimeRobot, Better Uptime)
- [ ] Set up log aggregation (optional)
- [ ] Configure backups (database, files)

### Security:
- [ ] Change default passwords in `.env`
- [ ] Enable firewall: `ufw allow 22,80,443/tcp`
- [ ] Set up fail2ban for SSH protection
- [ ] Configure database backups
- [ ] Review and test rate limiting

### SEO & Analytics:
- [ ] Add Google Analytics (optional)
- [ ] Submit sitemap to Google Search Console
- [ ] Add meta tags for social sharing
- [ ] Configure favicon and app icons

---

## 📊 Monitoring & Maintenance

### Check Service Health
```bash
# SSH into server
ssh root@your-server-ip

# Check containers
docker-compose ps

# View logs
docker-compose logs --tail=100 -f

# Restart service
docker-compose restart api
```

### Update Deployment
```bash
cd /opt/paipersum
git pull origin main
docker-compose up -d --build
```

### Database Backup
```bash
# Backup
docker-compose exec db pg_dump -U ps paipersum > backup.sql

# Restore
docker-compose exec -T db psql -U ps paipersum < backup.sql
```

---

## 🆘 Troubleshooting

### Site not loading
```bash
# Check Nginx
nginx -t
systemctl status nginx

# Check Docker services
docker-compose ps
docker-compose logs api web
```

### SSL certificate issues
```bash
# Renew manually
certbot renew --force-renewal

# Check expiry
certbot certificates
```

### API errors
```bash
# Check logs
docker-compose logs api

# Restart API
docker-compose restart api
```

### Database connection issues
```bash
# Check PostgreSQL
docker-compose exec db psql -U ps -c "SELECT version();"
```

---

## 💰 Cost Estimate

### VPS Option (DigitalOcean/AWS):
- Server: $12-24/month
- Domain: $12/year
- **Total: ~$15/month**

### Serverless Option (Vercel + Railway):
- Vercel: Free (Pro $20/month for team features)
- Railway: Free tier or $5/month
- Database: Free tier or $7/month
- **Total: $0-32/month**

### Managed Option (Render):
- Web: Free tier
- API: Free tier or $7/month
- PostgreSQL: Free tier or $7/month
- **Total: $0-14/month**

---

## 🎉 You're Live!

Your PaiperSum instance should now be accessible at:
- **https://paipersum.com** - Main application
- **https://paipersum.com/api/docs** - API documentation
- **https://paipersum.com/terms.html** - Terms of Service
- **https://paipersum.com/privacy.html** - Privacy Policy

**Next Steps:**
1. Test thoroughly with real documents
2. Set up monitoring and alerts
3. Configure Stripe for payments (see STRIPE_SETUP.md)
4. Announce your launch! 🚀
