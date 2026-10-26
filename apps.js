// KATALOG ZTECH STORE
// Tambahkan aplikasi Android, website, atau tool baru sebagai objek di PRODUCTS.
// Jenis yang didukung: "app", "web", dan "tool".
const STORE = {
  name: "ZTech Store",
  developer: "ZTech",
  email: "nizar.adn1711@gmail.com",
  instagram: "https://www.instagram.com/iniii_nizar/",
  repo: "nizzarss/ztech-store"
};

const PRODUCTS = [
  {
    id: "yuknyatet",
    name: "YukNyatet",
    type: "app",
    category: "Keuangan",
    featured: false,
    tagline: "Kelola Uang, Raih Mimpi",
    packageName: "com.yuknyatet.app",
    version: "1.1.2",
    size: null,
    updated: "26 Oktober 2026",
    apkFile: "YukNyatet.apk",
    url: null,
    signingSha256: "95:89:93:9E:28:AC:4B:F0:A2:8C:B3:67:5F:67:2B:98:5B:1A:6A:50:6A:85:8F:2F:E2:58:73:7F:C5:D5:37:CF",
    apkSha256: null,
    icon: "assets/yuknyatet/icon.webp",
    feature: "assets/yuknyatet/feature.webp",
    short: "Pencatat keuangan pribadi untuk membantu mengatur uang dan target tabungan.",
    description: [
      "YukNyatet adalah aplikasi pencatat keuangan pribadi untuk Android. Catat pemasukan, pengeluaran, dan tabungan, lalu lihat ringkasan keuanganmu dengan lebih mudah.",
      "Atur batas harian, mingguan, dan bulanan. Simpan wishlist dan pantau progres tabungan. Mode Neta bersifat opsional."
    ],
    features: [
      ["Catat transaksi", "Simpan pemasukan dan pengeluaran sehari-hari."],
      ["Batas pengeluaran", "Atur limit harian, mingguan, dan bulanan."],
      ["Statistik", "Lihat ringkasan pengeluaran dan kategori."],
      ["Wishlist", "Pantau target dan progres menabung."],
      ["Mode Neta (opsional)", "Maskot, chat AI, game, dan streak."],
      ["Tema terang dan gelap", "Pilih tampilan sesuai kenyamananmu."]
    ],
    screenshots: [
      "assets/yuknyatet/ss-beranda.webp",
      "assets/yuknyatet/ss-statistik.webp",
      "assets/yuknyatet/ss-wishlist.webp",
      "assets/yuknyatet/ss-neta_chat.webp",
      "assets/yuknyatet/ss-streak.webp"
    ],
    whatsNew: [
      "Tutorial singkat saat pertama dibuka.",
      "Mode Neta dengan chat AI, notifikasi, game, dan streak.",
      "Penyempurnaan pengalaman penggunaan."
    ],
    guides: ["assets/yuknyatet/guide-1.webp", "assets/yuknyatet/guide-2.webp"],
    privacySections: [
      {
        heading: "Pengelola aplikasi",
        paragraphs: ["YukNyatet adalah aplikasi pencatat keuangan pribadi yang dikembangkan oleh Nizar Adnan. Informasi berikut menjelaskan data yang digunakan oleh aplikasi, bukan oleh situs ZTech Store."]
      },
      {
        heading: "Data yang digunakan",
        bullets: [
          "Akun: nama, alamat email, dan foto profil dari akun Google yang digunakan untuk masuk.",
          "Data keuangan yang dicatat pengguna: transaksi, kategori, batas harian/mingguan/bulanan, dan wishlist.",
          "Pengaturan aplikasi: tema, notifikasi, Mode Neta, streak, dan progres game.",
          "Langganan: status Pro dan tanggal berakhirnya, serta permintaan pembayaran yang diajukan."
        ]
      },
      {
        heading: "Cara data digunakan",
        paragraphs: ["Data digunakan untuk menjalankan fitur aplikasi seperti menghitung sisa uang dan limit, menampilkan statistik, mengirim pengingat, dan mengelola langganan Mode Neta. Data tidak dijual dan aplikasi tidak menampilkan iklan."]
      },
      {
        heading: "Penyimpanan data",
        paragraphs: ["Data disimpan di Google Firebase (Firestore) dan terhubung ke akun pengguna. Akses ke data keuangan diatur melalui aturan keamanan database."]
      },
      {
        heading: "Chat Neta dan layanan AI",
        paragraphs: ["Saat Neta Chat digunakan, pesan dikirim ke layanan Google Gemini melalui Firebase AI. Jika opsi penggunaan data keuangan dinyalakan, ringkasan keuangan juga dikirim agar jawaban lebih sesuai. Hindari menulis data sensitif seperti nomor kartu atau kata sandi di chat. Ketentuan penggunaan data pada layanan AI mengikuti kebijakan penyedia layanan terkait. Fitur ini opsional dan hanya aktif dalam Mode Neta."]
      },
      {
        heading: "Notifikasi",
        paragraphs: ["Notifikasi limit dan pengingat dibuat di perangkat dan bisa diatur melalui menu Profil → Notifikasi atau pengaturan sistem."]
      },
      {
        heading: "Pembayaran",
        paragraphs: ["Langganan Mode Neta dibayar melalui transfer/QRIS. Aplikasi tidak menyimpan nomor kartu atau akun bank pengguna. Permintaan pembayaran menampilkan informasi nominal dan status yang relevan."]
      },
      {
        heading: "Kontrol dan penghapusan data",
        paragraphs: ["Pengguna dapat mengubah atau menghapus transaksi serta data lain melalui fitur aplikasi. Untuk permintaan penghapusan akun beserta data terkait, hubungi developer melalui email yang tersedia pada situs."]
      },
      {
        heading: "Anak-anak dan perubahan kebijakan",
        paragraphs: ["Aplikasi tidak ditujukan bagi anak di bawah 13 tahun. Kebijakan aplikasi dapat diperbarui dan perubahan penting dapat diumumkan melalui pembaruan aplikasi."]
      },
      {
        heading: "Kontak terkait aplikasi",
        paragraphs: ["Email: nizar.adn1711@gmail.com · Instagram: @iniii_nizar"]
      }
    ]
  }
];