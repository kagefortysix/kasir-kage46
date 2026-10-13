"use client";

import React, { useState } from "react";
import { Product, ProductCategory } from "@/types/pos";
import { usePosStore } from "@/store/usePosStore";
import { X, Coffee, Sparkles } from "lucide-react";

interface ProductFormModalProps {
  productToEdit?: Product | null;
  onClose: () => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({ productToEdit, onClose }) => {
  const { addProduct, updateProduct } = usePosStore();

  const [name, setName] = useState(productToEdit?.name || "");
  const [category, setCategory] = useState<ProductCategory>(productToEdit?.category || "Kopi");
  const [price, setPrice] = useState<number>(productToEdit?.price || 25000);
  const [costPrice, setCostPrice] = useState<number>(productToEdit?.costPrice || 8000);
  const [overheadCost, setOverheadCost] = useState<number>(productToEdit?.overheadCost || 1500);
  const [stock, setStock] = useState<number>(productToEdit?.stock || 50);
  const [minStockAlert, setMinStockAlert] = useState<number>(productToEdit?.minStockAlert || 10);
  const [imageUrl, setImageUrl] = useState(
    productToEdit?.imageUrl || "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80"
  );
  const [description, setDescription] = useState(productToEdit?.description || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || price <= 0) return;

    if (productToEdit) {
      updateProduct(productToEdit.id, {
        name,
        category,
        price,
        costPrice,
        overheadCost,
        packagingCost: 0,
        stock,
        minStockAlert,
        imageUrl,
        description,
      });
    } else {
      addProduct({
        name,
        category,
        price,
        costPrice,
        overheadCost,
        packagingCost: 0,
        stock,
        minStockAlert,
        imageUrl,
        description,
        isAvailable: true,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Coffee className="h-5 w-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {productToEdit ? "Edit Menu Produk" : "Tambah Menu Produk Baru"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Nama Menu Jual
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Caramel Macchiato Velvet"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Kategori Menu
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-medium text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="Signature">Signature</option>
                <option value="Kopi">Kopi</option>
                <option value="Non-Kopi">Non-Kopi</option>
                <option value="Makanan">Makanan</option>
                <option value="Camilan">Camilan</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Harga Jual (Rp)
              </label>
              <input
                type="number"
                required
                min={1000}
                step={500}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Modal Pokok (HPP) (Rp)
              </label>
              <input
                type="number"
                min={0}
                step={500}
                value={costPrice}
                onChange={(e) => setCostPrice(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Stok Awal Porsi
              </label>
              <input
                type="number"
                min={0}
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30">
            <label className="block text-xs font-bold text-amber-900 dark:text-amber-300 mb-1 flex items-center justify-between">
              <span>Alokasi Sewa Tempat & Operasional / Cup</span>
              <span className="text-[10px] text-amber-700/80 font-normal">Sewa toko, listrik & utilitas</span>
            </label>
            <div className="flex items-center">
              <span className="text-xs font-bold text-amber-600 mr-2">Rp</span>
              <input
                type="number"
                min={0}
                step={100}
                value={overheadCost}
                onChange={(e) => setOverheadCost(Number(e.target.value))}
                placeholder="Contoh: 1500"
                className="w-full rounded-xl border border-amber-200 bg-white px-3 py-1.5 text-xs font-black text-slate-900 focus:border-amber-500 focus:outline-none dark:border-amber-800 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Deskripsi Menu
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Catatan rasa, perpaduan bahan..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 bg-slate-100 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition"
            >
              {productToEdit ? "Simpan Perubahan" : "Tambahkan Menu"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
