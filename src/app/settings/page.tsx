"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { usePosStore } from "@/store/usePosStore";
import { StoreSettings, UserAccount, AppLanguage } from "@/types/pos";
import { initialSettings } from "@/data/mockData";
import { UserFormModal } from "@/components/auth/UserFormModal";
import { useTranslation } from "@/lib/translations";
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
  Lock,
  Edit2,
  Languages,
  Database,
  UploadCloud,
  FileDown,
  FileUp,
  Globe,
  RefreshCw
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
    addToast,
    language,
    setLanguage,
    syncStatus,
    manualSync,
    pushLocalToServer,
    pullServerToLocal
  } = usePosStore();

  const { t, isEnglish } = useTranslation();

  const isOwner = currentUser?.role === "owner";

  const [formData, setFormData] = useState<StoreSettings>(settings);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<UserAccount | null>(null);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
  };

  const handleStoreNameChange = (newName: string) => {
    const oldName = formData.storeName;
    let newFooter = formData.receiptFooterMessage;
    let newWifi = formData.wifiName;
    let newQris = formData.qrisMerchantName;

    // Auto-update receipt footer message if it contains old name or legacy 'KAGE46'
    if (oldName && newFooter.includes(oldName)) {
      newFooter = newFooter.replaceAll(oldName, newName);
    } else if (newFooter.includes("KAGE46")) {
      newFooter = newFooter.replaceAll("KAGE46", newName);
    }

    // Auto-update WiFi SSID if it follows standard pattern or legacy 'KAGE46_GUEST'
    const oldClean = oldName.replace(/[^a-zA-Z0-9]/g, "_").toUpperCase();
    const newClean = newName.replace(/[^a-zA-Z0-9]/g, "_").toUpperCase();
    if (newWifi === `${oldClean}_GUEST` || newWifi === "KAGE46_GUEST") {
      newWifi = newClean ? `${newClean}_GUEST` : "";
    }

    // Auto-update QRIS merchant name
    if (oldName && newQris.includes(oldName)) {
      newQris = newQris.replaceAll(oldName, newName);
    } else if (newQris.includes("KAGE46")) {
      newQris = newQris.replaceAll("KAGE46", newName);
    }

    setFormData((prev) => ({
      ...prev,
      storeName: newName,
      receiptFooterMessage: newFooter,
      wifiName: newWifi,
      qrisMerchantName: newQris,
    }));
  };

  const handleLanguageChange = (newLang: AppLanguage) => {
    setLanguage(newLang);
    setFormData((prev) => ({ ...prev, language: newLang }));
  };

  const handleReset = async () => {
    if (confirm(t.settings.confirmReset)) {
      setFormData(initialSettings);
      await resetAllData();
    }
  };

  const handleLoadDemo = async () => {
    if (confirm(t.settings.confirmLoadDemo)) {
      setFormData(initialSettings);
      await loadDemoData();
    }
  };

  const handleDeleteUserAccount = (userId: string, userName: string) => {
    const confirmMsg = t.settings.deleteAccountConfirm.replace("{name}", userName);
    if (confirm(confirmMsg)) {
      deleteUser(userId);
      addToast(
        language === "en" ? `Account "${userName}" deleted successfully.` : `Akun kasir "${userName}" berhasil dihapus.`,
        "info"
      );
    }
  };

  const handleDownloadBackup = () => {
    window.open("/api/sync/backup", "_blank");
  };

  const handleRestoreBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const json = JSON.parse(text);
      if (!confirm(isEnglish ? "Restore database from this backup file? Current data will be replaced." : "Pulihkan database dari file cadangan ini? Data saat ini akan digantikan.")) {
        return;
      }
      const res = await fetch("/api/sync/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(json),
      });
      if (res.ok) {
        addToast(isEnglish ? "Database restored successfully from file!" : "Database berhasil dipulihkan dari file!", "success");
        setTimeout(() => window.location.reload(), 600);
      } else {
        addToast(isEnglish ? "Failed to restore database from file" : "Gagal memulihkan database dari file", "error");
      }
    } catch (err) {
      addToast(isEnglish ? "Invalid or corrupted backup JSON file" : "File cadangan tidak valid atau rusak", "error");
    }
  };

  return (
    <AppShell>
      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto w-full pb-24 lg:pb-12">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 w-full">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex flex-wrap items-center gap-2">
              <span>{t.settings.pageTitle}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {formData.storeName || settings.storeName || "KASIR POS"} — {t.settings.pageSubtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleLoadDemo}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition shrink-0"
              title={t.settings.loadDemo}
            >
              <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
              <span>{t.settings.loadDemo}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 hover:border-rose-300 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-300 transition shadow-xs shrink-0"
              title={t.settings.clearData}
            >
              <Trash2 className="h-3.5 w-3.5 text-rose-600" />
              <span>{t.settings.clearData}</span>
            </button>
          </div>
        </div>

        {/* SECTION: PENGATURAN BAHASA SISTEM / SYSTEM LANGUAGE */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white font-bold shadow-md shadow-sky-600/20 shrink-0">
                <Languages className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{t.settings.langCardTitle}</span>
                  <span className="rounded bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-800 dark:bg-sky-950/60 dark:text-sky-300">
                    ID / EN
                  </span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t.settings.langCardDesc}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
                {t.settings.activeBadge}:
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                {language === "id" ? "🇮🇩 Bahasa Indonesia" : "🇺🇸 English (US)"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Indonesian Option */}
            <button
              type="button"
              onClick={() => handleLanguageChange("id")}
              className={`flex items-start gap-3.5 p-4 rounded-xl border text-left transition-all cursor-pointer relative ${
                language === "id"
                  ? "border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/30 dark:border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs"
                  : "border-slate-200 bg-slate-50/50 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800/80"
              }`}
            >
              <div className="text-2xl sm:text-3xl shrink-0 p-1.5 rounded-lg bg-white dark:bg-slate-800 shadow-xs border border-slate-200/60 dark:border-slate-700">
                🇮🇩
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {t.settings.langIdName}
                  </span>
                  {language === "id" && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>{t.settings.activeStatus}</span>
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {t.settings.langIdDesc}
                </p>
                <div className="mt-2.5 flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
                  <span className="px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                    IDR (Rp)
                  </span>
                  <span>•</span>
                  <span>Meja / Kasir / Struk</span>
                </div>
              </div>
            </button>

            {/* English Option */}
            <button
              type="button"
              onClick={() => handleLanguageChange("en")}
              className={`flex items-start gap-3.5 p-4 rounded-xl border text-left transition-all cursor-pointer relative ${
                language === "en"
                  ? "border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/30 dark:border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs"
                  : "border-slate-200 bg-slate-50/50 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800/80"
              }`}
            >
              <div className="text-2xl sm:text-3xl shrink-0 p-1.5 rounded-lg bg-white dark:bg-slate-800 shadow-xs border border-slate-200/60 dark:border-slate-700">
                🇺🇸
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {t.settings.langEnName}
                  </span>
                  {language === "en" && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>{t.settings.activeStatus}</span>
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {t.settings.langEnDesc}
                </p>
                <div className="mt-2.5 flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
                  <span className="px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                    USD / IDR
                  </span>
                  <span>•</span>
                  <span>Tables / Cashier / Receipt</span>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* SECTION: SERVER DATABASE & SINKRONISASI MULTI-DEVICE (CLOUDFLARE TUNNEL / LAN) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold shadow-md shadow-emerald-600/20 shrink-0">
                <Database className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{isEnglish ? "PC Server Database & Multi-Device Sync" : "Database Server PC & Sinkronisasi Multi-Device"}</span>
                  <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    Cloudflare Tunnel Ready
                  </span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isEnglish 
                    ? "Central database ensures all devices (local PC, Wi-Fi smartphones, Cloudflare Tunnel) stay 100% in sync."
                    : "Database terpusat memastikan PC kasir, HP pelayan via Wi-Fi lokal, dan Cloudflare Tunnel membaca data yang sama persis."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                syncStatus === "synced"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                  : syncStatus === "syncing"
                  ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
                  : "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
              }`}>
                <span className={`h-2 w-2 rounded-full ${
                  syncStatus === "synced" ? "bg-emerald-500 animate-pulse" : syncStatus === "syncing" ? "bg-amber-500 animate-spin" : "bg-slate-400"
                }`} />
                <span>
                  {syncStatus === "synced"
                    ? (isEnglish ? "Server Active & Synced" : "Server Aktif & Tersinkron")
                    : syncStatus === "syncing"
                    ? (isEnglish ? "Syncing with Server..." : "Menyinkronkan...")
                    : (isEnglish ? "Offline Mode" : "Mode Offline")}
                </span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Sync Now */}
            <button
              type="button"
              onClick={() => manualSync()}
              className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 dark:border-slate-800 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/20 transition text-left cursor-pointer"
            >
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                <RefreshCw className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {isEnglish ? "Sync Now" : "Sinkronkan Sekarang"}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  {isEnglish ? "Pull latest server updates" : "Cek pembaruan server"}
                </div>
              </div>
            </button>

            {/* Push Local to Server */}
            <button
              type="button"
              onClick={() => pushLocalToServer()}
              className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:border-sky-500 hover:bg-sky-50/40 dark:border-slate-800 dark:hover:border-sky-700 dark:hover:bg-sky-950/20 transition text-left cursor-pointer"
            >
              <div className="p-2 rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400">
                <UploadCloud className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {isEnglish ? "Upload to Server" : "Unggah ke Server PC"}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  {isEnglish ? "Make this device master" : "Jadikan data perangkat master"}
                </div>
              </div>
            </button>

            {/* Download Backup */}
            <button
              type="button"
              onClick={handleDownloadBackup}
              className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/40 dark:border-slate-800 dark:hover:border-indigo-700 dark:hover:bg-indigo-950/20 transition text-left cursor-pointer"
            >
              <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400">
                <FileDown className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {isEnglish ? "Download Backup" : "Unduh Cadangan (.json)"}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  {isEnglish ? "Save DB snapshot to file" : "Simpan file backup toko"}
                </div>
              </div>
            </button>

            {/* Restore from File */}
            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/40 dark:border-slate-800 dark:hover:border-amber-700 dark:hover:bg-amber-950/20 transition text-left cursor-pointer">
              <input
                type="file"
                accept=".json"
                onChange={handleRestoreBackup}
                className="hidden"
              />
              <div className="p-2 rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
                <FileUp className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {isEnglish ? "Restore Database" : "Pulihkan Cadangan"}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  {isEnglish ? "Upload .json backup file" : "Pilih file .json cadangan"}
                </div>
              </div>
            </label>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed flex items-start gap-2">
            <Globe className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <strong>{isEnglish ? "Multi-Device & Cloudflare Tunnel Architecture:" : "Arsitektur Multi-Device & Cloudflare Tunnel:"}</strong>{" "}
              {isEnglish
                ? "Every transaction, new product, and user password is automatically stored on this computer's server disk. Any device opening the Cloudflare Tunnel URL or local Wi-Fi IP connects directly to this server without creating separate databases."
                : "Setiap transaksi, menu baru, dan password kasir disimpan di disk komputer server ini. Perangkat yang mengakses via URL Cloudflare Tunnel atau IP Wi-Fi lokal otomatis terhubung langsung ke server ini tanpa membuat database terpisah."}
            </div>
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
                  <span>{t.settings.userCardTitle}</span>
                  <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    {t.settings.onlyOwner}
                  </span>
                </h2>
                <p className="text-xs text-slate-500">
                  {t.settings.userCardSubtitle}
                </p>
              </div>
            </div>

            {isOwner ? (
              <button
                type="button"
                onClick={() => {
                  setUserToEdit(null);
                  setIsUserModalOpen(true);
                }}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition shrink-0"
              >
                <UserPlus className="h-4 w-4" />
                <span>{t.settings.createCashier}</span>
              </button>
            ) : (
              <span className="text-xs text-amber-600 font-semibold flex items-center gap-1">
                <Lock className="h-3.5 w-3.5" />
                <span>{t.settings.cashierModeNotice}</span>
              </span>
            )}
          </div>

          {/* User List Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3">{t.settings.thEmployeeName}</th>
                  <th className="p-3">{t.settings.thUsername}</th>
                  <th className="p-3">{t.settings.thPassword}</th>
                  <th className="p-3">{t.settings.thRole}</th>
                  <th className="p-3">{t.settings.thStatus}</th>
                  <th className="p-3 text-right">{t.settings.thAction}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
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
                        {u.role === "owner" ? t.userModal.roleOwner : t.userModal.roleCashier}
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
                        {u.isActive ? (isEnglish ? "Active (Can Login)" : "Aktif (Bisa Login)") : (isEnglish ? "Inactive" : "Nonaktif")}
                      </button>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {isOwner && (
                          <button
                            type="button"
                            onClick={() => {
                              setUserToEdit(u);
                              setIsUserModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 transition cursor-pointer"
                            title={isEnglish ? `Edit name, username & password for ${u.name}` : `Edit nama, username & password akun ${u.name}`}
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                        )}
                        {u.role !== "owner" && isOwner ? (
                          <button
                            type="button"
                            onClick={() => handleDeleteUserAccount(u.id, u.name)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-800 transition cursor-pointer"
                            title={isEnglish ? "Delete this cashier account" : "Hapus akun kasir ini"}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        ) : null}
                      </div>
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
                {t.settings.storeCardTitle}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.settings.storeName}
                </label>
                <input
                  type="text"
                  required
                  value={formData.storeName}
                  onChange={(e) => handleStoreNameChange(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-900 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  {isEnglish
                    ? "Changing the name here automatically updates the system header, receipts, and store brand throughout the app."
                    : "Mengubah nama di sini otomatis memperbarui header sistem, struk printer kasir, dan identitas seluruh aplikasi."}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.settings.tagline}
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.settings.address}
              </label>
              <textarea
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.settings.phone}
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-900 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.settings.instagram}
                </label>
                <input
                  type="text"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.settings.tiktok}
                </label>
                <input
                  type="text"
                  value={formData.tiktok}
                  onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            {/* WiFi Credentials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.settings.wifiName}
                </label>
                <input
                  type="text"
                  value={formData.wifiName}
                  onChange={(e) => setFormData({ ...formData, wifiName: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-900 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.settings.wifiPassword}
                </label>
                <input
                  type="text"
                  value={formData.wifiPassword}
                  onChange={(e) => setFormData({ ...formData, wifiPassword: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-900 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Format Struk Thermal & Pajak */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Receipt className="h-5 w-5 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {t.settings.receiptCardTitle}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.settings.receiptWidth}
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
                    {t.settings.printer58}
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
                    {t.settings.printer80}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.settings.taxRate}
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={formData.taxPercentage}
                      onChange={(e) => setFormData({ ...formData, taxPercentage: Number(e.target.value) })}
                      className="w-24 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 pr-7 text-xs font-bold text-slate-900 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
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
                    <span>
                      {formData.taxEnabled
                        ? (isEnglish ? "VAT Enabled by Default at Cashier" : "Pajak PPN Aktif Secara Default di Kasir")
                        : (isEnglish ? "VAT Disabled (Tax Free)" : "Pajak PPN Nonaktif (Bebas Pajak)")}
                    </span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {isEnglish
                    ? `When enabled, new cashier orders automatically include ${formData.taxPercentage}% VAT. Cashier can still toggle VAT per transaction.`
                    : `Jika diaktifkan, pesanan baru di kasir otomatis memuat PPN ${formData.taxPercentage}%. Kasir tetap dapat menonaktifkan PPN secara fleksibel per transaksi.`}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.settings.receiptFooter}
              </label>
              <textarea
                rows={2}
                value={formData.receiptFooterMessage}
                onChange={(e) => setFormData({ ...formData, receiptFooterMessage: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Card 3: Non-Cash Payment Details */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Building2 className="h-5 w-5 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {t.settings.paymentCardTitle}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.settings.bankName}
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
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.settings.accountNumber}
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
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.settings.accountHolder}
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
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.settings.qrisName}
              </label>
              <input
                type="text"
                value={formData.qrisMerchantName}
                onChange={(e) => setFormData({ ...formData, qrisMerchantName: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-900 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
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
              <span>{t.settings.saveAllSettings}</span>
            </button>
          </div>

        </form>

        <UserFormModal
          isOpen={isUserModalOpen}
          onClose={() => {
            setIsUserModalOpen(false);
            setUserToEdit(null);
          }}
          userToEdit={userToEdit}
        />

      </div>
    </AppShell>
  );
}
