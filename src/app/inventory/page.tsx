"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { usePosStore } from "@/store/usePosStore";
import { useTranslation } from "@/lib/translations";
import { Ingredient } from "@/types/pos";
import { formatRupiah, formatDate } from "@/lib/utils";
import { StockOpnameModal } from "@/components/inventory/StockOpnameModal";
import { IngredientFormModal } from "@/components/inventory/IngredientFormModal";
import { 
  Package, 
  Plus, 
  Search, 
  ClipboardCheck, 
  AlertTriangle, 
  Edit2, 
  CheckCircle2, 
  ArrowUpDown,
  History,
  FileSpreadsheet
} from "lucide-react";

export default function InventoryPage() {
  const { ingredients, stockOpnames } = usePosStore();
  const { t, isEnglish } = useTranslation();

  const [activeTab, setActiveTab] = useState<"ingredients" | "opnames">("ingredients");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [opnameIngredient, setOpnameIngredient] = useState<Ingredient | null>(null);
  const [isOpnameModalOpen, setIsOpnameModalOpen] = useState(false);
  const [ingredientToEdit, setIngredientToEdit] = useState<Ingredient | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const categories = [
    { key: "Semua", label: t.inventory.catAll },
    { key: "Biji Kopi", label: t.inventory.catBeans },
    { key: "Dairy", label: t.inventory.catDairy },
    { key: "Sirup & Flavour", label: t.inventory.catSyrup },
    { key: "Bubuk Powder", label: t.inventory.catPowder },
    { key: "Packaging", label: t.inventory.catPackaging },
    { key: "Topping / Lainnya", label: t.inventory.catTopping },
  ];

  const filteredIngredients = ingredients.filter((ing) => {
    const matchCat = selectedCategory === "Semua" || ing.category === selectedCategory;
    const matchSearch = ing.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const criticalCount = ingredients.filter((i) => i.currentStock <= i.minStockAlert).length;
  const totalValuation = ingredients.reduce(
    (sum, i) => sum + i.currentStock * i.unitCost,
    0
  );

  return (
    <AppShell>
      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full pb-24 lg:pb-12">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 w-full">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex flex-wrap items-center gap-2">
              <span>{t.inventory.pageTitle}</span>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 shrink-0">
                {t.inventory.ingredientsCountBadge.replace("{count}", String(ingredients.length))}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {t.inventory.pageSubtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setOpnameIngredient(null);
                setIsOpnameModalOpen(true);
              }}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50/80 px-3.5 py-2.5 text-xs font-bold text-emerald-900 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 transition shrink-0"
            >
              <ClipboardCheck className="h-4 w-4 text-emerald-600" />
              <span>{t.inventory.stockOpnameBtn}</span>
            </button>

            <button
              onClick={() => {
                setIngredientToEdit(null);
                setIsFormModalOpen(true);
              }}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>{t.inventory.addIngredientBtn}</span>
            </button>
          </div>
        </div>

        {/* 3 Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <span className="text-[11px] font-bold text-slate-400 uppercase">{t.inventory.statTotalRegistered}</span>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {ingredients.length} {t.inventory.statItemTypes}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <span className="text-[11px] font-bold text-slate-400 uppercase">{t.inventory.statTotalValuation}</span>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {formatRupiah(totalValuation)}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <span className="text-[11px] font-bold text-slate-400 uppercase">{t.inventory.statLowStockAlert}</span>
            <div className="text-xl font-black text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1.5">
              <span>{criticalCount > 0 ? t.inventory.statCriticalCount.replace("{count}", String(criticalCount)) : t.inventory.statAllSafe}</span>
              {criticalCount > 0 && <AlertTriangle className="h-4 w-4" />}
            </div>
          </div>
        </div>

        {/* Tabs: Bahan Baku vs Riwayat Stock Opname */}
        <div className="flex border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab("ingredients")}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition ${
              activeTab === "ingredients"
                ? "border-emerald-600 text-emerald-600 dark:text-emerald-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Package className="h-4 w-4" />
            <span>{t.inventory.tabIngredients} ({ingredients.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("opnames")}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition ${
              activeTab === "opnames"
                ? "border-emerald-600 text-emerald-600 dark:text-emerald-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <History className="h-4 w-4" />
            <span>{t.inventory.tabOpnames} ({stockOpnames.length})</span>
          </button>
        </div>

        {/* Tab 1: Ingredients Table */}
        {activeTab === "ingredients" && (
          <div className="space-y-4">
            
            {/* Search & Category Filter */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t.inventory.searchPlaceholder}
                  className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2 text-xs sm:text-sm font-medium text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => setSelectedCategory(c.key)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition whitespace-nowrap ${
                      selectedCategory === c.key
                        ? "bg-emerald-600 text-white"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Ingredients Table */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider dark:border-slate-800 dark:bg-slate-800">
                    <tr>
                      <th className="p-4">{t.inventory.thIngredientName}</th>
                      <th className="p-4">{t.inventory.thCategory}</th>
                      <th className="p-4">{t.inventory.thCurrentStock}</th>
                      <th className="p-4">{isEnglish ? "Min. Limit" : "Batas Min."}</th>
                      <th className="p-4">{isEnglish ? "Package Price" : "Harga Beli Kemasan"}</th>
                      <th className="p-4">{t.inventory.thUnitCost}</th>
                      <th className="p-4">{t.inventory.thStatus}</th>
                      <th className="p-4 text-right">{t.inventory.thAction}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredIngredients.map((ing) => {
                      const isLow = ing.currentStock <= ing.minStockAlert;

                      return (
                        <tr key={ing.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="p-4 font-bold text-slate-900 dark:text-white">
                            {ing.name}
                          </td>
                          <td className="p-4">
                            <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                              {ing.category}
                            </span>
                          </td>
                          <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">
                            {ing.currentStock.toLocaleString()} {ing.unit}
                          </td>
                          <td className="p-4 font-mono text-slate-500">
                            {ing.minStockAlert.toLocaleString()} {ing.unit}
                          </td>
                          <td className="p-4 font-mono text-slate-700 dark:text-slate-300">
                            {formatRupiah(ing.packagePrice)} / {ing.packageSize} {ing.unit}
                          </td>
                          <td className="p-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {formatRupiah(ing.unitCost)} / {ing.unit}
                          </td>
                          <td className="p-4">
                            {isLow ? (
                              <span className="flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 w-fit">
                                <AlertTriangle className="h-3 w-3" />
                                <span>{isEnglish ? "Low" : "Menipis"}</span>
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 w-fit">
                                <CheckCircle2 className="h-3 w-3" />
                                <span>{isEnglish ? "Safe" : "Aman"}</span>
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setOpnameIngredient(ing);
                                  setIsOpnameModalOpen(true);
                                }}
                                className="flex items-center gap-1 rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 transition"
                                title={isEnglish ? "Perform Opname" : "Lakukan Opname"}
                              >
                                <ClipboardCheck className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">{t.inventory.actionOpname}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setIngredientToEdit(ing);
                                  setIsFormModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                                title={isEnglish ? "Edit Ingredient" : "Edit Bahan"}
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredIngredients.length === 0 && (
                      <tr>
                        <td colSpan={8} className="p-10 text-center text-slate-400">
                          <Package className="h-9 w-9 mx-auto mb-2 opacity-30" />
                          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{t.inventory.emptyIngredients}</p>
                          <p className="text-[11px] text-slate-400 mt-1">
                            {isEnglish 
                              ? "Click \"+ New Ingredient\" above to record starting inventory."
                              : "Klik tombol \"+ Bahan Baru\" di atas untuk mencatat stok awal Anda."}
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Stock Opname Records Table */}
        {activeTab === "opnames" && (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider dark:border-slate-800 dark:bg-slate-800">
                  <tr>
                    <th className="p-4">{t.inventory.thOpnameDate}</th>
                    <th className="p-4">{t.inventory.thOpnameIngredient}</th>
                    <th className="p-4">{t.inventory.thOpnameSystem}</th>
                    <th className="p-4">{t.inventory.thOpnameActual}</th>
                    <th className="p-4">{t.inventory.thOpnameDiff}</th>
                    <th className="p-4">{t.inventory.thOpnameReason}</th>
                    <th className="p-4">{t.inventory.thOpnameOperator}</th>
                    <th className="p-4">{isEnglish ? "Notes" : "Catatan"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {stockOpnames.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400">
                        {t.inventory.emptyOpnames}
                      </td>
                    </tr>
                  ) : (
                    stockOpnames.map((record) => (
                      <tr key={record.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-4 text-slate-500 font-mono">
                          {formatDate(record.timestamp)}
                        </td>
                        <td className="p-4 font-bold text-slate-900 dark:text-white">
                          {record.ingredientName}
                        </td>
                        <td className="p-4 font-mono">
                          {record.systemStock} {record.unit}
                        </td>
                        <td className="p-4 font-mono font-bold">
                          {record.actualStock} {record.unit}
                        </td>
                        <td className="p-4 font-mono font-extrabold">
                          <span
                            className={
                              record.difference === 0
                                ? "text-slate-500"
                                : record.difference > 0
                                ? "text-emerald-600"
                                : "text-rose-600"
                            }
                          >
                            {record.difference > 0 ? `+${record.difference}` : record.difference} {record.unit}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            {record.reason}
                          </span>
                        </td>
                        <td className="p-4 text-slate-600 dark:text-slate-400">
                          {record.recordedBy}
                        </td>
                        <td className="p-4 text-slate-500 italic max-w-xs truncate">
                          {record.note || "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modals */}
        {isOpnameModalOpen && (
          <StockOpnameModal
            ingredient={opnameIngredient}
            onClose={() => {
              setIsOpnameModalOpen(false);
              setOpnameIngredient(null);
            }}
          />
        )}

        {isFormModalOpen && (
          <IngredientFormModal
            ingredientToEdit={ingredientToEdit}
            onClose={() => {
              setIsFormModalOpen(false);
              setIngredientToEdit(null);
            }}
          />
        )}

      </div>
    </AppShell>
  );
}
