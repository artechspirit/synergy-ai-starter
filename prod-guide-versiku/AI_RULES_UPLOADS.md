⚠️ Extends root `AI_CONTEXT.md`. Upload/media adalah area security dan cost risk.

## 1. STORAGE STRATEGY
- File besar jangan lewat backend server; gunakan presigned URL ke S3/GCS/Supabase Storage atau provider setara.
- Pisahkan bucket/container public dan private.
- Private file wajib diakses via signed URL pendek umur.
- Jangan menyimpan credential storage di client.

## 2. VALIDATION
- Validasi ukuran file, extension, MIME type, dan jika perlu magic bytes.
- Image upload wajib dibatasi dimensi/ukuran dan dioptimalkan.
- Production untuk upload publik/user-generated sebaiknya memakai malware scanning atau moderation sesuai risiko.

## 3. NAMING & ACCESS
- Object key tidak boleh memakai nama file user mentah sebagai path utama.
- Gunakan UUID/hash path dan simpan original filename sebagai metadata jika perlu.
- Enforce ownership saat membuat signed URL.

## 4. CLEANUP
- Upload multi-step wajib punya cleanup untuk orphan object.
- Deletion data sensitif harus menghapus atau menjadwalkan penghapusan object terkait.

## 5. TESTING
- Test/manual script: file terlalu besar, MIME salah, akses file milik user lain, expired signed URL, duplicate submit.
