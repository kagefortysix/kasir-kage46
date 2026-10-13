# KASIR POS KAGE46 ☕

Modern & Mobile-Friendly Web Point of Sale (POS) System untuk Specialty Coffee & Artisan Kitchen **KAGE46**.

Dibangun dengan fokus utama pada **UI/UX Frontend yang cepat, premium, dan intuitif**, siap digunakan di layar smartphone, tablet, maupun desktop PC kasir.

---

## 🚀 Teknologi Utama

- **Framework**: Next.js App Router (v16+) & React 19
- **Bahasa**: TypeScript (Strict Typing)
- **Styling**: Tailwind CSS & Glassmorphism Aesthetics
- **Komponen & Ikon**: Lucide React Icons
- **State Management**: Zustand dengan `persist` (Local Storage Sync)
- **Desain UI**: Modern SaaS Dashboard (Inspired by Stripe, Shopify & Vercel)

---

## 📱 Fitur Lengkap Aplikasi

### 1. Sistem Kasir Pintar (Point of Sale)
- **Katalog Menu Interaktif**: Filter kategori cepat (*Signature, Kopi, Non-Kopi, Makanan, Camilan*), pencarian live, dan shortcut pencarian barcode / SKU.
- **Tipe Pesanan**:
  - **Dine-In**: Pemilih nomor meja (Meja 01 - 20, VIP 01 - 03, Outdoor 01 - 04) dengan indikator meja terisi (Open Bill).
  - **Takeaway**: Pesanan bungkus bawa pulang.
- **Kustomisasi Pesanan**: Tambah/kurang kuantitas, catatan khusus per menu (*less sugar, tanpa es, extra shot, pedas*), dan reset keranjang.
- **Docked & Drawer Cart**: Keranjang terpasang di samping pada layar desktop dan drawer slide-in + floating bar pada smartphone.

### 2. Input Menu Cepat Tanpa Wajib HPP
- Tombol **+ Menu Instan** langsung di layar kasir untuk memasukkan produk baru seketika tanpa harus meracik resep bahan baku terlebih dahulu.
- Menu baru langsung tersimpan ke katalog dan otomatis masuk ke keranjang kasir.

### 3. Multi-Metode Pembayaran & Kalkulator Kembalian
- **Tunai (Cash)**: Shortcut nominal cepat (Rp 20.000, 50.000, 100.000, 200.000, dan Uang Pas) dengan kalkulator kembalian real-time.
- **QRIS Instant**: Tampilan kode barcode QR dinamis dengan info NMID Merchant.
- **Transfer Bank**: Informasi bank outlet (BCA), nomor rekening, dan nama pemilik.
- **Kartu Debit / EDC**: Dukungan pembayaran via mesin EDC kasir.
- **Diskon & Pajak (PPN)**: Diskon nominal dan toggle switch PPN (11%).

### 4. Fitur Open Bill / Bayar Nanti (Pay Later)
- Simpan pesanan meja berjalan pelanggan yang belum lunas.
- Drawer daftar tagihan aktif: tambah menu tambahan ke meja atau langsung lunasi.

### 5. Cetak Struk Thermal & Share WhatsApp
- **Pratinjau Struk Dual-Size**: Switch ukuran kertas printer thermal **58mm** dan **80mm**.
- **Format Struk Lengkap**: Logo, nama outlet, nomor invoice, kasir bertugas, rincian menu + catatan, subtotal, diskon, PPN, metode bayar, kembalian, info WiFi, dan media sosial.
- **Kirim WhatsApp**: Otomatis menghasilkan teks struk rapi dan membuka tautan `wa.me` langsung ke nomor pelanggan.
- **Cetak Struk**: Format cetak khusus via printer thermal Bluetooth/USB (`@media print`).

### 6. Kalkulator HPP & Resep Otomatis
- Racik resep per porsi (gram, ml, pcs) berbasis database bahan baku riil.
- Menghitung modal HPP otomatis berdasarkan harga beli bahan baku terbaru.
- **Simulasi Margin & Rekomendasi Harga Jual**:
  - Rekomendasi otomatis margin 50%, 60% (Standar Cafe), dan 70%.
  - Tombol 1-klik untuk menerapkan harga rekomendasi.

### 7. Manajemen Inventori & Stock Opname
- Database bahan baku gudang lengkap dengan konversi harga beli kemasan ke satuan unit terkecil.
- Pemotongan stok bahan baku otomatis saat transaksi menu berhasil.
- Peringatan stok menipis (*Low Stock Alert*).
- **Fitur Stock Opname**: Pencatatan selisih fisik riil dengan alasan (*Spillage / Tumpah, Kadaluarsa, Rusak / Basi, Selisih Hitung*).

