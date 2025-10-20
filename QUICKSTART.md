# 🚀 PaiperSum - Quick Start Guide

Get PaiperSum running in under 5 minutes!

## 🎯 Prerequisites Check

```bash
node --version    # Should be 20+
python --version  # Should be 3.10+
docker --version  # Optional but recommended
```

If missing, install from:
- Node: https://nodejs.org/
- Python: https://python.org/
- Docker: https://docker.com/

---

## ⚡ Method 1: Docker (Recommended)

**Fastest way to run everything:**

```bash
# 1. Clone and enter directory
git clone <your-repo-url>
cd paipersum

# 2. Start all services
docker-compose up -d

# 3. Wait ~30 seconds for services to start, then open:
# - Web App: http://localhost:5173
# - API Docs: http://localhost:8000/docs
```

**That's it!** 🎉

To stop:
```bash
docker-compose down
```

---

## 💻 Method 2: Local Development

### Terminal 1 - API Backend

```bash
cd apps/api

# Create virtual environment
python -m venv .venv

# Activate (Mac/Linux)
source .venv/bin/activate
# Or Windows:
# .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start API
uvicorn main:app --reload
```

✅ API running at http://localhost:8000

### Terminal 2 - Web Frontend

```bash
cd apps/web

# Install dependencies
npm install

# Start dev server
npm run dev
```

✅ Web app running at http://localhost:5173

### Terminal 3 - Browser Extension (Optional)

```bash
cd apps/extension

# Install and build
npm install
npm run build

# Then load apps/extension/dist in Chrome:
# 1. Go to chrome://extensions/
# 2. Enable "Developer mode"
# 3. Click "Load unpacked"
# 4. Select the apps/extension/dist folder
```

---

## 🧪 Test It

1. Open http://localhost:5173
2. Click "I Understand & Accept" on the disclaimer
3. Paste this sample text:

```
I agree to indemnify and hold harmless the company. This agreement
automatically renews annually. Disputes will be resolved through binding
arbitration. You waive your right to join any class action lawsuit.
```

4. Click **"Analyze"**
5. See the risk score and detected clauses! 🎯

---

## 📦 What's Running?

| Service | URL | Purpose |
|---------|-----|---------|
| Web App | http://localhost:5173 | React frontend |
| API | http://localhost:8000 | FastAPI backend |
| API Docs | http://localhost:8000/docs | Interactive API documentation |
| PostgreSQL | localhost:5432 | Database (Docker only) |
| Redis | localhost:6379 | Cache (Docker only) |
| MinIO | http://localhost:9001 | Object storage (Docker only) |

---

## 🔧 Troubleshooting

### API won't start
```bash
# Check if port 8000 is in use
lsof -i :8000   # Mac/Linux
netstat -ano | findstr :8000  # Windows

# Try a different port
uvicorn main:app --reload --port 8001
```

### Web app shows "Failed to fetch"
```bash
# Make sure API is running first
curl http://localhost:8000/health

# Update API URL if needed
# Edit apps/web/.env and add:
VITE_API_URL=http://localhost:8000
```

### Docker issues
```bash
# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Full reset
docker-compose down -v
docker-compose up -d
```

### Python dependencies fail
```bash
# Upgrade pip first
python -m pip install --upgrade pip

# Try installing again
pip install -r requirements.txt
```

---

## 📝 Next Steps

1. ✅ **Customize**: Edit `apps/api/main.py` to add your own clause patterns
2. ✅ **Deploy**: See [README.md](README.md#deployment) for production deployment
3. ✅ **Contribute**: Read [CONTRIBUTING.md](CONTRIBUTING.md)
4. ✅ **Monitor**: Set up Sentry for error tracking

---

## 💬 Need Help?

- 📖 Full docs: [README.md](README.md)
- 🐛 Report bugs: [GitHub Issues](https://github.com/yourusername/paipersum/issues)
- 💬 Discord: [Join community](https://discord.gg/paipersum)
- 📧 Email: support@paipersum.com

---

**Happy analyzing! 🎉**
