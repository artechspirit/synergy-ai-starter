⚠️ Extends root `AI_CONTEXT.md`. Wajib dibaca sebelum mengubah repo yang sudah ada.

## 1. EXISTING REPO FIRST
- AI WAJIB inspect struktur folder, package manager, scripts, env pattern, test harness, styling, API client, auth, deploy config, dan git status.
- Pattern repo saat ini menang atas target monorepo sampai user menyetujui migration plan.
- Jangan membuat `apps/*`, `packages/*`, `@repo/*`, atau design system package baru hanya karena target architecture menyebutnya.
- Minimal diff lebih penting daripada konsistensi ideal jika scope adalah maintenance/bugfix.

## 2. AUDIT MINIMAL SEBELUM EDIT
Jalankan/cek setara ini sesuai repo:
- `rg --files`
- package manifest dan lockfile
- scripts lint/test/build/typecheck
- env examples dan validation
- framework routing dan folder convention
- auth/session implementation
- database/schema/migration location
- test harness dan CI config

## 3. GAP REPORT FORMAT
Sebelum migrasi atau perubahan struktural, tulis:
```md
## Current Repo Mode
- Package manager:
- Apps/packages:
- Backend mode:
- Auth mode:
- Test harness:
- Deploy target:

## Gap vs Target Architecture
- Gap:
- Impact:
- Migration risk:

## Recommendation
- Keep existing:
- Migrate later:
- Needs approval now:
```

## 4. APPROVAL GATES
Minta approval eksplisit sebelum:
- memindahkan folder besar
- mengubah package manager/lockfile
- mengganti auth/session strategy
- mengganti backend mode
- mengganti deploy provider
- membuat shared package target monorepo
- menjalankan migration destructive
- mengubah public API contract

## 5. SAFE MAINTENANCE DEFAULT
- Tambahkan test jika harness tersedia dan risk membenarkan.
- Jika harness belum ada, jelaskan gap dan lakukan manual verification.
- Jangan memperbaiki unrelated lint/format churn.
- Jangan menghapus file legacy kecuali terbukti tidak dipakai dan scope menyetujui cleanup.
