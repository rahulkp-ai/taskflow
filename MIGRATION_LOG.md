# Migration Log

This log documents the hardening pass applied to TaskFlow before it was made public. It's kept for transparency — the same pattern used on the NCF Recommender and PhishGuard repos — so anyone reviewing the history understands what changed and why, rather than treating the current state as if it had always looked this way.

## 2026-07 — Pre-release hardening pass

### Fixed

**1. Dead code removed from `server/index.js`**
The entire file had been duplicated as a commented-out block above the live code — an artifact of an earlier edit that was never cleaned up. Removed entirely; the live implementation is unchanged in behavior.

**2. CORS origin allow-list made environment-driven**
`server/index.js` previously hardcoded `https://mern-task-manager-app.netlify.app` into the allow-list — a leftover from an earlier deployment target that would not match wherever this instance is actually hosted. `CLIENT_ORIGIN` now accepts a single URL or a comma-separated list (e.g. `https://taskflow.vercel.app,http://localhost:3000`) and is the sole source of truth for allowed origins in non-local environments.

**3. Docker Compose local credentials annotated**
`docker-compose.yml`'s MongoDB service uses `admin` / `adminpassword123`. These are explicitly local-development-only — added an inline comment stating this and noting that production uses a MongoDB Atlas connection string via `MONGODB_URI`, which never reads this block.

**4. Security headers and rate limiting added**
Added `helmet` (secure HTTP response headers) and `express-rate-limit` (300 requests / 15 minutes per IP on `/api`) to `server/index.js`. Neither existed before this pass. Both are skipped when `NODE_ENV=test` so the existing test suite is unaffected.

**5. `.env.example` files added**
Added `server/.env.example` and `client/.env.example`. Previously the required variables were documented only in prose in the README; they're now committed as copyable templates, which is the more standard signal for a repo someone else might actually clone and run.

**6. CI pipeline added**
Added `.github/workflows/ci.yml` running the existing Jest (server) and Vitest (client) suites on every push and pull request to `main`. Both suites existed before this pass but were not wired into any pipeline — they ran locally only.

**7. LICENSE added**
`package.json` in both `server/` and `client/` already declared `"license": "ISC"`, but no `LICENSE` file existed at the repo root. Added one.

### Not changed

- No changes to any controller, model, or route logic — this pass is purely infrastructure/config/documentation.
- No changes to the seed data or database schema.
- Firebase file-upload integration is unchanged and remains optional.

### Known follow-ups (not yet done)

- Rotate the local Compose Mongo credentials to something Docker-secrets-managed if this is ever run somewhere less trusted than a personal machine.
- Consider adding `express-mongo-sanitize` if the API is ever exposed to less-trusted input than the current demo use case.
