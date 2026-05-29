# SajiAI - Production Project Blueprint

⚠️ **Instruksi untuk AI:** Gunakan dokumen ini sebelum membuat repo/project baru atau melakukan migrasi besar. Dokumen ini adalah level project, bukan level fitur. Setelah blueprint ini disetujui, baru pecah menjadi roadmap dan `AI_FEATURE_TEMPLATE.md` per fitur.

## 1. EXECUTIVE SUMMARY
- **Nama Project:** SajiAI
- **One-liner:** Smart F&B SaaS platform enabling seamless QR self-ordering, Point of Sale (POS), and Kitchen Display System (KDS) for modern cafes and restaurants.
- **Masalah yang Diselesaikan:** 
  - Antrean pemesanan panjang dan kesalahan input manual oleh pelayan.
  - Tingginya biaya operasional pelayan untuk restoran skala kecil hingga menengah (MSME).
  - Ketidaksesuaian pencatatan inventaris stok bahan dengan transaksi penjualan riil.
- **Solusi Utama:** 
  - Sistem pemesanan mandiri pelanggan lewat scan QR Table (Next.js Customer Web).
  - Dashboard POS & KDS terintegrasi untuk staf dapur dan pelayan (Expo Mobile App).
  - Portal analitik, manajemen menu, dan stok real-time untuk pemilik restoran (Next.js Owner Web).
- **Target Launch:** MVP (Beta)
- **Primary Platform:** [x] Web  [x] Mobile  [x] API  [ ] Semua
- **Repo Mode:** [x] New target monorepo  [ ] Existing repo migration  [ ] Prototype dulu

## 2. BUSINESS CONTEXT & GOALS
- **Business Goal:** Meningkatkan kecepatan perputaran meja (*table turnover*) sebesar 20%, mengurangi kesalahan pemesanan hingga 99%, dan memotong biaya overhead pelayan operasional restoran.
- **Primary Users:** Pelanggan Restoran (Guest/Customer), Staf Dapur (Kitchen Chef), Kasir/Pelayan (Wait Staff).
- **Secondary Users:** Pemilik Restoran (Merchant Owner), Super Admin SajiAI (SaaS platform manager).
- **Success Metrics:**
  - p95 API Latency < 200ms untuk endpoint pemesanan dan checkout.
  - LCP (Largest Contentful Paint) < 2.5s pada halaman web menu makanan pelanggan.
  - Skalabilitas penanganan order > 10.000 transaksi per menit selama jam sibuk.
- **Non-goals:** Pembukuan akuntansi pajak tingkat lanjut, sistem absensi karyawan berbasis pengenalan wajah.

## 3. USER PERSONA & CORE JOURNEYS
- **Persona 1:** Rian (Pelanggan Kafe) - Ingin memesan kopi dan makanan dengan cepat tanpa perlu menunggu pelayan datang membawa menu fisik.
- **Persona 2:** Chef Joko (Staf Dapur Restoran) - Membutuhkan informasi pesanan masuk yang rapi berdasarkan nomor meja dan waktu antre, tanpa slip kertas yang mudah hilang atau kotor.

### Core Journey 1: Scan-to-Order & Pay (Pelanggan)
1. Pelanggan men-scan QR code di meja restoran.
2. Web SajiAI menampilkan menu digital yang responsif (Next.js Customer App).
3. Pelanggan memilih menu, melakukan checkout, dan membayar lewat payment gateway terintegrasi (Midtrans/Xendit).
4. Setelah sukses, pesanan dikirim ke sistem antrean dapur.

### Core Journey 2: Kitchen Dispatching (Staf Dapur)
1. Dapur melihat pesanan baru masuk di tablet KDS (Expo Mobile KDS App) secara instan.
2. Dapur mengklik "Proses" untuk mulai memasak, status pesanan ter-update otomatis di sisi pelanggan.
3. Setelah selesai memasak, dapur mengklik "Selesai", mengirim notifikasi ke pelayan untuk menyajikan makanan.

## 4. PRODUCT SCOPE
### MVP Scope
- [ ] **Auth Module:** Multi-tenant login owner, registrasi tenant, dan token management (JWT RS256).
- [ ] **Menu Management:** Owner dapat mengatur kategori, item menu, foto, harga, dan ketersediaan stok.
- [ ] **QR Table Ordering:** Halaman menu digital responsif pelanggan (scan QR -> pilih -> pesan).
- [ ] **POS Billing & Payment Gateway:** Integrasi checkout dengan e-wallet (GoPay, OVO, ShopeePay) & Virtual Accounts.
- [ ] **Kitchen Display System (KDS):** Tampilan daftar pesanan real-time untuk dapur dengan websocket.

