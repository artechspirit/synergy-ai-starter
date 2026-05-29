# ⚡ Synergy AI Starter

> **Production-ready fullstack monorepo starter** — Next.js + NestJS + Expo + Prisma.
> Mengikuti semua standar di [`prod-guide-versiku`](./prod-guide-versiku/AI_CONTEXT.md).

[![CI](https://github.com/artechspirit/synergy-ai-starter/actions/workflows/ci.yml/badge.svg)](https://github.com/artechspirit/synergy-ai-starter/actions/workflows/ci.yml)

---

## Stack

| Layer    | Tech |
|----------|------|
| Monorepo | Turborepo v2 + pnpm workspaces |
| Web      | Next.js 15 (App Router) · React 19 · Tailwind 4 |
| API      | NestJS 10 · Prisma 5 · PostgreSQL 15 |
| Mobile   | Expo SDK 55 · expo-router · React Native |
| Shared   | Zod · TanStack Query v5 · Zustand v5 |
| Auth     | JWT RS256 (15m access + 7d refresh httpOnly cookie) |
| i18n     | next-intl (Web) · i18n-js (Mobile) · `en` + `id` |
| CI/CD    | GitHub Actions · Vercel · Cloud Run · EAS |

---

## What's included

- ✅ **Auth flow end-to-end**: Register, Login, Refresh Token, Logout
- ✅ **JWT RS256** dengan httpOnly cookie (Web) dan SecureStore (Mobile)
- ✅ **Design System**: Design tokens + Button, Input, Card, Modal, Badge, Skeleton
- ✅ **i18n**: `en` dan `id` translations di `packages/translations`
- ✅ **Zod everywhere**: env validation (crash-fast), request validation, shared schemas
- ✅ **Standard API envelope**: `{ success, data, meta, error: { code, message, traceId } }`
- ✅ **Security**: Helmet, CORS, Rate limiting, HSTS headers
- ✅ **Health checks**: `/healthz` (liveness) + `/readyz` (readiness with DB check)
- ✅ **Docker**: Multi-stage Dockerfile (non-root) + docker-compose local dev
- ✅ **CI/CD**: Affected-only builds, Turborepo Remote Cache, Cloud Run + EAS deploy
- ✅ **Orval**: Auto-generate TanStack Query hooks dari OpenAPI schema
- ✅ **Rename script**: `node scripts/rename.mjs <new-name>` untuk project baru

---

## Quick Start

```bash
# 1. Clone / Use this template
git clone git@github.com:artechspirit/synergy-ai-starter.git my-project

# 2. Rename (opsional)
node scripts/rename.mjs my-project @myproject

# 3. Generate RSA keys
node scripts/generate-keys.mjs

# 4. Setup env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
# Edit apps/api/.env dengan JWT keys dari step 3

# 5. Start DB
docker compose up -d

# 6. Install + migrate
pnpm install
cd apps/api && pnpm dlx prisma migrate dev --name init && cd ../..

# 7. Run!
pnpm dev
```

Buka: **http://localhost:3000** (Web) · **http://localhost:3001/api/docs** (Swagger)

Lihat [SETUP.md](./SETUP.md) untuk panduan lengkap.

---

## AI Rules

Folder [`prod-guide-versiku/`](./prod-guide-versiku/) berisi rules untuk AI coding assistant:

| File | Isi |
|------|-----|
| `AI_CONTEXT.md` | Root rules — stack, monorepo, security, API contract |
| `AI_RULES_API.md` | NestJS backend patterns & anti-patterns |
| `AI_RULES_WEB.md` | Next.js App Router patterns |
| `AI_RULES_MOBILE.md` | Expo / React Native patterns |
| `AI_RULES_UI.md` | Design system & i18n rules |
| `AI_RULES_TESTING.md` | Testing strategy by risk level |
| `AI_RULES_DEPLOY.md` | CI/CD & containerization rules |
| `AI_RULES_PRODUCTION_READY.md` | Production hardening checklist |
| `AI_RULES_ROADMAP.md` | Feature roadmap & execution strategy |
| `CARA_PROMPT.md` | Panduan cara prompt AI yang efektif |
