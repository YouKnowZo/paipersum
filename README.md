# PaiperSum.com - Production Release

## Status: 🚧 In Progress

This repository contains the production-ready Next.js 14 migration of PaiperSum, an AI-powered legal document analysis platform.

## Quick Start

See [apps/web/README.md](./apps/web/README.md) for detailed setup instructions.

### Quick Setup

1. **Install dependencies:**
   ```bash
   cd apps/web
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Set up database:**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Start FastAPI service (for analysis):**
   ```bash
   cd apps/api
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

## What's Been Built

### ✅ Completed
- Next.js 14 App Router structure
- Prisma database schema
- Auth.js authentication (email)
- Stripe integration (checkout, webhooks, customer portal)
- Document upload and analysis API
- Basic UI pages (home, pricing, dashboard, analyze, signin)
- API routes for documents, billing, invoices

### 🚧 In Progress
- Email verification UI
- Password reset UI
- Document detail view
- Document comparison
- OCR for images/scanned PDFs
- Shareable report pages
- API keys management
- PostHog analytics
- SEO optimization

## Architecture

- **Frontend**: Next.js 14 (App Router) + TypeScript + TailwindCSS
- **Backend**: Next.js API Routes + FastAPI (Python) for analysis
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: Auth.js (NextAuth v5)
- **Payments**: Stripe
- **Hosting**: Vercel (recommended)

## Documentation

- [Setup Guide](./apps/web/README.md) - Detailed setup instructions
- [SUMMARY.md](./SUMMARY.md) - Current vs desired state
- [CHECKLIST.md](./CHECKLIST.md) - Feature checklist
- [CHANGELOG.md](./CHANGELOG.md) - Recent changes

## Environment Variables

See [apps/web/.env.example](./apps/web/.env.example) for required environment variables.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see [LICENSE](./LICENSE) file for details.
