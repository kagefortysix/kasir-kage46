"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { usePosStore } from "@/store/usePosStore";
import { Product, ProductCategory } from "@/types/pos";
import { formatRupiah } from "@/lib/utils";
import { RecipeModal } from "@/components/products/RecipeModal";
import { ProductFormModal } from "@/components/products/ProductFormModal";
import { 
  Coffee, 
  Plus, 
  Search, 
  Calculator, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle 
} from "lucide-react";

export default function ProductsPage() {
  const { products, deleteProduct, currentUser } = usePosStore();
  const isOwner = currentUser?.role === "owner";

  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState<ProductCategory>("Semua");
  const [activeRecipeProduct, setActiveRecipeProduct] = useState<Product | null>(null);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const categories: ProductCategory[] = [
    "Semua",
    "Signature",
    "Kopi",
    "Non-Kopi",
    "Makanan",
    "Camilan",
  ];

  const filtered = products.filter((p) => {
    const matchCat = selectedCat === "Semua" || p.category === selectedCat;
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const productsWithRecipe = products.filter((p) => p.hasRecipe && p.recipe && p.recipe.length > 0).length;
  const avgMargin = Math.round(
    products.reduce((acc, p) => {
      const margin = p.price > 0 ? ((p.price - p.costPrice) / p.price) * 100 : 0;
      return acc + margin;
    }, 0) / (products.length || 1)
  );

  return (
    <AppShell>
      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full pb-24 lg:pb-12">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>Katalog Produk & Racik Resep HPP</span>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                {products.length} Menu
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Kelola menu jual, kalkulasi modal pokok bahan riil, dan simulasi margin laba kotor.
            </p>
          </div>

          {isOwner && (
            <button
              onClick={() => {
                setProductToEdit(null);
                setIsFormOpen(true);
              }}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Menu Baru</span>
            </button>
          )}
        </div>

        {/* 3 Summary Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-[#111827]">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Menu Jual</span>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {products.length} Item Aktif
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-[#111827]">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Memiliki Resep HPP</span>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {productsWithRecipe} dari {products.length} Menu ({Math.round((productsWithRecipe / products.length) * 100)}%)
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-[#111827]">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Rata-rata Margin Kotor</span>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {avgMargin}% Margin
            </div>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari menu, SKU..."
              className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2 text-xs sm:text-sm font-medium text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-[#111827] dark:text-white"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCat(c)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  selectedCat === c
                    ? "bg-slate-900 text-white dark:bg-emerald-600"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#111827] dark:text-slate-300"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Product Table without Photos */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-[#111827] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider dark:border-slate-800 dark:bg-slate-900">
                <tr>
                  <th className="p-4">SKU</th>
                  <th className="p-4">Nama Menu & Deskripsi</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Harga Jual</th>
                  <th className="p-4">Modal (HPP)</th>
                  <th className="p-4">Margin %</th>
                  <th className="p-4">Status Resep</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((prod) => {
                  const grossProfit = Math.max(0, prod.price - prod.costPrice);
                  const margin = prod.price > 0 ? Math.round((grossProfit / prod.price) * 100) : 0;
                  const hasRecipe = prod.hasRecipe && prod.recipe && prod.recipe.length > 0;

                  return (
                    <tr key={prod.id} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                      
                      {/* SKU */}
                      <td className="p-4 font-mono font-bold text-slate-600 dark:text-slate-400">
                        {prod.sku}
                      </td>

                      {/* Title & Description */}
                      <td className="p-4">
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                            {prod.name}
                          </div>
                          {prod.description && (
                            <div className="text-[11px] text-slate-500 line-clamp-1 max-w-xs mt-0.5">
                              {prod.description}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-4">
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                          {prod.category}
                        </span>
                      </td>

                      {/* Selling Price */}
                      <td className="p-4 font-bold text-slate-900 dark:text-white font-mono">
                        {formatRupiah(prod.price)}
                      </td>

                      {/* Cost HPP */}
                      <td className="p-4 font-mono font-medium text-slate-600 dark:text-slate-300">
                        <div>{formatRupiah(prod.costPrice)}</div>
                        {prod.overheadCost ? (
                          <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                            +Sewa: {formatRupiah(prod.overheadCost)}
                          </div>
                        ) : null}
                      </td>

                      {/* Margin % */}
                      <td className="p-4">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-black ${
                            margin >= 60
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                              : margin >= 45
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                              : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                          }`}
                        >
                          {margin}%
                        </span>
                      </td>

                      {/* Status Resep */}
                      <td className="p-4">
                        {hasRecipe ? (
                          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>{prod.recipe?.length} Bahan Gudang</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <span>Estimasi Manual</span>
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        {isOwner ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setActiveRecipeProduct(prod)}
                              className="flex items-center gap-1 rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 transition"
                              title="Kalkulator HPP & Racik Resep"
                            >
                              <Calculator className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">Racik HPP</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setProductToEdit(prod);
                                setIsFormOpen(true);
                              }}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                              title="Edit Produk"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => deleteProduct(prod.id)}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:border-slate-700 dark:hover:bg-rose-950/40 transition"
                              title="Hapus Produk"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium">Lihat Saja</span>
                        )}
                      </td>

                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-10 text-center text-slate-400">
                      <Coffee className="h-9 w-9 mx-auto mb-2 opacity-30" />
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Belum ada menu produk terdaftar</p>
                      {isOwner && (
                        <p className="text-[11px] text-slate-400 mt-1">
                          Klik tombol <strong>"+ Tambah Menu Baru"</strong> di atas untuk mendaftarkan menu riil toko Anda.
                        </p>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modals */}
        {activeRecipeProduct && (
          <RecipeModal
            product={activeRecipeProduct}
            onClose={() => setActiveRecipeProduct(null)}
          />
        )}

        {isFormOpen && (
          <ProductFormModal
            productToEdit={productToEdit}
            onClose={() => {
              setIsFormOpen(false);
              setProductToEdit(null);
            }}
          />
        )}

      </div>
    </AppShell>
  );
}
