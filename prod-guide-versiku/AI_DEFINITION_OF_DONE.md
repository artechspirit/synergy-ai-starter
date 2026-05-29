⚠️ Extends root `AI_CONTEXT.md`. Gunakan sebagai checklist selesai per tipe pekerjaan.

## 1. BUGFIX
- [ ] Root cause dijelaskan.
- [ ] Regression test ditambahkan jika harness tersedia.
- [ ] Patch minimal sesuai area bug.
- [ ] Test/lint/build relevan dijalankan atau gap dijelaskan.
- [ ] Risk note untuk area yang belum ter-cover.

## 2. FRONTEND-ONLY
- [ ] Tidak ada perubahan API/DB tersembunyi.
- [ ] Initial/loading/empty/error/success state sesuai kebutuhan.
- [ ] Responsive mobile/desktop.
- [ ] A11y dasar: semantic element, keyboard/focus, alert untuk error.
- [ ] Styling mengikuti pattern existing atau token yang disetujui.
- [ ] Verifikasi visual/manual atau test component sesuai risk.

## 3. MOBILE-ONLY
- [ ] Route/navigation sesuai Expo Router atau pattern existing.
- [ ] SafeArea/status bar handled.
- [ ] Permission states handled jika memakai capability native.
- [ ] Offline/rollback behavior jelas jika ada mutation.
- [ ] Manual simulator/device note atau test relevan.

## 4. API/BACKEND
- [ ] Backend mode teridentifikasi.
- [ ] Request validation aktif di boundary.
- [ ] Response envelope/error format konsisten.
- [ ] Auth/permission check sesuai data sensitivity.
- [ ] Service/repository boundary mengikuti pattern existing.
- [ ] Test service/endpoint sesuai risk.
- [ ] OpenAPI/contract updated jika project memakainya.

## 5. DATABASE/MIGRATION
- [ ] Migration non-destructive atau expand/contract.
- [ ] Index untuk where/order/join penting.
- [ ] Backfill/rollback note tersedia jika data existing terdampak.
- [ ] Seed/test data idempotent jika ditambahkan.
- [ ] Migration verification command dicatat.

## 6. INFRA/DEPLOY
- [ ] Env/secrets tidak hardcoded.
- [ ] CI/deploy command diverifikasi atau dijelaskan.
- [ ] Rollback procedure tertulis.
- [ ] Monitoring/logging impact dicatat.
- [ ] Perubahan provider/secret/database mendapat approval.

## 7. DOCS/SPEC
- [ ] Scope, non-goals, assumptions, dan open questions jelas.
- [ ] Acceptance criteria testable.
- [ ] Maturity level dan risk level disebutkan.
- [ ] Jika coding belum boleh, instruksi eksekusi ditulis jelas.
