"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { usePosStore } from "@/store/usePosStore";
import { StoreSettings } from "@/types/pos";
import { UserFormModal } from "@/components/auth/UserFormModal";
import { 
  Settings, 
  Store, 
  Receipt, 
  Percent, 
  RotateCcw, 
  Save, 
  Wifi, 
  Phone, 
  MapPin, 
  Building2, 
  QrCode,
  Users,
  UserPlus,
  KeyRound,
  ShieldCheck,
  Trash2,
  CheckCircle2,
  Lock
} from "lucide-react";

export default function SettingsPage() {
  const { 
    settings, 
    updateSettings, 
    resetAllData, 
    loadDemoData,
    users, 
    currentUser, 
    toggleUserActive, 
    deleteUser, 
    addToast 
  } = usePosStore();

  const isOwner = currentUser?.role === "owner";

  const [formData, setFormData] = useState<StoreSettings>(settings);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
  };

  const handleReset = () => {
    if (confirm("KOSONGKAN SEMUA DATA DEMO?\n\nSemua produk, bahan baku stok gudang, riwayat transaksi pesanan, dan kontak pelanggan akan dikosongkan total (0) agar siap diisi dengan data toko riil Anda.")) {
      resetAllData();
      setFormData(settings);
    }
  };

  const handleLoadDemo = () => {
    if (confirm("Muat kembali contoh data demo simulasi (menu kopi & makanan, stok gudang, pesanan)?")) {
      loadDemoData();
      setFormData(settings);
    }
  };

  const handleDeleteUserAccount = (userId: string, userName: string) => {
    if (confirm(`Hapus akun kasir "${userName}"? Kasir ini tidak akan bisa login lagi.`)) {
      deleteUser(userId);
      addToast(`Akun kasir "${userName}" berhasil dihapus.`, "info");
    }
  };

  return (
    <AppShell>
      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto w-full pb-24 lg:pb-12">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>Pengaturan Toko & Manajemen Akun</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Identitas outlet KAGE46, akun kasir/karyawan, dan format printer thermal struk.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLoadDemo}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition"
              title="Muat contoh data demo untuk simulasi"
            >
              <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
              <span>Muat Contoh Demo</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 hover:border-rose-300 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-300 transition shadow-xs"
              title="Kosongkan seluruh data untuk mulai operasional riil dari 0"
            >
              <Trash2 className="h-3.5 w-3.5 text-rose-600" />
              <span>Kosongkan Semua Data</span>
            </button>
          </div>
        </div>

        {/* SECTION: MANAJEMEN AKUN KASIR & KARYAWAN (OWNER) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/20">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Manajemen Akun Kasir & Pengguna</span>
                  <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    Khusus Owner
                  </span>
                </h2>
                <p className="text-xs text-slate-500">
                  Owner dapat menambah akun kasir baru, menetapkan username & password, dan mengontrol status aktif.
                </p>
              </div>
            </div>

            {isOwner ? (
              <button
                type="button"
                onClick={() => setIsUserModalOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition shrink-0"
              >
                <UserPlus className="h-4 w-4" />
                <span>+ Buat Akun Kasir Baru</span>
              </button>
            ) : (
              <span className="text-xs text-amber-600 font-semibold flex items-center gap-1">
                <Lock className="h-3.5 w-3.5" />
                <span>Mode Kasir: Hanya Owner yang dapat menambah akun</span>
              </span>
            )}
          </div>

          {/* User List Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-850 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3">Nama Karyawan</th>
                  <th className="p-3">Username Login</th>
                  <th className="p-3">Password</th>
                  <th className="p-3">Peran / Role</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                    <td className="p-3">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <div className={`h-2.5 w-2.5 rounded-full ${u.isActive ? (u.role === "owner" ? "bg-emerald-500" : "bg-sky-500") : "bg-slate-400"}`} />
                        <span>{u.name}</span>
                      </div>
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-600 dark:text-slate-300">
                      @{u.username}
                    </td>
                    <td className="p-3 font-mono text-slate-500">
                      {isOwner ? (
                        <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[11px] font-bold">
                          {u.password || "••••••••"}
                        </span>
                      ) : (
                        "••••••••"
                      )}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        u.role === "owner"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300"
                      }`}>
                        {u.role === "owner" ? "Owner / Master" : "Kasir Cabang"}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        type="button"
                        disabled={!isOwner || u.role === "owner"}
                        onClick={() => toggleUserActive(u.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                          u.isActive
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300"
                            : "bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300"
                        } disabled:opacity-50`}
                      >
                        {u.isActive ? "Aktif (Bisa Login)" : "Nonaktif"}
                      </button>
                    </td>
                    <td className="p-3 text-right">
                      {u.role !== "owner" && isOwner ? (
                        <button
                          type="button"
                          onClick={() => handleDeleteUserAccount(u.id, u.name)}
                          className="p-1 text-slate-400 hover:text-rose-500 transition"
                          title="Hapus akun kasir ini"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400">Master Utama</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Card 1: Identitas Outlet */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Store className="h-5 w-5 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Identitas Outlet & Informasi Publik
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Outlet / Brand
                </label>
                <input
                  type="text"
                  required
                  value={formData.storeName}
                  onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tagline Outlet
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Alamat Lengkap Outlet
              </label>
              <textarea
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nomor Telepon / WhatsApp
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Akun Instagram
                </label>
                <input
                  type="text"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Akun TikTok
                </label>
                <input
                  type="text"
                  value={formData.tiktok}
                  onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            {/* WiFi Credentials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama WiFi Outlet (SSID)
                </label>
                <input
                  type="text"
                  value={formData.wifiName}
                  onChange={(e) => setFormData({ ...formData, wifiName: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Password WiFi
                </label>
                <input
                  type="text"
                  value={formData.wifiPassword}
                  onChange={(e) => setFormData({ ...formData, wifiPassword: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Format Struk Thermal & Pajak */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Receipt className="h-5 w-5 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Format Printer Thermal & Pengaturan Pajak (PPN)
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Ukuran Lebar Kertas Printer Thermal Default
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, receiptSize: "58mm" })}
                    className={`rounded-xl p-2.5 text-xs font-bold border transition ${
                      formData.receiptSize === "58mm"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200"
                        : "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    58mm (Printer Mini / Bluetooth)
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, receiptSize: "80mm" })}
                    className={`rounded-xl p-2.5 text-xs font-bold border transition ${
                      formData.receiptSize === "80mm"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200"
                        : "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    80mm (Desktop / USB Pos Printer)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tarif Pajak PPN (%) & Status Default Kasir
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={formData.taxPercentage}
                      onChange={(e) => setFormData({ ...formData, taxPercentage: Number(e.target.value) })}
                      className="w-24 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 pr-7 text-xs font-bold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                    <span className="absolute right-2.5 top-2 text-xs font-bold text-slate-400">%</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, taxEnabled: !formData.taxEnabled })}
                    className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-xs font-bold transition select-none cursor-pointer border ${
                      formData.taxEnabled
                        ? "border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 shadow-2xs"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    <div
                      className={`relative inline-flex h-4 w-7 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out ${
                        formData.taxEnabled ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                          formData.taxEnabled ? "translate-x-3.5" : "translate-x-0.5"
                        }`}
                      />
                    </div>
                    <span>{formData.taxEnabled ? "Pajak PPN Aktif Secara Default di Kasir" : "Pajak PPN Nonaktif (Bebas Pajak)"}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Jika diaktifkan, pesanan baru di kasir otomatis memuat PPN {formData.taxPercentage}%. Kasir tetap dapat menonaktifkan PPN secara fleksibel per transaksi.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Pesan Catatan Kaki (Footer Struk Belanja)
              </label>
              <textarea
                rows={2}
                value={formData.receiptFooterMessage}
                onChange={(e) => setFormData({ ...formData, receiptFooterMessage: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Card 3: Non-Cash Payment Details */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Building2 className="h-5 w-5 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Akun Rekening Transfer & Merchant QRIS
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Bank
                </label>
                <input
                  type="text"
                  value={formData.bankAccount.bankName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bankAccount: { ...formData.bankAccount, bankName: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nomor Rekening
                </label>
                <input
                  type="text"
                  value={formData.bankAccount.accountNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bankAccount: { ...formData.bankAccount, accountNumber: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Atas Nama Rekening
                </label>
                <input
                  type="text"
                  value={formData.bankAccount.holderName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bankAccount: { ...formData.bankAccount, holderName: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Merchant Name & NMID QRIS
              </label>
              <input
                type="text"
                value={formData.qrisMerchantName}
                onChange={(e) => setFormData({ ...formData, qrisMerchantName: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 active:scale-[0.99] transition"
            >
              <Save className="h-4 w-4" />
              <span>Simpan Seluruh Pengaturan</span>
            </button>
          </div>

        </form>

        <UserFormModal
          isOpen={isUserModalOpen}
          onClose={() => setIsUserModalOpen(false)}
        />

      </div>
    </AppShell>
  );
}
