"use client";

import React from "react";
import { Product } from "@/types/pos";
import { usePosStore } from "@/store/usePosStore";
import { formatRupiah } from "@/lib/utils";
import { Plus, AlertTriangle, Sparkles } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = usePosStore();

  const isLowStock = product.stock <= (product.minStockAlert ?? 10);
  const isOutOfStock = product.stock <= 0;

  // Curated category badge styles
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
      className={`group relative flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs hover:border-emerald-500 hover:shadow-md dark:border-slate-800 dark:bg-[#111827] transition-all select-none cursor-pointer ${
        isOutOfStock
          ? "opacity-50 grayscale cursor-not-allowed"
          : "active:scale-[0.98] hover:-translate-y-0.5"
      }`}
    >
      {/* Top Header: SKU & Category Badge */}
      <div>
        <div className="flex items-center justify-between gap-1.5 mb-2">
          <span className="font-mono text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md">
            {product.sku}
          </span>

          <span
            className={`rounded-md px-2 py-0.5 text-[10px] font-bold border ${getCategoryBadge(
              product.category
            )} flex items-center gap-1`}
          >
            {product.category === "Signature" && <Sparkles className="h-2.5 w-2.5" />}
            <span>{product.category}</span>
          </span>
        </div>

        {/* Product Name */}
        <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
          {product.name}
        </h3>

        {/* Description Snippet */}
        {product.description && (
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}
      </div>

      {/* Bottom Bar: Price & Stock & Action */}
      <div className="mt-3.5 pt-2.5 border-t border-slate-100 dark:border-slate-800/70 flex items-center justify-between">
        <div>
          <div className="text-sm font-black text-slate-900 dark:text-white font-mono">
            {formatRupiah(product.price)}
          </div>
          
          {/* Stock status */}
          <div className="text-[10px] mt-0.5">
            {isOutOfStock ? (
              <span className="font-bold text-rose-600 dark:text-rose-400">Stok Habis</span>
            ) : isLowStock ? (
              <span className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                <AlertTriangle className="h-2.5 w-2.5" />
                <span>Sisa {product.stock}</span>
              </span>
            ) : (
              <span className="text-slate-500 dark:text-slate-400">Stok: {product.stock}</span>
            )}
          </div>
        </div>

        <button
          type="button"
          disabled={isOutOfStock}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs group-hover:bg-emerald-700 active:scale-90 transition-all shrink-0"
          aria-label={`Tambah ${product.name}`}
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
