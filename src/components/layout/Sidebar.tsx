"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePosStore } from "@/store/usePosStore";
import { useTranslation } from "@/lib/translations";
import {
  LayoutDashboard,
  ShoppingCart,
  Coffee,
  Package,
  Receipt,
  Users,
  BarChart3,
  Settings,
  Clock,
  X
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { currentUser, setShiftModalOpen, orders, currentShift, settings } = usePosStore();
  const { t, language } = useTranslation();

  const isOwner = currentUser?.role === "owner";
  const openBills = orders.filter((o) => o.status === "open_bill").length;

  const allNavItems = [
    {
      title: t.nav.dashboard,
      href: "/",
      icon: LayoutDashboard,
      badge: null,
      ownerOnly: false,
    },
    {
      title: t.nav.pos,
      href: "/pos",
      icon: ShoppingCart,
      badge: t.nav.mainBadge,
      ownerOnly: false,
    },
    {
      title: t.nav.transactions,
      href: "/transactions",
      icon: Receipt,
      badge: openBills > 0 ? `${openBills} ${t.nav.openSuffix}` : null,
      ownerOnly: false,
    },
    {
      title: t.nav.customers,
      href: "/customers",
      icon: Users,
      badge: null,
      ownerOnly: false,
    },
    {
      title: t.nav.products,
      href: "/products",
      icon: Coffee,
      badge: t.nav.ownerBadge,
      ownerOnly: true,
    },
    {
      title: t.nav.inventory,
      href: "/inventory",
      icon: Package,
      badge: t.nav.ownerBadge,
      ownerOnly: true,
    },
    {
      title: t.nav.reports,
      href: "/reports",
      icon: BarChart3,
      badge: t.nav.ownerBadge,
      ownerOnly: true,
    },
    {
      title: t.nav.settings,
      href: "/settings",
      icon: Settings,
      badge: t.nav.ownerBadge,
      ownerOnly: true,
    },
  ];

  const navItems = allNavItems.filter((item) => !item.ownerOnly || isOwner);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0e1422] transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand / Header in Mobile */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-slate-100 dark:border-slate-800 lg:hidden">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-xs shrink-0">
              {settings?.storeName ? settings.storeName.replace(/[^a-zA-Z0-9]/g, "").slice(0, 3).toUpperCase() : "POS"}
            </div>
            <span className="font-bold text-slate-900 dark:text-white truncate max-w-[150px]">
              {settings?.storeName || "KASIR POS"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Menu Operasional
          </div>

          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-xs font-bold"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                      isActive ? "text-white" : "text-slate-400 dark:text-slate-400 group-hover:text-emerald-500"
                    }`}
                  />
                  <span>{item.title}</span>
                </div>

                {item.badge && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : item.badge.includes("Open")
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 animate-pulse"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Bottom Shift Widget */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800">
          <div
            onClick={() => setShiftModalOpen(true)}
            className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50 p-3 hover:border-emerald-300 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-emerald-700/50 transition-all group"
          >
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-200">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{language === "en" ? "Shift Status" : "Status Shift"}</span>
              </div>
              <span
                className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                  currentShift && currentShift.status === "open"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                    : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                }`}
              >
                {currentShift && currentShift.status === "open" ? (language === "en" ? "ACTIVE" : "AKTIF") : "OFF"}
              </span>
            </div>
            
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {currentShift && currentShift.status === "open"
                ? `${language === "en" ? "Cashier:" : "Kasir:"} ${currentShift.cashierName}`
                : (language === "en" ? "Click to open new shift" : "Klik untuk buka shift baru")}
            </p>

            <div className="mt-2 flex items-center justify-between text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold group-hover:underline">
              <span>{language === "en" ? "Manage Shift & Drawer" : "Kelola Shift & Laci"}</span>
              <span>&rarr;</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
