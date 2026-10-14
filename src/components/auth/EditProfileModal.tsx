"use client";

import React, { useState, useEffect } from "react";
import { usePosStore } from "@/store/usePosStore";
import { useTranslation } from "@/lib/translations";
import { 
  UserCog, 
  X, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  Save, 
  AlertCircle, 
  KeyRound, 
  CheckCircle2, 
  ShieldCheck 
} from "lucide-react";

export const EditProfileModal: React.FC = () => {
  const { 
    currentUser, 
    updateUser, 
    isEditProfileModalOpen, 
    setEditProfileModalOpen,
    settings 
  } = usePosStore();

  const { t, language } = useTranslation();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (currentUser && isEditProfileModalOpen) {
      setName(currentUser.name || "");
      setUsername(currentUser.username || "");
      setPassword(currentUser.password || "");
      setShowPassword(false);
      setError(null);
      setSuccess(false);
    }
  }, [currentUser, isEditProfileModalOpen]);

  if (!isEditProfileModalOpen || !currentUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const cleanName = name.trim();
    const cleanUsername = username.trim().toLowerCase().replace(/\s+/g, "");
    const cleanPassword = password.trim();

    if (!cleanName) {
      setError(t.profile.nameRequired);
      return;
    }

    if (!cleanUsername || cleanUsername.length < 3) {
      setError(t.profile.usernameMinLength);
      return;
    }

    if (!cleanPassword || cleanPassword.length < 4) {
      setError(t.profile.passwordMinLength);
      return;
    }

    const updated = updateUser(currentUser.id, {
      name: cleanName,
      username: cleanUsername,
      password: cleanPassword,
    });

    if (updated) {
      setSuccess(true);
      setTimeout(() => {
        setEditProfileModalOpen(false);
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold shadow-md shadow-emerald-600/20 shrink-0">
              <UserCog className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                {t.profile.title}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {t.profile.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={() => setEditProfileModalOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Tutup"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Current Account Card Summary */}
        <div className="mt-3.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`h-9 w-9 rounded-xl flex items-center justify-center text-xs font-black uppercase text-white shadow-xs shrink-0 ${
              currentUser.role === "owner" ? "bg-emerald-600" : "bg-sky-600"
            }`}>
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                Akun ID: {currentUser.id}
              </div>
            </div>
          </div>

          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase shrink-0 ${
            currentUser.role === "owner"
              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
              : "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300"
          }`}>
            {currentUser.role === "owner" ? "Owner Utama" : "Kasir"}
          </span>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Perubahan akun berhasil disimpan!</span>
          </div>
        )}

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          
          {/* 1. Nama Lengkap */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Nama Lengkap Akun
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Riky Kage46"
                className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 shadow-2xs focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Nama yang tampil di struk kasir dan dashboard.</p>
          </div>

          {/* 2. Username Login */}
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
                placeholder="riky07"
                className="w-full rounded-xl border border-slate-200 bg-white pl-8 pr-3 py-2 text-xs font-mono font-bold text-slate-900 shadow-2xs focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Digunakan untuk masuk login aplikasi.</p>
          </div>

          {/* 3. Password Baru */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Password Login Baru
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ketik password baru (min. 4 karakter)"
                className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-10 py-2 text-xs font-bold font-mono text-slate-900 shadow-2xs focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                title={showPassword ? "Sembunyikan password" : "Lihat password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Password baru akan langsung aktif untuk sesi login berikutnya.</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setEditProfileModalOpen(false)}
              className="flex-1 rounded-xl border border-slate-200 bg-slate-100 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition cursor-pointer"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 active:scale-[0.99] transition cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>{t.profile.saveChanges}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
