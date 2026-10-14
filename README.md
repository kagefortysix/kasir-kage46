# ☕ KASIR POS KAGE46

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-v5-443E38?style=for-the-badge)](https://zustand-demo.pmnd.rs/)
[![Supabase Ready](https://img.shields.io/badge/Supabase-Ready-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)

**KASIR POS KAGE46** adalah aplikasi kasir pintar (*Point of Sale*) modern berbasis web yang dirancang khusus untuk bisnis *Food & Beverage* (F&B), kafe, kedai kopi (*Specialty Coffee*), artisan kitchen, dan restoran. 

Sistem ini mengusung pendekatan **Offline-First**, **Mobile-Friendly**, dan **Cloud-Ready** dengan antarmuka premium berstandar SaaS (Glassmorphism, Dark/Light Mode, dan responsif di smartphone, tablet, maupun desktop PC kasir).

---

## 📑 Daftar Isi

- [Sekilas Proyek](#-sekilas-proyek)
- [Teknologi yang Digunakan (Tech Stack)](#-teknologi-yang-digunakan-tech-stack)
- [Fitur Utama Sistem](#-fitur-utama-sistem)
  - [1. Sistem Kasir Pintar (Point of Sale)](#1-sistem-kasir-pintar-point-of-sale)
  - [2. Transaksi & Multi-Metode Pembayaran](#2-transaksi--multi-metode-pembayaran)
  - [3. Cetak Struk Thermal & Share WhatsApp](#3-cetak-struk-thermal--share-whatsapp)
  - [4. Manajemen Inventori & Stock Opname](#4-manajemen-inventori--stock-opname)
  - [5. Kalkulator HPP & Resep Otomatis](#5-kalkulator-hpp--resep-otomatis)
  - [6. Laporan Keuangan & Analisis Laba Bersih](#6-laporan-keuangan--analisis-laba-bersih)
  - [7. Manajemen Shift & Laci Kasir (Cash Management)](#7-manajemen-shift--laci-kasir-cash-management)
  - [8. Pengeluaran Operasional (OPEX Tracker)](#8-pengeluaran-operasional-opex-tracker)
  - [9. Database Pelanggan & CRM](#9-database-pelanggan--crm)
  - [10. Autentikasi & Multi-User RBAC](#10-autentikasi--multi-user-rbac)
  - [11. Ekspor Data ke Excel/CSV](#11-ekspor-data-ke-excelcsv)
  - [12. Pengaturan Outlet & Personalisasi](#12-pengaturan-outlet--personalisasi)
- [Kredensial Akun Bawaan (Demo)](#-kredensial-akun-bawaan-demo)
- [Instalasi & Menjalankan Proyek](#-instalasi--menjalankan-proyek)
- [Akses Jaringan Lokal (Multi-Device / Smartphone)](#-akses-jaringan-lokal-multi-device--smartphone)
- [Integrasi Database Cloud Supabase (Opsional)](#-integrasi-database-cloud-supabase-opsional)
- [Struktur Direktori Proyek](#-struktur-direktori-proyek)

---

## 💡 Sekilas Proyek

Operasional kedai kopi dan restoran membutuhkan sistem kasir yang tidak hanya cepat dalam mencatat pesanan, namun juga mampu mengontrol modal bahan baku secara akurat. **KASIR POS KAGE46** hadir menjawab tantangan tersebut dengan:
- **Kalkulasi HPP Presisi**: Menghubungkan setiap porsi menu dengan stok bahan baku gram/mililiter riil di gudang.
- **Transparansi Profit**: Menampilkan Laba Bersih riil (*Net Profit*) setelah dikurangi HPP bahan baku dan biaya operasional kas toko.
- **Portabilitas Tinggi**: Dapat dioperasikan langsung dari smartphone kasir atau tablet pelayan tanpa perlu instalasi aplikasi khusus dari toko aplikasi.
- **Kemandirian Sistem**: Bekerja lancar secara offline menggunakan penyimpanan peramban lokal (*LocalStorage Sync* via Zustand Persist), dan siap disinkronkan ke PostgreSQL Supabase untuk analitik terpusat.

---

## 🛠 Teknologi yang Digunakan (Tech Stack)

| Kategori | Teknologi | Deskripsi |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) | Framework React modern dengan performa tinggi & rendering optimal |
| **Library UI** | [React 19](https://react.dev/) | Versi terbaru React untuk manajemen siklus UI yang reaktif |
| **Bahasa** | [TypeScript](https://www.typescriptlang.org/) | Type-safe code untuk stabilitas dan pemeliharaan jangka panjang |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first CSS modern, glassmorphism styling, & Dark Mode otomatis |
| **State Management** | [Zustand v5](https://github.com/pmndrs/zustand) | Global state management ringan dengan middleware `persist` (Local Storage) |
| **Ikon UI** | [Lucide React](https://lucide.dev/) | Paket ikon vektor modern, elegan, dan konsisten |
| **Database Cloud** | [Supabase](https://supabase.com/) | Backend PostgreSQL (Opsional) untuk sinkronisasi cloud multi-cabang |
| **CSS Print Engine** | `@media print` kustom | Tata letak khusus struk kasir printer thermal (58mm & 80mm) |
| **Internationalization** | In-App Translation Module | Dukungan dwibahasa penuh (**Bahasa Indonesia** & **English**) |

---

## 🚀 Fitur Utama Sistem

### 1. Sistem Kasir Pintar (Point of Sale)
- **Katalog Menu Cepat & Filter Kategori**: Filter instan berdasarkan kategori (*Signature, Kopi, Non-Kopi, Makanan, Camilan, Semua*), pencarian teks live, dan kode SKU/barcode.
- **Tipe Pesanan Terintegrasi**:
  - **Dine-In**: Pemilihan nomor meja visual (*Meja 01 - 20, VIP 01 - 03, Outdoor 01 - 04*) dengan penanda meja yang sedang terisi (*Open Bill*).
  - **Takeaway**: Opsi kemasan bawa pulang otomatis.
- **Kustomisasi Pesanan Fleksibel**: Pengaturan jumlah item, catatan khusus per menu (*misal: less sugar, oatmilk, tanpa es, level pedas*), dan pembersihan keranjang instan.
- **Adaptif Responsive Layout**:
  - **Desktop / Tablet**: Keranjang terpasang di samping (*Docked Cart Pane*) untuk entri pesanan cepat.
  - **Smartphone**: Tombol aksi mengambang (*Floating Action Bar*) dan drawer keranjang geser (*Slide-in Cart Drawer*).
- **Input Menu Cepat (+ Menu Instan)**: Tambah menu baru seketika langsung dari layar kasir tanpa harus meracik resep bahan baku terlebih dahulu. Menu langsung masuk ke keranjang dan tersimpan di database.

### 2. Transaksi & Multi-Metode Pembayaran
- **Multi-Metode Pembayaran**:
  - **Tunai (Cash)**: Shortcut nominal uang cepat (Rp 20.000, Rp 50.000, Rp 100.000, Rp 200.000, dan Uang Pas) serta kalkulator kembalian otomatis real-time.
  - **QRIS Instant**: Tampilan kode QR dinamis dengan informasi NMID Merchant outlet.
  - **Transfer Bank**: Informasi nomor rekening outlet (BCA/Bank lain), nama pemilik, dan tombol konfirmasi.
  - **Kartu Debit / EDC**: Pencatatan transaksi gesek kartu mesin EDC kasir.
- **Diskon & Pajak (PPN)**: Potongan diskon fleksibel (nominal) dan toggle pajak PPN (11%) yang dapat diaktifkan/dinonaktifkan per pesanan.
- **Fitur Open Bill / Bayar Nanti**:
  - Simpan pesanan meja aktif yang belum dilunasi.
  - Tambah menu baru ke tagihan berjalan meja tersebut kapan saja.
  - Pelunasan cepat melalui drawer daftar tagihan aktif (*Open Bills Drawer*).
- **Riwayat Transaksi & Pembatalan (Void)**:
  - Pelacakan seluruh transaksi dengan filter status (*Lunas / Completed, Open Bill, Void*).
  - Filter berdasarkan metode pembayaran dan pencarian invoice/pelanggan.
  - **Fitur Void Aman**: Pembatalan transaksi wajib menyertakan alasan pembatalan dan dilengkapi opsi **otomatis mengembalikan (*restore*) stok bahan baku** ke gudang.

### 3. Cetak Struk Thermal & Share WhatsApp
- **Dukungan Dual-Size Printer Thermal**: Switch ukuran kertas struk **58mm** dan **80mm** secara langsung.
- **Format Struk Kasir Lengkap**:
  - Identitas toko (Logo, Nama Toko, Tagline, Alamat, Nomor Telepon).
  - Nomor invoice resmi, tanggal, jam, dan nama kasir bertugas.
  - Tipe pesanan (Dine-In + Nomor Meja / Takeaway) & nama pelanggan.
  - Rincian item menu, catatan khusus, subtotal, diskon, PPN, dan total bayar.
  - Metode pembayaran, jumlah uang diserahkan, dan nominal kembalian.
  - Fasilitas WiFi outlet (SSID & Password) dan akun media sosial (Instagram & TikTok).
  - Pesan penutup struk (*Footer Message*).
- **Cetak Thermal Bluetooth & USB**: Layout cetak presisi berbasis CSS `@media print` tanpa margin berlebih.
- **Kirim Struk via WhatsApp**: Menghasilkan format pesan teks struk yang rapi dan membuka tautan `wa.me` langsung ke nomor WhatsApp pelanggan dengan 1 klik.
- **Salin Teks Struk**: Tombol salin teks nota ke clipboard.

### 4. Manajemen Inventori & Stock Opname
- **Database Bahan Baku Gudang**: Pengelolaan stok bahan baku (*Biji Kopi, Susu/Dairy, Sirup & Flavour, Bubuk Powder, Packaging, Topping*).
- **Konversi Biaya Kemasan ke Satuan Terkecil**: Otomatis menghitung biaya pokok per gram, mililiter, atau pcs berdasarkan harga beli kemasan besar.
- **Pengurangan Stok Otomatis**: Setiap kali pesanan lunas di kasir POS, stok bahan baku berkurang otomatis sesuai takaran porsi resep.
- **Peringatan Stok Menipis (*Low Stock Alert*)**: Penanda visual merah ketika stok fisik berada di bawah batas minimum (*threshold*).
- **Valuasi Aset Stok**: Total nilai rupiah seluruh aset bahan baku di gudang yang terhitung secara *real-time*.
- **Pencatatan Stock Opname Terpadu**:
  - Rekonsiliasi fisik berkala antara stok riil dan stok sistem.
  - Pencatatan alasan selisih stok (*Spillage / Tumpah, Kadaluarsa, Rusak / Basi, Selisih Hitung, Lainnya*).
  - Riwayat lengkap opname beserta tanggal, jam, dan nama staf pencatat.

### 5. Kalkulator HPP & Resep Otomatis
- **Racik Komposisi Resep Menu**: Masukkan takaran bahan baku per porsi (misal: 18 gr Espresso Beans + 150 ml Fresh Milk + 20 ml Aren Syrup).
- **Kalkulasi Biaya Pokok Bahan (Raw Material Cost)**: Menghitung modal bahan otomatis dari database inventori terbaru.
- **Alokasi Beban Operasional & Sewa Tempat (Overhead Cost)**:
  - Input alokasi sewa tempat & listrik per cup.
  - Dilengkapi kalkulator bantuan: hitung sewa bulanan dibagi target penjualan cup per bulan.
- **Alokasi Biaya Kemasan (Packaging Cost)**: Perhitungan biaya cup, lid, dan sedotan per sajian.
- **Kalkulator Full HPP**: Total HPP Komprehensif = Biaya Bahan Baku + Beban Sewa/Overhead + Biaya Kemasan.
- **Simulasi Margin Profit & Rekomendasi Harga Jual**:
  - Menghitung persentase margin keuntungan saat ini.
  - Rekomendasi harga jual otomatis untuk target margin 50%, 60% (Standar Kafe), dan 70% (Premium).
  - Terapkan harga rekomendasi ke katalog menu hanya dengan 1-klik.

### 6. Laporan Keuangan & Analisis Laba Bersih
- **Waterfall Finansial Komprehensif**:
  1. **Omset Penjualan Kotor (*Gross Revenue*)**
  2. **Harga Pokok Penjualan (*Total HPP Bahan Baku & Overhead*)**
  3. **Laba Kotor (*Gross Profit = Omset - HPP*)**
  4. **Beban Pengeluaran Operasional (*OPEX Toko*)**
  5. **Laba Bersih Riil (*Net Profit = Laba Kotor - OPEX*) & Margin Bersih (%)**
- **Filter Periode Laporan**: Hari Ini (*Today*), 7 Hari Terakhir (*7d*), dan 30 Hari Terakhir (*30d*).
- **Distribusi Metode Pembayaran**: Rekapitulasi total dana masuk per metode (*Tunai, QRIS, Bank Transfer, Kartu Debit*).
- **Cetak Laporan Pembukuan**: Format cetak laporan laba rugi resmi (*Print to PDF / Lembar Pembukuan*).

### 7. Manajemen Shift & Laci Kasir (Cash Management)
- **Buka Shift Kasir**: Input modal uang kembalian awal (*Starting Cash*).
- **Slip Tutup Shift Kasir (*Shift Settlement*)**:
  - Rekapitulasi modal kas awal.
  - Total penerimaan tunai (*Cash Sales*) & non-tunai (*Non-Cash Sales*).
  - Total pengeluaran uang dari laci kasir (*Cash Drawer Expenses*).
  - Perhitungan **Expected Cash** (Kas Seharusnya) vs **Actual Cash** (Kas Fisik Terhitung).
  - Deteksi otomatis selisih kas (*Over / Short Difference*).
- **Arsip Riwayat Shift**: Riwayat pembukuan pergantian shift kasir terdahulu.

### 8. Pengeluaran Operasional (OPEX Tracker)
- **Catat Biaya Harian**: Input pembelian kebutuhan mendadak seperti es batu kristal, gas LPG, perlengkapan kebersihan, galon air, atau logistik.
- **Pilihan Sumber Kas**:
  - **Kas Laci Kasir (*Cash Drawer*)**: Otomatis memotong uang kas di laci pada shift berjalan (*mengurangi Expected Cash*).
  - **Rekening Bank (*Bank Transfer*)**: Dicatat ke pembukuan beban operasional tanpa mengganggu laci kasir.

### 9. Database Pelanggan & CRM
- **Buku Kontak Pelanggan**: Simpan data pelanggan (Nama, Nomor Telepon/WhatsApp, Email).
- **Metrik Loyalitas**: Menghitung frekuensi kunjungan (*Total Visits*), akumulasi belanja (*Total Spend*), dan poin loyalitas secara otomatis.
- **Chat WhatsApp Instan**: Buka chat WhatsApp pelanggan dengan template pesan salam hangat personal toko yang otomatis disiapkan.

### 10. Autentikasi & Multi-User RBAC
- **Login Barrier**: Sistem kasir terkunci rapat sebelum staf memasukkan username dan kata sandi yang valid.
- **Role-Based Access Control (RBAC)**:
  - **Owner / Master**: Memiliki hak akses penuh ke seluruh modul, termasuk kalkulator HPP, resep rahasia, laporan laba bersih, inventori gudang, manajemen pengguna, dan pengaturan toko.
  - **Kasir (Cashier)**: Dibatasi hanya pada operasional kasir POS, pesanan meja, riwayat transaksi, buka/tutup shift, dan pencatatan kas laci. Akses ke menu resep dan laporan laba dilindungi dengan layar pengaman.
- **Manajemen Akun Kasir**: Owner dapat menambah kasir baru, mengedit profil, mengubah kata sandi, serta menonaktifkan akun kasir yang sudah tidak bertugas.

### 11. Ekspor Data ke Excel/CSV
- Ekspor seluruh tabel ke format **CSV dengan standar UTF-8 BOM** sehingga langsung rapi dan kompatibel dibuka di Microsoft Excel, Google Sheets, maupun Numbers tanpa format berantakan:
  - Ekspor Riwayat Transaksi Penjualan
  - Ekspor Laporan Laba Rugi Finansial
  - Ekspor Database Inventori & Valuasi Bahan Baku

### 12. Pengaturan Outlet & Personalisasi
- **Identitas Toko**: Nama outlet, slogan/tagline, alamat lengkap, dan nomor kontak.
- **Informasi WiFi Pelanggan**: Nama SSID dan kata sandi WiFi untuk otomatis ditampilkan di struk belanja.
- **Akun Media Sosial**: Username Instagram & TikTok outlet.
- **Pajak & Rekening Bank**: Persentase tarif PPN (%) dan nomor rekening transfer kasir.
- **Dukungan Dwibahasa (Bilingual)**: Pilihan bahasa antarmuka **Bahasa Indonesia** atau **English**.
- **Tema Gelap / Terang**: Dukungan Dark Mode dan Light Mode yang nyaman untuk penggunaan siang maupun malam hari.
- **Manajemen Data**: Tombol muat data demo (*Load Demo Data*) atau reset data toko (*Reset All Data*).

---

## 🔑 Kredensial Akun Bawaan (Demo)

Aplikasi telah dilengkapi dengan data demo siap pakai. Anda dapat masuk menggunakan salah satu akun berikut:

| Peran (*Role*) | Username | Password | Hak Akses |
| :--- | :--- | :--- | :--- |
| **Owner / Master** | `owner` | `kage46owner` | Akses Penuh (POS, Resep HPP, Inventori, Laba Bersih, Pengaturan, Akun) |
| **Kasir 1** | `kasir1` | `kasir123` | Akses Operasional Kasir POS, Transaksi, Shift, Kas Laci |
| **Kasir 2** | `kasir2` | `kasir123` | Akses Operasional Kasir POS, Transaksi, Shift, Kas Laci |

> [!TIP]
> Anda dapat menambah atau mengubah akun kasir kapan saja melalui menu **Pengaturan & Akun** saat masuk sebagai **Owner**.

---

## 💻 Instalasi & Menjalankan Proyek

### Prasyarat
- **Node.js**: Versi `18.17` atau lebih baru (direkomendasikan Node.js v20+)
- **npm** atau **yarn** / **pnpm**

### Langkah-Langkah

1. **Clone repository atau buka direktori proyek**:
   ```bash
   cd "c:\Users\Administrator\Documents\antigravity\kasir kage46"
   ```

2. **Pasang seluruh dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan server pengembangan (Development Server)**:
   ```bash
   npm run dev
   ```

4. **Buka aplikasi di peramban (Browser)**:
   Akses [http://localhost:3000](http://localhost:3000) melalui Google Chrome, Microsoft Edge, Safari, atau Firefox.

5. **Build untuk Produksi (Opsional)**:
   ```bash
   npm run build
   npm run start
   ```

---

## 📱 Akses Jaringan Lokal (Multi-Device / Smartphone)

Server development dijalankan dengan argumen `-H 0.0.0.0`, yang memungkinkan perangkat lain (smartphone kasir, tablet pelayan) dalam satu jaringan Wi-Fi mengakses aplikasi kasir:

1. Buka Command Prompt / PowerShell di komputer host dan ketik:
   ```bash
   ipconfig
   ```
2. Temukan alamat **IPv4 Address** komputer Anda (contoh: `192.168.1.46`).
3. Buka browser di smartphone atau tablet yang terhubung ke jaringan Wi-Fi yang sama, lalu akses:
   ```
   http://192.168.1.46:3000
   ```
4. Kasir dan pelayan sekarang dapat memasukkan pesanan langsung dari perangkat genggam mereka!

---

## ☁️ Integrasi Database Cloud Supabase (Opsional)

Secara bawaan, aplikasi bekerja 100% mandiri (*Offline-First*) menggunakan penyimpanan peramban lokal. Jika Anda ingin menghubungkannya ke cloud Supabase:

1. Buat proyek baru di [Supabase Dashboard](https://database.new).
2. Salin file environment contoh:
   ```bash
   cp .env.local.example .env.local
   ```
3. Buka file `.env.local` dan isi dengan kredensial API Supabase Anda:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```
4. Masuk ke menu **SQL Editor** di Dashboard Supabase, buka file [supabase/schema.sql](file:///c:/Users/Administrator/Documents/antigravity/kasir%20kage46/supabase/schema.sql), lalu jalankan seluruh kueri SQL tersebut untuk membuat tabel `users`, `products`, `ingredients`, `orders`, `expenses`, `shifts`, `customers`, `stock_opnames`, dan `store_settings`.

---

## 📂 Struktur Direktori Proyek

```
kasir-kage46/
├── public/                 # Aset statis & favicon
├── src/
│   ├── app/                # Next.js App Router Pages
│   │   ├── layout.tsx      # Root HTML Layout, Metadata & Theme Loader
│   │   ├── globals.css     # Tailwind CSS styles & @media print receipt rules
│   │   ├── page.tsx        # Dashboard Utama, Metrik Penjualan & Top Menu
│   │   ├── pos/            # Layar Kasir Pintar (Katalog, Keranjang & Checkout)
│   │   ├── products/       # Manajemen Menu, Kalkulator Resep & Simulasi HPP
│   │   ├── inventory/      # Database Bahan Baku Gudang & Stock Opname
│   │   ├── transactions/   # Riwayat Transaksi, Open Bill & Void Pesanan
│   │   ├── customers/      # Database Pelanggan, Poin & Kontak WhatsApp
│   │   ├── reports/        # Laporan Keuangan, Waterfall Laba Bersih & Cetak PDF
│   │   └── settings/       # Pengaturan Toko, Pajak, Format Struk & Akun Staf
│   ├── components/         # Komponen Modular Reusable
│   │   ├── auth/           # LoginScreen, LoginModal, UserFormModal, EditProfileModal
│   │   ├── inventory/      # IngredientFormModal, StockOpnameModal
│   │   ├── layout/         # AppShell, Header, Sidebar, MobileBottomNav
│   │   ├── pos/            # ProductGrid, ProductCard, CartPane, CheckoutModal,
│   │   │                   # ReceiptModal, TablePickerModal, QuickAddProductModal
│   │   ├── products/       # RecipeModal (HPP Calculator), ProductFormModal
│   │   ├── shared/         # ShiftModal, ExpenseModal, OpenBillsDrawer, ToastContainer
│   │   └── transactions/   # TransactionDetailModal, VoidModal
│   ├── data/
│   │   └── mockData.ts     # Data awal (Pengguna, Menu Kafe, Bahan Baku, Riwayat)
│   ├── lib/
│   │   ├── exportUtils.ts  # Mesin ekspor CSV / Excel UTF-8 BOM
│   │   ├── supabase.ts     # Inisialisasi klien Supabase & deteksi koneksi
│   │   ├── translations.ts # Modul dwibahasa (Indonesian & English)
│   │   └── utils.ts        # Helper mata uang (IDR), format tanggal & generate ID
│   ├── store/
│   │   └── usePosStore.ts  # Zustand global store dengan LocalStorage persistensi
│   └── types/
│       └── pos.ts          # Definisi tipe data komprehensif TypeScript
├── supabase/
│   └── schema.sql          # Skema PostgreSQL lengkap untuk Supabase
├── .env.local.example      # Template konfigurasi environment
├── package.json            # Konfigurasi dependensi dan skrip proyek
├── tsconfig.json           # Konfigurasi compiler TypeScript
└── README.md               # Dokumentasi lengkap proyek
```

---

## 📄 Lisensi & Hak Cipta

Dikelola untuk operasional **KAGE46 Specialty Coffee & Artisan Kitchen**. Seluruh hak cipta dilindungi.
