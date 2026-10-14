"use client";

import React, { useState } from "react";
import { Ingredient, StockOpnameRecord } from "@/types/pos";
import { usePosStore } from "@/store/usePosStore";
import { useTranslation } from "@/lib/translations";
import { X, ClipboardCheck, AlertTriangle } from "lucide-react";

interface StockOpnameModalProps {
  ingredient?: Ingredient | null;
  onClose: () => void;
}

export const StockOpnameModal: React.FC<StockOpnameModalProps> = ({ ingredient, onClose }) => {
  const { ingredients, recordStockOpname, currentShift } = usePosStore();
  const { t, isEnglish } = useTranslation();

  const [selectedIngredientId, setSelectedIngredientId] = useState<string>(
    ingredient?.id || ingredients[0]?.id || ""
  );

  const activeIngredient = ingredients.find((i) => i.id === selectedIngredientId);

  const [actualStock, setActualStock] = useState<number>(
    activeIngredient ? activeIngredient.currentStock : 0
  );
  const [reason, setReason] = useState<StockOpnameRecord["reason"]>("Spillage (Tumpah)");
  const [note, setNote] = useState("");

  const systemStock = activeIngredient?.currentStock || 0;
  const difference = actualStock - systemStock;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeIngredient) return;

    recordStockOpname({
      ingredientId: activeIngredient.id,
      actualStock,
      reason,
      recordedBy: currentShift?.cashierName || (isEnglish ? "Inventory Staff / Cashier" : "Petugas Gudang / Kasir"),
      note,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/20">
              <ClipboardCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {t.stockOpnameModal.title}
              </h2>
              <p className="text-xs text-slate-500">
                {t.stockOpnameModal.subtitle}
              </p>
            </div>
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
              {t.stockOpnameModal.selectIngredientLabel}
            </label>
            <select
              value={selectedIngredientId}
              onChange={(e) => {
                setSelectedIngredientId(e.target.value);
                const target = ingredients.find((i) => i.id === e.target.value);
                if (target) setActualStock(target.currentStock);
              }}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {ingredients.map((ing) => (
                <option key={ing.id} value={ing.id}>
                  {ing.name} ({t.stockOpnameModal.systemStockLabel} {ing.currentStock} {ing.unit})
                </option>
              ))}
            </select>
          </div>

          {/* Current System Stock Badge */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 flex justify-between items-center text-xs dark:border-slate-800 dark:bg-slate-800/40">
            <span className="text-slate-500">{t.stockOpnameModal.systemStockLabel}</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {systemStock} {activeIngredient?.unit}
            </span>
          </div>

          {/* Actual Physical Counted Stock */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t.stockOpnameModal.actualStockLabel.replace("{unit}", activeIngredient?.unit || "")}
            </label>
            <input
              type="number"
              min={0}
              step={activeIngredient?.unit === "pcs" ? 1 : 10}
              value={actualStock}
              onChange={(e) => setActualStock(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Selisih Indicator */}
          <div className="flex items-center justify-between rounded-xl p-2.5 text-xs font-bold bg-slate-100 dark:bg-slate-800">
            <span className="text-slate-500">{t.stockOpnameModal.varianceLabel}</span>
            <span
              className={
                difference === 0
                  ? "text-slate-700 dark:text-slate-300"
                  : difference > 0
                  ? "text-emerald-600"
                  : "text-rose-600"
              }
            >
              {difference > 0 ? `+${difference}` : difference} {activeIngredient?.unit}{" "}
              {difference < 0
                ? t.stockOpnameModal.varianceDecreased
                : difference > 0
                ? t.stockOpnameModal.varianceIncreased
                : t.stockOpnameModal.varianceBalanced}
            </span>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t.stockOpnameModal.reasonLabel}
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as StockOpnameRecord["reason"])}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="Spillage (Tumpah)">{t.stockOpnameModal.reasonSpillage}</option>
              <option value="Kadaluarsa">{t.stockOpnameModal.reasonExpired}</option>
              <option value="Rusak / Basi">{t.stockOpnameModal.reasonDamaged}</option>
              <option value="Selisih Hitung">{t.stockOpnameModal.reasonAudit}</option>
              <option value="Lainnya">{t.stockOpnameModal.reasonOther}</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t.stockOpnameModal.noteLabel}
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t.stockOpnameModal.notePlaceholder}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 bg-slate-100 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              {t.stockOpnameModal.cancelBtn}
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition"
            >
              {t.stockOpnameModal.submitBtn}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
