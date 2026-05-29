# 🚀 SETUP.md — Getting Started with Synergy AI Starter

> Waktu setup: ~10 menit dari clone ke `pnpm dev` yang berjalan.

---

## Prerequisites

Pastikan sudah terinstall:
- **Node.js** v20 LTS → [nodejs.org](https://nodejs.org)
- **pnpm** v9+ → `npm install -g pnpm`
- **Docker** (untuk local database) → [docker.com](https://docker.com)

---

## Step 1 — Clone / Use Template

**Opsi A: GitHub Template** (rekomendasi)
1. Buka `github.com/artechspirit/synergy-ai-starter`
2. Klik **"Use this template"** → **"Create a new repository"**
3. Clone repo barumu:
```bash
git clone git@github.com:your-username/your-new-project.git
cd your-new-project
```

**Opsi B: Clone langsung**
```bash
git clone git@github.com:artechspirit/synergy-ai-starter.git my-new-project
cd my-new-project
```

---

## Step 2 — Rename Project (Opsional tapi Recommended)

Ganti semua referensi `synergy-ai-starter` dan `@repo` dengan nama project barumu:

```bash
node scripts/rename.mjs my-new-project @myproject
```

Script ini akan mengupdate:
- Semua `package.json` (`name`, `@repo/*` imports)
- Semua `turbo.json`, `pnpm-workspace.yaml`
- Semua source file yang menyebut nama lama

Setelah rename:
```bash
git add -A && git commit -m "chore: rename to my-new-project"
```

---

## Step 3 — Generate RSA Keys untuk JWT

```bash
node scripts/generate-keys.mjs
```

Script ini akan:
1. Generate RSA key pair (2048-bit)
2. Simpan ke `apps/api/private.key` dan `apps/api/public.key`
3. Print nilai yang perlu ditambahkan ke `.env`

> ⚠️ `private.key` sudah ada di `.gitignore`. Jangan pernah commit ke Git.

---

## Step 4 — Setup Environment Variables

### apps/api
```bash
cp apps/api/.env.example apps/api/.env
```
Edit `apps/api/.env` dan isi:
- `JWT_PRIVATE_KEY` — dari output `generate-keys.mjs`
- `JWT_PUBLIC_KEY` — dari output `generate-keys.mjs`
- `DATABASE_URL` sudah diset ke PostgreSQL Docker (langsung bisa pakai)

### apps/web
```bash
cp apps/web/.env.example apps/web/.env.local
```
Nilai default sudah benar untuk local dev.

---

## Step 5 — Start Local Database

```bash
docker compose up -d
```

Ini akan menjalankan:
- **PostgreSQL 15** di `localhost:5432`
- **Redis 7** di `localhost:6379` (standby untuk BullMQ)

Tunggu hingga healthy:
```bash
docker compose ps
```

---

## Step 6 — Install Dependencies

```bash
pnpm install
```

---

## Step 7 — Run Database Migrations

```bash
cd apps/api && pnpm dlx prisma migrate dev --name init
cd ../..
```

Untuk seed data awal (opsional):
```bash
cd apps/api && pnpm run db:seed
cd ../..
```

Default seed membuat:
- Admin: `admin@example.com` / `Admin@12345`
- 5 test users: `User@12345`

---

## Step 8 — Run All Apps

```bash
pnpm dev
```

Ini menjalankan semua workspace sekaligus:

| App     | URL                          |
|---------|------------------------------|
| Web     | http://localhost:3000        |
| API     | http://localhost:3001        |
| API Docs| http://localhost:3001/api/docs |
| Mobile  | Expo Go / Simulator          |

---

## Step 9 — Verify Everything Works

```bash
# Health check
curl http://localhost:3001/healthz
# → { "status": "ok", "uptime": ... }

curl http://localhost:3001/readyz  
# → { "status": "ok", "db": "connected" }

# Try login
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin@12345"}'
# → { "success": true, "data": { "accessToken": "..." } }
```

---

## Project Structure

```
├── apps/
│   ├── web/        → Next.js 15 (App Router) — http://localhost:3000
│   ├── api/        → NestJS 10 + Prisma      — http://localhost:3001
│   └── mobile/     → Expo SDK 55              — Expo Go
├── packages/
│   ├── tsconfig/   → Shared TypeScript config
│   ├── eslint/     → Shared ESLint config
│   ├── env/        → Zod env validation (crash-fast)
│   ├── validation/ → Shared Zod schemas (Web + API + Mobile)
│   ├── ui/         → Design tokens + Foundation components
│   ├── translations/ → i18n JSON (en + id)
│   └── api-contracts/ → OpenAPI + Orval codegen
├── scripts/
│   ├── rename.mjs       → Rename project
│   └── generate-keys.mjs → Generate RSA keys
├── docker-compose.yml   → PostgreSQL + Redis
└── prod-guide-versiku/  → AI rules & guardrails
```

---

## Useful Commands

```bash
# Run full build (verify everything compiles)
pnpm build

# Run lint + typecheck
pnpm lint && pnpm typecheck

# Run tests
pnpm test

# Open Prisma Studio (DB GUI)
cd apps/api && pnpm run db:studio

# Generate API client dari OpenAPI (setelah API berjalan)
pnpm generate:types

# Sync design tokens ke Tailwind + NativeWind
pnpm sync:ui-tokens
```

---

## CI/CD Secrets yang Dibutuhkan

Tambahkan secrets ini di GitHub repo settings:

| Secret | Keterangan |
|--------|-----------|
| `TURBO_TOKEN` | Vercel Remote Cache token |
| `TURBO_TEAM` | Vercel team slug |
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | GCP OIDC provider |
| `GCP_SERVICE_ACCOUNT` | GCP service account email |
| `GCP_PROJECT_ID` | GCP project ID |
| `GCP_REGION` | Cloud Run region (e.g., `asia-southeast1`) |
| `GCP_ARTIFACT_REGISTRY` | Container registry URL |
| `EXPO_TOKEN` | EAS personal access token |
| `TEST_DATABASE_URL` | PostgreSQL URL for CI tests |

---

## Production Checklist

Sebelum deploy production, pastikan:
- [ ] RSA keys sudah di-inject via Secret Manager (GCP/AWS/Vercel)
- [ ] `DATABASE_URL` production menggunakan `?sslmode=require`
- [ ] Rate limiting sudah aktif (sudah: `@nestjs/throttler`)
- [ ] Helmet headers aktif (sudah: `helmet`)
- [ ] CORS `ALLOWED_ORIGINS` sudah berisi domain production
- [ ] Turborepo Remote Cache sudah dikonfigurasi
- [ ] EAS project ID sudah diisi di `apps/mobile/app.json`
- [ ] Rollback plan tersedia sebelum setiap release

---

*Dibuat dengan ❤️ mengikuti standar [prod-guide-versiku](./prod-guide-versiku/AI_CONTEXT.md)*
