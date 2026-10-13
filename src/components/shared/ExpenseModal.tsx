"use client";

import React, { useState } from "react";
import { usePosStore } from "@/store/usePosStore";
import { formatRupiah } from "@/lib/utils";
import { Expense } from "@/types/pos";
import { PlusCircle, X, DollarSign, Wallet, Building2, Tag } from "lucide-react";

export const ExpenseModal: React.FC = () => {
  const { isExpenseModalOpen, setExpenseModalOpen, addExpense, currentShift } = usePosStore();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Expense["category"]>("Bahan Tambahan");
  const [amount, setAmount] = useState<number>(35000);
  const [source, setSource] = useState<Expense["source"]>("cash_drawer");
  const [note, setNote] = useState("");

  if (!isExpenseModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || amount <= 0) return;

    addExpense({
      title,
      category,
      amount,
      source,
      cashierName: currentShift?.cashierName || "Kasir On-Duty",
      note,
    });

    setTitle("");
    setNote("");
  };

  const quickTemplates = [
    { title: "Beli Es Batu Kristal 2 Bal", amount: 24000, category: "Bahan Tambahan" as const },
    { title: "Refill Gas LPG 12kg Kitchen", amount: 145000, category: "Utilitas & Listrik" as const },
    { title: "Beli Galon Air Minum 2 Pcs", amount: 40000, category: "Bahan Tambahan" as const },
    { title: "Plastik Cup Carrier & Kantong", amount: 35000, category: "Operasional Toko" as const },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400">
              <PlusCircle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Catat Beban Operasional Kas
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pengeluaran harian outlet & kas kasir
              </p>
            </div>
          </div>
          <button
            onClick={() => setExpenseModalOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Template Chips */}
        <div className="mt-3">
          <div className="text-[11px] font-semibold text-slate-400 mb-1.5">Template Cepat:</div>
          <div className="flex flex-wrap gap-1.5">
            {quickTemplates.map((t, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setTitle(t.title);
                  setAmount(t.amount);
                  setCategory(t.category);
                }}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-medium text-slate-600 hover:border-emerald-400 hover:bg-emerald-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                {t.title}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Keperluan / Nama Biaya
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Belanja es batu kristal 2 bal"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Kategori Beban
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Expense["category"])}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-medium text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="Bahan Tambahan">Bahan Tambahan</option>
                <option value="Utilitas & Listrik">Utilitas & Listrik</option>
                <option value="Operasional Toko">Operasional Toko</option>
                <option value="Transport & Logistik">Transport & Logistik</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nominal Biaya (Rp)
              </label>
              <input
                type="number"
                required
                min={1000}
                step={1000}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Sumber Dana Pengeluaran
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSource("cash_drawer")}
                className={`flex items-center gap-2 rounded-xl border p-2.5 text-xs font-semibold transition ${
                  source === "cash_drawer"
                    ? "border-rose-500 bg-rose-50 text-rose-900 dark:bg-rose-950/40 dark:text-rose-200"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                <Wallet className="h-4 w-4 text-rose-600" />
                <div className="text-left">
                  <div>Kas Laci Kasir</div>
                  <div className="text-[10px] font-normal text-slate-500">Potong uang laci</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSource("bank_transfer")}
                className={`flex items-center gap-2 rounded-xl border p-2.5 text-xs font-semibold transition ${
                  source === "bank_transfer"
                    ? "border-sky-500 bg-sky-50 text-sky-900 dark:bg-sky-950/40 dark:text-sky-200"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                <Building2 className="h-4 w-4 text-sky-600" />
                <div className="text-left">
                  <div>Rekening Bank</div>
                  <div className="text-[10px] font-normal text-slate-500">Transfer owner</div>
                </div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Catatan / Bukti Pengeluaran
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Contoh: Bon nota toko es kristal terlampir"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setExpenseModalOpen(false)}
              className="flex-1 rounded-xl border border-slate-200 bg-slate-100 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition"
            >
              Simpan Pengeluaran
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
