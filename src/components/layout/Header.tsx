"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePosStore } from "@/store/usePosStore";
import { useTranslation } from "@/lib/translations";
import { 
  Coffee, 
  Sun, 
  Moon, 
  ShieldCheck, 
  User, 
  Clock, 
  PlusCircle, 
  Receipt, 
  Menu,
  ChevronDown,
  LogIn,
  LogOut,
  KeyRound,
  UserCog,
  Languages,
  RefreshCw
} from "lucide-react";

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { 
    role, 
    currentUser,
    logout,
    isDarkMode, 
    toggleDarkMode, 
    currentShift, 
    setShiftModalOpen, 
    setExpenseModalOpen,
    setOpenBillsDrawerOpen,
    orders,
    cart,
    setCartDrawerOpen,
    setEditProfileModalOpen,
    settings,
    syncStatus,
    manualSync
  } = usePosStore();

  const { t, language, toggleLanguage, setLanguage } = useTranslation();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const openBillsCount = orders.filter((o) => o.status === "open_bill").length;
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full max-w-full border-b border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-[#0b0f19]/95 transition-colors">
      <div className="flex h-16 items-center justify-between px-2.5 sm:px-6 w-full max-w-full">
        
        {/* Left: Mobile hamburger & Brand */}
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 shrink">
          <button
            onClick={onToggleSidebar}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden shrink-0"
            aria-label="Toggle Navigation"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group min-w-0">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform shrink-0">
              <Coffee className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-slate-900 dark:text-white text-sm sm:text-base md:text-lg truncate max-w-[105px] xs:max-w-[145px] sm:max-w-[200px] md:max-w-[240px]">
                  {settings?.storeName || "KASIR POS"}
                </span>
                <span className="hidden sm:inline-block rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 shrink-0">
                  POS PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden md:block truncate max-w-[240px]">
                {settings?.tagline || "Point of Sale System"}
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Shift status pill */}
        <div className="hidden md:flex items-center gap-2.5">
          <button
            onClick={() => setShiftModalOpen(true)}
            className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-all ${
              currentShift && currentShift.status === "open"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300"
                : "border-rose-200 bg-rose-50 text-rose-800 hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-300"
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${
              currentShift && currentShift.status === "open"
                ? "bg-emerald-500 animate-pulse"
                : "bg-rose-500"
            }`} />
            <Clock className="h-3.5 w-3.5" />
            <span>
              {currentShift && currentShift.status === "open"
                ? `${t.header.shiftOpen} ${currentShift.cashierName}`
                : t.header.shiftClosed}
            </span>
          </button>

          {/* Quick Expense Button */}
          <button
            onClick={() => setExpenseModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800 transition"
          >
            <PlusCircle className="h-3.5 w-3.5 text-emerald-500" />
            <span>{t.header.recordExpense}</span>
          </button>
        </div>

        {/* Right Actions: Server Sync, Open Bills, Role Switcher, Dark Mode, Cart */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* Server Sync Status Pill */}
          <button
            onClick={() => manualSync()}
            className={`flex items-center gap-1.5 rounded-xl border p-2 sm:px-2.5 sm:py-1.5 text-xs font-semibold transition shrink-0 ${
              syncStatus === "synced"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300 hover:bg-emerald-100"
                : syncStatus === "syncing"
                ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-300 hover:bg-amber-100"
                : "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 hover:bg-slate-100"
            }`}
            title="Database Terhubung ke Server PC (Sinkron Otomatis) - Klik untuk sinkronkan sekarang"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${syncStatus === "syncing" ? "animate-spin text-amber-500" : "text-emerald-500"}`} />
            <span className="hidden lg:inline text-[11px]">
              {syncStatus === "synced" ? "Server PC" : syncStatus === "syncing" ? "Sinkron..." : "Offline"}
            </span>
          </button>

          
          {/* Open Bills Badge */}
          <button
            onClick={() => setOpenBillsDrawerOpen(true)}
            className="relative flex items-center gap-1.5 rounded-xl border border-slate-200 p-2 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-[#111827] dark:text-slate-200 dark:hover:bg-slate-800 transition text-xs font-medium shrink-0"
            title={t.header.openBillsTooltip}
          >
            <Receipt className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden md:inline">{t.header.openBills}</span>
            {openBillsCount > 0 && (
              <span className="flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-emerald-600 text-[9px] sm:text-[10px] font-bold text-white shrink-0">
                {openBillsCount}
              </span>
            )}
          </button>

          {/* User Account & Role Switcher */}
          <div className="relative shrink-0">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className={`flex items-center gap-1.5 rounded-xl border p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-bold transition shrink-0 cursor-pointer ${
                currentUser?.role === "owner"
                  ? "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200 hover:bg-emerald-100"
                  : "border-sky-300 bg-sky-50 text-sky-900 dark:border-sky-700 dark:bg-sky-950/40 dark:text-sky-200 hover:bg-sky-100"
              }`}
              title={`${currentUser?.name || "Kasir"} (${currentUser?.role === "owner" ? "Owner" : "Kasir"}) - Klik untuk opsi akun/logout`}
            >
              {/* User Avatar badge (always visible) */}
              <div className="relative flex items-center justify-center">
                <div className={`h-6 w-6 rounded-lg flex items-center justify-center text-[11px] font-black uppercase text-white shadow-xs ${
                  currentUser?.role === "owner" ? "bg-emerald-600" : "bg-sky-600"
                }`}>
                  {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-white dark:border-slate-900 ${
                  currentUser?.role === "owner" ? "bg-emerald-400" : "bg-sky-400"
                }`} />
              </div>

              {/* Text label: hidden on mobile (< sm), shown on tablet/desktop */}
              <div className="hidden sm:flex flex-col items-start leading-tight">
                <span className="font-bold text-[11px] truncate max-w-[90px] sm:max-w-[120px]">
                  {currentUser?.name || "Kasir"}
                </span>
                <span className="text-[9px] opacity-75 uppercase tracking-wide">
                  {currentUser?.role === "owner" ? "Owner" : "Kasir"}
                </span>
              </div>
              <ChevronDown className="h-3 w-3 opacity-60 ml-0.5 hidden sm:block" />
            </button>

            {roleDropdownOpen && (
              <>
                {/* Backdrop overlay */}
                <div 
                  className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]" 
                  onClick={() => setRoleDropdownOpen(false)} 
                />

                {/* Dropdown Menu */}
                <div 
                  className="absolute right-0 top-full mt-2 w-64 max-w-[calc(100vw-1.5rem)] rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl dark:border-slate-800 dark:bg-[#111827] z-50 animate-in fade-in zoom-in-95 duration-100"
                >
                  {/* Current User Card */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 mb-2.5 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`h-8 w-8 rounded-xl flex items-center justify-center text-xs font-black uppercase text-white shadow-xs shrink-0 ${
                          currentUser?.role === "owner" ? "bg-emerald-600" : "bg-sky-600"
                        }`}>
                          {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {currentUser?.name || "Kasir"}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono truncate">
                            @{currentUser?.username || "kasir"}
                          </div>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase shrink-0 ${
                        currentUser?.role === "owner"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300"
                      }`}>
                        {currentUser?.role || "cashier"}
                      </span>
                    </div>
                  </div>

                  {/* Language Selector inside dropdown */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 mb-2 border border-slate-100 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-semibold">
                      <Languages className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      <span>{t.header.language}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-slate-200/80 dark:bg-slate-700 p-0.5 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setLanguage("id")}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                          language === "id" 
                            ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs" 
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        🇮🇩 ID
                      </button>
                      <button
                        type="button"
                        onClick={() => setLanguage("en")}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                          language === "en" 
                            ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs" 
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        🇺🇸 EN
                      </button>
                    </div>
                  </div>

                  {/* Edit Profile & Password Trigger */}
                  <button
                    onClick={() => {
                      setRoleDropdownOpen(false);
                      setEditProfileModalOpen(true);
                    }}
                    className="w-full mb-2 flex items-center justify-center gap-2 rounded-xl py-2 px-3 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 transition cursor-pointer"
                  >
                    <UserCog className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{t.header.editProfile}</span>
                  </button>

                  {/* Logout Button */}
                  <button
                    onClick={() => {
                      setRoleDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-98 transition shadow-xs cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>{t.header.logout}</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Quick Language Toggle Pill */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-[#111827] dark:text-slate-200 dark:hover:bg-slate-800 transition shrink-0 cursor-pointer shadow-2xs"
            title={language === "id" ? t.header.switchToEn : t.header.switchToId}
            aria-label="Toggle Language"
          >
            <span className="text-xs">
              {language === "id" ? "🇮🇩" : "🇺🇸"}
            </span>
            <span className="text-[10px] font-black uppercase text-slate-800 dark:text-slate-200">
              {language === "id" ? "ID" : "EN"}
            </span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-[#111827] dark:text-slate-200 dark:hover:bg-slate-800 transition shrink-0 cursor-pointer"
            aria-label="Toggle Theme"
            title={isDarkMode ? t.header.switchThemeLight : t.header.switchThemeDark}
          >
            {isDarkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
          </button>

          {/* Cart Mobile Quick Trigger */}
          <button
            onClick={() => setCartDrawerOpen(true)}
            className="relative flex items-center justify-center rounded-xl bg-emerald-600 p-2 text-white shadow-xs hover:bg-emerald-700 lg:hidden shrink-0 cursor-pointer"
            aria-label={t.header.cart}
          >
            <Coffee className="h-4 w-4" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-slate-900 text-[9px] sm:text-[10px] font-bold text-white border-2 border-white dark:border-slate-900">
                {cartItemCount}
              </span>
            )}
          </button>

        </div>
      </div>
    </header>
  );
};
