# PaiperSum.com - Production Release Checklist

## Foundation Setup
- [x] Next.js 14 App Router configured
- [x] TypeScript strict mode enabled
- [x] TailwindCSS + shadcn/ui installed
- [x] Prisma schema created and migrated
- [x] Auth.js configured with email provider
- [x] env.ts with zod validation created
- [x] Folder structure organized (app/, components/, lib/, prisma/)

## Database Schema
- [x] User model (id, email, name, emailVerified, image, createdAt, updatedAt)
- [x] Account model (for OAuth providers)
- [x] Session model (for Auth.js)
- [x] VerificationToken model (email verification)
- [x] Document model (id, userId, name, type, content, analysis, createdAt)
- [x] Subscription model (userId, stripeCustomerId, stripeSubscriptionId, status, plan, currentPeriodEnd)
- [x] APIKey model (id, userId, name, keyHash, lastUsedAt, createdAt)
- [x] UsageRecord model (userId, documentId, type, count, date)

## Authentication
- [x] Email signup flow
- [x] Email verification flow (via Auth.js)
- [x] Password reset flow (via Auth.js)
- [x] Sign in flow
- [x] Sign out flow
- [ ] Profile page (view/edit)
- [ ] Account deletion
- [x] OAuth providers (Google, GitHub) - configured but need UI

## Billing & Subscriptions
- [x] Stripe products created (Free, Pro Monthly, Pro Annual, Enterprise)
- [x] Checkout session creation API route
- [x] Webhook handler for checkout.session.completed
- [x] Webhook handler for invoice.paid
- [x] Webhook handler for customer.subscription.updated
- [x] Webhook handler for customer.subscription.deleted
- [x] Customer portal link generation
- [ ] Billing page (plan, usage, invoices) - API ready, needs UI
- [x] Usage metering (pages analyzed beyond plan caps)
- [ ] Grace period handling

