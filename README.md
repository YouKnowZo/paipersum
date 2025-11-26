# 🚀 PaiperSum - AI Content Analyzer

> **Professional AI-powered analyzer and summarizer for any content type. Fast, accurate, secure.**

PaiperSum is a production-ready SaaS platform that provides instant AI analysis for documents, code, articles, emails, research papers, and more. Get actionable insights, summaries, and recommendations in seconds.

[![CI](https://github.com/yourusername/paipersum/workflows/CI/badge.svg)](https://github.com/yourusername/paipersum/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ✨ Features

### Core Capabilities
- 🔍 **Universal Analysis** - Analyze any content type (documents, code, articles, emails, etc.)
- 🤖 **AI-Powered Insights** - Advanced summarization with key points and sentiment analysis
- ⚡ **Lightning Fast** - Get results in seconds
- 🔒 **Enterprise Security** - Bank-level encryption and threat monitoring
- 📊 **Actionable Results** - Clear recommendations tailored to content type
- 🛡️ **Admin Security Portal** - Real-time threat monitoring and security dashboard

### Supported Content Types
- Legal documents & contracts
- Code & technical documentation
- Articles & blog posts
- Research papers
- Emails & communications
- General text content

### Security Features
- ✅ Real-time threat detection
- ✅ Security event logging
- ✅ Rate limiting & DDoS protection
- ✅ Admin cybersecurity dashboard
- ✅ Comprehensive security headers
- ✅ IP blocking & monitoring

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 20+ ([Download](https://nodejs.org/))
- **Python** 3.11+ ([Download](https://python.org/))
- **Docker** (optional, for containerized deployment)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/paipersum.git
cd paipersum

# 2. Install dependencies
cd apps/web && npm install
cd ../api && pip install -r requirements.txt

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# 4. Start the API
cd apps/api
uvicorn main:app --reload

# 5. In a new terminal, start the web app
cd apps/web
npm run dev

# 6. Open http://localhost:5173 in your browser
```

### Using Docker (Recommended for Production)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services will be available at:
- **Web App**: http://localhost:5173
- **API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Admin Dashboard**: http://localhost:8000/admin/dashboard

---

## 📁 Project Structure

```
paipersum/
├── apps/
│   ├── web/                    # React + Vite frontend
│   │   ├── src/
│   │   │   ├── components/     # UI components
│   │   │   ├── lib/           # API client, schemas
│   │   │   ├── pages/         # Page components
│   │   │   └── App.tsx        # Main application
│   │   └── package.json
│   │
│   ├── api/                   # FastAPI backend
│   │   ├── main.py            # FastAPI application
│   │   ├── analyzer_engine.py # Universal analyzer
│   │   ├── admin_security.py  # Security portal
│   │   ├── security.py        # Rate limiting, headers
│   │   ├── ingest.py          # File processing
│   │   └── requirements.txt
│   │
│   └── extension/             # Browser extension
│
├── .github/workflows/         # CI/CD pipelines
├── render.yaml                 # Render deployment config
├── vercel.json                # Vercel deployment config
└── README.md
```

---

## 🎨 Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling & design system

### Backend
- **FastAPI** - High-performance Python API
- **OpenAI/Anthropic** - AI analysis (optional, free tier available)
- **Pydantic** - Data validation
- **PDFMiner** - PDF text extraction
- **Stripe** - Payment processing

### DevOps
- **Docker** - Containerization
- **GitHub Actions** - CI/CD
- **Render** - API hosting
- **Vercel** - Web hosting

---

## 📖 Usage

### Web Interface

1. **Paste Text**: Copy content directly into the textarea
2. **Upload File**: Drag & drop or select files (PDF, DOC, DOCX, TXT, MD, etc.)
3. **Analyze**: Click "Analyze" to process the content
4. **Review Results**: See summary, key points, sentiment, and recommendations
5. **Export**: Download results as PDF (Pro feature)

### API

```bash
# Analyze text
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "Your content here..."}'

# Analyze file
curl -X POST http://localhost:8000/analyze-file \
  -F "file=@document.pdf"

# Admin security dashboard
curl -X GET http://localhost:8000/admin/security-dashboard \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**API Documentation**: http://localhost:8000/docs

---

## ⚙️ Configuration

### Environment Variables

Create `.env` file in `apps/api/`:

```bash
# API Configuration
ALLOWED_ORIGINS=https://paipersum.com,https://www.paipersum.com
ADMIN_SECRET=your-secure-admin-secret

# AI APIs (Optional - free tiers available)
OPENAI_API_KEY=sk-xxx
ANTHROPIC_API_KEY=sk-ant-xxx

# Stripe (Optional)
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Sentry (Optional)
SENTRY_DSN=https://xxx@sentry.io/xxx
```

### Web Configuration

Create `.env` file in `apps/web/`:

```bash
VITE_API_URL=http://localhost:8000
```

---

## 🚢 Deployment

### Deploy to Render (API)

1. Connect your GitHub repository to Render
2. Create a new **Web Service**
3. Use `render.yaml` configuration or set:
   - Build Command: `cd apps/api && pip install -r requirements.txt`
   - Start Command: `cd apps/api && uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add environment variables
5. Deploy

### Deploy to Vercel (Web)

1. Connect your GitHub repository to Vercel
2. Import project
3. Vercel will auto-detect `vercel.json` configuration
4. Set environment variables
5. Deploy

### Deploy to Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### GitHub Actions (CI/CD)

The repository includes GitHub Actions workflows:
- **CI**: Runs tests on push/PR
- **Deploy**: Auto-deploys to Render/Vercel on main branch

---

## 🔒 Security & Compliance

### Security Features
- ✅ HTTPS encryption (in production)
- ✅ Rate limiting (30 req/10sec per IP)
- ✅ Security headers (CSP, HSTS, X-Frame-Options)
- ✅ Input validation & sanitization
- ✅ File upload restrictions
- ✅ Admin security dashboard
- ✅ Threat detection & logging
- ✅ IP blocking capabilities

### Legal Compliance
- ✅ **Terms of Service** - `/terms.html`
- ✅ **Privacy Policy** - `/privacy.html`
- ✅ **GDPR Compliant** - Data minimization, right to deletion
- ✅ **CCPA Compliant** - California privacy rights
- ✅ **Not Professional Advice Disclaimer** - Clear disclosure

### Data Handling
- 🔒 Content processed in memory (not permanently stored)
- 🔒 TLS encryption in transit
- 🔒 No human review of your content
- 🔒 Analysis results deleted after 90 days

---

## 💰 Pricing

### Free Plan
- 10 analyses per month
- Basic summarization
- Standard support

### Pro Plan - $29/month
- Unlimited analyses
- AI-powered insights
- Priority support
- PDF export
- API access
- Advanced analytics

### Team Plan - $99/month
- Everything in Pro
- Team collaboration
- Admin dashboard
- Custom integrations
- Dedicated support
- SLA guarantee

---

## 🛡️ Admin Security Portal

Access the admin security dashboard at `/admin/dashboard` with your admin token.

Features:
- Real-time threat monitoring
- Security event logs
- IP blocking/unblocking
- Rate limit violation tracking
- Suspicious pattern detection
- Top attackers list

---

## 🛡️ Disclaimer

**⚠️ IMPORTANT: THIS IS NOT PROFESSIONAL ADVICE**

PaiperSum provides automated content analysis for **informational purposes only**. This service:

- Does NOT constitute legal, financial, medical, or professional advice
- Does NOT create any professional-client relationship
- May miss important information or misinterpret content
- Should NOT be relied upon for important decisions
- Is NOT a substitute for consultation with qualified professionals

**Always consult qualified professionals** licensed in your jurisdiction before making important decisions.

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

```bash
# Fork the repo
# Create a feature branch
git checkout -b feature/amazing-feature

# Make your changes
# Commit with clear messages
git commit -m "Add amazing feature"

# Push to your fork
git push origin feature/amazing-feature

# Open a Pull Request
```

---

## 📞 Support

- **Documentation**: [docs.paipersum.com](https://docs.paipersum.com)
- **Email**: support@paipersum.com
- **Issues**: [GitHub Issues](https://github.com/yourusername/paipersum/issues)

---

## 📜 License

MIT License - see [LICENSE](LICENSE) file for details.

Copyright © 2025 PaiperSum

---

**Built with ❤️ for professionals who need reliable AI analysis**
