⚠️ Extends root AI_CONTEXT.md. Production hardening & operational excellence rules. Gunakan bersama `AI_RULES_MATURITY.md`; item yang belum wajib untuk Prototype/MVP harus ditandai `Deferred` dengan alasan dan trigger.

## 1. ZERO-DOWNTIME DATABASE OPERATIONS (EXPAND/CONTRACT)
- **Aturan Migrasi:** Semua perubahan skema database (terutama PostgreSQL) di lingkungan produksi wajib mengikuti pola **Expand/Contract** (Zero-Downtime).
- 🚫 **DILARANG KERAS:** Melakukan RENAME kolom, DROP kolom, atau mengubah tipe data secara destruktif dalam satu rilis yang sama.
- **Pola Expand/Contract:**
  1. **Phase 1 (Expand):** Tambahkan kolom baru (misal `new_field` nullable). Tulis kode aplikasi agar menulis data ke kedua kolom (`old_field` dan `new_field`) secara bersamaan (dual-write).
  2. **Phase 2 (Backfill):** Jalankan skrip migrasi asinkron/background job untuk menyalin data lama dari `old_field` ke `new_field`.
  3. **Phase 3 (Contract):** Ubah kode aplikasi agar hanya membaca dan menulis ke `new_field`. Hapus referensi `old_field` dari kode.
  4. **Phase 4 (Cleanup):** Pada rilis berikutnya, jalankan migrasi database untuk men-DROP kolom `old_field`.
- **Indexing & Performance:**
  - Setiap query yang melibatkan kolom pada klausul `where`, `join`, `group by`, dan `order by` wajib memiliki indeks.
  - Gunakan `CONCURRENTLY` saat membuat indeks baru pada tabel besar di produksi (`CREATE INDEX CONCURRENTLY`).
  - Verifikasi query lambat menggunakan `EXPLAIN ANALYZE`. Target query execution time < 100ms.
- **Connection Pooling:** Wajib gunakan connection pooler (seperti PgBouncer atau Prisma Accelerate) untuk menangani lonjakan koneksi. Atur batas pool secara terukur agar tidak melebihi kapasitas memori database.

## 2. RESILIENCY & FAULT TOLERANCE
- **Retry Policy:**
  - Maksimal retry adalah **2 kali** setelah request awal gagal (total 3 attempts).
  - Wajib menggunakan **Exponential Backoff** (misal: 1s, 2s, 4s) ditambah **Jitter** (random noise) untuk menghindari fenomena *Thundering Herd* (penumpukan request serentak ke server).
- **Circuit Breaker:**
  - Integrasi dengan layanan pihak ketiga (Stripe, Twilio, AWS S3, dll.) wajib dibungkus dengan *Circuit Breaker*.
  - Jika terjadi **5 kegagalan berturut-turut**, sirkuit wajib terbuka (*Open State*) selama minimal **30 detik** sebelum mencoba lagi (*Half-Open*). Selama sirkuit terbuka, berikan graceful fallback atau cached data ke user.
- **Background Jobs / Message Queue:**
  - Gunakan Redis-backed queue (misal BullMQ di NestJS).
  - **Idempotency:** Semua job handler wajib bersifat idempotent (aman dijalankan berkali-kali dengan payload yang sama tanpa menduplikasi efek samping).
  - **Dead Letter Queue (DLQ):** Jika sebuah job gagal setelah maksimal percobaan retry (default 3x), pindahkan job tersebut ke DLQ/failed queue untuk diinspeksi secara manual. Jangan biarkan job gagal menyumbat antrean utama.
- **Rate Limiting:**
  - Batasi traffic di tingkat Gateway atau Middleware: 100 request/menit per IP untuk rute umum.
  - Rute sensitif (Auth, Payment, Upload, Resource-heavy mutations) wajib dibatasi maksimal 10 request/menit per IP.

## 3. SECURITY & HARDENING
- **Security Headers:**
  - Wajib aktifkan header keamanan standar menggunakan Helmet.
  - Terapkan **Content Security Policy (CSP)** yang ketat. Hindari `'unsafe-inline'` di produksi. Gunakan *nonce-based* CSP untuk scripts dinamis.
- **Secrets Management:**
  - 🚫 **DILARANG:** Menyimpan credential, private key, atau API token dalam repositori kode (bahkan di `.env.example` sekalipun).
  - Inject secrets saat runtime melalui Container Orchestrator (AWS ECS, Google Cloud Run) atau Vercel Environment Variables.
  - Semua variabel environment wajib divalidasi saat aplikasi dinyalakan menggunakan skema Zod terpusat (crash fast jika ada env yang hilang/salah format).
  - Detail operasional mengikuti `AI_RULES_ENV_SECRETS.md`.
