⚠️ Extends root `AI_CONTEXT.md`. Gunakan dokumen ini untuk menyesuaikan ketatnya aturan dengan target launch.

## 1. MATURITY LEVEL
Pilih satu level untuk project/fitur sebelum membuat roadmap.

| Level | Tujuan | Standar Minimal |
|---|---|---|
| Prototype | Validasi ide cepat | Build jalan, alur utama bisa dicoba, risiko dicatat |
| MVP | Dipakai user awal terbatas | Auth dasar, validasi input, error state, logging dasar, rollback manual |
| Beta | UAT/staging serius | Test critical path, env validation, seed UAT, monitoring error, migration aman |
| Production v1 | Live untuk user nyata | Security hardening, observability, CI/CD, backup/rollback, performance pass |
| Regulated/High Risk | Data/payment/health/ownership kritis | Threat model, audit log, encryption, approval ADR, E2E critical path |

## 2. RULE INTERPRETATION
- `MUST/WAJIB` berlaku sesuai maturity level. Jika aturan tidak relevan untuk level saat ini, AI wajib menandai sebagai `Deferred` dengan alasan dan trigger kapan wajib dipenuhi.
- Existing repo tetap mengikuti pattern saat ini sampai migration plan disetujui.
- Jangan menurunkan standar untuk auth, payment, PII, ownership, upload publik, atau destructive migration. Area ini minimal Beta/Production discipline.

## 3. CHECKLIST PER LEVEL
### Prototype
- [ ] Scope dan non-goals tertulis.
- [ ] Alur utama bisa dijalankan lokal.
- [ ] Tidak ada secrets di source code.
- [ ] Risiko produksi ditandai sebagai Deferred.

### MVP
- [ ] Validasi request/form aktif.
- [ ] Loading, empty, error, success states ada untuk flow utama.
- [ ] Auth/session mengikuti stack existing.
- [ ] Minimal regression/unit test untuk logic berisiko.
- [ ] Manual rollback note tersedia.

### Beta
- [ ] Env validation aktif.
- [ ] Critical path test atau manual test script tersedia.
- [ ] Seed/demo data UAT tersedia.
- [ ] Error logging dan alert dasar aktif.
- [ ] Migration memakai expand/contract jika ada perubahan data production-like.

### Production v1
- [ ] CI memblokir lint/typecheck/test/build gagal.
- [ ] Observability, health/readiness, rate limit, security headers aktif.
- [ ] Backup dan rollback procedure tervalidasi.
- [ ] Dependency audit dijalankan.
- [ ] Performance bottleneck utama sudah diuji.

### Regulated/High Risk
- [ ] ADR disetujui untuk keputusan arsitektur/security.
- [ ] Threat model disetujui.
- [ ] Audit log untuk aksi sensitif.
- [ ] Data sensitif dienkripsi atau punya mitigasi formal.
- [ ] E2E/manual evidence untuk critical path tersimpan.

## 4. AI OUTPUT REQUIREMENT
Setiap blueprint/roadmap harus menyebut:
- `Maturity Level`
- aturan yang wajib sekarang
- aturan yang deferred
- risiko jika deferred melewati target launch
