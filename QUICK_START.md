# 🚀 PaiperSum V2 - Quick Start Guide

## Get Running in 2 Minutes

### Option 1: Use API Locally (Fastest)

```bash
# Terminal 1: Start API
cd apps/api
pip install -r requirements.txt
python -m uvicorn main_v2:app --reload

# Terminal 2: Start Frontend
cd apps/web
npm install --legacy-peer-deps
npm run dev

# Open http://localhost:5173
```

### Option 2: Deploy to Production (5 Minutes)

#### Step 1: Deploy API to Render
1. Go to https://render.com → Sign up (free)
2. Click "New +" → "Web Service"
3. Connect GitHub repo
4. Use settings:
   - **Build:** `cd apps/api && pip install -r requirements.txt`
   - **Start:** `cd apps/api && uvicorn main_v2:app --host 0.0.0.0 --port $PORT`
5. Add env var: `ADMIN_TOKEN=change_this_token`
6. Deploy (takes 2 min)

#### Step 2: Deploy Frontend to Vercel
```bash
npm install -g vercel
cd apps/web
vercel --prod
```

**Done! Your app is live at:**
- Frontend: https://your-app.vercel.app
- API: https://your-api.onrender.com

---

## Test It Works

### 1. Test API
```bash
curl http://localhost:8000/health
# Should return: {"status":"healthy","version":"2.0.0"}
```

### 2. Analyze a Document
```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"text":"I agree to indemnify and hold harmless the company. This agreement automatically renews unless canceled."}'
```

### 3. Access Admin Dashboard
- Go to http://localhost:5173/admin
- Password: `admin_secure_token_change_in_production`

---

## Environment Variables

### API (apps/api/.env)
```bash
ADMIN_TOKEN=your_secure_token_here
ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend (apps/web/.env)
```bash
VITE_API_URL=http://localhost:8000
```

---

## Common Issues

### Port Already in Use
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Or use different port
uvicorn main_v2:app --port 8001
```

### npm Install Errors
```bash
# Use legacy peer deps
npm install --legacy-peer-deps

# Or clear cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### CORS Errors
Make sure `VITE_API_URL` in frontend matches your API URL:
```bash
# Frontend .env
VITE_API_URL=http://localhost:8000
```

---

## Next Steps

1. ✅ Read [README.md](./README.md) for full documentation
2. ✅ Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for production
3. ✅ Review [QUALITY_ASSESSMENT.md](./QUALITY_ASSESSMENT.md) for honest review
4. ✅ See [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md) before launch

---

## Support

- 📧 support@paipersum.com
- 📧 alonzolockett@paipersum.com
- 🐛 [GitHub Issues](https://github.com/yourusername/paipersum/issues)

---

**Built with ❤️ - Now go analyze some documents!**
