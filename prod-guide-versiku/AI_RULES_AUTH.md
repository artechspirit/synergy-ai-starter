⚠️ Extends root `AI_CONTEXT.md`. Auth adalah area high-risk.

## 1. MODE DECISION
- Identifikasi auth existing sebelum edit: custom JWT, NextAuth/Auth.js, Supabase Auth, OAuth provider, session DB, atau legacy.
- Jangan mengganti auth mode tanpa ADR dan approval.
- Web production default: session/refresh token di `httpOnly`, `secure`, `sameSite=strict/lax sesuai kebutuhan cross-site`, bukan localStorage.
- Mobile default: token/session secret di `expo-secure-store` atau secure storage setara.

## 2. CORE REQUIREMENTS
- Access token pendek umur; refresh token rotation untuk production.
- Password reset token single-use, pendek umur, hashed di DB.
- Email verification untuk akun email/password production.
- Account lockout/rate limit untuk login, reset password, OTP.
- Logout harus revoke refresh/session server-side jika mode mendukung.
- Semua event sensitif dicatat: login success/fail, reset requested, password changed, role changed, session revoked.

## 3. PERMISSIONS
- Gunakan permission matrix untuk fitur admin/ownership.
- Jangan hanya menyembunyikan UI; API/backend wajib enforce authorization.
- Query data user-specific wajib filter berdasarkan `userId`/tenant/ownership di service/repository.

## 4. ERROR & PRIVACY
- Error login tidak boleh membocorkan apakah email terdaftar.
- Jangan log password, token, OTP, magic link, atau cookie.
- Gunakan stable error code seperti `AUTH_INVALID_TOKEN`, `AUTH_FORBIDDEN`, `AUTH_RATE_LIMITED`.

## 5. TESTING
- High-risk auth flow butuh regression/integration test jika harness tersedia.
- Minimal test/manual script: login, refresh, logout, forbidden access, expired token, reset password jika ada.