## Document Analysis
- [x] File upload endpoint (PDF, DOCX, TXT, Images)
- [x] File validation (MIME type, size limits)
- [x] PDF text extraction (via FastAPI)
- [x] DOCX text extraction (via FastAPI)
- [x] TXT file parsing
- [ ] OCR for images (Tesseract.js or service)
- [ ] OCR for scanned PDFs
- [ ] Text extraction pipeline
- [ ] Analysis API integration (FastAPI)
- [ ] Document storage (Vercel Blob or S3)
- [ ] Document listing (user's documents)
- [ ] Document deletion
- [ ] Analysis results caching

## Legal Analysis Features
- [ ] Clause detection (14+ clause types)
- [ ] Risk scoring (0-100)
- [ ] Risk color coding (Green/Yellow/Red)
- [ ] Plain-English summaries
- [ ] GDPR/CCPA mention detection
- [ ] Data-sharing detection
- [ ] Highlighted clauses with reasons
- [ ] Recommendation engine (Sign/Negotiate/Walk Away)

## General Summarization
- [ ] User-selectable styles (Bullet, Executive, Study notes)
- [ ] Compression ratio selection
- [ ] Summarization API endpoint

## Document Comparison
- [ ] Two-document upload
- [ ] Diff highlighting for clauses
- [ ] Data-sharing term comparison
- [ ] Side-by-side view
- [ ] Jump-to-clause navigation

## Report Generation
- [ ] PDF report generation with branding
- [ ] Logo inclusion
- [ ] Timestamp inclusion
- [ ] Share link generation
- [ ] Shareable read-only report pages
- [ ] Report expiration (optional)

## API Access
- [ ] API key generation UI
- [ ] API key management (list, revoke)
- [ ] API endpoints with authentication
- [ ] Rate limiting per tier (Free: 10/min, Pro: 100/min, Enterprise: unlimited)
- [ ] Usage metering per API key
- [ ] API documentation page

## UI Components
- [ ] Dashboard layout
- [ ] Recent documents list
- [ ] Document status badges
- [ ] Risk badges (Green/Yellow/Red)
- [ ] Quick actions (analyze, export, share)
- [ ] Analyzer view (left: doc, right: findings)
- [ ] Comparison view (two docs, unified diff)
- [ ] Pricing page with feature table
- [ ] FAQ section
- [ ] Empty states
- [ ] Loading states
- [ ] Error boundaries
- [ ] Toast notifications (shadcn/ui)

## Navigation & Routes
- [ ] Home page (landing)
- [ ] Dashboard (/dashboard)
- [ ] Analyze page (/analyze)
- [ ] Document view (/documents/[id])
- [ ] Comparison page (/compare)
- [ ] Pricing page (/pricing)
- [ ] Account page (/account)
- [ ] Billing page (/billing)
- [ ] API docs page (/api-docs)
- [ ] Share page (/share/[id])
- [ ] Auth pages (/signin, /signup, /verify-email, /reset-password)

## Marketing Pages
- [ ] Hero section with CTA
- [ ] Value propositions
- [ ] Features section
- [ ] Testimonials (optional)
- [ ] Trust badges
- [ ] Footer with legal links

## Analytics & Tracking
- [ ] PostHog initialization
- [ ] Event: upload_started
- [ ] Event: upload_failed
- [ ] Event: analysis_complete
- [ ] Event: export_pdf
- [ ] Event: checkout_started
- [ ] Event: subscription_active
- [ ] Privacy-safe tracking (no PII in events)

## SEO
- [ ] Metadata for all pages
- [ ] OG images (1200x630)
- [ ] Twitter card images
- [ ] sitemap.xml generation
- [ ] robots.txt
- [ ] Fast LCP optimization
- [ ] Image optimization (next/image)

## Security
- [ ] Server-side MIME validation
- [ ] File size limits enforced
- [ ] Input sanitization
- [ ] RBAC on document access (users can only see their docs)
- [ ] Signed download URLs for reports
- [ ] Rate limits per IP
- [ ] Rate limits per user tier
- [ ] CSRF protection
- [ ] XSS protection
- [ ] SQL injection prevention (Prisma)
- [ ] Audit trail for document analyses

## Legal Compliance
- [ ] "Informational only, not legal advice" disclaimer shown
- [ ] Terms of Service page
- [ ] Privacy Policy page
- [ ] DPA link in footer
- [ ] Cookie banner (if needed)

## Testing
- [ ] Unit tests for parsers
- [ ] Unit tests for risk detector
- [ ] Integration tests for auth flows
- [ ] Integration tests for billing webhook
- [ ] Integration tests for upload pipeline
- [ ] Playwright e2e: signup → verify → upload → analyze → checkout → portal
- [ ] Lighthouse CI (≥90 perf/accessibility)

## Performance
- [ ] Streaming analysis responses
- [ ] Background jobs for heavy OCR
- [ ] Image/PDF previews optimized
- [ ] Code splitting
- [ ] Lazy loading for heavy components

## CI/CD
- [ ] GitHub Actions workflow
- [ ] TypeScript type checking
- [ ] ESLint checks
- [ ] Prettier formatting
- [ ] Tests run on PR
- [ ] Build verification
- [ ] Vercel deployment on merge to main

## Documentation
- [ ] README.md with setup steps
- [ ] Environment variables documented
- [ ] Deployment instructions
- [ ] API documentation
- [ ] CHANGELOG.md

## Deployment
- [ ] Vercel project configured
- [ ] Environment variables set in Vercel
- [ ] Database provisioned (Vercel Postgres or external)
- [ ] Stripe webhook endpoint configured
- [ ] Domain configured
- [ ] SSL certificate active
- [ ] Analytics verified working

## Post-Launch
- [ ] Monitor error rates (Sentry)
- [ ] Monitor performance (Vercel Analytics)
- [ ] Monitor conversion funnel (PostHog)
- [ ] Set up alerts for critical errors
- [ ] Review user feedback