### Post-MVP Scope
- [ ] **AI Smart Upselling:** Rekomendasi otomatis menu pendamping berbasis preferensi pelanggan saat checkout.
- [ ] **Inventory Auto-Replenishment:** Integrasi peringatan stok bahan baku menipis langsung ke supplier terdaftar.
- [ ] **Multi-Outlet Support:** Konsolidasi laporan analitik untuk pemilik restoran dengan banyak cabang.

### Out of Scope
- [ ] Integrasi mesin cetak resi fisik Bluetooth bawaan (diserahkan ke POS pihak ketiga eksternal di MVP).
- [ ] Integrasi pemesanan ojek online (Grab/Gojek delivery).

## 5. HIGH-LEVEL FEATURE MAP
| Module | Description | Platform | Priority | Data Sensitivity |
|---|---|---|---|---|
| Auth | Registrasi tenant & login kasir/owner | Web/Mobile/API | P0 | User-specific (Credentials) |
| Menu | CRUD menu makanan, kategori, dan stok | Web/API | P0 | Public / Read-only |
| Ordering | Keranjang belanja, checkout, & pemesanan | Web (Customer)/API | P0 | User-specific (PII) |
| POS & Billing | Pembayaran digital (Midtrans/Xendit), invoice | Web/Mobile/API | P0 | Financial / Payment Sensitive |
| KDS | Monitor & status penyiapan makanan | Mobile (Tablet)/API | P0 | Operational / Private |
| Analytics | Laporan penjualan, item terlaris, jam sibuk | Web (Owner)/API | P1 | Financial / Merchant-only |

## 6. ARCHITECTURE DECISIONS
- **Architecture Target:** Monorepo dengan Turborepo v2+, dikelola via pnpm workspaces.
- **Backend Mode:** NestJS + Prisma + PostgreSQL (Mode A).
- **Web Stack:** Next.js 16.x (App Router), React 19.x, Tailwind CSS 4.x.
- **Mobile Stack (POS & KDS):** Expo SDK 55.x, React Native, NativeWind, Expo Router.
- **Shared Packages Needed:**
  - `packages/api-contracts`: OpenAPI schema generator + Orval TanStack Query hooks.
  - `packages/validation`: Zod schemas untuk DTO dan validasi form bersama.
  - `packages/env`: Zod runtime env validator terpusat.
  - `packages/ui`: Design tokens + Tailwind shared components (Button, Input, Card, Modal, Skeleton).
  - `packages/tsconfig` & `packages/eslint`: Standar konfigurasi TS & lint.
- **External Services:**
  - **Payment Gateway:** Midtrans / Xendit API.
  - **Caching & Queue:** Redis + BullMQ (asinkronisasi pengiriman email billing dan notifikasi).
  - **Observability:** OpenTelemetry (tracing), Sentry (crash reporting), Pino (JSON logs).
- **Decision Notes:** Next.js Serverless akan dideploy ke Vercel dengan pola Prisma global singleton. API NestJS dideploy ke Google Cloud Run dengan autoscale.

## 7. TARGET REPOSITORY STRUCTURE
```txt
apps/
  web/                     # Owner Dashboard & Customer QR Web
    app/
      (merchant)/          # Halaman admin owner resto
      (customer)/          # Halaman scan QR menu pelanggan
      api/                 # Next.js Route Handlers (jika butuh proxy)
    components/
    lib/
      prisma.ts            # Global Prisma Client Singleton
  
  mobile/                  # Staff POS & KDS Tablet App
    src/
      app/                 # Expo Router group (auth), (tabs), (modals)
      components/
      lib/
  
  api/                     # Central NestJS Backend API
    src/
      modules/
        auth/
        menu/
        order/
        payment/
      infra/
        database/          # PrismaService singleton
        logger/            # Pino Structured Logger
    prisma/
      schema.prisma        # Database Schema definition
      migrations/

packages/
  api-contracts/           # OpenAPI specs + generated TanStack Query client
  ui/                      # Shared design tokens & foundation components
  validation/              # Shared Zod schemas (API payload, forms)
  env/                     # centralized runtime environment validations
  tsconfig/
  eslint/
```

