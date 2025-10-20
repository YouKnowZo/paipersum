# 🚀 PaiperSum Deployment Guide

Complete deployment instructions for running PaiperSum in production and generating revenue.

---

## 📋 Pre-Deployment Checklist

### ✅ Security
- [ ] Change `JWT_SECRET` in `.env` to a strong random value
- [ ] Update `ALLOWED_ORIGINS` to your frontend domain
- [ ] Set up HTTPS/TLS certificates
- [ ] Configure firewall rules
- [ ] Enable rate limiting
- [ ] Set up Sentry for error tracking

### ✅ Legal Compliance
- [ ] Update Terms of Service with your company info
- [ ] Update Privacy Policy with your company info
- [ ] Add your jurisdiction to governing law clauses
- [ ] Set up GDPR/CCPA compliance workflows
- [ ] Create privacy@yourdomain.com email
- [ ] Create legal@yourdomain.com email

### ✅ Business Setup
- [ ] Create Stripe account
- [ ] Set up Stripe products/pricing
- [ ] Configure webhooks
- [ ] Set up billing email notifications
- [ ] Create support email
- [ ] Set up analytics (Google Analytics, Plausible, etc.)

---

## 🐳 Method 1: Docker Compose (Fastest)

### Production Docker Compose

Create `docker-compose.prod.yml`:

```yaml
version: '3.9'

services:
  db:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${DB_USER:-ps}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: paipersum
    volumes:
      - db_data:/var/lib/postgresql/data
    networks:
      - internal

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    volumes:
      - redis_data:/data
    networks:
      - internal

  api:
    build:
      context: ./apps/api
    restart: unless-stopped
    environment:
      DATABASE_URL: postgresql+psycopg://${DB_USER}:${DB_PASSWORD}@db:5432/paipersum
      REDIS_URL: redis://redis:6379
      JWT_SECRET: ${JWT_SECRET}
      STRIPE_SECRET: ${STRIPE_SECRET}
      STRIPE_WEBHOOK_SECRET: ${STRIPE_WEBHOOK_SECRET}
      SENTRY_DSN: ${SENTRY_DSN}
      ALLOWED_ORIGINS: ${ALLOWED_ORIGINS}
    depends_on:
      - db
      - redis
    networks:
      - internal
      - web

  web:
    build:
      context: ./apps/web
      target: production
    restart: unless-stopped
    environment:
      VITE_API_URL: ${API_URL}
    networks:
      - web

  nginx:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./certs:/etc/nginx/certs:ro
    depends_on:
      - api
      - web
    networks:
      - web

networks:
  internal:
  web:

volumes:
  db_data:
  redis_data:
