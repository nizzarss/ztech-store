# ZTech Store

ZTech Store adalah etalase umum untuk aplikasi Android, website, web tools, dan proyek digital buatan ZTech. Website ini menggunakan HTML, CSS, dan JavaScript statis serta dipublikasikan melalui GitHub Pages.

## Menambahkan karya baru

1. Buka file apps.js dan tambahkan objek baru ke array PRODUCTS.
2. Gunakan type: "app" untuk aplikasi Android, type: "web" untuk website, atau type: "tool" untuk web tools.
3. Untuk produk yang memakai gambar, simpan aset di folder khusus seperti assets/nama-proyek/, lalu gunakan path relatif pada properti icon, screenshots, atau guides.
4. Untuk aplikasi Android, isi apkFile dengan nama aset APK yang diunggah ke GitHub Releases pada repositori ini. Pastikan file tersebut benar-benar tersedia di Release terbaru.
5. Untuk website atau tool, isi properti url dengan alamat situs yang akan dibuka.
6. Isi description, features, dan whatsNew sesuai kebutuhan. Gunakan privacySections hanya untuk informasi privasi produk itu sendiri.

Contoh bentuk data:

~~~js
{
  id: "proyek-baru",
  name: "Proyek Baru",
  type: "web",
  category: "Produktivitas",
  short: "Ringkasan singkat karya.",
  url: "https://contoh.example",
  icon: "assets/proyek-baru/icon.webp",
  description: ["Deskripsi karya."]
}
~~~

## Unduhan APK

Tautan unduhan dibuat dari:

https://github.com/nizzarss/ztech-store/releases/latest/download/<nama-apk>

Menambahkan entri produk saja tidak mengunggah APK. Unggah berkas APK ke GitHub Release dengan nama yang sesuai sebelum mempromosikan tombol unduhan.

## Privasi

privacy.html menjelaskan praktik privasi situs etalase secara umum. Kebijakan dan ringkasan data suatu aplikasi harus diletakkan di halaman detail produk terkait, tidak dijadikan kebijakan seluruh ZTech Store.

## Deploy

Workflow .github/workflows/deploy.yml membangun folder situs dan menerbitkannya ke GitHub Pages ketika ada push ke main. Sebelum menggabungkan perubahan, periksa Settings → Pages dan pastikan sumber deploy diatur ke GitHub Actions.