"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { usePosStore } from "@/store/usePosStore";
import { formatRupiah, formatTime } from "@/lib/utils";
import { Order, PaymentMethod } from "@/types/pos";
import { 
  Receipt, 
  X, 
  Clock, 
  PlusCircle, 
  Check, 
  Users
} from "lucide-react";

export const OpenBillsDrawer: React.FC = () => {
  const router = useRouter();
  const { 
    isOpenBillsDrawerOpen, 
    setOpenBillsDrawerOpen, 
    orders, 
    loadOrderIntoCart, 
    settleOpenBill
  } = usePosStore();

  const [settlingOrderId, setSettlingOrderId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [cashAmountInput, setCashAmountInput] = useState<number>(0);

  if (!isOpenBillsDrawerOpen) return null;

  const openBills = orders.filter((o) => o.status === "open_bill");

  const handleEditBill = (order: Order) => {
    loadOrderIntoCart(order);
    setOpenBillsDrawerOpen(false);
    router.push("/pos");
  };

  const handleStartSettle = (order: Order) => {
    setSettlingOrderId(order.id);
    setCashAmountInput(order.total);
  };

  const handleConfirmSettle = (order: Order) => {
    settleOpenBill(order.id, paymentMethod, cashAmountInput);
    setSettlingOrderId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative flex flex-col w-full max-w-md h-full bg-white dark:bg-[#111827] border-l border-slate-200 dark:border-slate-800 shadow-2xl animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Daftar Open Bill ({openBills.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tagihan meja berjalan & pesanan pending
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setOpenBillsDrawerOpen(false);
              setSettlingOrderId(null);
            }}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {openBills.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Receipt className="h-12 w-12 text-slate-300 dark:text-slate-700 mb-2" />
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Tidak ada Open Bill yang aktif
              </p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                Anda dapat menyimpan tagihan pelanggan di kasir menggunakan tombol "Simpan Tagihan (Open Bill)".
              </p>
            </div>
          ) : (
            openBills.map((bill) => {
              const isSettling = settlingOrderId === bill.id;

              return (
                <div
                  key={bill.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-emerald-300 dark:border-slate-800 dark:bg-[#151c2e] transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60">
                          {bill.tableNumber || "Takeaway"}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {bill.invoiceNumber}
                        </span>
                      </div>
                      <div className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-slate-400" />
                        <span>{bill.customerName || "Tamu Walk-in"}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono">
                        {formatRupiah(bill.total)}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center justify-end gap-1 mt-0.5">
                        <Clock className="h-3 w-3" />
                        <span>{formatTime(bill.timestamp)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Items list snippet */}
                  <div className="mt-3 rounded-xl bg-slate-50 p-2 text-[11px] dark:bg-slate-800/60 divide-y divide-slate-100 dark:divide-slate-800">
                    {bill.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between py-1 text-slate-600 dark:text-slate-300">
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span className="font-bold font-mono">{formatRupiah(item.subtotal)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Pelunasan Panel or Action Buttons */}
                  {isSettling ? (
                    <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 dark:border-emerald-900/40 dark:bg-emerald-950/20 animate-in fade-in duration-100">
                      <div className="text-xs font-bold text-emerald-900 dark:text-emerald-300 mb-2">
                        Pilih Metode Pelunasan:
                      </div>

                      <div className="grid grid-cols-3 gap-1.5 mb-3">
                        {(["cash", "qris", "transfer"] as PaymentMethod[]).map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setPaymentMethod(m)}
                            className={`rounded-lg py-1.5 text-[11px] font-bold uppercase transition ${
                              paymentMethod === m
                                ? "bg-emerald-600 text-white shadow-2xs"
                                : "bg-white text-slate-700 border border-slate-200 dark:bg-[#111827] dark:text-slate-200 dark:border-slate-700"
                            }`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>

                      {paymentMethod === "cash" && (
                        <div className="mb-2">
                          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                            Nominal Uang Tunai Diterima:
                          </label>
                          <input
                            type="number"
                            value={cashAmountInput}
                            onChange={(e) => setCashAmountInput(Number(e.target.value))}
                            className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-900 dark:border-slate-700 dark:bg-[#111827] dark:text-white"
                          />
                          <div className="mt-1 flex justify-between text-[11px]">
                            <span className="text-slate-500">Kembalian:</span>
                            <span className="font-bold text-emerald-600 font-mono">
                              {formatRupiah(Math.max(0, cashAmountInput - bill.total))}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setSettlingOrderId(null)}
                          className="flex-1 rounded-lg border border-slate-200 bg-white py-1.5 text-[11px] font-semibold text-slate-600 dark:bg-[#111827] dark:text-slate-300"
                        >
                          Batal
                        </button>
                        <button
                          type="button"
                          onClick={() => handleConfirmSettle(bill)}
                          className="flex-1 rounded-lg bg-emerald-600 py-1.5 text-[11px] font-bold text-white hover:bg-emerald-700 transition"
                        >
                          Konfirmasi Lunas
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditBill(bill)}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 transition"
                      >
                        <PlusCircle className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Tambah Item</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStartSettle(bill)}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-2xs transition"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Bayar / Lunasi</span>
                      </button>
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