## 8. DOMAIN MODEL / DATA BLUEPRINT
| Entity | Purpose | Key Fields | Relations | Notes |
|---|---|---|---|---|
| Tenant | Restoran terdaftar | id, name, slug, address | has many menus, orders | PII |
| User | User tenant (owner/staff) | id, email, password_hash, role | belongs to tenant | PII / Secure |
| Table | Meja fisik restoran | id, number, qr_code_url | belongs to tenant, has many orders | Public |
| MenuItem | Menu makanan/minuman | id, name, price, stock, is_available | belongs to category | Public |
| Order | Transaksi pesanan | id, table_id, total_amount, status | belongs to table, has many items | Transactional |
| OrderItem | Item dalam pesanan | id, menu_item_id, quantity, notes | belongs to order | Transactional |
| Payment | Log transaksi pembayaran | id, order_id, status, gateway_ref | belongs to order | Financial |

### Data Rules
- **ID Strategy:** UUID v4 untuk seluruh primary key.
- **Soft Delete:** Wajib untuk `MenuItem` (field `deleted_at`) agar tidak merusak relasi histori `OrderItem` lama.
- **Audit Trail:** Log otomatis untuk perubahan status order (`PENDING -> PAID -> PROCESSING -> COMPLETED`) dan status transaksi pembayaran.
- **Indexes Required:** Indeks pada `tenant_id` di semua tabel relasional, `order_id` di tabel payment, dan composite index `(tenant_id, slug)`.

## 9. API & CONTRACT BLUEPRINT
- **API Style:** REST API + Standard JSON Envelope.
- **Base URL:** `/api/v1`
- **Response Envelope:**
  ```json
  {
    "success": true,
    "data": {},
    "meta": { "cursor": null, "hasMore": false },
    "error": null
  }
  ```

| Method | Endpoint | Purpose | Auth | Cache Policy |
|---|---|---|---|---|
| POST | `/api/v1/auth/login` | Login staff/owner | Public | no-store |
| GET | `/api/v1/menu` | List menu makanan pelanggan | Public | force-cache (revalidate: 60s) |
| POST | `/api/v1/orders` | Buat order baru via QR | Public | no-store |
| GET | `/api/v1/orders/:id` | Status pesanan riil | Public | no-store |
| POST | `/api/v1/payment/webhook` | Webhook status transaksi | Public | no-store |
| GET | `/api/v1/healthz` | Health check liveness | Public | no-store |
| GET | `/api/v1/readyz` | Health check readiness | Public | no-store |

### Validation Rules
- Validasi data input di boundary controller wajib menggunakan Zod DTO yang dibagikan dari `@repo/validation`.
- Error validasi wajib melontarkan kode `VALIDATION_FAILED` dengan rincian field yang flatten.

## 10. UI/UX BLUEPRINT
- **Design Direction:** Sleek, modern, and visually engaging. Dominasi warna bertema makanan segar (hijau zaitun lembut, oranye hangat, abu-abu gelap). Desain menggunakan Glassmorphism pada elemen kartu info.
- **Design System:** Dikelola penuh oleh `packages/ui` menggunakan Tailwind CSS 4.x.
- **Core Screens:**
  - Customer Menu & Cart - Web (Customer) - Responsif mobile-first.
  - POS Cashier & Billing - Mobile (Tablet) - Dense, touch-friendly target.
  - Kitchen Display Status - Mobile (Tablet) - High contrast, visual progress timer.
  - Owner Dashboard Analytics - Web (Merchant) - Data-dense charts & metrics.
- **Required States:** Semua screen wajib mengimplementasikan skeleton loading, dialog error yang ramah pengguna, empty state yang komunikatif (ilustrasi + CTA), dan status offline banner.

## 11. SECURITY, PRIVACY & PERMISSIONS
- **Roles:** Customer (Guest), Staff (Waitress/Chef), Tenant Owner (Merchant), Super Admin.
- **Permission Matrix:**
| Action | Customer | Staff | Owner | Super Admin |
|---|---:|---:|---:|---:|
| View Digital Menu | ✅ | ✅ | ✅ | ✅ |
| Create Order & Pay | ✅ | ✅ | ✅ | ✅ |
| Change Order Status | ❌ | ✅ | ✅ | ✅ |
| Edit Menu/Prices | ❌ | ❌ | ✅ | ✅ |
| Manage Staff Users | ❌ | ❌ | ✅ | ✅ |
| Delete Tenant Account| ❌ | ❌ | ❌ | ✅ |

