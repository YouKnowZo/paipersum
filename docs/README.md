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
