"use client";

import React, { useState } from "react";
import { usePosStore } from "@/store/usePosStore";
import { formatRupiah, formatDate } from "@/lib/utils";
import { 
  Clock, 
  X, 
  DollarSign, 
  Calculator, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  Printer, 
  User 
} from "lucide-react";

export const ShiftModal: React.FC = () => {
  const { 
    isShiftModalOpen, 
    setShiftModalOpen, 
    currentShift, 
    openShift, 
    closeShift, 
    role 
  } = usePosStore();

  // Open Shift Form State
  const [startingCashInput, setStartingCashInput] = useState<number>(200000);
  const [cashierNameInput, setCashierNameInput] = useState<string>("Rizky Ramadhan");
  const [openNotesInput, setOpenNotesInput] = useState<string>("Shift Pagi");

  // Close Shift Form State
  const [actualCashInput, setActualCashInput] = useState<number>(
    currentShift ? currentShift.expectedCash : 0
  );
  const [closeNotesInput, setCloseNotesInput] = useState<string>("");
  const [showSettlementPreview, setShowSettlementPreview] = useState<boolean>(false);

  if (!isShiftModalOpen) return null;

  const isShiftActive = currentShift && currentShift.status === "open";
  const expectedCash = currentShift ? currentShift.expectedCash : 0;
  const cashDifference = actualCashInput - expectedCash;

  const handleOpenShift = (e: React.FormEvent) => {
    e.preventDefault();
    openShift(startingCashInput, cashierNameInput, openNotesInput);
  };

  const handleCloseShift = () => {
    closeShift(actualCashInput, closeNotesInput);
    setShowSettlementPreview(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {isShiftActive ? "Manajemen & Tutup Shift Kasir" : "Buka Shift Kasir Baru"}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isShiftActive ? "Rekonsiliasi uang fisik di laci kasir" : "Catat modal awal uang kembalian"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShiftModalOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        {!isShiftActive ? (
          /* FORM BUKA SHIFT */
          <form onSubmit={handleOpenShift} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nama Kasir Bertugas
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={cashierNameInput}
                  onChange={(e) => setCashierNameInput(e.target.value)}
                  placeholder="Contoh: Rizky Ramadhan"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs font-medium text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Modal Awal Kasir (Uang Kembalian di Laci)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-500">Rp</span>
                <input
                  type="number"
                  required
                  min={0}
                  step={5000}
                  value={startingCashInput}
                  onChange={(e) => setStartingCashInput(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 py-2 text-sm font-bold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div className="flex gap-2 mt-2">
                {[100000, 200000, 300000, 500000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setStartingCashInput(val)}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-700 hover:border-emerald-400 hover:bg-emerald-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    {formatRupiah(val)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Catatan Shift (Opsional)
              </label>
              <input
                type="text"
                value={openNotesInput}
                onChange={(e) => setOpenNotesInput(e.target.value)}
                placeholder="Contoh: Shift Pagi (07:00 - 15:00)"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-[11px] text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300">
              💡 Modal kasir digunakan sebagai acuan uang kembalian. Seluruh transaksi tunai dan pengeluaran laci akan direkonsiliasi saat tutup shift.
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 active:scale-[0.99] transition"
            >
              Buka Shift Kasir Sekarang
            </button>
          </form>
        ) : (
          /* RINGKASAN & TUTUP SHIFT */
          <div className="mt-4 space-y-4">
            {/* Shift info badge */}
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 border border-slate-200 dark:border-slate-800 dark:bg-slate-800/40">
              <div>
                <div className="text-[11px] text-slate-500">Kasir Bertugas</div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">{currentShift.cashierName}</div>
              </div>
              <div className="text-right">
                <div className="text-[11px] text-slate-500">Mulai Shift</div>
                <div className="text-xs font-medium text-slate-700 dark:text-slate-300">{formatDate(currentShift.openedAt)}</div>
              </div>
            </div>

            {/* Reconciliation breakdown cards */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl border border-slate-200 p-2.5 dark:border-slate-800">
                <span className="text-[11px] text-slate-500">Modal Kas Awal</span>
                <div className="text-sm font-bold text-slate-900 dark:text-white">{formatRupiah(currentShift.startingCash)}</div>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-2.5 dark:border-emerald-900/30 dark:bg-emerald-950/20">
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400">Total Tunai Masuk</span>
                <div className="text-sm font-bold text-emerald-700 dark:text-emerald-300">+{formatRupiah(currentShift.totalCashSales)}</div>
              </div>
              <div className="rounded-xl border border-sky-200 bg-sky-50/50 p-2.5 dark:border-sky-900/30 dark:bg-sky-950/20">
                <span className="text-[11px] text-sky-700 dark:text-sky-400">Total Non-Tunai</span>
                <div className="text-sm font-bold text-sky-700 dark:text-sky-300">{formatRupiah(currentShift.totalNonCashSales)}</div>
              </div>
              <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-2.5 dark:border-rose-900/30 dark:bg-rose-950/20">
                <span className="text-[11px] text-rose-700 dark:text-rose-400">Pengeluaran Laci</span>
                <div className="text-sm font-bold text-rose-700 dark:text-rose-300">-{formatRupiah(currentShift.totalExpenses)}</div>
              </div>
            </div>

            {/* Expected Cash in drawer */}
            <div className="rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/40 p-3.5 dark:border-emerald-800/60 dark:bg-emerald-950/20">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-emerald-900 dark:text-emerald-300">
                    Uang Tunai Laci Sistem (Expected Cash)
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Modal + Tunai Masuk - Pengeluaran Laci
                  </div>
                </div>
                <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                  {formatRupiah(expectedCash)}
                </div>
              </div>
            </div>

            {/* Input actual physical cash */}
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                Hitung Fisik Uang di Laci Kasir (Actual Cash)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-500">Rp</span>
                <input
                  type="number"
                  min={0}
                  step={1000}
                  value={actualCashInput}
                  onChange={(e) => setActualCashInput(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3 py-2 text-base font-extrabold text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {/* Difference indication */}
              <div className="mt-2 flex items-center justify-between rounded-lg p-2 text-xs font-semibold">
                <span className="text-slate-500">Selisih Kas Laci:</span>
                <span
                  className={`font-bold ${
                    cashDifference === 0
                      ? "text-emerald-600"
                      : cashDifference > 0
                      ? "text-sky-600"
                      : "text-rose-600"
                  }`}
                >
                  {cashDifference === 0
                    ? "✓ Pas (Tidak Ada Selisih)"
                    : cashDifference > 0
                    ? `+${formatRupiah(cashDifference)} (Lebih)`
                    : `${formatRupiah(cashDifference)} (Kurang / Minus)`}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Catatan Penutupan Shift
              </label>
              <input
                type="text"
                value={closeNotesInput}
                onChange={(e) => setCloseNotesInput(e.target.value)}
                placeholder="Contoh: Selisih uang koin tip atau uang pas diserahkan ke shift sore"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShiftModalOpen(false)}
                className="flex-1 rounded-xl border border-slate-200 bg-slate-100 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                Kembali ke Kasir
              </button>
              <button
                type="button"
                onClick={handleCloseShift}
                className="flex-1 rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-600/20 hover:bg-rose-700 transition"
              >
                Tutup Shift & Rekap
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
