# Prod Guide Versiku

Panduan ini adalah operating manual untuk AI saat merancang, memigrasi, atau mengerjakan aplikasi yang ditargetkan siap produksi.

## Urutan Baca Cepat
1. `AI_CONTEXT.md` - aturan utama, target arsitektur, dan protokol kerja AI.
2. `AI_RULES_MATURITY.md` - pilih level kesiapan: Prototype, MVP, Beta, Production v1, atau Regulated.
3. `AI_RULES_EXISTING_REPO.md` - wajib dibaca sebelum mengubah repo yang sudah ada.
4. `AI_RULES_ROADMAP.md` - cara memecah pekerjaan menjadi fase yang bisa diverifikasi.
5. Baca aturan domain sesuai scope:
   - `AI_RULES_WEB.md`
   - `AI_RULES_API.md`
   - `AI_RULES_MOBILE.md`
   - `AI_RULES_UI.md`
   - `AI_RULES_TESTING.md`
   - `AI_RULES_DEPLOY.md`

## Template Utama
- `AI_PROJECT_INTAKE_TEMPLATE.md` - form ringan untuk ide awal.
- `AI_PROJECT_BLUEPRINT_TEMPLATE.md` - blueprint project production-ready.
- `AI_FEATURE_TEMPLATE.md` - spesifikasi fitur sebelum coding.
- `AI_ADR_TEMPLATE.md` - keputusan arsitektur besar.
- `AI_THREAT_MODEL_TEMPLATE.md` - threat modeling untuk fitur/data berisiko.

## Workflow Rekomendasi
1. Ide baru: isi intake atau jalankan `./prod-guide-versiku/setup.sh --intake`.
2. Project baru/migrasi besar: buat `PROJECT_BLUEPRINT.md`, lalu `ROADMAP.md`.
3. Fitur baru: buat spec memakai `AI_FEATURE_TEMPLATE.md`.
4. Eksekusi kode: buat roadmap fase dulu, minta approval, lalu kerjakan satu fase per waktu.
5. Sebelum rilis: cek `AI_DEFINITION_OF_DONE.md` dan `AI_RULES_PRODUCTION_READY.md`.

## Prinsip Utama
- Existing repo menang atas target architecture sampai migration plan disetujui.
- Jangan mengubah auth, data model, deploy provider, atau struktur repo besar tanpa approval eksplisit.
- Validasi, observability, rollback, dan security disesuaikan dengan maturity level, bukan dipaksakan sama rata.
- Untuk risiko tinggi, buat ADR dan threat model sebelum implementasi.
