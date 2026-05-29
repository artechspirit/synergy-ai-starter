⚠️ Extends root `AI_CONTEXT.md`. Seed data harus aman, idempotent, dan sesuai environment.

## 1. TYPES
- `dev seed`: membantu development lokal.
- `test seed`: deterministik untuk test otomatis.
- `demo/UAT seed`: realistis tapi bukan data pribadi asli.
- `production seed`: hanya reference data yang aman dan melalui deployment procedure.

## 2. RULES
- Seed harus idempotent: aman dijalankan lebih dari sekali.
- Jangan memakai data user/customer nyata tanpa anonymization.
- Jangan auto-run seed di production kecuali explicit release step.
- Password demo harus jelas non-production dan dapat dirotasi.
- File fixture besar harus punya alasan dan lokasi yang jelas.

## 3. RESET STRATEGY
- Test DB harus bisa dibersihkan antar run.
- Demo/UAT boleh punya reset script dengan approval.
- Jangan membuat reset script yang bisa diarahkan ke production tanpa guard.

## 4. CHECKLIST
- [ ] Environment guard ada.
- [ ] Data sensitif tidak dipakai.
- [ ] Idempotent.
- [ ] Cara menjalankan dan rollback/cleanup tertulis.
