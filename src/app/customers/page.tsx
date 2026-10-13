"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { usePosStore } from "@/store/usePosStore";
import { Customer } from "@/types/pos";
import { formatRupiah, formatDate } from "@/lib/utils";
import { 
  Users, 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  MessageSquare, 
  X, 
  Calendar,
  Trash2 
} from "lucide-react";

export default function CustomersPage() {
  const { customers, addCustomer, deleteCustomer } = usePosStore();

  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    addCustomer({ name, phone, email });
    setName("");
    setPhone("");
    setEmail("");
    setIsAddModalOpen(false);
  };

  const handleDeleteCustomer = (id: string, customerName: string) => {
    if (confirm(`Hapus pelanggan "${customerName}" dari daftar kontak?`)) {
      deleteCustomer(id);
    }
  };

  const handleWhatsApp = (phoneStr: string, customerName: string) => {
    const cleanPhone = phoneStr.replace(/[^0-9]/g, "");
    const formatted = cleanPhone.startsWith("0") ? `62${cleanPhone.slice(1)}` : cleanPhone;
    const msg = encodeURIComponent(
      `Halo Kak ${customerName}! Terima kasih telah berbelanja di KAGE46 Coffee & Eatery.`
    );
    window.open(`https://wa.me/${formatted}?text=${msg}`, "_blank");
  };

  return (
    <AppShell>
      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full pb-24 lg:pb-12">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>Daftar Pelanggan</span>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
                {customers.length} Pelanggan
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Database kontak pelanggan dan riwayat transaksi pesanan KAGE46.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition"
          >
            <Plus className="h-4 w-4" />
            <span>+ Tambah Pelanggan</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau nomor WhatsApp pelanggan..."
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2 text-xs sm:text-sm font-medium text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
        </div>

        {/* Customer Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map((cust) => {
            return (
              <div
                key={cust.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-emerald-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base">
                        {cust.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 font-mono">
                        <Phone className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>{cust.phone}</span>
                      </div>
                      {cust.email && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                          <Mail className="h-3.5 w-3.5" />
                          <span>{cust.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Customer stats (Visits & Spend only, no loyalty points) */}
                  <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-2.5 text-center dark:bg-slate-800/50">
                    <div>
                      <div className="text-[10px] text-slate-400">Kunjungan</div>
                      <div className="text-xs font-black text-slate-900 dark:text-white mt-0.5">
                        {cust.totalVisits}x
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Total Belanja</div>
                      <div className="text-xs font-black text-slate-900 dark:text-white mt-0.5 truncate">
                        {formatRupiah(cust.totalSpend)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Card Row */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>Terakhir: {cust.lastVisit.slice(0, 10)}</span>
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleWhatsApp(cust.phone, cust.name)}
                      className="flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition"
                      title="Chat WhatsApp"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>Chat WA</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteCustomer(cust.id, cust.name)}
                      className="flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-100 hover:border-rose-300 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300 dark:hover:bg-rose-950/60 transition"
                      title="Hapus Pelanggan"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {filteredCustomers.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
            <Users className="h-10 w-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Belum ada data pelanggan</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Klik <strong>"+ Tambah Pelanggan"</strong> di atas untuk menyimpan kontak pelanggan baru.
            </p>
          </div>
        )}

        {/* Add Customer Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-emerald-600" />
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Registrasi Pelanggan Baru
                  </h2>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="mt-4 space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Amanda Clarissa"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nomor WhatsApp / HP
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono font-medium text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email (Opsional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Contoh: amanda@gmail.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-100 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition"
                  >
                    Simpan Pelanggan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </AppShell>
  );
}
