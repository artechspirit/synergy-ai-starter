⚠️ Extends root `AI_CONTEXT.md`. Berlaku untuk semua workspace.

## 1. ENV STRATEGY
- `.env` hanya lokal dan tidak boleh di-commit.
- `.env.example` boleh berisi nama variabel dan placeholder non-rahasia, bukan token asli, private key, service account JSON, atau URL rahasia production.
- Production secrets di-inject lewat Vercel/GCP/AWS/Railway/Fly/Render secret manager atau mekanisme setara.
- Semua env wajib divalidasi saat startup untuk app production/Beta ke atas.

## 2. NAMING & SCOPE
- Prefix env sesuai app jika perlu: `WEB_`, `API_`, `MOBILE_`, atau public prefix framework (`NEXT_PUBLIC_`, `EXPO_PUBLIC_`) hanya untuk nilai yang aman dilihat client.
- Jangan letakkan secret di public prefix.
- Pisahkan env development, preview/staging, production.

## 3. ROTATION & INCIDENT
- Jika secret bocor, rotate secret dan revoke credential lama.
- Jangan menghapus history atau menyembunyikan insiden tanpa catatan; buat incident note.
- CI harus mencegah secret masuk repo jika tooling tersedia.

## 4. CHECKLIST
- [ ] Env schema/validation ada untuk Beta ke atas.
- [ ] Tidak ada secret di source, docs, test snapshot, atau log.
- [ ] `.gitignore` mencakup env lokal.
- [ ] Deployment docs menyebut tempat konfigurasi secret.
