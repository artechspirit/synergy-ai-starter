⚠️ Extends root AI_CONTEXT.md. Next.js App Router execution rules.

## PATTERNS
- Default: Server Components. `'use client'` HANYA untuk state/event/browser API.
- Fetching: `fetch()` di server jika cocok. Public/static data → `force-cache`/`revalidate`. User-specific/auth/dashboard/payment/ownership data → `no-store` default.
- AI WAJIB menulis alasan caching per fetch yang menyentuh data penting.
- Routing: Group `(auth)`, `(dashboard)`. Wajib `loading.tsx`, `error.tsx`, `not-found.tsx`. Wajib pakai `<Suspense>` untuk streaming data agar FCP lebih cepat.
- Mutations: Server Actions (`"use server"`). Zod validasi di awal. Return standard envelope.
- Styling: Tailwind only. Conditional: `clsx` + `tailwind-merge`. 🚫 No CSS Modules / inline `style={}`.
- Auth: `httpOnly` cookies via `cookies()`/`next-auth`. 🚫 No localStorage.
- DB: Penggunaan Prisma Client di Server Components / Actions wajib menggunakan pola global singleton (`globalThis.prisma`) untuk mencegah kebocoran koneksi pool di serverless (Vercel).
- Forms: Pengelolaan form di client-side wajib menggunakan **React Hook Form** yang terintegrasi dengan **Zod resolver**.
- Media: Optimalisasi LCP wajib menggunakan Next.js `<Image>` dengan spesifikasi atribut `sizes`, format modern (WebP/AVIF), serta proper loading placeholder blur untuk mencegah layout shift.

## 🚫 ANTI-PATTERNS
- `useEffect` data fetch → GANTI Server Component / TanStack Query
- `force-cache` untuk dashboard/auth/payment/private data → GANTI `no-store` atau revalidation policy yang jelas
- `window`/`document` di server → PINDAH ke client + guard
- Global state untuk remote data → GANTI TanStack Query
- `any` di props/hooks → WAJIB interface/generics
- Direct import `apps/api` → GANTI `@repo/api-contracts` + fetch jika monorepo. Untuk repo non-monorepo, pakai API client/contract lokal yang disepakati.
- Inisiasi `new PrismaClient()` berulang di Server Actions/Components → GANTI Global Prisma Singleton
- Mengelola state form manual menggunakan rentetan `useState` → GANTI React Hook Form + Zod
- Tag `<img>` standar untuk gambar dinamis → GANTI `<Image>` Next.js untuk mencegah akumulasi Layout Shift (CLS)

## ✅ CHECKLIST
- [ ] Server/Client boundary jelas
- [ ] Fetch cache policy match data sensitivity
- [ ] Error/Loading boundaries present
- [ ] Tailwind + clsx only
- [ ] Types from `@repo/api-contracts` or approved local contract
- [ ] No console.log / any / direct API import
- [ ] Prisma global singleton used for Serverless database calls
- [ ] React Hook Form + Zod resolver active for client-side forms
- [ ] Next.js Image component utilized with sizes and placeholder blur
