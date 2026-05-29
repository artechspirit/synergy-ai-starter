# SajiAI - Project Roadmap

Generated from `PROJECT_BLUEPRINT.md`.

## Roadmap Type
- **Type:** Project Bootstrap Roadmap (Fullstack + Mobile)
- **Repo Mode:** New target monorepo
- **Backend Mode:** NestJS + Prisma + PostgreSQL
- **Primary Platform:** Web (Customer + Merchant) & Mobile (POS + KDS)
- **Testing Risk:** High Risk (Financial Transactions & Real-time KDS Queue)

---

## Phase 0: Discovery & Blueprint Lock
- [x] Review and approve project scope, non-goals, and success metrics in `PROJECT_BLUEPRINT.md`.
- [x] Confirm choices for open questions (Midtrans vs Xendit for Payment, KDS printing support).
- [x] Verify repo mode is set to "New target monorepo".
- [x] Checkpoint: Blueprint approved by product/engineering owner.

---

## Phase 1: Foundation / Repository Bootstrap
- [x] Initialize monorepo workspace using pnpm: `npx create-turbo@latest -p pnpm`.
- [x] Set up global workspace configurations (`package.json`, `turbo.json`, `pnpm-workspace.yaml`).
- [x] Create shared configuration packages:
  - `packages/tsconfig` (strict type checking enabled).
  - `packages/eslint` (strict formatting rules).
- [x] Create placeholder directories for apps: `apps/web` (Next.js), `apps/mobile` (Expo), `apps/api` (NestJS).
- [x] Set up centralized environment variable validator in `packages/env` using Zod.
- [x] **Checkpoint (Gembok):** Run `pnpm install && turbo run lint typecheck build` to ensure the clean monorepo builds successfully.

---

## Phase 2: Data & API Foundation
- [ ] Bootstrap NestJS backend API: `npx @nestjs/cli@latest new apps/api --package-manager pnpm --strict`.
- [ ] Initialize Prisma in `apps/api` with PostgreSQL connector.
- [ ] Define database models (Tenant, User, Table, MenuItem, Order, OrderItem, Payment) in `schema.prisma`.
- [ ] Set up migrations and run initial schema creation in PostgreSQL database.
- [ ] Implement global error exception filter and standard API response envelope wrapping.
- [ ] Set up `/healthz` (liveness) and `/readyz` (readiness with DB & Redis ping checks) endpoints.
- [ ] Generate OpenAPI documentation in NestJS using `@nestjs/swagger` decorators.
- [ ] **Checkpoint (Gembok):** Run `cd apps/api && pnpm prisma validate && pnpm test` to verify database schema validation and backend test suites pass.

---

## Phase 3: Design System & Client Foundation
- [ ] Set up shared design tokens JSON (`packages/ui/tokens/design-tokens.json`) based on SajiAI color themes.
- [ ] Synchronize tokens to Tailwind CSS config for Web and NativeWind config for Mobile: `pnpm run sync:ui-tokens`.
- [ ] Create foundational UI components (Button, Input, Card, Modal, Badge, Skeleton) in `packages/ui` package.
- [ ] Set up client query generation in `packages/api-contracts` using **Orval** to auto-generate type-safe TanStack Query hooks from NestJS Swagger JSON.
- [ ] Bootstrap Next.js App Router in `apps/web` with client-side layout for Customer Ordering and Merchant Owner Portal.
- [ ] Bootstrap Expo App Router shell in `apps/mobile` with base navigation for Cashier POS and Kitchen Display System (KDS).
- [ ] Set up Prisma client global singleton in `apps/web/lib/prisma.ts` for safe serverless connections.
- [ ] Set up translations JSON structures (`packages/translations/locales/{en,id}.json`) and integrate `next-intl` (Web) / `i18n-js` (Mobile) translation hooks.
- [ ] **Checkpoint (Gembok):** Run `turbo run build --filter=apps/web --filter=apps/mobile` to ensure both Web and Mobile client shells build cleanly with shared UI and auto-generated API contracts.

---

## Phase 4: MVP Feature Implementation
For each P0/P1 feature listed below, a dedicated `AI_FEATURE_TEMPLATE.md` spec must be created and approved before writing code.

### Phase 4.1: Menu & Catalog (P0)
- [ ] Implement menu management dashboard (CRUD menu items, categories, stocks) for Merchant Owner on Web.
- [ ] Implement responsive digital menu catalog for Restaurant Customers on Web via QR Table route.
- [ ] **Checkpoint (Gembok):** Run `turbo run test --filter=apps/web` and manual catalog browsing verification.

### Phase 4.2: Ordering & Payment Gateway (P0)
- [ ] Implement shopping cart checkout and order placement on Customer Web.
- [ ] Integrate Midtrans/Xendit Payment Gateway SDK in NestJS API.
- [ ] Implement payment transaction callback webhooks to transition Order Status (`PENDING -> PAID`).
- [ ] **Checkpoint (Gembok):** Run integration tests for payment webhook endpoints and simulate order flows.

### Phase 4.3: POS Cashier & Kitchen Display System (P0)
- [ ] Implement real-time Order monitoring dashboard on KDS Mobile Tablet app via WebSockets.
- [ ] Implement status update controls for Chefs to transition orders (`PAID -> PROCESSING -> COMPLETED`).
- [ ] Implement POS Billing screen on Cashier Mobile app to review completed order invoices.
- [ ] Implement offline-syncing queue for KDS to persist local states when ISP internet fails.
- [ ] **Checkpoint (Gembok):** Run `turbo run test --filter=apps/mobile` and verify end-to-end WebSocket order dispatch state transitions.

---

## Phase 5: Production Hardening
- [ ] Implement structured JSON logging using Pino, redacting all PII parameters (passwords, emails, card numbers).
- [ ] Set up distributed tracing propagation with OpenTelemetry across API, Web, and database layers.
- [ ] Enable Helmet middleware and configure strict Content Security Policy (CSP) headers (no `'unsafe-inline'`).
- [ ] Configure rate limiters on sensitive endpoints (Auth, Orders, Webhooks).
- [ ] Set up Sentry reporting on client and API layers.
- [ ] Verify production readiness checklist compliance in `AI_RULES_PRODUCTION_READY.md`.
- [ ] **Checkpoint (Gembok):** Run `pnpm run audit` and verify production Docker build pipelines pass with zero High/Critical security vulnerabilities.

---

## Execution Rule
Do not write application code until Phase 0 is approved and Phase 1 repository bootstrap execution is explicitly requested by the user.
