"use client";

import React, { useState } from "react";
import { Ingredient } from "@/types/pos";
import { usePosStore } from "@/store/usePosStore";
import { useTranslation } from "@/lib/translations";
import { formatRupiah } from "@/lib/utils";
import { X, Package, Calculator } from "lucide-react";

interface IngredientFormModalProps {
  ingredientToEdit?: Ingredient | null;
  onClose: () => void;
}

export const IngredientFormModal: React.FC<IngredientFormModalProps> = ({
  ingredientToEdit,
  onClose,
}) => {
  const { addIngredient, updateIngredient } = usePosStore();
  const { t } = useTranslation();

  const [name, setName] = useState(ingredientToEdit?.name || "");
  const [category, setCategory] = useState<Ingredient["category"]>(
    ingredientToEdit?.category || "Biji Kopi"
  );
  const [unit, setUnit] = useState<Ingredient["unit"]>(ingredientToEdit?.unit || "gr");
  const [currentStock, setCurrentStock] = useState<number>(ingredientToEdit?.currentStock || 1000);
  const [minStockAlert, setMinStockAlert] = useState<number>(ingredientToEdit?.minStockAlert || 200);
  const [packagePrice, setPackagePrice] = useState<number>(ingredientToEdit?.packagePrice || 120000);
  const [packageSize, setPackageSize] = useState<number>(ingredientToEdit?.packageSize || 1000);

  const unitCost = Math.round(packagePrice / (packageSize || 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || packagePrice <= 0 || packageSize <= 0) return;

    if (ingredientToEdit) {
      updateIngredient(ingredientToEdit.id, {
        name,
        category,
        unit,
        currentStock,
        minStockAlert,
        packagePrice,
        packageSize,
      });
    } else {
      addIngredient({
        name,
        category,
        unit,
        currentStock,
        minStockAlert,
        packagePrice,
        packageSize,
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
            <Package className="h-5 w-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {ingredientToEdit ? t.ingredientModal.titleEdit : t.ingredientModal.titleAdd}
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
              {t.ingredientModal.nameLabel}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.ingredientModal.namePlaceholder}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.ingredientModal.categoryLabel}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Ingredient["category"])}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-medium text-slate-900 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="Biji Kopi">{t.inventory.catBeans}</option>
                <option value="Dairy">{t.inventory.catDairy}</option>
                <option value="Sirup & Flavour">{t.inventory.catSyrup}</option>
                <option value="Bubuk Powder">{t.inventory.catPowder}</option>
                <option value="Packaging">{t.inventory.catPackaging}</option>
                <option value="Topping / Lainnya">{t.inventory.catTopping}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.ingredientModal.unitLabel}
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as Ingredient["unit"])}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-bold text-slate-900 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="gr">Gram (gr)</option>
                <option value="ml">Mililiter (ml)</option>
                <option value="pcs">Pieces (pcs)</option>
                <option value="pack">Pack</option>
              </select>
            </div>
          </div>

          {/* Pricing & Package Conversion */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40 space-y-2.5">
            <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
              {t.ingredientModal.conversionTitle}
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">
                  {t.ingredientModal.packagePriceLabel}
                </label>
                <input
                  type="number"
                  min={1000}
                  step={1000}
                  value={packagePrice}
                  onChange={(e) => setPackagePrice(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 mb-1">
                  {t.ingredientModal.packageSizeLabel.replace("{unit}", unit)}
                </label>
                <input
                  type="number"
                  min={1}
                  value={packageSize}
                  onChange={(e) => setPackageSize(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-800"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-700 text-xs">
              <span className="text-slate-500">{t.ingredientModal.unitCostSummary.replace("{unit}", unit)}</span>
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                {formatRupiah(unitCost)} / {unit}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.ingredientModal.stockLabel.replace("{unit}", unit)}
              </label>
              <input
                type="number"
                min={0}
                value={currentStock}
                onChange={(e) => setCurrentStock(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.ingredientModal.minAlertLabel.replace("{unit}", unit)}
              </label>
              <input
                type="number"
                min={0}
                value={minStockAlert}
                onChange={(e) => setMinStockAlert(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 bg-slate-100 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              {t.ingredientModal.cancelBtn}
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition"
            >
              {ingredientToEdit ? t.ingredientModal.submitEdit : t.ingredientModal.submitAdd}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
