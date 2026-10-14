"use client";

import React, { useState } from "react";
import { Product, RecipeItem, Ingredient } from "@/types/pos";
import { usePosStore } from "@/store/usePosStore";
import { useTranslation } from "@/lib/translations";
import { formatRupiah } from "@/lib/utils";
import { 
  Calculator, 
  X, 
  Plus, 
  Trash2, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  PieChart,
  Building2,
  Package,
  HelpCircle
} from "lucide-react";

interface RecipeModalProps {
  product: Product;
  onClose: () => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({ product, onClose }) => {
  const { ingredients, updateProduct, addToast } = usePosStore();
  const { t, isEnglish } = useTranslation();

  const [recipeItems, setRecipeItems] = useState<RecipeItem[]>(product.recipe || []);
  const [selectedIngredientId, setSelectedIngredientId] = useState<string>(
    ingredients[0]?.id || ""
  );
  const [amountInput, setAmountInput] = useState<number>(15);
  const [sellingPriceInput, setSellingPriceInput] = useState<number>(product.price);
  
  // Overhead cost allocation (Sewa tempat, utilitas/listrik per porsi)
  const [overheadCostInput, setOverheadCostInput] = useState<number>(
    product.overheadCost ?? 1500
  );

  // Helper calculator for rent allocation
  const [monthlyRentInput, setMonthlyRentInput] = useState<number>(3000000);
  const [monthlyCupTarget, setMonthlyCupTarget] = useState<number>(1500);
  const [showRentHelper, setShowRentHelper] = useState<boolean>(false);

  // Raw material total cost
  const rawMaterialCost = recipeItems.reduce((sum, item) => sum + item.subtotalCost, 0);

  // Calculate live total Full HPP (Bahan + Alokasi Sewa Tempat & Operasional)
  const totalHpp = rawMaterialCost + Number(overheadCostInput || 0);

  // Gross profit & margin percentage
  const grossProfit = Math.max(0, sellingPriceInput - totalHpp);
  const marginPercentage = sellingPriceInput > 0 ? Math.round((grossProfit / sellingPriceInput) * 100) : 0;

  // Recommended prices for target margins
  const priceMargin50 = Math.round(totalHpp / (1 - 0.50));
  const priceMargin60 = Math.round(totalHpp / (1 - 0.60));
  const priceMargin70 = Math.round(totalHpp / (1 - 0.70));

  const applyCalculatedRent = () => {
    if (monthlyCupTarget > 0) {
      const perCup = Math.round(monthlyRentInput / monthlyCupTarget);
      setOverheadCostInput(perCup);
      setShowRentHelper(false);
      addToast(
        isEnglish
          ? `Rent allocation of ${formatRupiah(perCup)}/cup applied!`
          : `Alokasi sewa Rp ${perCup.toLocaleString("id-ID")}/cup diterapkan!`,
        "info"
      );
    }
  };

  const handleAddIngredient = () => {
    const ing = ingredients.find((i) => i.id === selectedIngredientId);
    if (!ing || amountInput <= 0) return;

    const costPerUnit = ing.unitCost;
    const subtotalCost = Math.round(costPerUnit * amountInput);

    const newItem: RecipeItem = {
      ingredientId: ing.id,
      ingredientName: ing.name,
      amount: amountInput,
      unit: ing.unit,
      costPerUnit,
      subtotalCost,
    };

    setRecipeItems([...recipeItems, newItem]);
  };

  const handleRemoveIngredient = (index: number) => {
    setRecipeItems(recipeItems.filter((_, idx) => idx !== index));
  };

  const handleSaveRecipe = () => {
    updateProduct(product.id, {
      recipe: recipeItems,
      hasRecipe: recipeItems.length > 0,
      rawMaterialCost,
      overheadCost: Number(overheadCostInput) || 0,
      packagingCost: 0,
      costPrice: totalHpp,
      price: sellingPriceInput,
    });
    addToast(
      isEnglish
        ? `Recipe COGS & pricing for "${product.name}" updated successfully!`
        : `Resep HPP & harga "${product.name}" berhasil diperbarui!`,
      "success"
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative flex flex-col w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/20">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                {t.recipeModal.title.replace("{name}", product.name)}
              </h2>
              <p className="text-xs text-slate-500">
                {t.recipeModal.subtitle}
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* Add Ingredient Form */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <div className="text-xs font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
              <Plus className="h-4 w-4 text-emerald-600" />
              <span>{t.recipeModal.addIngredientTitle}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
              <div className="sm:col-span-7">
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {t.recipeModal.selectIngredientLabel}
                </label>
                <select
                  value={selectedIngredientId}
                  onChange={(e) => setSelectedIngredientId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {ingredients.map((ing) => (
                    <option key={ing.id} value={ing.id}>
                      {ing.name} ({formatRupiah(ing.unitCost)}/{ing.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {t.recipeModal.amountLabel}
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    min={0.1}
                    step={1}
                    value={amountInput}
                    onChange={(e) => setAmountInput(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <span className="ml-2 text-xs font-semibold text-slate-500">
                    {ingredients.find((i) => i.id === selectedIngredientId)?.unit || "unit"}
                  </span>
                </div>
              </div>

              <div className="sm:col-span-2 flex items-end">
                <button
                  type="button"
                  onClick={handleAddIngredient}
                  className="w-full rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900 text-white py-2 text-xs font-bold hover:bg-slate-800 transition"
                >
                  {t.recipeModal.addBtn}
                </button>
              </div>
            </div>
          </div>

          {/* Current Recipe Breakdown Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 dark:text-white">
                {t.recipeModal.breakdownTitle.replace("{count}", String(recipeItems.length))}
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {t.recipeModal.totalHppHeader.replace("{cost}", formatRupiah(totalHpp))}
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-[11px] font-bold text-slate-500 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3">{t.recipeModal.thIngredient}</th>
                    <th className="p-3">{t.recipeModal.thAmount}</th>
                    <th className="p-3">{t.recipeModal.thUnitCost}</th>
                    <th className="p-3">{t.recipeModal.thSubtotal}</th>
                    <th className="p-3 text-right">{t.recipeModal.thAction}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {recipeItems.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-slate-400 text-xs">
                        {t.recipeModal.emptyRecipe}
                      </td>
                    </tr>
                  ) : (
                    recipeItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                        <td className="p-3 font-semibold text-slate-800 dark:text-white">
                          {item.ingredientName}
                        </td>
                        <td className="p-3 font-mono font-bold">
                          {item.amount} {item.unit}
                        </td>
                        <td className="p-3 text-slate-500 font-mono">
                          {formatRupiah(item.costPerUnit)}/{item.unit}
                        </td>
                        <td className="p-3 font-bold text-slate-900 dark:text-white font-mono">
                          {formatRupiah(item.subtotalCost)}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveIngredient(idx)}
                            className="p-1 text-slate-400 hover:text-rose-500 transition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section: Alokasi Sewa Tempat & Biaya Kemasan/Cup (Overhead HPP) */}
          <div className="rounded-2xl border border-amber-200/80 bg-amber-50/40 p-4 dark:border-amber-900/30 dark:bg-amber-950/20 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {t.recipeModal.overheadTitle}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowRentHelper(!showRentHelper)}
                className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1"
              >
                <HelpCircle className="h-3.5 w-3.5" />
                <span>{showRentHelper ? t.recipeModal.rentHelperCloseBtn : t.recipeModal.rentHelperBtn}</span>
              </button>
            </div>

            {/* Helper Calculator if expanded */}
            {showRentHelper && (
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-amber-200 dark:border-amber-800 text-xs space-y-2 animate-in fade-in duration-150">
                <div className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">
                  {t.recipeModal.rentHelperTitle}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-0.5">{t.recipeModal.monthlyRentLabel}</label>
                    <input
                      type="number"
                      step={500000}
                      value={monthlyRentInput}
                      onChange={(e) => setMonthlyRentInput(Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-0.5">{t.recipeModal.monthlyCupTargetLabel}</label>
                    <input
                      type="number"
                      step={100}
                      value={monthlyCupTarget}
                      onChange={(e) => setMonthlyCupTarget(Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1 text-xs font-bold"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-600 dark:text-slate-400">
                    {t.recipeModal.rentPerCupLabel}{" "}
                    <strong className="text-amber-600 dark:text-amber-400 font-bold">
                      {formatRupiah(monthlyCupTarget > 0 ? Math.round(monthlyRentInput / monthlyCupTarget) : 0)}
                    </strong>
                  </span>
                  <button
                    type="button"
                    onClick={applyCalculatedRent}
                    className="px-2.5 py-1 bg-amber-600 text-white rounded-lg text-[10px] font-bold hover:bg-amber-700"
                  >
                    {t.recipeModal.applyRentBtn}
                  </button>
                </div>
              </div>
            )}

            {/* Single clean card for Alokasi Sewa Tempat & Operasional */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 flex items-center justify-between">
                <span>{t.recipeModal.overheadCardLabel}</span>
                <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">{t.recipeModal.overheadCardHint}</span>
              </label>
              <div className="flex items-center">
                <span className="text-xs font-bold text-slate-400 mr-2">Rp</span>
                <input
                  type="number"
                  min={0}
                  step={100}
                  value={overheadCostInput}
                  onChange={(e) => setOverheadCostInput(Number(e.target.value))}
                  placeholder="Contoh: 1500"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-black text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            {/* Total HPP Summary breakdown: Bahan + Sewa */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-900 text-white dark:bg-slate-800 text-xs">
              <div className="flex flex-wrap items-center gap-2.5 text-[11px]">
                <span className="text-slate-300">
                  {t.recipeModal.summaryIngredients} <strong className="text-white">{formatRupiah(rawMaterialCost)}</strong>
                </span>
                <span className="text-slate-500">+</span>
                <span className="text-slate-300">
                  {t.recipeModal.summaryRentOps} <strong className="text-amber-400">{formatRupiah(overheadCostInput || 0)}</strong>
                </span>
              </div>
              <div className="font-extrabold text-emerald-400 text-xs sm:text-sm">
                {t.recipeModal.summaryTotalHpp} {formatRupiah(totalHpp)}
              </div>
            </div>
          </div>

          {/* Pricing & Gross Margin Simulation */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-800/60 space-y-3">
            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <span>{t.recipeModal.pricingSimTitle}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-slate-200 p-3 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40">
                <span className="text-[11px] text-slate-500">{t.recipeModal.currentPriceLabel}</span>
                <div className="mt-1 flex items-center">
                  <span className="text-xs font-bold text-slate-500 mr-1">Rp</span>
                  <input
                    type="number"
                    min={1000}
                    step={1000}
                    value={sellingPriceInput}
                    onChange={(e) => setSellingPriceInput(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm font-black text-slate-900 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-emerald-200 p-3 bg-emerald-50/50 dark:border-emerald-900/30 dark:bg-emerald-950/20">
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400">{t.recipeModal.grossProfitLabel}</span>
                <div className="mt-1 text-base font-black text-emerald-700 dark:text-emerald-300">
                  {formatRupiah(grossProfit)}
                </div>
              </div>

              <div className="rounded-xl border border-emerald-200 p-3 bg-emerald-50/50 dark:border-emerald-900/30 dark:bg-emerald-950/20">
                <span className="text-[11px] text-emerald-800 dark:text-emerald-400">{t.recipeModal.marginPctLabel}</span>
                <div className="mt-1 text-base font-black text-emerald-700 dark:text-emerald-300">
                  {marginPercentage}%
                </div>
              </div>
            </div>

            {/* Smart Price Suggestions */}
            <div>
              <div className="text-[11px] font-semibold text-slate-500 mb-1.5">
                {t.recipeModal.recPricesTitle}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSellingPriceInput(priceMargin50)}
                  className="rounded-xl border border-slate-200 bg-white p-2.5 text-center hover:border-emerald-400 dark:border-slate-700 dark:bg-slate-800 transition"
                >
                  <div className="text-[10px] text-slate-400">{t.recipeModal.target50}</div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                    {formatRupiah(priceMargin50)}
                  </div>
                  <div className="text-[9px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-semibold">{t.recipeModal.applyRecBtn}</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSellingPriceInput(priceMargin60)}
                  className="rounded-xl border border-emerald-300 bg-emerald-50/60 p-2.5 text-center hover:border-emerald-500 dark:border-emerald-800 dark:bg-emerald-950/30 transition shadow-2xs"
                >
                  <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">{t.recipeModal.target60}</div>
                  <div className="text-xs font-black text-emerald-700 dark:text-emerald-300 mt-0.5">
                    {formatRupiah(priceMargin60)}
                  </div>
                  <div className="text-[9px] text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5">{t.recipeModal.primaryRecBtn}</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSellingPriceInput(priceMargin70)}
                  className="rounded-xl border border-slate-200 bg-white p-2.5 text-center hover:border-emerald-400 dark:border-slate-700 dark:bg-slate-800 transition"
                >
                  <div className="text-[10px] text-slate-400">{t.recipeModal.target70}</div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                    {formatRupiah(priceMargin70)}
                  </div>
                  <div className="text-[9px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-semibold">{t.recipeModal.applyRecBtn}</div>
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            {t.recipeModal.cancelBtn}
          </button>
          <button
            type="button"
            onClick={handleSaveRecipe}
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition"
          >
            {t.recipeModal.saveRecipeBtn}
          </button>
        </div>

      </div>
    </div>
  );
};
