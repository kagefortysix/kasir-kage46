"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePosStore } from "@/store/usePosStore";
import {
  ShoppingCart,
  Receipt,
  LayoutDashboard,
  Package,
  Coffee,
  Users
} from "lucide-react";

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const { cart, orders, currentUser } = usePosStore();

  const isOwner = currentUser?.role === "owner";
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const openBillsCount = orders.filter((o) => o.status === "open_bill").length;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-[#0b0f19]/95 lg:hidden pb-safe">
      <div className="flex h-16 items-center justify-around px-2">
        
        <Link
          href="/"
          className={`flex flex-col items-center justify-center w-14 py-1 text-[10px] font-medium transition ${
            pathname === "/"
              ? "text-emerald-600 dark:text-emerald-400 font-bold"
              : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <LayoutDashboard className="h-5 w-5 mb-0.5" />
          <span>Dashboard</span>
        </Link>

        <Link
          href="/pos"
          className={`relative flex flex-col items-center justify-center w-14 py-1 text-[10px] font-medium transition ${
            pathname === "/pos"
              ? "text-emerald-600 dark:text-emerald-400 font-bold"
              : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <div className="relative">
            <ShoppingCart className="h-5 w-5 mb-0.5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[9px] font-bold text-white">
                {cartItemCount}
              </span>
            )}
          </div>
          <span>Kasir POS</span>
        </Link>

        <Link
          href="/transactions"
          className={`relative flex flex-col items-center justify-center w-14 py-1 text-[10px] font-medium transition ${
            pathname === "/transactions"
              ? "text-emerald-600 dark:text-emerald-400 font-bold"
              : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <div className="relative">
            <Receipt className="h-5 w-5 mb-0.5" />
            {openBillsCount > 0 && (
              <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[9px] font-bold text-white shadow-xs">
                {openBillsCount}
              </span>
            )}
          </div>
          <span>Transaksi</span>
        </Link>

        {isOwner ? (
          <>
            <Link
              href="/products"
              className={`flex flex-col items-center justify-center w-14 py-1 text-[10px] font-medium transition ${
                pathname === "/products"
                  ? "text-emerald-600 dark:text-emerald-400 font-bold"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              <Coffee className="h-5 w-5 mb-0.5" />
              <span>Produk</span>
            </Link>

            <Link
              href="/inventory"
              className={`flex flex-col items-center justify-center w-14 py-1 text-[10px] font-medium transition ${
                pathname === "/inventory"
                  ? "text-emerald-600 dark:text-emerald-400 font-bold"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              <Package className="h-5 w-5 mb-0.5" />
              <span>Stok</span>
            </Link>
          </>
        ) : (
          <Link
            href="/customers"
            className={`flex flex-col items-center justify-center w-14 py-1 text-[10px] font-medium transition ${
              pathname === "/customers"
                ? "text-emerald-600 dark:text-emerald-400 font-bold"
                : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <Users className="h-5 w-5 mb-0.5" />
            <span>Pelanggan</span>
          </Link>
        )}

      </div>
    </nav>
  );
};
