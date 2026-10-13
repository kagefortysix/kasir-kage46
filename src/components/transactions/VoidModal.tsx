"use client";

import React, { useState } from "react";
import { Order } from "@/types/pos";
import { usePosStore } from "@/store/usePosStore";
import { formatRupiah } from "@/lib/utils";
import { AlertTriangle, X, RotateCcw } from "lucide-react";

interface VoidModalProps {
  order: Order;
  onClose: () => void;
}

export const VoidModal: React.FC<VoidModalProps> = ({ order, onClose }) => {
  const { voidOrder } = usePosStore();

  const [reason, setReason] = useState("Salah input jumlah pesanan");
  const [restoreStock, setRestoreStock] = useState(true);

  const handleConfirmVoid = (e: React.FormEvent) => {
    e.preventDefault();
    voidOrder(order.id, reason, restoreStock);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-2xl border border-rose-200 bg-white p-5 sm:p-6 shadow-2xl dark:border-rose-900/40 dark:bg-slate-900">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Batalkan Transaksi (Void)
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                {order.invoiceNumber} • {formatRupiah(order.total)}
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

        <form onSubmit={handleConfirmVoid} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Alasan Pembatalan (Void)
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-rose-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="Salah input jumlah pesanan">Salah input jumlah pesanan oleh kasir</option>
              <option value="Pelanggan batal memesan">Pelanggan membatalkan pesanan (Walk-out)</option>
              <option value="Metode pembayaran salah">Metode pembayaran salah / revisi tagihan</option>
              <option value="Salah input menu / meja">Salah input menu / salah meja</option>
              <option value="Lainnya">Alasan operasional lainnya</option>
            </select>
          </div>

          {/* Restore stock checkbox */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={restoreStock}
                onChange={(e) => setRestoreStock(e.target.checked)}
                className="mt-0.5 rounded text-rose-600 focus:ring-rose-500 h-4 w-4"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                  <RotateCcw className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Kembalikan Stok Bahan Baku Otomatis</span>
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Stok bahan baku dari racikan resep menu akan otomatis dikembalikan (restored) ke gudang inventori.
                </p>
              </div>
            </label>
          </div>

          <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3 text-[11px] text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
            ⚠️ Transaksi yang dibatalkan akan ditandai dengan status <strong>VOID</strong> pada laporan keuangan dan total kas shift akan disesuaikan.
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 bg-slate-100 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              Kembali
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-600/20 hover:bg-rose-700 transition"
            >
              Konfirmasi Void
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
