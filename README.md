# 🛡️ PaiperSum Atlas — Anything Analyzer + Threat Desk

> **A professional AI workspace that distills any document into an executive brief and streams live cybersecurity telemetry to the same console.**

PaiperSum Atlas is a production-ready SaaS platform built for legal, security, GTM, and operations teams. Upload contracts, SOC reports, procurement questionnaires, privacy updates, SIEM exports—Atlas produces minimal, board-ready summaries while the built-in admin portal highlights every blocked attack and compliance risk.

[![CI](https://github.com/yourusername/paipersum/workflows/CI/badge.svg)](https://github.com/yourusername/paipersum/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ✨ Features

### Core Capabilities
- 🧭 **Atlas Briefings** - Instant recommendations for contracts, privacy updates, vendor questionnaires, SOC evidence, product launches, and more
- 🛡️ **Admin Threat Desk** - Live feed of blocked attacks, suspicious IPs, CVE watchlists, and geo heat maps
- 📊 **Risk Scoring & Cost Math** - 0-100 risk score, cost impact modeling, and benchmarking across industries
- 🎯 **Negotiation & Response Kits** - Auto-generated legal redlines, procurement replies, and trust communications
- 📄 **Executive Exports** - PDF, DOCX, and share links with citations, mitigation actions, and disclaimers
- 🔌 **Free Integrations** - Slack/Teams/Notion/Jira digests plus browser extension for instant captures

### Workflows Covered
- Master service agreements, statements of work, and NDAs
- Privacy, trust, and legal policy updates
- Vendor security questionnaires and compliance evidence packs
- SOC reports, audit findings, and SIEM/EDR exports
- GTM assets (pricing decks, marketing claims, launch copy)
- HR, ops, and finance approvals (offer letters, procurement memos)

### Detected Clauses
- ❗ **High Risk (Red)**: Indemnification, Liability Waivers, Assumption of Risk
- ⚠️ **Moderate Risk (Yellow)**: Arbitration, Class Action Waivers, Auto-Renewal, Data Sharing
- ✅ **Low Risk (Green)**: Governing Law, Termination, Force Majeure

### Admin Cybersecurity Portal
- 📡 **Live telemetry** - Aggregated attack attempts, blocked credentials, and geo maps with ISP and ASN attribution
- 🧪 **Threat simulations** - Synthetic red-team runs to validate rate limits, header policies, and WAF coverage
- 📬 **Digest delivery** - Slack, Teams, and email summaries for exec staff without exposing raw logs
- 📁 **Audit-ready evidence** - Exportable JSON/PDF with timestamps, controls, and follow-up owners

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 20+ ([Download](https://nodejs.org/))
- **Python** 3.10+ ([Download](https://python.org/))
- **Docker** (optional, for containerized deployment)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/paipersum.git
cd paipersum

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# 4. Start the API
cd apps/api
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload

# 5. In a new terminal, start the web app
cd apps/web
npm install
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
- **MinIO Console**: http://localhost:9001 (minio/minio12345)

---

## 📁 Project Structure

```
paipersum/
├── apps/
│   ├── web/                    # React + Vite frontend
│   │   ├── src/
│   │   │   ├── components/     # Reusable UI components
│   │   │   ├── lib/           # API client, schemas
│   │   │   ├── pages/         # Page components
│   │   │   ├── App.tsx        # Main application
│   │   │   └── main.tsx       # Entry point
│   │   ├── public/            # Static assets, legal pages
│   │   └── package.json
│   │
│   ├── api/                   # FastAPI backend
│   │   ├── main.py            # FastAPI application
│   │   ├── obs.py             # Observability & logging
│   │   ├── security.py        # Rate limiting, headers
│   │   ├── ingest.py          # PDF/OCR processing
│   │   ├── report.py          # PDF report generation
│   │   └── requirements.txt
│   │
│   └── extension/             # Browser extension
│       ├── src/
│       │   └── content.ts     # Content script
│       └── public/
│           └── manifest.json
│
├── docker-compose.yml         # Local development stack
├── .github/workflows/         # CI/CD pipelines
└── README.md
```

---

## 🎨 Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling & design system
- **Zod** - Runtime type validation
- **Axios** - HTTP client

### Backend
- **FastAPI** - High-performance Python API
- **Pydantic** - Data validation
- **PDFMiner** - PDF text extraction
- **Tesseract** - OCR for scanned documents
- **FPDF** - PDF report generation
- **PostgreSQL** - Database (optional, for auth)
- **Redis** - Caching & rate limiting
- **MinIO** - S3-compatible object storage

### DevOps
- **Docker** - Containerization
- **GitHub Actions** - CI/CD
- **Uvicorn** - ASGI server

---

## 📖 Usage

### Web Interface

1. **Paste Text**: Copy legal text directly into the textarea
2. **Upload File**: Drag & drop or select PDF, DOC, DOCX, TXT files
3. **Analyze**: Click "Analyze" to process the document
4. **Review Results**: See risk score, confidence, and detected clauses
5. **Export PDF**: Download a professional report

### Browser Extension

1. **Install**:
   ```bash
   cd apps/extension
   npm install
   npm run build
   ```

2. **Load in Chrome**:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select `apps/extension/dist` folder

3. **Use**:
   - Navigate to any webpage with legal text
   - Look for the PaiperSum panel in the top-right
   - Click "Analyze This Page"

### API

```bash
# Analyze text
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "I agree to indemnify and hold harmless..."}'

# Analyze file
curl -X POST http://localhost:8000/analyze-file \
  -F "file=@contract.pdf"

# Export PDF report
curl -X POST http://localhost:8000/export/pdf \
  -H "Content-Type: application/json" \
  -d '{"text": "..."}' \
  --output report.pdf
```

**API Documentation**: http://localhost:8000/docs

---

## ⚙️ Configuration

### Environment Variables

Create `.env` file in the root directory:

```bash
# API Configuration
DATABASE_URL=postgresql+psycopg://ps:ps@localhost:5432/paipersum
REDIS_URL=redis://localhost:6379
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minio
S3_SECRET_KEY=minio12345
S3_BUCKET=paipersum
JWT_SECRET=your-secret-key-change-in-production
STRIPE_SECRET=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
SENTRY_DSN=https://xxx@sentry.io/xxx
ALLOWED_ORIGINS=*
ADMIN_API_KEY=replace-with-strong-passphrase

# Web Configuration
VITE_API_URL=http://localhost:8000
```

### Customization

**Add Custom Clauses** (apps/api/main.py):
```python
RULES = [
    (r"your-regex-pattern", "Clause Title", "Plain English summary", 'risk-level'),
    # risk-level: 'red', 'yellow', or 'green'
]
```

**Adjust Risk Weights** (apps/api/main.py):
```python
RISK_WEIGHTS = {'red': 30, 'yellow': 12, 'green': 4}
```

**Rate Limiting** (apps/api/security.py):
```python
WINDOW = 10  # seconds
LIMIT = 30   # requests per window
```

## 🧑‍💼 Admin Portal

- Set `ADMIN_API_KEY` in `apps/api/.env` and redeploy. All `/admin/*` routes expect this passcode via the `X-Admin-Key` header.
- The web console (“Security Portal” button) prompts for the passcode locally (stored only in `sessionStorage`) and then pulls the dashboard via FastAPI.
- Telemetry and config changes persist to `apps/api/data/state.json` so threat timelines, usage analytics, and rate-limit settings survive restarts. Swap this file for Postgres/Redis as you scale.
- Admins can adjust rate limits, toggle maintenance mode, manage allowed admin IPs, and acknowledge threats directly from the UI.

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Test specific app
npm --workspace apps/web test
```

### Manual Testing Checklist
- [ ] Text analysis with sample contract
- [ ] File upload (PDF, DOCX, TXT)
- [ ] Large file handling (>1MB)
- [ ] Invalid file format rejection
- [ ] PDF export functionality
- [ ] Browser extension on various sites
- [ ] Mobile responsiveness
- [ ] Accessibility (keyboard navigation, screen readers)

---

## 🚢 Deployment

### Docker Production Deployment

```bash
# Build images
docker-compose -f docker-compose.yml build

# Run in production mode
docker-compose -f docker-compose.yml up -d

# View logs
docker-compose logs -f api web

# Scale workers
docker-compose up -d --scale api=3
```

### Platform Deployment

#### Deploy to Fly.io

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login
flyctl auth login

# Deploy API
cd apps/api
flyctl launch
flyctl deploy

# Deploy Web
cd ../web
flyctl launch
flyctl deploy
```

#### Deploy to Render

1. Connect your GitHub repository
2. Create new **Web Service** for API
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
3. Create new **Static Site** for Web
   - Build Command: `cd apps/web && npm install && npm run build`
   - Publish Directory: `apps/web/dist`

#### Deploy to Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

---

## 🔒 Security & Compliance

### Security Features Implemented
- ✅ HTTPS encryption (in production)
- ✅ Rate limiting (30 req/10sec per IP)
- ✅ Security headers (CSP, HSTS, X-Frame-Options)
- ✅ Input validation & sanitization
- ✅ File upload restrictions (type, size)
- ✅ Request ID tracking
- ✅ Structured logging
- ✅ Error handling without data leaks

### Legal Compliance
- ✅ **Not Legal Advice Disclaimer** - Prominent throughout UI
- ✅ **Terms of Service** - `/terms.html`
- ✅ **Privacy Policy** - `/privacy.html`
- ✅ **GDPR Compliant** - Data minimization, right to deletion
- ✅ **CCPA Compliant** - California privacy rights
- ✅ **No Attorney-Client Relationship** - Clear disclosure

### Data Handling
- 🔒 Documents **not stored** by default (processed in memory)
- 🔒 TLS encryption in transit
- 🔒 No human review of your documents
- 🔒 Analysis results deleted after 90 days (configurable)

---

## 🛡️ Disclaimer

**⚠️ IMPORTANT: THIS IS NOT LEGAL OR SECURITY ADVICE**

PaiperSum provides automated analysis and telemetry summaries for **informational purposes only**. This service:

- Does NOT constitute legal advice or cybersecurity guidance
- Does NOT create an attorney-client or consultant relationship
- May miss important clauses, threats, or misinterpret data
- Should NOT be relied upon for legal, compliance, or security decisions
- Is NOT a substitute for consultation with licensed professionals

**Always consult qualified legal counsel and certified security practitioners** before making binding decisions or claims.

---

## 💰 Business Model / Monetization

### Pricing Tiers

| Tier | Price | Designed For | Highlights |
|------|-------|--------------|------------|
| **Starter** | $0 | Solo users validating drafts | 40 analyses/month, weekly threat digest, PDF/DOCX export |
| **Operator** | $49/seat | GTM, legal, and security leads | Unlimited analyses, live threat desk, Slack/Teams/Notion sync |
| **Enterprise** | Custom | Regulated orgs & large teams | Private AI enclaves, SSO/SCIM, DPA, dedicated trust engineer |

### Stripe Integration
See `apps/api/stripe_routes.py` for checkout and webhook flow.

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

### Development Guidelines
- Follow TypeScript/Python style guides
- Add tests for new features
- Update documentation
- Ensure accessibility compliance
- Add error handling

---

## 📊 Roadmap

### MVP (Current)
- [x] Core analysis engine
- [x] Web interface
- [x] PDF export
- [x] Browser extension
- [x] Docker deployment
- [x] Legal compliance pages

### Phase 2 (Q1 2026)
- [ ] User authentication
- [ ] Stripe payment integration
- [ ] Document history
- [ ] Advanced ML classifier (transformer-based)
- [ ] Multi-language support
- [ ] Comparison mode (diff two documents)

### Phase 3 (Q2 2026)
- [ ] Team collaboration features
- [ ] API keys for developers
- [ ] Webhooks
- [ ] OCR improvements
- [ ] Mobile apps (iOS/Android)
- [ ] Enterprise SSO

---

## 📞 Support

- **Documentation**: [docs.paipersum.com](https://docs.paipersum.com)
- **Email**: support@paipersum.com
- **Issues**: [GitHub Issues](https://github.com/yourusername/paipersum/issues)
- **Discord**: [Join our community](https://discord.gg/paipersum)

---

## 📜 License

MIT License - see [LICENSE](LICENSE) file for details.

Copyright © 2025 PaiperSum

---

## 🙏 Acknowledgments

- Legal clause patterns inspired by [ToS;DR](https://tosdr.org/)
- UI design inspired by modern SaaS best practices
- Built with open-source technologies

---

## 📈 Analytics & Monitoring

### Key Metrics to Track
- Monthly Active Users (MAU)
- Documents analyzed per day
- Conversion rate (free → paid)
- Average risk score
- Model confidence trends
- API latency (p95, p99)
- Error rates

### Monitoring Stack
- **Sentry**: Error tracking
- **OpenTelemetry**: Distributed tracing
- **Prometheus**: Metrics collection
- **Grafana**: Dashboards

---

**Built with ❤️ for everyone who's ever clicked "I agree" without reading**