- **Dependency Auditing:**
  - CI/CD pipeline wajib menjalankan security audit dependensi secara otomatis (misal: `pnpm audit` atau Snyk).
  - Blokir deployment jika terdeteksi dependensi yang memiliki tingkat kerentanan *High* atau *Critical* tanpa mitigasi resmi.
- **Data Privacy & Encryption:**
  - Data pribadi sensitif (PII - Personally Identifiable Information) seperti nomor identitas, nomor telepon, dan detail alamat wajib dienkripsi sebelum disimpan ke database (Application-Level Encryption) jika diperlukan oleh kepatuhan regulasi.

## 4. OBSERVABILITY, METRICS & ALERTING
- **Structured JSON Logging:**
  - Semua log di produksi wajib berformat JSON terstruktur (misal menggunakan Pino atau Winston).
  - Log wajib mengandung meta-data penting: `traceId`, `correlationId`, `userId` (jika ada), nama modul, dan `duration_ms` untuk pelacakan performa.
- **PII Log Redaction:**
  - 🚫 **DILARANG:** Mencatat data sensitif seperti password plain text, token JWT, CVV kartu kredit, atau data pribadi langsung ke dalam log. Gunakan sanitizer/redactor pada pustaka logger untuk menyaring field sensitif ini secara otomatis.
- **Distributed Tracing:**
  - Implementasikan OpenTelemetry untuk melacak alur request lintas service (Web -> API -> Database -> Redis). Pastikan `traceparent` di-inject ke setiap outbound HTTP request.
- **Health & Readiness Endpoints:**
  - `/healthz` (Liveness): Mengembalikan status HTTP 200 jika container aplikasi hidup/berjalan.
  - `/readyz` (Readiness): Mengembalikan status HTTP 200 hanya jika aplikasi siap menerima traffic (koneksi database utama, Redis, dan service eksternal kritis terverifikasi aktif). Jika salah satu gagal, kembalikan HTTP 503.

## 5. CACHING & CDN OPTIMIZATION
- **Cache-Control Headers:**
  - Data statik (assets, images, fonts) wajib di-cache di tingkat browser & CDN selama minimal 1 tahun (`Cache-Control: public, max-age=31536000, immutable`).
  - Halaman web semi-dinamis wajib menggunakan directive `stale-while-revalidate` agar CDN dapat menyajikan konten lama dengan cepat sementara memperbarui cache di latar belakang (`Cache-Control: public, max-age=0, s-maxage=60, stale-while-revalidate=60`).
- **Cache Stampede Mitigation (Cache Penetration):**
  - Gunakan mekanisme locking atau background revalidation (misal: Redis lock) saat memproses query database yang berat setelah cache expire, sehingga hanya ada satu request yang memicu query ke DB sementara request lainnya menunggu atau menggunakan data stale.
- **Cache Invalidation:**
  - Lakukan pembatalan cache (cache invalidation) secara presisi pasca mutasi data (event-driven). Jangan mengandalkan TTL saja untuk data dinamis yang sering berubah.

## ✅ CHECKLIST PRODUCTION READY
- [ ] Maturity level chosen and deferred production items documented
- [ ] Definition of Done satisfied for the work type
- [ ] ADR exists for architecture/auth/payment/deploy/provider changes
- [ ] Threat model exists for high-risk auth/payment/PII/ownership/upload flows
- [ ] Database migrations follow Expand/Contract (no direct column drop/rename)
- [ ] All database queries indexed and verified via EXPLAIN ANALYZE
- [ ] Connection pool (PgBouncer) configured and limit set
- [ ] Retry policy configured with Exponential Backoff + Jitter
- [ ] Circuit Breaker active on all external third-party API calls
- [ ] Background jobs (BullMQ) are idempotent and Dead Letter Queue (DLQ) configured
- [ ] Middleware rate limiter active (general: 100 req/min, sensitive: 10 req/min)
- [ ] Helmet security headers active & strict CSP configured (no 'unsafe-inline')
- [ ] Environment variables validated at runtime using Zod
- [ ] Auto-dependency scan active in CI pipeline (pnpm audit/Snyk)
- [ ] JSON logging configured with traceId, and PII logs redacted
- [ ] /healthz and /readyz endpoints active and checking dependency health
- [ ] Cache-Control set with stale-while-revalidate for semi-dynamic data
- [ ] Cache Stampede mitigation active on heavy database query caching
- [ ] API Client/SDK generated automatically from OpenAPI schema (no manual fetch writing)
- [ ] Prisma Client global singleton pattern active on serverless Next.js deployment
- [ ] React Hook Form + Zod resolver active on both Web & Mobile client forms
- [ ] Image assets optimized for LCP (Next.js Image configured, Expo native image caching active)
- [ ] i18n integrated with zero hardcoded UI strings on Web & Mobile
