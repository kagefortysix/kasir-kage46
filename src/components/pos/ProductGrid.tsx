"use client";

import React, { useState, useMemo } from "react";
import { usePosStore } from "@/store/usePosStore";
import { ProductCategory, Product } from "@/types/pos";
import { ProductCard } from "./ProductCard";
import { ProductListItem } from "./ProductListItem";
import { QuickAddProductModal } from "./QuickAddProductModal";
import { useTranslation } from "@/lib/translations";
import { 
  Search, 
  ScanBarcode, 
  Zap, 
  LayoutGrid, 
  List, 
  X, 
  Coffee 
} from "lucide-react";

export const ProductGrid: React.FC = () => {
  const { products, setQuickAddModalOpen, addToCart, addToast } = usePosStore();
  const { t, isEnglish } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [barcodeInput, setBarcodeInput] = useState("");
  const [isBarcodeOpen, setIsBarcodeOpen] = useState(false);
  const [layoutMode, setLayoutMode] = useState<"grid" | "list">("grid");

  const categories: ProductCategory[] = [
    "Semua",
    "Signature",
    "Kopi",
    "Non-Kopi",
    "Makanan",
    "Camilan",
  ];

  const getCategoryLabel = (cat: ProductCategory) => {
    switch (cat) {
      case "Semua":
        return t.common.all;
      case "Signature":
        return "Signature";
      case "Kopi":
        return isEnglish ? "Coffee" : "Kopi";
      case "Non-Kopi":
        return isEnglish ? "Non-Coffee" : "Non-Kopi";
      case "Makanan":
        return isEnglish ? "Food" : "Makanan";
      case "Camilan":
        return isEnglish ? "Snacks" : "Camilan";
      default:
        return cat;
    }
  };

  // Filter products by category and search
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = selectedCategory === "Semua" || p.category === selectedCategory;
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;

    const found = products.find(
      (p) => p.sku.toLowerCase() === barcodeInput.trim().toLowerCase()
    );

    if (found) {
      addToCart(found);
      setBarcodeInput("");
      setIsBarcodeOpen(false);
      addToast(
        isEnglish
          ? `SKU match: ${found.name} added to cart!`
          : `SKU cocok: ${found.name} dimasukkan keranjang!`,
        "success"
      );
    } else {
      addToast(
        isEnglish
          ? `SKU/Barcode "${barcodeInput}" not found`
          : `SKU/Barcode "${barcodeInput}" tidak ditemukan`,
        "error"
      );
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden p-3 sm:p-4 w-full max-w-full min-w-0">
      
      {/* Top Search, Layout Mode Toggle & Fast Actions */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between pb-3 w-full max-w-full">
        
        {/* Search Input */}
        <div className="relative flex-1 min-w-0 w-full">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isEnglish ? "Search menu or SKU code (e.g. Latte, Croissant)..." : "Cari menu atau kode SKU (Kopi Aren, Croissant)..."}
            className="w-full rounded-xl border border-slate-200/90 bg-white pl-10 pr-9 py-2 text-xs sm:text-sm font-medium text-slate-900 shadow-2xs focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-[#111827] dark:text-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Action Controls: Layout Switcher, Scan SKU, Quick Menu */}
        <div className="flex items-center justify-between sm:justify-end gap-1.5 shrink-0 w-full sm:w-auto">
          
          {/* Grid vs List Switcher */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-white p-0.5 dark:border-slate-800 dark:bg-[#111827] shadow-2xs">
            <button
              type="button"
              onClick={() => setLayoutMode("grid")}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${
                layoutMode === "grid"
                  ? "bg-emerald-600 text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
              title={isEnglish ? "Grid Layout" : "Tampilan Grid"}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Grid</span>
            </button>

            <button
              type="button"
              onClick={() => setLayoutMode("list")}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${
                layoutMode === "list"
                  ? "bg-emerald-600 text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
              title={isEnglish ? "List Layout" : "Tampilan List"}
            >
              <List className="h-3.5 w-3.5" />
              <span className="hidden md:inline">List</span>
            </button>
          </div>

          {/* Barcode scanner */}
          <button
            type="button"
            onClick={() => setIsBarcodeOpen(!isBarcodeOpen)}
            className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-2 text-xs font-semibold transition shadow-2xs ${
              isBarcodeOpen
                ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#111827] dark:text-slate-300"
            }`}
            title="Scan SKU"
          >
            <ScanBarcode className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden lg:inline">Scan SKU</span>
          </button>

          {/* Quick Menu */}
          <button
            type="button"
            onClick={() => setQuickAddModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 active:scale-95 transition"
          >
            <Zap className="h-3.5 w-3.5 fill-white" />
            <span>{t.pos.quickProduct}</span>
          </button>
        </div>

      </div>

      {/* Barcode Quick Input Popup */}
      {isBarcodeOpen && (
        <form
          onSubmit={handleBarcodeSubmit}
          className="mb-2.5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/80 p-2 dark:border-emerald-900/40 dark:bg-emerald-950/30 animate-in fade-in duration-100"
        >
          <ScanBarcode className="h-4 w-4 text-emerald-600 shrink-0 ml-1" />
          <input
            type="text"
            autoFocus
            value={barcodeInput}
            onChange={(e) => setBarcodeInput(e.target.value)}
            placeholder={isEnglish ? "Scan barcode or enter SKU (e.g. KGE-COF-01)..." : "Scan barcode scanner atau ketik SKU (contoh: KGE-COF-01)..."}
            className="flex-1 rounded-lg border border-emerald-300 bg-white px-2.5 py-1.5 text-xs font-mono text-slate-900 focus:outline-none dark:border-emerald-700 dark:bg-[#111827] dark:text-white"
          />
          <button
            type="submit"
            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
          >
            {isEnglish ? "Add" : "Tambah"}
          </button>
        </form>
      )}

      {/* Category Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none select-none w-full max-w-full min-w-0">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all shadow-2xs ${
                isActive
                  ? "bg-slate-900 text-white dark:bg-emerald-600 dark:text-white shadow-xs scale-102"
                  : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-[#111827] dark:text-slate-300 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800"
              }`}
            >
              {getCategoryLabel(cat)}
            </button>
          );
        })}
      </div>

      {/* Product List / Grid Content */}
      <div className="flex-1 overflow-y-auto pt-1 pb-16 lg:pb-2 pr-1">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-52 text-center">
            <Coffee className="h-9 w-9 text-slate-300 dark:text-slate-700 mb-2" />
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {isEnglish ? "No menu items found" : "Tidak ada menu ditemukan"}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {isEnglish
                ? `Try another keyword or use the "${t.pos.quickProduct}" button.`
                : `Coba kata kunci lain atau gunakan tombol "${t.pos.quickProduct}".`}
            </p>
          </div>
        ) : layoutMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-2.5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="space-y-1.5">
            {filteredProducts.map((product) => (
              <ProductListItem key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Modal Quick Add */}
      <QuickAddProductModal />

    </div>
  );
};
