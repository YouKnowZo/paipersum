# PaiperSum - Setup Guide

## Prerequisites

- Node.js 20+
- PostgreSQL database
- Stripe account (for payments)
- SMTP server (for email auth)

## Setup

1. **Install dependencies:**

```bash
cd apps/web
npm install
```

2. **Set up environment variables:**

Create a `.env.local` file:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/paipersum

# Auth
AUTH_SECRET=generate-a-random-32-character-string-here
NEXTAUTH_URL=http://localhost:3000

# Email (for Auth.js email provider)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=noreply@paipersum.com
SMTP_PASSWORD=your-password

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Analysis API (FastAPI service)
ANALYSIS_API_URL=http://localhost:8000

# Optional: Analytics
NEXT_PUBLIC_POSTHOG_KEY=...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

3. **Set up database:**

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate
```

4. **Start development server:**

```bash
npm run dev
```

5. **Start FastAPI service (for analysis):**

In a separate terminal:

```bash
cd apps/api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## Stripe Setup

1. Create products in Stripe Dashboard:
   - Pro Monthly: $20/month
   - Pro Annual: $200/year

2. Copy the Price IDs and add to `.env.local`:
   ```env
   STRIPE_PRO_MONTHLY_PRICE_ID=price_...
   STRIPE_PRO_ANNUAL_PRICE_ID=price_...
   ```

3. Set up webhook endpoint:
   - URL: `https://yourdomain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `invoice.paid`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy webhook secret to `.env.local`

## Deployment

### Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Database

Use Vercel Postgres or external PostgreSQL provider. Update `DATABASE_URL` in Vercel environment variables.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run db:migrate` - Run database migrations
- `npm run db:generate` - Generate Prisma client
- `npm run db:seed` - Seed database (if configured)
