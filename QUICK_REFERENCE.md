# Quick Reference - Project Structure

## 🎯 What You Need to Know

### Use This Structure ✅
```
apps/
├── web/       → Frontend (React + Vite + TypeScript)
├── api/       → Backend (FastAPI + Python)
└── extension/ → Browser Extension
```

### Ignore These ❌
```
backend/   → OLD (don't use)
frontend/  → OLD (don't use)
server/    → OLD (don't use)
```

## 🚀 Quick Commands

### Development
```bash
npm run dev:web    # Frontend on http://localhost:5173
npm run dev:api    # API on http://localhost:8000
npm run dev:ext    # Extension build watcher
```

### Build
```bash
npm run build      # Build everything for production
```

### Testing
```bash
npm run lint       # Check code quality
npm run a11y       # Accessibility testing
```

## 📦 What's Installed

- **Frontend**: React 18, Vite, TypeScript, TailwindCSS
- **Backend**: FastAPI, PyTorch, Transformers, PDF processing
- **Extension**: Chrome/Firefox extension with Vite

## 🔗 Important URLs

- Frontend Dev: http://localhost:5173
- API Dev: http://localhost:8000
- API Docs: http://localhost:8000/docs
- GitHub Repo: https://github.com/YouKnowZo/paipersum

## 📋 All Required Files Are Present ✅

### Frontend (apps/web/)
- ✅ src/App.tsx
- ✅ src/main.tsx
- ✅ src/components/ (all UI components)
- ✅ package.json
- ✅ vite.config.ts

### Backend (apps/api/)
- ✅ main.py (main API server)
- ✅ decision_engine.py
- ✅ ingest.py
- ✅ report.py
- ✅ security.py
- ✅ obs.py
- ✅ requirements.txt
- ✅ Dockerfile

### Extension (apps/extension/)
- ✅ src/content.ts
- ✅ public/manifest.json
- ✅ package.json
- ✅ vite.config.ts

## ✅ Status

- Git: Clean working tree
- Merge: Fixed (no conflicts)
- Branches: Cleaned up old setup branches
- Structure: Modern monorepo ready to use

## 🔧 Need Help?

See `MERGE_STATUS.md` for detailed information about:
- Complete project structure
- Branch cleanup details
- Security vulnerabilities
- Next steps
