"use client";

import React, { useState } from "react";
import { usePosStore } from "@/store/usePosStore";
import { formatRupiah } from "@/lib/utils";
import { TablePickerModal } from "./TablePickerModal";
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  FileText, 
  CreditCard, 
  Save, 
  X, 
  Utensils, 
  ShoppingBag,
  Percent,
  Check
} from "lucide-react";

interface CartPaneProps {
  isMobileDrawer?: boolean;
}

export const CartPane: React.FC<CartPaneProps> = ({ isMobileDrawer = false }) => {
  const {
    cart,
    orderType,
    setOrderType,
    tableNumber,
    discountNominal,
    setDiscountNominal,
    taxEnabled,
    setTaxEnabled,
    settings,
    updateCartQuantity,
    removeFromCart,
    updateCartItemNotes,
    clearCart,
    setCheckoutModalOpen,
    saveOpenBill,
    currentShift,
    isCartDrawerOpen,
    setCartDrawerOpen
  } = usePosStore();

  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [editingNotesItemId, setEditingNotesItemId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState("");
  const [isDiscountOpen, setIsDiscountOpen] = useState(false);

  // If inside mobile drawer and drawer is closed, don't render
  if (isMobileDrawer && !isCartDrawerOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxRate = taxEnabled ? settings.taxPercentage / 100 : 0;
  const taxNominal = Math.round((subtotal - discountNominal) * taxRate);
  const total = Math.max(0, subtotal - discountNominal + taxNominal);
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleOpenNotes = (itemId: string, currentNote: string = "") => {
    setEditingNotesItemId(itemId);
    setNoteInput(currentNote);
  };

  const handleSaveNotes = (itemId: string) => {
    updateCartItemNotes(itemId, noteInput.trim());
    setEditingNotesItemId(null);
  };

  const handleSaveBill = () => {
    const cashier = currentShift?.cashierName || "Kasir Utama";
    saveOpenBill(cashier);
    if (isMobileDrawer) setCartDrawerOpen(false);
  };

  const handleOpenCheckout = () => {
    setCheckoutModalOpen(true);
    if (isMobileDrawer) setCartDrawerOpen(false);
  };

  const content = (
    <div className="flex flex-col h-full min-h-0 overflow-hidden bg-white dark:bg-[#111827] border-l border-slate-200 dark:border-slate-800">
      
      {/* Top Header: Order Type Switcher & Table */}
      <div className="shrink-0 p-3 sm:p-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50">
        
        {/* Mobile close button if drawer */}
        {isMobileDrawer && (
          <div className="flex items-center justify-between pb-2.5 lg:hidden">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Keranjang Kasir ({totalQty} Item)
              </span>
            </div>
            <button
              onClick={() => setCartDrawerOpen(false)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Order Type Toggle: Dine In vs Takeaway */}
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-200/70 dark:bg-slate-800 p-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => setOrderType("dine_in")}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition ${
              orderType === "dine_in"
                ? "bg-white text-slate-900 shadow-2xs dark:bg-[#111827] dark:text-white font-extrabold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <Utensils className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Dine In (Meja)</span>
          </button>

          <button
            type="button"
            onClick={() => setOrderType("takeaway")}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition ${
              orderType === "takeaway"
                ? "bg-white text-slate-900 shadow-2xs dark:bg-[#111827] dark:text-white font-extrabold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <ShoppingBag className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Takeaway</span>
          </button>
        </div>

        {/* Table Selector for Dine In */}
        {orderType === "dine_in" && (
          <div className="mt-2 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/70 px-3 py-1.5 text-xs dark:border-emerald-900/40 dark:bg-emerald-950/20">
            <span className="font-semibold text-emerald-900 dark:text-emerald-300">
              Lokasi: <span className="font-black">{tableNumber}</span>
            </span>
            <button
              type="button"
              onClick={() => setIsTableModalOpen(true)}
              className="rounded-lg bg-emerald-600 px-2 py-0.5 text-[11px] font-bold text-white hover:bg-emerald-700 transition"
            >
              Ganti Meja
            </button>
          </div>
        )}
      </div>

      {/* Cart Items List with min-h-0 and overflow-y-auto so it stays scrollable internally */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-2">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center px-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 mb-2">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Keranjang Masih Kosong
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5 max-w-xs leading-relaxed">
              Klik menu di sebelah kiri untuk menambahkan pesanan.
            </p>
          </div>
        ) : (
          cart.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-slate-200/90 bg-white p-2.5 dark:border-slate-800 dark:bg-[#151c2e] shadow-2xs hover:border-slate-300 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 pr-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {item.name}
                  </h4>
                  <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    {formatRupiah(item.price)}
                  </div>
                </div>

                {/* Subtotal */}
                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-slate-900 dark:text-white font-mono">
                    {formatRupiah(item.price * item.quantity)}
                  </span>
                </div>
              </div>

              {/* Notes display */}
              {item.notes && editingNotesItemId !== item.id && (
                <div className="mt-1 flex items-center justify-between rounded-lg bg-slate-50 px-2 py-0.5 text-[10px] text-slate-500 dark:bg-slate-800">
                  <span className="italic truncate">* {item.notes}</span>
                  <button
                    onClick={() => handleOpenNotes(item.id, item.notes)}
                    className="text-emerald-600 dark:text-emerald-400 hover:underline shrink-0 ml-1 font-semibold"
                  >
                    Ubah
                  </button>
                </div>
              )}

              {/* Note input edit box */}
              {editingNotesItemId === item.id && (
                <div className="mt-1.5 space-y-1 animate-in fade-in duration-100">
                  <input
                    type="text"
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    placeholder="Less sugar, tanpa es, pedas, dll."
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => setEditingNotesItemId(null)}
                      className="px-2 py-0.5 text-[10px] text-slate-500 hover:bg-slate-100 rounded"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveNotes(item.id)}
                      className="px-2 py-0.5 text-[10px] bg-emerald-600 text-white font-bold rounded"
                    >
                      Simpan
                    </button>
                  </div>
                </div>
              )}

              {/* Bottom Row: Quantity controls & Notes trigger */}
              <div className="mt-2 flex items-center justify-between pt-1.5 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center text-[10px] text-slate-400">
                  {!item.notes && editingNotesItemId !== item.id && (
                    <button
                      type="button"
                      onClick={() => handleOpenNotes(item.id, "")}
                      className="flex items-center gap-1 text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 font-medium"
                    >
                      <FileText className="h-3 w-3" />
                      <span>+ Catatan</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => updateCartQuantity(item.id, -1)}
                    className="flex h-6 w-6 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-5 text-center text-xs font-black text-slate-900 dark:text-white">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateCartQuantity(item.id, 1)}
                    className="flex h-6 w-6 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="ml-1 p-1 text-slate-400 hover:text-rose-500 transition"
                    title="Hapus"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Bill Calculation & Checkout Footer: Pinned at bottom (shrink-0) */}
      <div className="shrink-0 p-3 sm:p-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-[#0e1422] space-y-2">
        
        {/* Subtotal, Discount & Tax Settings */}
        <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex justify-between">
            <span>Subtotal ({totalQty} item):</span>
            <span className="font-bold text-slate-900 dark:text-white font-mono">
              {formatRupiah(subtotal)}
            </span>
          </div>

          {/* Discount Trigger / Input */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsDiscountOpen(!isDiscountOpen)}
              className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
            >
              <Percent className="h-3 w-3" />
              <span>{discountNominal > 0 ? `Diskon: -${formatRupiah(discountNominal)}` : "+ Pasang Diskon"}</span>
            </button>

            {isDiscountOpen && (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={0}
                  step={1000}
                  value={discountNominal}
                  onChange={(e) => setDiscountNominal(Number(e.target.value))}
                  placeholder="Nominal Rp"
                  className="w-24 rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setIsDiscountOpen(false)}
                  className="p-1 rounded bg-emerald-600 text-white"
                >
                  <Check className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>

          {/* Tax Switcher */}
          <div className="flex items-center justify-between py-1.5 border-t border-dashed border-slate-200 dark:border-slate-800 text-[11px] sm:text-xs">
            <button
              type="button"
              onClick={() => setTaxEnabled(!taxEnabled)}
              title={taxEnabled ? "Klik untuk nonaktifkan pajak PPN" : "Klik untuk aktifkan pajak PPN"}
              className={`flex items-center gap-2 rounded-lg px-2.5 py-1 font-semibold transition select-none cursor-pointer active:scale-95 ${
                taxEnabled
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                  : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200 dark:bg-slate-800/80 dark:text-slate-400 dark:border-slate-700"
              }`}
            >
              {/* Toggle switch visual */}
              <div
                className={`relative inline-flex h-4 w-7 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out ${
                  taxEnabled ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-600"
                }`}
              >
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                    taxEnabled ? "translate-x-3.5" : "translate-x-0.5"
                  }`}
                />
              </div>
              <span>PPN ({settings.taxPercentage}%): {taxEnabled ? "Aktif" : "Nonaktif"}</span>
            </button>
            <span className={`font-mono font-bold ${taxEnabled ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-500"}`}>
              {taxEnabled ? formatRupiah(taxNominal) : "Rp 0"}
            </span>
          </div>

          {/* Total Grand */}
          <div className="flex justify-between text-sm sm:text-base font-black text-slate-900 dark:text-white pt-1.5 border-t border-slate-200 dark:border-slate-800">
            <span>Total Tagihan:</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-mono">{formatRupiah(total)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-1.5 pt-1">
          <button
            type="button"
            disabled={cart.length === 0}
            onClick={handleOpenCheckout}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs transition ${
              cart.length === 0
                ? "bg-slate-300 dark:bg-slate-800 cursor-not-allowed text-slate-500"
                : "bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99]"
            }`}
          >
            <CreditCard className="h-4 w-4" />
            <span>Bayar Sekarang ({formatRupiah(total)})</span>
          </button>

          <div className="flex gap-1.5">
            <button
              type="button"
              disabled={cart.length === 0}
              onClick={clearCart}
              className="flex items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-600 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-800 dark:bg-[#111827] dark:text-slate-300 dark:hover:bg-rose-950/40 transition disabled:opacity-40"
              title="Kosongkan Keranjang"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>

            <button
              type="button"
              disabled={cart.length === 0}
              onClick={handleSaveBill}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50/70 py-1.5 text-[11px] font-bold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-800/60 dark:bg-emerald-950/30 dark:text-emerald-300 transition disabled:opacity-40"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Simpan Open Bill</span>
            </button>
          </div>
        </div>

      </div>

      {/* Table picker modal */}
      <TablePickerModal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
      />

    </div>
  );

  // If mobile drawer mode
  if (isMobileDrawer) {
    return (
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-150">
        <div className="relative w-full max-w-md h-full bg-white dark:bg-[#111827] shadow-2xl animate-in slide-in-from-right duration-200">
          {content}
        </div>
      </div>
    );
  }

  // Desktop inline pane
  return content;
};
