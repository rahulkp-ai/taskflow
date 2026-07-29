# Contributing to TaskFlow

Thanks for considering a contribution. This is primarily a portfolio project, but it's built and tested like a production service, and contributions are welcome.

## Getting set up

1. Fork and clone the repo.
2. Follow the **Environment Setup** section of the [README](README.md) (Docker or local, your choice).
3. Copy `server/.env.example` → `server/.env` and `client/.env.example` → `client/.env`, and fill in real values.

## Development workflow

- Backend lives in `server/`, frontend in `client/` — each has its own `package.json`, dependencies, and test suite.
- Run the backend suite: `cd server && npm test` (Jest + Supertest + `mongodb-memory-server`, no real database needed).
- Run the frontend suite: `cd client && npm test` (Vitest + React Testing Library).
- Both suites run automatically in CI on every push/PR via `.github/workflows/ci.yml`.

## Before opening a PR

- [ ] Tests pass locally for whichever side you touched (both, if the change spans the stack).
- [ ] No secrets, credentials, or `.env` files included in the diff.
- [ ] New environment variables are added to the relevant `.env.example`, not just used in code.
- [ ] Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `test:`, `build:`, `ci:`, `chore:`, `refactor:`).

## Reporting bugs / proposing features

Open an issue with:
- What you expected vs. what happened (for bugs)
- Steps to reproduce, including whether you're on Docker or local dev
- For features: the problem it solves, not just the implementation

## Code of conduct

Be respectful, be constructive. No harassment, no gatekeeping.
