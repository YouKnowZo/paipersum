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