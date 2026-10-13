"use client";

import React, { useState } from "react";
import { usePosStore } from "@/store/usePosStore";
import { formatRupiah } from "@/lib/utils";
import { PaymentMethod } from "@/types/pos";
import { 
  CreditCard, 
  Banknote, 
  QrCode, 
  Building2, 
  X, 
  CheckCircle, 
  User
} from "lucide-react";

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutModalOpen, 
    setCheckoutModalOpen, 
    cart, 
    orderType, 
    tableNumber, 
    discountNominal, 
    taxEnabled, 
    setTaxEnabled,
    settings, 
    currentShift, 
    customers, 
    selectedCustomerId, 
    setSelectedCustomerId, 
    completeCheckout 
  } = usePosStore();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [cashGiven, setCashGiven] = useState<number>(0);

  if (!isCheckoutModalOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxRate = taxEnabled ? settings.taxPercentage / 100 : 0;
  const taxNominal = Math.round((subtotal - discountNominal) * taxRate);
  const total = Math.max(0, subtotal - discountNominal + taxNominal);

  // default cash given to exact total initially if 0
  const activeCashGiven = cashGiven > 0 ? cashGiven : total;
  const change = Math.max(0, activeCashGiven - total);

  const quickNominals = [
    { label: "Uang Pas", value: total },
    { label: "Rp 20.000", value: 20000 },
    { label: "Rp 50.000", value: 50000 },
    { label: "Rp 100.000", value: 100000 },
    { label: "Rp 200.000", value: 200000 },
  ].filter((item) => item.value >= total || item.label === "Uang Pas");

  const handlePay = () => {
    const cashier = currentShift?.cashierName || "Kasir Utama";
    completeCheckout(paymentMethod, activeCashGiven, cashier);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative flex flex-col w-full max-w-xl rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-[#111827] max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Pembayaran & Checkout
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {orderType === "dine_in" ? `Dine-In (${tableNumber})` : "Takeaway"} • {cart.length} Jenis Menu
            </p>
          </div>
          <button
            onClick={() => setCheckoutModalOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Total Bill Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-5 py-4 text-white flex items-center justify-between">
          <div>
            <div className="text-xs text-emerald-100 font-medium">Total Tagihan Pesanan</div>
            <div className="text-2xl font-black font-mono">{formatRupiah(total)}</div>
          </div>
          <div className="text-right text-xs text-emerald-100">
            <div>Subtotal: {formatRupiah(subtotal)}</div>
            {discountNominal > 0 && <div>Diskon: -{formatRupiah(discountNominal)}</div>}
            {taxNominal > 0 && <div>PPN: +{formatRupiah(taxNominal)}</div>}
          </div>
        </div>

        {/* Quick Tax & Total Modifier Bar */}
        <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/70 px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Pajak Transaksi:</span>
            <button
              type="button"
              onClick={() => setTaxEnabled(!taxEnabled)}
              className={`flex items-center gap-2 rounded-lg px-2.5 py-1 text-xs font-bold transition select-none cursor-pointer active:scale-95 ${
                taxEnabled
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-200 text-slate-600 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300"
              }`}
            >
              <div
                className={`relative inline-flex h-3.5 w-6 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out ${
                  taxEnabled ? "bg-white/30" : "bg-slate-400 dark:bg-slate-500"
                }`}
              >
                <span
                  className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                    taxEnabled ? "translate-x-3" : "translate-x-0.5"
                  }`}
                />
              </div>
              <span>{taxEnabled ? `PPN ${settings.taxPercentage}% Aktif` : "PPN Nonaktif (Bebas Pajak)"}</span>
            </button>
          </div>
          <div className="text-right text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
            {taxEnabled ? `+${formatRupiah(taxNominal)}` : "Rp 0"}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4">
          
          {/* Link to Customer */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Pelanggan (Opsional)
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <select
                value={selectedCustomerId || ""}
                onChange={(e) => setSelectedCustomerId(e.target.value || undefined)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs font-medium text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="">-- Tamu Walk-in --</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Payment Method Tabs */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Pilih Metode Pembayaran
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("cash")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition ${
                  paymentMethod === "cash"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200 shadow-xs"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                <Banknote className="h-5 w-5 mb-1 text-emerald-600 dark:text-emerald-400" />
                <span>Tunai (Cash)</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("qris")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition ${
                  paymentMethod === "qris"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200 shadow-xs"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                <QrCode className="h-5 w-5 mb-1 text-rose-500" />
                <span>QRIS Instant</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("transfer")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition ${
                  paymentMethod === "transfer"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200 shadow-xs"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                <Building2 className="h-5 w-5 mb-1 text-sky-600" />
                <span>Transfer Bank</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition ${
                  paymentMethod === "card"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200 shadow-xs"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                <CreditCard className="h-5 w-5 mb-1 text-indigo-600" />
                <span>Debit / EDC</span>
              </button>
            </div>
          </div>

          {/* Conditional Detail per Method */}
          {paymentMethod === "cash" && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Uang Tunai Diterima (Rp)
                </label>
                <input
                  type="number"
                  min={0}
                  step={1000}
                  value={activeCashGiven}
                  onChange={(e) => setCashGiven(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-base font-black text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-[#111827] dark:text-white"
                />
              </div>

              {/* Shortcut buttons */}
              <div>
                <div className="text-[11px] text-slate-500 mb-1 font-medium">Pecahan Cepat:</div>
                <div className="flex flex-wrap gap-1.5">
                  {quickNominals.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCashGiven(item.value)}
                      className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${
                        activeCashGiven === item.value
                          ? "bg-emerald-600 text-white shadow-2xs"
                          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-200"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Kembalian Display */}
              <div className="flex items-center justify-between rounded-xl bg-emerald-50 p-3 border border-emerald-200 dark:border-emerald-900/40 dark:bg-emerald-950/30">
                <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                  Uang Kembalian (Change):
                </span>
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  {formatRupiah(change)}
                </span>
              </div>
            </div>
          )}

          {paymentMethod === "qris" && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-800/40 text-center">
              <div className="rounded-xl bg-white p-3 shadow-md border border-slate-200 dark:border-slate-700">
                {/* Simulated dynamic QR code SVG */}
                <svg className="w-36 h-36" viewBox="0 0 100 100">
                  <rect width="100" height="100" fill="white" />
                  <rect x="10" y="10" width="25" height="25" fill="black" />
                  <rect x="15" y="15" width="15" height="15" fill="white" />
                  <rect x="18" y="18" width="9" height="9" fill="black" />
                  <rect x="65" y="10" width="25" height="25" fill="black" />
                  <rect x="70" y="15" width="15" height="15" fill="white" />
                  <rect x="73" y="18" width="9" height="9" fill="black" />
                  <rect x="10" y="65" width="25" height="25" fill="black" />
                  <rect x="15" y="70" width="15" height="15" fill="white" />
                  <rect x="18" y="73" width="9" height="9" fill="black" />
                  <rect x="42" y="15" width="6" height="12" fill="black" />
                  <rect x="42" y="35" width="16" height="6" fill="black" />
                  <rect x="42" y="50" width="10" height="15" fill="black" />
                  <rect x="60" y="45" width="12" height="12" fill="black" />
                  <rect x="75" y="60" width="15" height="6" fill="black" />
                  <rect x="65" y="75" width="10" height="15" fill="black" />
                  <rect x="45" y="75" width="12" height="12" fill="black" />
                </svg>
              </div>
              <div className="mt-3 font-bold text-xs text-slate-800 dark:text-white">
                {settings.qrisMerchantName}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Scan via GoPay, OVO, Dana, BCA Mobile, ShopeePay, dll.
              </div>
            </div>
          )}

          {paymentMethod === "transfer" && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40 text-xs space-y-2">
              <div className="font-bold text-slate-800 dark:text-white">
                Informasi Rekening Outlet KAGE46:
              </div>
              <div className="rounded-xl bg-white p-3 border border-slate-200 dark:border-slate-700 dark:bg-[#111827] space-y-1 font-mono">
                <div className="text-slate-500 text-[11px] font-sans">Bank:</div>
                <div className="font-bold text-slate-900 dark:text-white">{settings.bankAccount.bankName}</div>
                <div className="text-slate-500 text-[11px] font-sans mt-2">Nomor Rekening:</div>
                <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{settings.bankAccount.accountNumber}</div>
                <div className="text-slate-500 text-[11px] font-sans mt-2">Atas Nama:</div>
                <div className="font-semibold text-slate-800 dark:text-slate-200">{settings.bankAccount.holderName}</div>
              </div>
            </div>
          )}

          {paymentMethod === "card" && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40 text-xs text-slate-600 dark:text-slate-300">
              <p className="font-semibold text-slate-800 dark:text-white mb-1">
                Mesin EDC / Terminal Kartu:
              </p>
              <p className="text-[11px]">
                Gesek atau tap kartu Debit / Kredit pelanggan pada mesin EDC kasir, pastikan struk transaksi EDC berhasil keluar sebelum menekan tombol konfirmasi.
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setCheckoutModalOpen(false)}
              className="flex-1 rounded-xl border border-slate-200 bg-slate-100 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handlePay}
              disabled={paymentMethod === "cash" && activeCashGiven < total}
              className={`flex-1 rounded-xl py-3 text-xs font-bold text-white shadow-xs transition flex items-center justify-center gap-1.5 ${
                paymentMethod === "cash" && activeCashGiven < total
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99]"
              }`}
            >
              <CheckCircle className="h-4 w-4" />
              <span>Selesaikan Transaksi & Cetak</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
