"use client";

import React from "react";
import { Product } from "@/types/pos";
import { usePosStore } from "@/store/usePosStore";
import { formatRupiah } from "@/lib/utils";
import { Plus, AlertTriangle, Sparkles } from "lucide-react";

interface ProductListItemProps {
  product: Product;
}

export const ProductListItem: React.FC<ProductListItemProps> = ({ product }) => {
  const { addToCart } = usePosStore();

  const isLowStock = product.stock <= (product.minStockAlert ?? 10);
  const isOutOfStock = product.stock <= 0;

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case "Signature":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60";
      case "Kopi":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60";
      case "Non-Kopi":
        return "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/60";
      case "Makanan":
        return "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800/60";
      case "Camilan":
        return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
    }
  };

  return (
    <div
      onClick={() => {
        if (!isOutOfStock) addToCart(product);
      }}
      className={`group flex items-center justify-between gap-3 rounded-xl border border-slate-200/90 bg-white px-3.5 py-2.5 shadow-2xs hover:border-emerald-500 hover:shadow-xs dark:border-slate-800 dark:bg-[#111827] transition-all select-none cursor-pointer ${
        isOutOfStock
          ? "opacity-50 grayscale cursor-not-allowed"
          : "active:scale-[0.99] hover:bg-slate-50/50 dark:hover:bg-slate-850"
      }`}
    >
      {/* Left: SKU, Name & Category */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
            {product.sku}
          </span>
          <span
            className={`rounded px-1.5 py-0.2 text-[9px] font-bold border ${getCategoryBadge(
              product.category
            )}`}
          >
            {product.category}
          </span>
          {isLowStock && !isOutOfStock && (
            <span className="text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-0.5 font-semibold">
              <AlertTriangle className="h-2.5 w-2.5" />
              <span>Sisa {product.stock}</span>
            </span>
          )}
          {isOutOfStock && (
            <span className="text-[10px] text-rose-600 font-bold">Habis</span>
          )}
        </div>

        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mt-0.5">
          {product.name}
        </h4>
      </div>

      {/* Right: Price & Quick Add Button */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="text-right">
          <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white font-mono">
            {formatRupiah(product.price)}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">
            Stok: {product.stock}
          </div>
        </div>

        <button
          type="button"
          disabled={isOutOfStock}
          className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs group-hover:bg-emerald-700 active:scale-90 transition-all"
          aria-label={`Tambah ${product.name}`}
        >
          <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
