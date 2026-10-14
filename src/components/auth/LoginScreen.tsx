"use client";

import React, { useState } from "react";
import { usePosStore } from "@/store/usePosStore";
import { useTranslation } from "@/lib/translations";
import { 
  Coffee, 
  User, 
  KeyRound, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Database,
  Lock,
  ArrowRight,
  Sun,
  Moon
} from "lucide-react";

export const LoginScreen: React.FC = () => {
  const { login, isDarkMode, toggleDarkMode, settings, syncStatus } = usePosStore();
  const { t } = useTranslation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanUser = username.trim();
    if (!cleanUser || !password) {
      setErrorMessage(t.auth.emptyFieldsErr);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const success = login(cleanUser, password);
      setLoading(false);
      if (!success) {
        setErrorMessage(t.auth.invalidErr);
      }
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-white overflow-y-auto selection:bg-emerald-500 selection:text-white transition-colors duration-200">
      
      {/* Top Right Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <button
          type="button"
          onClick={toggleDarkMode}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-md hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-200 dark:hover:bg-slate-800 transition-all"
          title={isDarkMode ? t.header.switchThemeLight : t.header.switchThemeDark}
          aria-label="Toggle Theme"
        >
          {isDarkMode ? (
            <>
              <Sun className="h-4 w-4 text-amber-400" />
              <span className="hidden sm:inline">Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="h-4 w-4 text-slate-600" />
              <span className="hidden sm:inline">Dark Mode</span>
            </>
          )}
        </button>
      </div>

      {/* Decorative gradient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-teal-500/10 dark:bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-[#0e1526]/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-slate-200/60 dark:shadow-emerald-950/40 animate-in fade-in zoom-in-95 duration-200 transition-colors">
        
        {/* Brand Header */}
        <div className="text-center pb-6 border-b border-slate-100 dark:border-slate-800/80">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-xl shadow-emerald-600/25 mb-3.5 ring-4 ring-emerald-500/10">
            <Coffee className="h-8 w-8" />
          </div>

          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              {settings?.storeName || "KASIR POS"}
            </span>
            <span className="rounded-md bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 px-2 py-0.5 text-[10px] font-extrabold tracking-wider">
              POS PRO
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            {settings?.tagline || "Point of Sale System"}
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60">
            <Database className={`h-3 w-3 ${syncStatus === "synced" ? "text-emerald-500" : syncStatus === "syncing" ? "text-amber-500 animate-spin" : "text-slate-400"}`} />
            <span>
              {syncStatus === "synced" 
                ? (settings?.language === "en" ? "Server Database Connected" : "Server Database Terhubung")
                : syncStatus === "syncing"
                ? (settings?.language === "en" ? "Syncing Server..." : "Menyinkronkan Server...")
                : t.auth.offlineBadge}
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="pt-5 pb-2 text-center">
          <h1 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-center gap-1.5">
            <Lock className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
            <span>{t.auth.screenTitle}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t.auth.screenSubtitle}
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mt-3 rounded-xl border border-rose-200 dark:border-rose-500/40 bg-rose-50 dark:bg-rose-950/50 p-3.5 text-xs text-rose-700 dark:text-rose-200 flex items-start gap-2.5 animate-in fade-in duration-150">
            <AlertCircle className="h-4 w-4 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form (Strict Manual Input Only - No Quick Login) */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {t.auth.usernameLabel}
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                required
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t.auth.usernamePlaceholder}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 pl-10 pr-4 py-2.5 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {t.auth.passwordLabel}
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.auth.passwordPlaceholder}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 pl-10 pr-10 py-2.5 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-white transition"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3 text-xs font-black text-white shadow-lg shadow-emerald-600/25 active:scale-[0.99] transition disabled:opacity-50"
          >
            <span>
              {loading
                ? t.auth.loadingVerify
                : t.auth.submitBtn.replace("{store}", settings?.storeName || "Kasir")}
            </span>
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            {t.auth.copyright.replace("{store}", settings?.storeName || "Smart POS")}
          </p>
        </div>

      </div>
    </div>
  );
};
