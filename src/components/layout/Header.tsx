"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePosStore } from "@/store/usePosStore";
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
  KeyRound
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
    setCartDrawerOpen
  } = usePosStore();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const openBillsCount = orders.filter((o) => o.status === "open_bill").length;
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-[#0b0f19]/95 transition-colors">
      <div className="flex h-16 items-center justify-between px-3 sm:px-6">
        
        {/* Left: Mobile hamburger & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Toggle Navigation"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Coffee className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-slate-900 dark:text-white text-base sm:text-lg">
                  KAGE<span className="text-emerald-500">46</span>
                </span>
                <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  POS PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Specialty Coffee & Eatery
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
                ? `Shift: ${currentShift.cashierName}`
                : "Shift Ditutup"}
            </span>
          </button>

          {/* Quick Expense Button */}
          <button
            onClick={() => setExpenseModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800 transition"
          >
            <PlusCircle className="h-3.5 w-3.5 text-emerald-500" />
            <span>Catat Beban Kas</span>
          </button>
        </div>

        {/* Right Actions: Open Bills, Role Switcher, Dark Mode, Cart */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* Open Bills Badge */}
          <button
            onClick={() => setOpenBillsDrawerOpen(true)}
            className="relative flex items-center gap-1.5 rounded-xl border border-slate-200 p-2 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-[#111827] dark:text-slate-200 dark:hover:bg-slate-800 transition text-xs font-medium"
            title="Daftar Open Bill / Meja Aktif"
          >
            <Receipt className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Open Bill</span>
            {openBillsCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                {openBillsCount}
              </span>
            )}
          </button>

          {/* User Account & Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-bold transition ${
                currentUser?.role === "owner"
                  ? "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200"
                  : "border-sky-300 bg-sky-50 text-sky-900 dark:border-sky-700 dark:bg-sky-950/40 dark:text-sky-200"
              }`}
            >
              <div className={`h-2 w-2 rounded-full ${currentUser?.role === "owner" ? "bg-emerald-500" : "bg-sky-500"}`} />
              <div className="flex flex-col items-start leading-tight">
                <span className="font-bold text-[11px] truncate max-w-[90px] sm:max-w-[120px]">
                  {currentUser?.name || "Kasir"}
                </span>
                <span className="text-[9px] opacity-75 uppercase tracking-wide">
                  {currentUser?.role === "owner" ? "Owner" : "Kasir"}
                </span>
              </div>
              <ChevronDown className="h-3 w-3 opacity-60 ml-0.5" />
            </button>

            {roleDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-slate-800 dark:bg-[#111827] z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setRoleDropdownOpen(false)}
              >
                {/* Current User Card */}
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 mb-2 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {currentUser?.name || "Kasir"}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                      currentUser?.role === "owner"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                        : "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300"
                    }`}>
                      {currentUser?.role || "cashier"}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    @{currentUser?.username || "kasir"}
                  </div>
                </div>

                {/* Login / Switch Account Action */}
                {/* Logout Button */}
                <button
                  onClick={() => logout()}
                  className="w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition text-left"
                >
                  <LogOut className="h-4 w-4 text-rose-500" />
                  <span>Keluar dari Akun (Logout)</span>
                </button>
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-[#111827] dark:text-slate-200 dark:hover:bg-slate-800 transition"
            aria-label="Toggle Theme"
            title={isDarkMode ? "Beralih ke Light Mode" : "Beralih ke Dark Mode"}
          >
            {isDarkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
          </button>

          {/* Cart Mobile Quick Trigger */}
          <button
            onClick={() => setCartDrawerOpen(true)}
            className="relative flex items-center justify-center rounded-xl bg-emerald-600 p-2 text-white shadow-xs hover:bg-emerald-700 lg:hidden"
            aria-label="Buka Keranjang"
          >
            <Coffee className="h-4 w-4" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white border-2 border-white dark:border-slate-900">
                {cartItemCount}
              </span>
            )}
          </button>

        </div>
      </div>
    </header>
  );
};
