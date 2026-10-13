"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ProductGrid } from "@/components/pos/ProductGrid";
import { CartPane } from "@/components/pos/CartPane";
import { CheckoutModal } from "@/components/pos/CheckoutModal";
import { usePosStore } from "@/store/usePosStore";
import { formatRupiah } from "@/lib/utils";
import { ShoppingCart, Coffee, ArrowRight } from "lucide-react";

export default function PosPage() {
  const { cart, discountNominal, taxEnabled, settings } = usePosStore();
  
  // Mobile view state: "menu" | "cart"
  const [mobileTab, setMobileTab] = useState<"menu" | "cart">("menu");

  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxRate = taxEnabled ? settings.taxPercentage / 100 : 0;
  const taxNominal = Math.round((subtotal - discountNominal) * taxRate);
  const total = Math.max(0, subtotal - discountNominal + taxNominal);

  return (
    <AppShell>
      <div className="flex flex-col flex-1 h-[calc(100dvh-4rem)] overflow-hidden">
        
        {/* Mobile View Switcher (Only visible on screens < md) */}
        <div className="md:hidden shrink-0 px-3 pt-2 pb-1.5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]">
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setMobileTab("menu")}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition ${
                mobileTab === "menu"
                  ? "bg-white text-slate-900 shadow-2xs dark:bg-[#111827] dark:text-white"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <Coffee className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Katalog Menu</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileTab("cart")}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition relative ${
                mobileTab === "cart"
                  ? "bg-emerald-600 text-white shadow-2xs font-extrabold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Keranjang ({totalQty})</span>
              {totalQty > 0 && mobileTab !== "cart" && (
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping absolute top-1.5 right-2" />
              )}
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 min-h-0 overflow-hidden relative">
          
          {/* Menu Catalog Column */}
          <div
            className={`flex-1 h-full min-h-0 overflow-hidden ${
              mobileTab === "cart" ? "hidden md:block" : "block"
            }`}
          >
            <ProductGrid />
          </div>

          {/* Cart Column (Docked on tablet/desktop, toggled on mobile) */}
          <div
            className={`w-full md:w-80 lg:w-[380px] xl:w-[420px] shrink-0 h-full min-h-0 overflow-hidden ${
              mobileTab === "menu" ? "hidden md:block" : "block"
            }`}
          >
            <CartPane isMobileDrawer={false} />
          </div>

        </div>

        {/* Mobile Floating Bar if on Menu tab and items in cart */}
        {mobileTab === "menu" && totalQty > 0 && (
          <div className="md:hidden fixed bottom-16 left-3 right-3 z-30 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <button
              onClick={() => setMobileTab("cart")}
              className="flex w-full items-center justify-between rounded-xl bg-emerald-600 px-4 py-3 text-white shadow-lg shadow-emerald-600/30 active:scale-[0.99] transition-all"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
                  {totalQty}
                </div>
                <div className="text-left leading-tight">
                  <div className="text-[11px] text-emerald-100">Keranjang Aktif</div>
                  <div className="text-xs font-bold font-mono">{formatRupiah(total)}</div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs font-bold bg-white text-emerald-800 px-3 py-1.5 rounded-lg shadow-2xs">
                <span>Lihat Keranjang</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </button>
          </div>
        )}

      </div>

      {/* Global Checkout Modal */}
      <CheckoutModal />
    </AppShell>
  );
}
