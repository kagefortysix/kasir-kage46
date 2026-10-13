"use client";

import React, { useState } from "react";
import { usePosStore } from "@/store/usePosStore";
import { UserRole } from "@/types/pos";
import { 
  UserPlus, 
  X, 
  User, 
  Lock, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({ isOpen, onClose }) => {
  const { addUser, users, addToast } = usePosStore();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("cashier");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanUsername = username.trim().toLowerCase();
    if (!cleanUsername || !name.trim() || !password.trim()) {
      setError("Semua kolom (Nama, Username, Password) wajib diisi!");
      return;
    }

    if (users.some((u) => u.username.toLowerCase() === cleanUsername)) {
      setError(`Username "${cleanUsername}" sudah digunakan oleh kasir lain. Pilih username lain.`);
      return;
    }

    addUser({
      name: name.trim(),
      username: cleanUsername,
      password: password.trim(),
      role,
      isActive: true,
    });

    addToast(`Akun kasir/pengguna "${name}" berhasil dibuat!`, "success");
    setName("");
    setUsername("");
    setPassword("");
    setRole("cashier");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/20">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Buat Akun Kasir / Pengguna Baru
              </h2>
              <p className="text-[11px] text-slate-500">
                Akses masuk aplikasi POS untuk kasir cabang KAGE46
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Nama Lengkap Karyawan / Kasir
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Rian Barista"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Username Login (Huruf Kecil / Angka)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2 text-xs font-bold text-slate-400">@</span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ""))}
                placeholder="rian46"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-2 text-xs font-mono font-bold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Password Login
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Hak Akses / Peran Akun
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole("cashier")}
                className={`p-3 rounded-xl border text-left transition ${
                  role === "cashier"
                    ? "border-sky-500 bg-sky-50/70 dark:border-sky-700 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200"
                    : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300"
                }`}
              >
                <div className="text-xs font-bold">Kasir (Cashier)</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Input pesanan, buka shift, cetak nota
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole("owner")}
                className={`p-3 rounded-xl border text-left transition ${
                  role === "owner"
                    ? "border-emerald-500 bg-emerald-50/70 dark:border-emerald-700 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200"
                    : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300"
                }`}
              >
                <div className="text-xs font-bold">Owner / Admin</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Akses penuh laporan laba, HPP, & buat akun
                </div>
              </button>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 bg-slate-100 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition"
            >
              Simpan Akun Baru
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
