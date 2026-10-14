"use client";

import React, { useState } from "react";
import { usePosStore } from "@/store/usePosStore";
import { useTranslation } from "@/lib/translations";
import { X, Check, UtensilsCrossed } from "lucide-react";

interface TablePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TablePickerModal: React.FC<TablePickerModalProps> = ({ isOpen, onClose }) => {
  const { tableNumber, setTableNumber, setOrderType, orders } = usePosStore();
  const { t, isEnglish } = useTranslation();
  const [customTable, setCustomTable] = useState("");

  if (!isOpen) return null;

  // Find active open bills to indicate occupied tables
  const occupiedTables = orders
    .filter((o) => o.status === "open_bill" && o.tableNumber)
    .map((o) => o.tableNumber);

  const indoorTables = Array.from(
    { length: 12 },
    (_, i) => `${isEnglish ? "Table" : "Meja"} ${String(i + 1).padStart(2, "0")}`
  );
  const vipTables = ["VIP 01", "VIP 02", "VIP 03"];
  const outdoorTables = ["Outdoor 01", "Outdoor 02", "Outdoor 03", "Outdoor 04"];

  const handleSelectTable = (tbl: string) => {
    setTableNumber(tbl);
    setOrderType("dine_in");
    onClose();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTable.trim()) return;
    setTableNumber(customTable.trim());
    setOrderType("dine_in");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900 max-h-[88vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5 text-emerald-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {t.tablePicker.title}
              </h2>
              <p className="text-[11px] text-slate-500">{t.tablePicker.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Indoor Area */}
        <div className="mt-3">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            {t.tablePicker.mainArea}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {indoorTables.map((tbl) => {
              const isSelected = tableNumber === tbl;
              const isOccupied = occupiedTables.includes(tbl);

              return (
                <button
                  key={tbl}
                  type="button"
                  onClick={() => handleSelectTable(tbl)}
                  className={`flex flex-col items-center justify-center rounded-xl p-2.5 text-xs font-bold border transition ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                      : isOccupied
                      ? "border-rose-300 bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-emerald-400 hover:bg-emerald-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  }`}
                >
                  <span>{tbl}</span>
                  {isOccupied && !isSelected && (
                    <span className="text-[9px] font-normal text-rose-600 dark:text-rose-400 mt-0.5">
                      {t.tablePicker.occupiedBadge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* VIP & Outdoor */}
        <div className="mt-4">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            {t.tablePicker.vipArea}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[...vipTables, ...outdoorTables].map((tbl) => {
              const isSelected = tableNumber === tbl;
              const isOccupied = occupiedTables.includes(tbl);

              return (
                <button
                  key={tbl}
                  type="button"
                  onClick={() => handleSelectTable(tbl)}
                  className={`flex flex-col items-center justify-center rounded-xl p-2.5 text-xs font-bold border transition ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                      : isOccupied
                      ? "border-rose-300 bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-emerald-400 hover:bg-emerald-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  }`}
                >
                  <span>{tbl}</span>
                  {isOccupied && !isSelected && (
                    <span className="text-[9px] font-normal text-rose-600 dark:text-rose-400 mt-0.5">
                      {t.tablePicker.occupiedBadge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Input */}
        <form onSubmit={handleCustomSubmit} className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
          <input
            type="text"
            value={customTable}
            onChange={(e) => setCustomTable(e.target.value)}
            placeholder={t.tablePicker.customPlaceholder}
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          <button
            type="submit"
            className="rounded-xl bg-emerald-600 text-white px-3.5 py-2 text-xs font-bold hover:bg-emerald-700 transition"
          >
            {t.tablePicker.selectBtn}
          </button>
        </form>

      </div>
    </div>
  );
};
