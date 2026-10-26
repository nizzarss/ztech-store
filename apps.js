// ============================================================
//  DATA TOKO. Edit file ini untuk menambah atau mengubah aplikasi.
//  Ganti REPO jika nama repo GitHub-mu berbeda.
// ============================================================
const STORE = {
  name: "ZTech Store",
  developer: "ZTech.dev",
  email: "nizar.adn1711@gmail.com",
  instagram: "https://www.instagram.com/YukNyatet.dev/",
  repo: "nizzarss/ztech-store"   // pemilik/nama-repo
};

const APPS = [
  {
    id: "yuknyatet",
    name: "YukNyatet",
    tagline: "Kelola Uang, Raih Mimpi",
    category: "Keuangan",
    packageName: "com.yuknyatet.app",
    version: "1.1.2",
    size: null,                 // contoh: "42 MB" (isi setelah APK final)
    updated: "26 Oktober 2026",
    // Nama file APK di GitHub Releases (Releases → Assets)
    apkFile: "YukNyatet.apk",
    apkSha256: null,            // opsional: SHA-256 file APK
    signingSha256: "95:89:93:9E:28:AC:4B:F0:A2:8C:B3:67:5F:67:2B:98:5B:1A:6A:50:6A:85:8F:2F:E2:58:73:7F:C5:D5:37:CF",
    icon: "assets/yuknyatet/icon.webp",
    feature: "assets/yuknyatet/feature.webp",
    short: "Catat uang, jaga limit, tetap tenang. Ditemani Neta si berang-berang.",
    description: [
      "YukNyatet adalah aplikasi pencatat keuangan pribadi yang simpel untuk Android. Catat pengeluaran, pemasukan, dan tabungan dalam hitungan detik, lalu lihat ke mana uangmu pergi.",
      "Atur batas harian, mingguan, dan bulanan, dan kamu diingatkan sebelum kebablasan. Simpan wishlist impianmu dan pantau progres tabungannya."
    ],
    features: [
      ["Catat cepat", "Ketuk tombol +, isi nominal, simpan."],
      ["Limit harian, mingguan, bulanan", "Pengingat sebelum limit habis."],
      ["Statistik jelas", "Grafik pengeluaran dan kategori teratas."],
      ["Wishlist", "Target barang impian dan progres menabung."],
      ["Mode Neta (opsional)", "Maskot berang-berang, chat AI, game, dan streak harian."],
      ["Mode terang dan gelap", "Nyaman dipakai siang atau malam."]
    ],
    screenshots: ["assets/yuknyatet/ss-beranda.webp","assets/yuknyatet/ss-statistik.webp","assets/yuknyatet/ss-wishlist.webp","assets/yuknyatet/ss-neta_chat.webp","assets/yuknyatet/ss-streak.webp"],
    whatsNew: ["Tutorial singkat saat pertama dibuka.","Mode Neta: chat AI, notifikasi Neta, game, dan streak.","Halaman Kebijakan Privasi dan tautan Instagram."],
    data: ["Akun Google (nama, email) untuk masuk.","Data keuangan yang kamu catat sendiri, disimpan di akunmu.","Pesan Neta Chat dikirim ke layanan AI Google Gemini hanya saat kamu memakainya."],
    guides: ["assets/yuknyatet/guide-1.webp","assets/yuknyatet/guide-2.webp"]
  }
];