- **Security Hardening:**
  - Enkripsi JWT payload menggunakan algoritma asimetris `RS256`.
  - Pasang strict CSP header (tanpa `'unsafe-inline'`) untuk web guna mencegah serangan XSS.
  - Validasi ketat tanda tangan webhook pembayaran Midtrans/Xendit sebelum memperbarui status order.

## 12. PERFORMANCE, RELIABILITY & OFFLINE
- **Next.js Caching:** Halaman menu digital statik pelanggan menggunakan caching CDN dengan header `stale-while-revalidate`.
- **Database Pooling:** Batasi koneksi pool database utama di Google Cloud Run. Gunakan PgBouncer pada database PostgreSQL di produksi.
- **Offline Resiliency (KDS App):**
  - Aplikasi KDS Mobile menyimpan pesanan lokal di AsyncStorage/SQLite lokal.
  - Jika internet terputus, KDS tetap dapat menampilkan pesanan yang sudah terunduh. Antrean status penyiapan makanan akan di-sinkronisasi ulang ke server begitu koneksi terdeteksi kembali melalui NetInfo.

## 13. OBSERVABILITY & OPERATIONS
- Structured JSON logging terintegrasi menggunakan Pino. Seluruh parameter PII (password, email pelanggan, nomor kartu) secara otomatis disaring (*redacted*).
- Penelusuran terdistribusi lintas servis menggunakan OpenTelemetry dengan korelasi `traceparent` HTTP header.
- Endpoint readiness `/readyz` melakukan pengecekan ping aktif ke DB PostgreSQL dan Redis secara berkala.

## 14. TESTING STRATEGY
- **Risk Level:** High Risk (menyangkut transaksi pembayaran dan sinkronisasi antrean dapur real-time).
- **Unit & Integration Tests:**
  - Logic kalkulasi harga belanjaan keranjang makanan dan diskon wajib diuji menggunakan Vitest.
  - Logic state machine transisi order status wajib dicover integration test dengan database mock.
- **Critical Paths (E2E Playwright):**
  - Alur lengkap: Pelanggan scan QR -> Buat Order -> Bayar (simulasi webhook sukses) -> KDS dapur menerima pesanan -> Kasir memverifikasi status pembayaran.

## 15. DEPLOYMENT & ENVIRONMENTS
- **Web App:** Next.js dideploy ke **Vercel** untuk latency CDN yang optimal bagi pelanggan.
- **Backend API:** NestJS dibungkus ke Docker image multi-stage (builder -> runner non-root) dan dideploy ke **Google Cloud Run** dengan kapasitas memori 1GB CPU 1.
- **Database:** Managed PostgreSQL (AWS RDS / Supabase Postgres) dengan enkripsi data-at-rest dan SSL mode wajib (`?sslmode=require`).
- **Rollback Procedure:** Feature flag aktif untuk gerbang rilis baru. Jika terjadi kegagalan fatal pada database migration, jalankan script contract rollback terdokumentasi.

## 16. PROJECT ROADMAP
Detail peta jalan terperinci untuk bootstrap fondasi hingga rilis MVP dapat dilihat di [ROADMAP.md](file:///home/beta/workspace/apps/synergy-ai-starter/prod-guide-versiku/generated/sajiai/ROADMAP.md).

## 17. PRODUCTION READINESS CHECKLIST
Evaluasi kepatuhan arsitektur produksi wajib merujuk secara ketat pada pedoman di file [AI_RULES_PRODUCTION_READY.md](file:///home/beta/workspace/apps/synergy-ai-starter/prod-guide-versiku/AI_RULES_PRODUCTION_READY.md) sebelum memicu proses deployment di CI/CD.

## 18. RESOLVED QUESTIONS
- **Payment Gateway Choice:** **Midtrans** (dipilih karena kemudahan integrasi QRIS/GoPay serta sandbox simulator yang handal untuk pasar lokal).
- **KDS Printer Support:** **Tampilan layar tablet saja untuk MVP** (dukungan cetak printer thermal fisik ditiadakan di MVP untuk mengurangi ketergantungan perangkat keras, dipindahkan ke Post-MVP).


## 19. AI EXECUTION INSTRUCTION
Setelah blueprint ini disetujui:
1. Buat roadmap detail mengikuti `AI_RULES_ROADMAP.md` dan `AI_RULES_PRODUCTION_READY.md`.
2. Pecah setiap P0/P1 feature menjadi dokumen `AI_FEATURE_TEMPLATE.md`.
3. Jangan menulis kode sebelum roadmap fase pertama disetujui user.
4. Jika ada gap antara repo existing dan target architecture, buat migration plan dulu.
