# ZTech Store

Etalase APK buatan ZTech.dev. Situs ini adalah web statis (HTML, CSS, JavaScript) dan dipublikasikan melalui GitHub Pages.

## Menambahkan aplikasi
1. Tambahkan satu objek aplikasi ke array `APPS` di `apps.js`.
2. Simpan ikon, gambar fitur, tangkapan layar, dan panduan ke `assets/<id-aplikasi>/`.
3. Buat GitHub Release dan unggah APK dengan nama yang cocok dengan properti `apkFile` pada objek aplikasi.

Tautan unduhan diarahkan ke `https://github.com/nizzarss/ztech-store/releases/latest/download/<nama-apk>`. ZIP sumber saat ini tidak menyertakan APK, sehingga aset APK perlu ditambahkan ke Release sebelum unduhan aktif.

## Deploy
Workflow `.github/workflows/deploy.yml` membangun direktori situs lalu menerbitkannya ke GitHub Pages setiap ada push ke `main`. Jika belum dikonfigurasi, buka **Settings → Pages → Build and deployment → Source: GitHub Actions** untuk mengaktifkan deploy.