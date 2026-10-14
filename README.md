# ☕ KASIR POS KAGE46

[![Live Demo](https://img.shields.io/badge/LIVE%20DEMO-kasir--kage46.vercel.app-0070F3?style=for-the-badge&logo=vercel&logoColor=white)](https://kasir-kage46.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-v5-443E38?style=for-the-badge)](https://zustand-demo.pmnd.rs/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

---

🌐 **Pilih Bahasa / Choose Language:**  
[![Bahasa Indonesia](https://img.shields.io/badge/🇮🇩_Bahasa-Indonesia-red?style=for-the-badge)](README.md)
[![English](https://img.shields.io/badge/🇬🇧_Language-English-blue?style=for-the-badge)](README.en.md)

---

### 🚀 Coba Aplikasi Langsung (Live Demo)
Klik tombol di bawah ini untuk mencoba aplikasi secara langsung tanpa perlu instalasi:

[![Buka Live Demo Kasir KAGE46](https://img.shields.io/badge/👉_KLIK_DI_SINI_UNTUK_BUKA_LIVE_DEMO-0070F3?style=for-the-badge&logo=vercel&logoColor=white)](https://kasir-kage46.vercel.app/)

> **Tautan Demo:** [https://kasir-kage46.vercel.app/](https://kasir-kage46.vercel.app/)

---

## 💡 Tentang Aplikasi

**KASIR POS KAGE46** adalah aplikasi kasir pintar (*Point of Sale*) modern berbasis web yang dirancang khusus untuk bisnis **F&B, Kedai Kopi (*Specialty Coffee*), Artisan Kitchen, dan Restoran**. 

Sistem ini menggabungkan pencatatan pesanan kasir super cepat, kalkulasi **HPP & Resep Otomatis**, kontrol stok gudang, laporan laba bersih riil, serta **Database Server Terpusat** yang otomatis tersinkronisasi antar perangkat (PC kasir dan smartphone pelayan di meja pelanggan via Wi-Fi lokal).

---

## 🔑 Akun Demo Bawaan

| Peran (*Role*) | Username | Password | Hak Akses |
| :--- | :--- | :--- | :--- |
| **👑 Owner / Master** | `owner` | `kage46owner` | **Akses Penuh** (POS, Resep HPP, Laba Bersih, Gudang, Pengaturan Toko, Manajemen Akun) |
| **☕ Kasir (Cashier)** | `kasir1` | `kasir123` | **Kasir Operasional** (POS, Transaksi Meja, Buka/Tutup Shift, Kas Laci) |

---

## ✨ Fitur Utama Lengkap

### 1. 🛒 Kasir Pintar (Point of Sale)
- **Katalog Cepat & Kategori**: Filter instan (*Signature, Kopi, Non-Kopi, Makanan, Camilan*), pencarian live, dan SKU barcode.
- **Tipe Pesanan**:
  - **Dine-In**: Pemilih meja visual (*Meja 01 - 20, VIP, Outdoor*) dengan indikator meja terisi (*Open Bill*).
  - **Takeaway**: Opsi bungkus bawa pulang otomatis.
- **Input Menu Cepat (+ Menu Instan)**: Tambah menu baru langsung dari layar kasir tanpa harus meracik resep bahan baku terlebih dahulu.
- **Desain Responsif**: Panel keranjang terpasang di samping pada PC/tablet dan drawer geser (*slide-in*) pada smartphone.

### 2. 💳 Multi-Pembayaran & Open Bill
- **Metode Pembayaran**:
  - **Tunai (Cash)**: Shortcut nominal uang cepat (Rp 20.000, 50.000, 100.000, Uang Pas) & hitung kembalian otomatis.
  - **QRIS Dinamis**: Tampilan barcode QRIS dengan info NMID toko.
  - **Transfer Bank & Kartu EDC**: Konfirmasi nomor rekening dan pencatatan debit mesin EDC.
- **Diskon & Pajak**: Diskon fleksibel per pesanan dan toggle pajak PPN 11%.
- **Open Bill (Bayar Nanti)**: Simpan pesanan meja yang belum lunas, tambah pesanan susulan, dan selesaikan tagihan kapan saja.
- **Void Transaksi Aman**: Pembatalan nota wajib alasan pembatalan dengan opsi **otomatis mengembalikan stok bahan baku ke gudang**.

### 3. 🖨️ Cetak Struk Thermal & WhatsApp
- **Dual-Size Printer**: Pilihan ukuran kertas struk **58mm** dan **80mm**.
- **Cetak Presisi**: Cetak langsung via printer thermal USB / Bluetooth tanpa margin berlebih (`@media print`).
- **Kirim Struk via WhatsApp**: Kirim format nota belanja rapi ke nomor WhatsApp pelanggan dalam 1-klik.
- **Info Lengkap Struk**: Nama toko, logo, kasir, meja, rincian menu, wifi toko, medsos, dan catatan kaki.

### 4. 🧪 Kalkulator HPP & Resep Otomatis
- **Komposisi Resep Bahan Baku**: Takaran gram/ml per porsi menu (Espresso, Susu, Sirup, Cup, Sedotan).
- **Alokasi Beban Overhead & Sewa**: Kalkulator beban sewa tempat & listrik bulanan dibagi ke modal per cup.
- **Biaya Kemasan (Packaging Cost)**: Perhitungan otomatis biaya cup, lid, dan sedotan per sajian.
- **Simulasi Margin Profit**: Rekomendasi harga jual untuk target margin 50%, 60% (Standar Kafe), dan 70% (Premium) dengan tombol terapkan harga otomatis.

### 5. 📦 Inventori Gudang & Stock Opname
- **Database Bahan Baku**: Satuan unit (gram, ml, pcs), konversi harga kemasan besar ke harga satuan terkecil.
- **Auto-Deduct Stok**: Stok berkurang otomatis setiap transaksi berhasil di kasir.
- **Peringatan Stok Menipis (*Low Stock Alert*)**: Penanda visual merah ketika stok mendekati batas minimum.
- **Stock Opname Terintegrasi**: Catat rekonsiliasi fisik vs sistem, hitung selisih, dan simpan alasan (*Spillage, Expired, Rusak*).
- **Valuasi Aset**: Perhitungan nilai total aset inventori gudang secara real-time.

### 6. 📊 Laporan Keuangan & Laba Bersih Riil
- **Waterfall Finansial**:
  1. **Omset Penjualan Kotor (*Gross Revenue*)**
  2. **Total HPP Bahan Baku & Beban Kemasan**
  3. **Laba Kotor (*Gross Profit*)**
  4. **Pengeluaran Operasional Harian (*OPEX Toko*)**
  5. **Laba Bersih Riil (*Net Profit*) & Persentase Margin Bersih**
- **Filter Periode**: Hari Ini (*Today*), 7 Hari Terakhir (*7d*), dan 30 Hari Terakhir (*30d*).
- **Cetak Laporan**: Format cetak laporan pembukuan resmi (Print to PDF).

### 7. 💵 Manajemen Shift & Laci Kasir (*Cash Float*)
- **Buka Shift**: Input modal kas laci awal (*Starting Cash*).
- **Tutup Shift Kasir (*Reconciliation*)**:
  - Rekap kas modal, penjualan tunai, penjualan non-tunai, dan pengeluaran kas laci.
  - Perhitungan otomatis **Expected Cash** vs **Actual Cash** dan deteksi selisih kas (*Over/Short*).
- **Arsip Riwayat Shift**: Rekapitulasi shift kasir terdahulu tersimpan rapi.

### 8. 📝 OPEX Tracker (Pengeluaran Harian)
- Catat biaya belanja operasional mendadak (es batu, gas LPG, perlengkapan kebersihan, galon).
- Pilihan sumber dana: **Kas Laci Kasir** (otomatis memotong kas laci pada shift berjalan) atau **Transfer Bank**.

### 9. 👥 CRM & Database Pelanggan
- Buku kontak pelanggan (Nama, No. WhatsApp, Email).
- Metrik otomatis: Total kunjungan, akumulasi belanja (*Total Spend*), dan poin reward loyalitas.
- Tombol langsung chat WhatsApp dengan pesan salam personal toko.

### 10. 🛡️ Autentikasi & Multi-User RBAC
- **Login Barrier**: Aplikasi terkunci sebelum login dengan username & kata sandi valid.
- **Hak Akses Ketat (RBAC)**: Kasir dibatasi hanya pada transaksi kasir, open bill meja, dan shift. Modul resep HPP, laporan laba, dan pengaturan toko dilindungi khusus akun **Owner**.
- **Kelola Akun**: Owner dapat menambah kasir baru, ubah password, atau menonaktifkan akun staf.

### 11. ⚙️ Pengaturan Toko & Manajemen Data
- Personalisasi nama outlet, tagline, alamat, nomor telepon, info WiFi, dan tarif PPN.
- **Cadangan & Pemulihan (Backup & Restore)**: Unduh salinan database `.json` atau pulihkan kapan saja via 1-klik.
- **Kosongkan Data (*Reset All Data*)**: Bersihkan seluruh data demo untuk mulai dari toko kosong yang siap pakai riil.
- **Muat Data Demo (*Load Demo Data*)**: Kembalikan data contoh lengkap untuk simulasi.
- **Mode Tampilan**: Dark Mode & Light Mode yang nyaman di mata.
- **Dwibahasa (Bilingual)**: Pilihan bahasa **Bahasa Indonesia** atau **English**.

### 12. 🔄 Database Server Terpusat & Sinkronisasi Multi-Device
- **Single Source of Truth**: Data toko tersimpan di server lokal PC (`data/pos_database.json`) dengan atomic write & rolling backup (`.bak.json`).
- **Sinkronisasi Otomatis Real-Time**: Pesanan meja dari HP pelayan langsung muncul di PC kasir; menu baru dari PC langsung tampil di HP pelayan.
- **Multi-Device Ready**: Bekerja mulus melalui jaringan Wi-Fi lokal (LAN).

---

## 🛠 Teknologi yang Digunakan

| Komponen | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) | Rendering optimal & arsitektur modern |
| **UI Library** | [React 19](https://react.dev/) | Reaktif & performa tinggi |
| **Bahasa** | [TypeScript](https://www.typescriptlang.org/) | Type-safe & bebas bug |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Glassmorphism, Dark/Light Mode, & Responsive UI |
| **State Management** | [Zustand v5](https://zustand-demo.pmnd.rs/) | Store global ringan dengan sinkronisasi server |
| **Ikon** | [Lucide React](https://lucide.dev/) | Paket ikon modern & elegan |
| **Penyimpanan Server** | Local Server JSON DB | File database persisten di PC server |
| **Database Cloud** | [Supabase](https://supabase.com/) | Opsional untuk sinkronisasi PostgreSQL multi-cabang |

---

## 💻 Cara Menjalankan Proyek di Komputer Lokal

### 1. Prasyarat
- Pastikan telah menginstal [Node.js](https://nodejs.org/) (versi 18.17+ atau 20+).

### 2. Instalasi & Menjalankan
Buka terminal / PowerShell di direktori proyek:

```bash
# 1. Pasang dependensi
npm install

# 2. Jalankan server pengembangan
npm run dev
```

Buka peramban di: **[http://localhost:3000](http://localhost:3000)**

---

## 📱 Akses dari HP / Tablet Pelayan

### Opsi A: Jaringan Wi-Fi Toko yang Sama (LAN)
1. Cek alamat IP komputer server kasir dengan perintah:
   ```bash
   ipconfig
   ```
2. Temukan **IPv4 Address** (misal: `192.168.1.9`).
3. Buka browser di smartphone/tablet pelayan, lalu akses:
   ```
   http://192.168.1.9:3000
   ```

---

## 📂 Struktur Direktori Ringkas

```
kasir-kage46/
├── data/
│   ├── pos_database.json        # Database master server persisten
│   └── pos_database.bak.json    # Salinan cadangan otomatis bergulir
├── src/
│   ├── app/
│   │   ├── api/sync/            # API Route sinkronisasi real-time & backup/restore
│   │   ├── layout.tsx           # Root Layout & Metadata
│   │   ├── page.tsx             # Dashboard Utama & KPI Penjualan
│   │   ├── pos/                 # Kasir Pintar (Katalog, Keranjang & Checkout)
│   │   ├── products/            # Katalog Menu & Kalkulator Resep HPP
│   │   ├── inventory/           # Stok Gudang & Stock Opname
│   │   ├── transactions/        # Riwayat Transaksi & Open Bill Meja
│   │   ├── customers/           # Database Pelanggan & CRM
│   │   ├── reports/             # Laporan Keuangan & Analisis Laba
│   │   └── settings/            # Pengaturan Toko, Akun Staf & Reset Data
│   ├── components/              # Komponen UI modular (Header, Sidebar, Modals)
│   ├── lib/                     # Server DB engine, Sync service, Terjemahan
│   ├── store/                   # Zustand store (usePosStore.ts)
│   └── types/                   # Type definitions TypeScript
├── package.json
└── README.md
```

---

## 📄 Lisensi

Proyek ini dirilis di bawah naungan lisensi **[MIT License](LICENSE)**. Bebas digunakan, dipelajari, dan dikembangkan untuk keperluan bisnis, komersial, maupun edukasi.
