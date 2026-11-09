# Label Team Photos

Website galeri foto untuk tim: login dengan satu password bersama, unggah banyak foto sekaligus, kelompokkan per album, lihat, unduh, dan hapus. Foto disimpan di **Vercel Blob**.

Stack: Next.js 14 (App Router) + `@vercel/blob`.

## Deploy ke Vercel

1. Ekstrak zip ini, lalu push folder ke repository GitHub (atau pakai `npx vercel` dari folder ini).
2. Di Vercel: **Add New → Project**, pilih repo tersebut, lalu **Deploy** (deploy pertama boleh gagal sampai langkah 3-4 selesai).
3. Buka tab **Storage → Create → Blob**, buat store, lalu hubungkan ke project. `BLOB_READ_WRITE_TOKEN` terisi otomatis.
4. Buka **Settings → Environment Variables**, tambahkan:
   - `TEAM_PASSWORD`: password yang dibagikan ke tim
   - `AUTH_SECRET`: string acak panjang (mis. hasil `openssl rand -hex 32`)
5. **Redeploy** project.

## Jalankan lokal

```bash
npm install
npx vercel link && npx vercel env pull .env.local   # ambil BLOB_READ_WRITE_TOKEN
# tambahkan TEAM_PASSWORD dan AUTH_SECRET ke .env.local (lihat .env.example)
npm run dev
```

Buka http://localhost:3000

## Catatan

- Unggahan langsung dari browser ke Blob, jadi tidak terkena batas 4,5 MB function Vercel. Batas per foto di kode: 30 MB (ubah di `app/api/upload/route.js`).
- Halaman galeri dan API dilindungi password. URL file foto di Blob bersifat publik tetapi acak dan sulit ditebak; jangan bagikan link fotonya jika isinya sensitif.
- Galeri menampilkan hingga 1000 foto terbaru (ubah `limit` di `app/api/photos/route.js`).
- Album dibuat otomatis dari nama yang diketik saat mengunggah.
