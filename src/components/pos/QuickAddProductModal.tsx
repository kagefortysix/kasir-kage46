"use client";

import React, { useState } from "react";
import { usePosStore } from "@/store/usePosStore";
import { ProductCategory } from "@/types/pos";
import { useTranslation } from "@/lib/translations";
import { Zap, X } from "lucide-react";

export const QuickAddProductModal: React.FC = () => {
  const { isQuickAddModalOpen, setQuickAddModalOpen, quickAddProduct } = usePosStore();
  const { t, isEnglish } = useTranslation();

  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(15000);
  const [category, setCategory] = useState<ProductCategory>("Kopi");

  if (!isQuickAddModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || price <= 0) return;

    quickAddProduct(name, price, category);
    setName("");
    setPrice(15000);
    setQuickAddModalOpen(false);
  };

  const presetPrices = [10000, 15000, 20000, 25000, 30000, 35000];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xl dark:border-slate-800 dark:bg-[#111827]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {t.quickAdd.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.quickAdd.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={() => setQuickAddModalOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t.quickAdd.nameLabel}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.quickAdd.namePlaceholder}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.quickAdd.categoryLabel}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-medium text-slate-900 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="Kopi">{isEnglish ? "Coffee" : "Kopi"}</option>
                <option value="Non-Kopi">{isEnglish ? "Non-Coffee" : "Non-Kopi"}</option>
                <option value="Makanan">{isEnglish ? "Food" : "Makanan"}</option>
                <option value="Camilan">{isEnglish ? "Snacks" : "Camilan"}</option>
                <option value="Signature">Signature</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.quickAdd.priceLabel}
              </label>
              <input
                type="number"
                required
                min={1000}
                step={500}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-900 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white font-mono"
              />
            </div>
          </div>

          <div>
            <div className="text-[11px] text-slate-500 mb-1.5 font-medium">
              {t.quickAdd.quickPricesLabel}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {presetPrices.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPrice(p)}
                  className={`rounded-lg px-2 py-1 text-[11px] font-semibold transition ${
                    price === p
                      ? "bg-emerald-600 text-white"
                      : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {(p / 1000).toFixed(0)}k
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 text-[11px] text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-300">
            {t.quickAdd.bannerNote}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setQuickAddModalOpen(false)}
              className="flex-1 rounded-xl border border-slate-200 bg-slate-100 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              {t.quickAdd.cancelBtn}
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
            >
              {t.quickAdd.submitBtn}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
