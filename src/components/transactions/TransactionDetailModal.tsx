"use client";

import React, { useState } from "react";
import { Order } from "@/types/pos";
import { usePosStore } from "@/store/usePosStore";
import { useTranslation } from "@/lib/translations";
import { formatRupiah, formatDate } from "@/lib/utils";
import { VoidModal } from "./VoidModal";
import { 
  Receipt, 
  X, 
  Printer, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Share2, 
  RotateCcw 
} from "lucide-react";

interface TransactionDetailModalProps {
  order: Order;
  onClose: () => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  order,
  onClose,
}) => {
  const { setActiveReceiptOrder, setReceiptModalOpen } = usePosStore();
  const { t, isEnglish } = useTranslation();
  const [isVoidModalOpen, setIsVoidModalOpen] = useState(false);

  const handlePrintAgain = () => {
    setActiveReceiptOrder(order);
    setReceiptModalOpen(true);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
        <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 max-h-[90vh] overflow-y-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                <Receipt className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {t.transactionDetail.modalTitle}
                </h2>
                <p className="text-xs text-slate-500 font-mono">
                  {order.invoiceNumber}
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

          {/* Status Banner */}
          <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 p-3 border border-slate-200 dark:border-slate-800 dark:bg-slate-800">
            <div>
              <div className="text-[11px] text-slate-500">{isEnglish ? "Order Status" : "Status Pesanan"}</div>
              <div className="text-xs font-bold capitalize text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5">
                {order.status === "completed" && (
                  <span className="flex items-center gap-1 text-emerald-600 font-bold">
                    <CheckCircle2 className="h-4 w-4" /> {isEnglish ? "Completed (Paid)" : "Lunas Selesai"}
                  </span>
                )}
                {order.status === "open_bill" && (
                  <span className="flex items-center gap-1 text-amber-600 font-bold">
                    <Clock className="h-4 w-4" /> {isEnglish ? "Active Open Bill" : "Open Bill Aktif"}
                  </span>
                )}
                {order.status === "void" && (
                  <span className="flex items-center gap-1 text-rose-600 font-bold">
                    <AlertTriangle className="h-4 w-4" /> {isEnglish ? "Cancelled (Void)" : "Transaksi Dibatalkan (Void)"}
                  </span>
                )}
              </div>
            </div>

            <div className="text-right text-xs">
              <div className="text-[11px] text-slate-500">{isEnglish ? "Transaction Time" : "Waktu Transaksi"}</div>
              <div className="font-semibold text-slate-700 dark:text-slate-300">
                {formatDate(order.timestamp)}
              </div>
            </div>
          </div>

          {/* Void notice if void */}
          {order.status === "void" && (
            <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-300">
              <div className="font-bold">{isEnglish ? "Void Reason:" : "Alasan Void:"} {order.voidReason}</div>
              <div className="text-[11px] text-rose-600 mt-0.5">
                {isEnglish ? "Cancelled at:" : "Dibatalkan pada:"} {order.voidedAt} • {isEnglish ? "Stock restored:" : "Stok dikembalikan:"} {order.restoredStock ? (isEnglish ? "Yes" : "Ya") : (isEnglish ? "No" : "Tidak")}
              </div>
            </div>
          )}

          {/* Items Table */}
          <div className="mt-4">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              {isEnglish ? `Ordered Items (${order.items.length}):` : `Daftar Pesanan (${order.items.length} Menu):`}
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-3 text-xs flex justify-between items-start bg-white dark:bg-slate-900">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">
                      {item.quantity}x {item.name}
                    </div>
                    {item.notes && (
                      <div className="text-[11px] text-slate-500 italic mt-0.5">
                        * {item.notes}
                      </div>
                    )}
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      @ {formatRupiah(item.price)}
                    </div>
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white font-mono">
                    {formatRupiah(item.subtotal)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="mt-4 space-y-1.5 rounded-xl bg-slate-50 p-3.5 text-xs text-slate-600 dark:bg-slate-800/40 dark:text-slate-400 font-mono">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-bold text-slate-900 dark:text-white">{formatRupiah(order.subtotal)}</span>
            </div>
            {order.discountNominal > 0 && (
              <div className="flex justify-between text-rose-600 font-bold">
                <span>{isEnglish ? "Discount:" : "Diskon:"}</span>
                <span>-{formatRupiah(order.discountNominal)}</span>
              </div>
            )}
            {order.taxNominal > 0 && (
              <div className="flex justify-between">
                <span>{isEnglish ? "Tax (VAT):" : "PPN:"}</span>
                <span>{formatRupiah(order.taxNominal)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700 font-sans">
              <span>{isEnglish ? "TOTAL BILL:" : "TOTAL TAGIHAN:"}</span>
              <span className="text-emerald-600 dark:text-emerald-400">{formatRupiah(order.total)}</span>
            </div>
          </div>

          {/* Payment metadata */}
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-xl border border-slate-200 p-2.5 dark:border-slate-800">
              <span className="text-[11px] text-slate-500">{isEnglish ? "Payment Method:" : "Metode Bayar:"}</span>
              <div className="font-bold uppercase text-slate-900 dark:text-white">{order.paymentMethod}</div>
            </div>
            <div className="rounded-xl border border-slate-200 p-2.5 dark:border-slate-800">
              <span className="text-[11px] text-slate-500">{isEnglish ? "Cashier on Duty:" : "Kasir Bertugas:"}</span>
              <div className="font-bold text-slate-900 dark:text-white">{order.cashierName}</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-5 flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            {order.status !== "void" && (
              <button
                type="button"
                onClick={() => setIsVoidModalOpen(true)}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300 transition"
              >
                <AlertTriangle className="h-4 w-4" />
                <span>{isEnglish ? "Void (Cancel)" : "Void (Batalkan)"}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handlePrintAgain}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition"
            >
              <Printer className="h-4 w-4" />
              <span>{isEnglish ? "Reprint Receipt / Share WA" : "Cetak Ulang Struk / Share WA"}</span>
            </button>
          </div>

        </div>
      </div>

      {isVoidModalOpen && (
        <VoidModal
          order={order}
          onClose={() => {
            setIsVoidModalOpen(false);
            onClose();
          }}
        />
      )}
    </>
  );
};