### 8. Manajemen Shift & Laci Kasir Harian
- Modal awal uang kembalian kasir saat membuka shift.
- Slip Tutup Shift Kasir (*Shift Settlement*) yang merekap:
  - Modal kas awal
  - Total penerimaan tunai
  - Total penerimaan non-tunai
  - Pengeluaran dari laci
  - Expected cash vs Actual cash terhitung & kalkulasi selisih.

### 9. Pencatatan Pengeluaran Kas Operasional (Expenses)
- Input biaya harian (belanja es batu kristal, gas LPG, perlengkapan kebersihan, dll.).
- Sumber dana: dipotong dari **Kas Laci Kasir** (otomatis memotong expected cash) atau **Rekening Bank**.

### 10. Laporan Keuangan & Analisis Laba Bersih
- **Waterfall Finansial**:
  1. Omset Penjualan (Gross Revenue)
  2. Beban Pokok Penjualan (Total HPP Bahan)
  3. Laba Kotor (Gross Profit)
  4. Pengeluaran Operasional (OPEX)
  5. **Laba Bersih Riil (Net Profit = Omset - HPP - OPEX)**
- Filter periode: Hari Ini, 7 Hari Terakhir, 30 Hari.
- Grafik visual penjualan dan distribusi metode pembayaran.
- Format resmi cetak laporan pembukuan bulanan.

### 11. Riwayat Transaksi & Pembatalan (Void)
- Seluruh riwayat transaksi dengan filter status (Lunas / Open Bill / Void).
- Cetak ulang struk lama kapan saja.
- **Fitur Void Transaksi** dengan opsi **pengembalian (restore) stok bahan baku** ke gudang secara otomatis.

### 12. Switcher Role Multi-User (Owner vs Kasir)
- Switcher role di header:
  - **Owner / Master**: Akses penuh ke seluruh fitur dan laporan eksekutif.
  - **Kasir**: Akses fokus ke operasional transaksi POS, buka/tutup shift, dan pengeluaran harian.

### 13. Pengaturan Outlet & Format Struk
- Kustomisasi identitas toko, nomor kontak, akun Instagram & TikTok, WiFi outlet.
- Pengaturan default ukuran struk 58mm/80mm dan pesan ucapan terima kasih.
- Tarif pajak PPN & nomor rekening outlet.
- Tombol Reset Demo Data.

---

## 💻 Cara Menjalankan Project

1. Pastikan Node.js (v18+) terpasang.
2. Jalankan server development:
   ```bash
   npm run dev
   ```
3. Buka browser di [http://localhost:3000](http://localhost:3000).

---

## 📂 Struktur Folder

```
src/
├── app/
│   ├── layout.tsx         # Root layout & SEO metadata
│   ├── globals.css        # Tailwind styling & print receipt styles
│   ├── page.tsx           # Dashboard & Analytics
│   ├── pos/page.tsx       # Layar Kasir POS
│   ├── products/page.tsx  # Katalog Produk & Resep HPP
│   ├── inventory/page.tsx # Database Bahan Baku & Stock Opname
│   ├── transactions/page.tsx # Riwayat Pesanan & Open Bill
│   ├── customers/page.tsx # Database Pelanggan & Loyalitas
│   ├── reports/page.tsx   # Laporan Keuangan & Laba Bersih
│   └── settings/page.tsx  # Identitas Toko & Format Struk
├── components/
│   ├── layout/            # Header, Sidebar, MobileBottomNav, AppShell
│   ├── pos/               # ProductGrid, ProductCard, CartPane, CheckoutModal, ReceiptModal, TablePickerModal, QuickAddProductModal
│   ├── products/          # RecipeModal (HPP Calculator), ProductFormModal
│   ├── inventory/         # StockOpnameModal, IngredientFormModal
│   ├── transactions/      # TransactionDetailModal, VoidModal
│   └── shared/            # ShiftModal, ExpenseModal, OpenBillsDrawer, ToastContainer
├── store/
│   └── usePosStore.ts     # Zustand global persistent state & business logic
├── types/
│   └── pos.ts             # Comprehensive TypeScript models
├── data/
│   └── mockData.ts        # Mock Indonesian coffee shop & eatery data
└── lib/
    └── utils.ts           # Currency (IDR), Date, & ID formatting helpers
```
