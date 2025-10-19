# PaiperSum (MVP)

## Quick start
1. Install Node 20+ and Python 3.10+.
2. From repo root: `npm i`
3. API: `cd apps/api && python -m venv .venv && . .venv/bin/activate && pip install -r requirements.txt && uvicorn main:app --reload`
4. Web: `cd ../../apps/web && npm i && npm run dev` (VITE_API_URL defaults to http://localhost:8000)
5. Extension: `cd ../../apps/extension && npm i && npm run build`, then load `apps/extension/dist` as an unpacked extension in Chrome.

## Notes
- Not legal advice. This MVP uses deterministic regex heuristics. Swap `RULES` with a model‑backed classifier for production.
- Add authentication, encryption, and storage policies before public usage.


---

## What's missing for "full backend + UI/UX"
- **NLP:** Trained clause classifier + risk model, not regex.
- **Uploads:** Robust PDF/DOCX/OCR pipeline, large-file handling.
- **Auth:** Sign-up/login, JWT, password reset, SSO.
- **Storage:** Postgres schema, object storage (S3/MinIO), encryption at rest.
- **Privacy/Compliance:** DPIA, data-retention controls, consent toggles, audit logs.
- **Payments:** Stripe tiers, usage metering, invoices.
- **Extension:** Options page, API key config, site permissions hardening, store packaging.
- **UX polish:** Figma design system, responsive states, a11y pass, empty/error/loading states.
- **Enterprise:** Team workspaces, roles, org policies, API keys, rate limiting.
- **Ops:** Docker, CI/CD, env secrets, monitoring, error tracking, logging.
- **QA:** Unit/integration tests, model eval set, security review.
- **Docs:** API spec, privacy/ToS, support flows.
- **Internationalization:** i18n and locale-specific legal hints.

## Fast path to "complete"
- **Data + Model (2–3 wks):** Add spaCy/transformer model, label 500–1,000 clauses, train, replace regex.
- **Files + OCR (1 wk):** Tesseract/pdfminer pipeline, async chunking, size limits.
- **Auth + DB (1 wk):** Postgres schema, JWT, user/docs tables, KMS-backed secrets.
- **Storage + Privacy (1 wk):** S3/MinIO, per-doc encryption, retention policies, audit log.
- **Payments (3–4 days):** Stripe checkout, plans, usage limits, webhooks.
- **Extension GA (3–4 days):** Options UI, configurable API, permissions minimization, bundle for store.
- **UX polish (1 wk):** Design system, a11y fixes, skeleton loaders, error UX.
- **Ops (3–4 days):** Dockerfiles, compose, deploy to Fly.io/Render, Sentry + Prometheus.
- **QA + Docs (1 wk):** Tests, model eval report, API docs, ToS/Privacy.

## Optional extensions to build now
- Postgres schema, Stripe integration, auth routes.
- File/OCR service and a baseline transformer classifier.
- Figma-level UI passes for all states.

---

# Phase 2 — Figma/UI Pass (Design System + Specs)

## Design tokens (import to Figma Variables and Tailwind)
```json
{
  "color": {
    "brand/blue": "#0f4c81",
    "brand/green": "#2e7d32",
    "brand/yellow": "#f9a825",
    "brand/red": "#c62828",
    "ink/900": "#0b1324",
    "ink/700": "#1f2937",
    "ink/500": "#4b5563",
    "ink/300": "#9ca3af",
    "paper/0": "#ffffff",
    "paper/50": "#f9fafb",
    "paper/100": "#f3f4f6",
    "border/200": "#e5e7eb"
  },
  "radius": {"xs":"6","sm":"10","md":"12","lg":"16","xl":"24"},
  "spacing": {"xs":"4","sm":"8","md":"12","lg":"16","xl":"24","2xl":"32"},
  "shadow": {"sm":"0 1px 2px rgba(0,0,0,.06)","md":"0 6px 18px rgba(0,0,0,.1)","lg":"0 10px 30px rgba(0,0,0,.12)"},
  "font": {"ui":"Inter","legal":"Source Serif Pro"}
}
```

### Tailwind plugin snippet
```js
// tailwind.config.cjs (extend)
extend: {
  colors: {
    brand: { blue:'#0f4c81', green:'#2e7d32', yellow:'#f9a825', red:'#c62828' },
    ink: { 900:'#0b1324',700:'#1f2937',500:'#4b5563',300:'#9ca3af' },
    paper: { 0:'#ffffff',50:'#f9fafb',100:'#f3f4f6' },
    border: { 200:'#e5e7eb' }
  },
  borderRadius: { xs:'6px', sm:'10px', md:'12px', lg:'16px', xl:'24px' },
  boxShadow: { sm:'0 1px 2px rgba(0,0,0,.06)', md:'0 6px 18px rgba(0,0,0,.1)', lg:'0 10px 30px rgba(0,0,0,.12)' }
}
```

## Core components (Figma and code parity)
- **App Shell:** top bar, left nav, content area, right insights rail.
- **Buttons:** Primary (brand/blue), Secondary (border), Destructive (brand/red). States: hover, focus, disabled, loading.
- **Inputs:** Text, textarea, file dropzone, select. With help text + error.
- **Cards:** Elevated containers for Summary, Clauses, Privacy scan.
- **RiskMeter:** horizontal progress with step ticks; color switches at 25/50/75.
- **Badges:** risk dots (green/yellow/red), "Confidence %", "Not legal advice".
- **Tables:** Clauses table with sticky header, sortable by risk.
- **Empty/Loading/Error:** skeleton lines, spinners, retry button.
- **A11y:** WCAG AA contrast; focus ring 2px brand/blue; keyboard trap avoided; reduced‑motion animations.

### Screen list for Figma
1. Upload (dropzone + paste)
2. Analysis Summary (risk meter, top clauses)
3. Clauses detail (filters, search, citations)
4. Original text side‑by‑side
5. Compare versions (delta risk)
6. Account: Sign in/up, Forgot password
7. Billing: Plans, checkout state, receipts
8. Settings: Data retention, export, delete account
9. Extension sidebar

---

# Phase 3 — Deployment Scripts (Docker, CI/CD, Env)

## Docker Compose Setup
The `docker-compose.yml` in the repo root provides:
- **PostgreSQL 16** database on port 5432
- **MinIO** object storage on ports 9000 (API) and 9001 (console)
- **API** service built from `apps/api`
- **Web** service built from `apps/web`

### Start all services
```bash
docker-compose up -d
```

### Initialize database
```bash
docker-compose exec db psql -U ps -d paipersum -f /path/to/init.sql
# Or copy init.sql into container first
docker cp apps/api/init.sql paipersum-db-1:/tmp/
docker-compose exec db psql -U ps -d paipersum -f /tmp/init.sql
```

## Environment Configuration
Copy `.env.api.example` to `.env.api` and configure:
- `DATABASE_URL`: PostgreSQL connection string
- `S3_ENDPOINT`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`: MinIO/S3 credentials
- `JWT_SECRET`: Change to a secure random string
- `STRIPE_SECRET`, `STRIPE_WEBHOOK_SECRET`: Your Stripe keys
- `ALLOWED_ORIGINS`: CORS origins (use specific domains in production)

## CI/CD Pipeline
GitHub Actions workflow (`.github/workflows/ci.yml`) runs:
- Node.js 20 setup
- Web app install and build
- API linting with ruff

### Deployment targets
- **Fly.io**: Add `fly.toml`, use `flyctl deploy`
- **Render**: Connect repo, set build commands
- **Railway**: Connect repo, configure services
- **AWS/GCP/Azure**: Use Dockerfiles with your preferred container service

---

# Phase 1 — Backend Extensions (Auth, Stripe, OCR, Model)

## Database Schema
The `apps/api/init.sql` file contains:
- `users` table with email/password authentication
- `documents` table for uploaded files (S3 keys)
- `analyses` table for storing risk analysis results
- `api_keys` table for API authentication
- `audit_logs` table for compliance tracking

Run the schema file against your PostgreSQL database to initialize.

## Authentication (`apps/api/auth.py`)
Provides JWT-based authentication:
- `POST /auth/register` - Create new user account
- `POST /auth/login` - Login and receive JWT token

Uses Argon2 for password hashing. Configure `JWT_SECRET` environment variable.

## Billing (`apps/api/billing.py`)
Stripe integration skeleton:
- `POST /billing/create-portal` - Create Stripe billing portal
- `POST /billing/webhook` - Handle Stripe webhooks

Configure `STRIPE_SECRET` and `STRIPE_WEBHOOK_SECRET` environment variables.

## File Processing (`apps/api/ingest.py`)
PDF and OCR text extraction:
- Uses `pdfminer.six` for text-based PDFs
- Falls back to Tesseract OCR for scanned documents
- Requires `tesseract-ocr` and `poppler-utils` system packages (included in Dockerfile)

## ML Model (`apps/api/model.py`)
Transformer-based clause classification:
- Uses `facebook/bart-large-mnli` zero-shot classifier
- Classifies text chunks into 9 clause categories
- Returns confidence scores and snippets
- Replaces regex patterns with ML predictions

**Note:** First run downloads ~1.6GB model. Consider:
- Caching model in Docker layer
- Using smaller models (distilbart, minilm)
- Switching to fine-tuned legal domain models

## File Upload Endpoint
`POST /analyze-file` accepts file uploads:
1. Extracts text from PDF or reads as plain text
2. Attempts ML classification (if dependencies available)
3. Falls back to regex patterns if ML unavailable
4. Returns same format as `/analyze` endpoint

## Web Upload Component
`apps/web/src/components/Upload.tsx` provides:
- File input with PDF/text support
- Upload progress and error handling
- Inline results display with risk score
- Integrated into main App above text input

---

## Development Workflow

### Local Development (without Docker)
```bash
# Terminal 1: API
cd apps/api
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload

# Terminal 2: Web
cd apps/web
npm install
npm run dev

# Terminal 3: Extension (optional)
cd apps/extension
npm install
npm run build
# Load apps/extension/dist as unpacked extension in Chrome
```

### Docker Development
```bash
# Start all services
docker-compose up --build

# View logs
docker-compose logs -f api
docker-compose logs -f web

# Restart single service
docker-compose restart api

# Stop all
docker-compose down
```

## Testing the ML Model
```bash
# Inside API container or venv
python -c "from model import classify_clauses; print(classify_clauses('You agree to indemnify us...'))"
```

## Production Checklist
- [ ] Change all default passwords/secrets
- [ ] Set `ALLOWED_ORIGINS` to specific domains
- [ ] Enable HTTPS/TLS
- [ ] Set up database backups
- [ ] Configure S3 bucket policies
- [ ] Set up monitoring (Sentry, Prometheus)
- [ ] Enable rate limiting
- [ ] Add input validation and sanitization
- [ ] Implement proper error logging
- [ ] Set up CDN for static assets
- [ ] Configure email service for auth
- [ ] Add terms of service and privacy policy
- [ ] Implement GDPR compliance features
- [ ] Set up staging environment
- [ ] Load test with expected traffic
- [ ] Security audit (dependencies, code, infrastructure)
