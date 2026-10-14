"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePosStore } from "@/store/usePosStore";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { MobileBottomNav } from "./MobileBottomNav";
import { ShiftModal } from "../shared/ShiftModal";
import { ExpenseModal } from "../shared/ExpenseModal";
import { OpenBillsDrawer } from "../shared/OpenBillsDrawer";
import { ReceiptModal } from "../pos/ReceiptModal";
import { ToastContainer } from "../shared/ToastContainer";
import { CartPane } from "../pos/CartPane";
import { LoginScreen } from "../auth/LoginScreen";
import { EditProfileModal } from "../auth/EditProfileModal";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { syncService } from "@/lib/syncService";

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDarkMode, currentUser, settings } = usePosStore();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    syncService.init();

    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    if (settings?.storeName && typeof document !== "undefined") {
      document.title = `${settings.storeName} • Modern Point of Sale`;
    }
  }, [isDarkMode, settings?.storeName]);

  // Loading skeleton while hydrating store from localStorage
  if (!mounted) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-emerald-600 animate-pulse flex items-center justify-center font-black text-xl shadow-lg shadow-emerald-600/30">
            {settings?.storeName ? settings.storeName.replace(/[^a-zA-Z0-9]/g, "").slice(0, 3).toUpperCase() : "POS"}
          </div>
          <div className="text-xs font-bold tracking-widest text-slate-300 uppercase">
            Memuat {settings?.storeName || "KASIR POS"}...
          </div>
        </div>
      </div>
    );
  }

  // Strict Authentication Barrier: When logged out, lock the entire application!
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#080d1a] text-slate-900 dark:text-white font-sans transition-colors">
        <LoginScreen />
        <ToastContainer />
      </div>
    );
  }

  // Role Access Enforcement: Cashiers cannot access owner-only pages (reports, settings, products, inventory)
  const isOwner = currentUser.role === "owner";
  const isOwnerOnlyPage =
    pathname === "/reports" ||
    pathname === "/settings" ||
    pathname === "/products" ||
    pathname === "/inventory";

  if (!isOwner && isOwnerOnlyPage) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 font-sans transition-colors w-full max-w-full overflow-x-hidden">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex flex-1 overflow-hidden w-full max-w-full">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="flex-1 flex flex-col items-center justify-center p-6 text-center w-full max-w-full min-w-0">
            <div className="max-w-md p-6 sm:p-8 rounded-3xl border border-amber-200 bg-white shadow-xl dark:border-amber-900/50 dark:bg-slate-900 space-y-4">
              <div className="mx-auto h-14 w-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <ShieldAlert className="h-7 w-7" />
              </div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Akses Terbatas: Khusus Akun Owner</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Halaman ini (Resep HPP, Inventori Stok, Laporan Finansial & Pengaturan) dikhususkan untuk <strong>Owner</strong>. Akun Anda saat ini masuk sebagai <strong>Kasir</strong>.
              </p>
              <div className="pt-2">
                <Link
                  href="/pos"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Kembali ke Kasir POS</span>
                </Link>
              </div>
            </div>
          </main>
        </div>
        <ToastContainer />
      </div>
    );
  }

  const isPosPage = pathname === "/pos";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 font-sans transition-colors w-full max-w-full overflow-x-hidden">
      
      {/* Top Header */}
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Layout Area */}
      <div className="flex flex-1 overflow-hidden w-full max-w-full">
        
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Content Page: If on POS, prevent outer scroll so cart & catalog fit in viewport */}
        <main
          className={`flex-1 flex flex-col min-w-0 w-full max-w-full ${
            isPosPage ? "h-[calc(100dvh-4rem)] overflow-hidden" : "overflow-y-auto overflow-x-hidden"
          }`}
        >
          {children}
        </main>

      </div>

      {/* Mobile Cart Drawer (Global trigger) */}
      <CartPane isMobileDrawer={true} />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Global Shared Modals */}
      <ShiftModal />
      <ExpenseModal />
      <OpenBillsDrawer />
      <ReceiptModal />
      <EditProfileModal />

      {/* Toasts */}
      <ToastContainer />

    </div>
  );
};
