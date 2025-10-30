## Setup placeholders and environment configuration

Use this checklist to connect payments, deploy, and enable account features.

- Stripe (client, web):
  - apps/web: set `VITE_STRIPE_PUBLIC_KEY` in your hosting env (Vercel). Example: `pk_live_...`
  - apps/web: set `VITE_API_URL` to your API base (e.g., `https://api.yourdomain.com`)
- Stripe (server / FastAPI):
  - apps/api: set `STRIPE_SECRET_KEY` (e.g., `sk_live_...`)
  - apps/api: set `STRIPE_WEBHOOK_SECRET` from the Stripe Dashboard
  - In Stripe Dashboard, create a recurring Price for "PaiperSum Pro"; copy its `price_...` id
  - In `apps/web/src/App.tsx`, replace `price_PLACEHOLDER` with your `price_...` id
- Domains:
  - Web app on Vercel: point apex/root domain to Vercel; set `paipersum.com`
  - API on Render/Fly/Railway: set `VITE_API_URL` accordingly
- Privacy/Data:
  - Support email for data requests is `support@paipersum.com` (update in `AccountPage.tsx` if different)
  - If you want server-side deletion/export, add API routes and wire buttons in `AccountPage.tsx`
- Icons:
  - Favicon lives at `apps/web/public/favicon.svg`. Replace with your SVG to update branding.
- Extension:
  - Update Chrome Web Store listing link in `EverydayIntegration.tsx` if you publish the extension.
