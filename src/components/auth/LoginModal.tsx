"use client";

import React, { useState } from "react";
import { usePosStore } from "@/store/usePosStore";
import { useTranslation } from "@/lib/translations";
import { 
  Lock, 
  User, 
  X, 
  ShieldCheck, 
  KeyRound, 
  Eye, 
  EyeOff, 
  Coffee, 
  CheckCircle2, 
  AlertCircle,
  Database
} from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login, currentUser, users, settings } = usePosStore();
  const { t, isEnglish } = useTranslation();
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    setTimeout(() => {
      const success = login(username, password);
      setLoading(false);
      if (success) {
        onClose();
      } else {
        setErrorMessage(t.auth.invalidErr);
      }
    }, 200);
  };

  const isCloud = isSupabaseConfigured();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Brand & Header */}
        <div className="text-center pb-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/25 mb-3">
            <Coffee className="h-7 w-7" />
          </div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
            {isEnglish ? `Cashier & Owner Login - ${settings?.storeName || "Outlet"}` : `Login Kasir & Owner ${settings?.storeName || "Outlet"}`}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isEnglish ? "Sign in to start cashier shift & transactions." : "Masuk dengan akun terdaftar untuk mulai transaksi & pencatatan shift kasir."}
          </p>

          <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold border bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700">
            <Database className="h-3 w-3 text-emerald-500" />
            <span>
              {isCloud
                ? (isEnglish ? "Supabase PostgreSQL Connected" : "Supabase PostgreSQL Terhubung")
                : (isEnglish ? "Local Offline-First Mode Active" : "Autentikasi Lokal Aktif (Offline-First)")}
            </span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t.auth.usernameLabel}
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t.auth.usernamePlaceholder}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-xs font-bold text-slate-900 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t.auth.passwordLabel}
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.auth.passwordPlaceholder}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 py-2 text-xs font-bold text-slate-900 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-black text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 active:scale-[0.99] transition disabled:opacity-50"
          >
            {loading ? t.auth.loadingVerify : t.auth.submitBtn.replace("{store}", settings?.storeName || "Kasir")}
          </button>
        </form>

      </div>
    </div>
  );
};
