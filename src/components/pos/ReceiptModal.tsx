"use client";

import React, { useState } from "react";
import { usePosStore } from "@/store/usePosStore";
import { formatRupiah, formatDate, formatTime } from "@/lib/utils";
import { useTranslation } from "@/lib/translations";
import { 
  Printer, 
  Share2, 
  X, 
  CheckCircle2, 
  Phone, 
  Wifi, 
  Copy, 
  FileText,
  Smartphone,
  Bluetooth
} from "lucide-react";

export const ReceiptModal: React.FC = () => {
  const { 
    isReceiptModalOpen, 
    setReceiptModalOpen, 
    activeReceiptOrder, 
    settings,
    addToast 
  } = usePosStore();

  const { t, isEnglish } = useTranslation();

  const [receiptWidth, setReceiptWidth] = useState<"58mm" | "80mm">(settings.receiptSize || "58mm");
  const [copiedWA, setCopiedWA] = useState(false);
  const [showAndroidGuide, setShowAndroidGuide] = useState(false);

  if (!isReceiptModalOpen || !activeReceiptOrder) return null;

  const order = activeReceiptOrder;

  // Generate plain text receipt for WhatsApp sharing & Bluetooth printing
  const generateWhatsAppReceiptText = () => {
    let text = `*${settings.storeName.toUpperCase()}*\n`;
    text += `${settings.tagline}\n`;
    text += `${settings.address}\n`;
    text += `Telp: ${settings.phone}\n`;
    text += `--------------------------------\n`;
    text += `${isEnglish ? "Invoice No  : " : "No. Invoice : "}${order.invoiceNumber}\n`;
    text += `${isEnglish ? "Time        : " : "Waktu       : "}${formatDate(order.timestamp)}\n`;
    text += `${isEnglish ? "Cashier     : " : "Kasir       : "}${order.cashierName}\n`;
    text += `${isEnglish ? "Order Type  : " : "Tipe Order  : "}${
      order.orderType === "dine_in"
        ? `${isEnglish ? "Dine-In" : "Dine-In"} (${order.tableNumber})`
        : isEnglish ? "Takeaway" : "Takeaway"
    }\n`;
    if (order.customerName) text += `${isEnglish ? "Customer    : " : "Pelanggan   : "}${order.customerName}\n`;
    text += `--------------------------------\n`;
    order.items.forEach((item) => {
      text += `${item.name}\n`;
      if (item.notes) text += `  _${item.notes}_\n`;
      text += `  ${item.quantity} x ${formatRupiah(item.price)} = ${formatRupiah(item.subtotal)}\n`;
    });
    text += `--------------------------------\n`;
    text += `Subtotal    : ${formatRupiah(order.subtotal)}\n`;
    if (order.discountNominal > 0) text += `${isEnglish ? "Discount    : -" : "Diskon      : -"}${formatRupiah(order.discountNominal)}\n`;
    if (order.taxNominal > 0) text += `${isEnglish ? "VAT" : "PPN"} (${settings.taxPercentage}%)    : ${formatRupiah(order.taxNominal)}\n`;
    text += `*TOTAL       : ${formatRupiah(order.total)}*\n`;
    text += `--------------------------------\n`;
    text += `${isEnglish ? "Payment     : " : "Pembayaran  : "}${order.paymentMethod.toUpperCase()}\n`;
    text += `${isEnglish ? "Paid        : " : "Bayar       : "}${formatRupiah(order.amountPaid)}\n`;
    text += `${isEnglish ? "Change      : " : "Kembalian   : "}${formatRupiah(order.changeAmount)}\n`;
    text += `--------------------------------\n`;
    text += `${settings.receiptFooterMessage}\n`;
    text += `IG: ${settings.instagram} | WiFi: ${settings.wifiPassword}\n`;
    return text;
  };

  const handleShareWhatsApp = () => {
    const text = generateWhatsAppReceiptText();
    const encoded = encodeURIComponent(text);
    const phone = order.customerPhone ? order.customerPhone.replace(/[^0-9]/g, "") : "";
    const waUrl = phone ? `https://wa.me/${phone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
    
    window.open(waUrl, "_blank");
    addToast(
      isEnglish ? "Opening WhatsApp to send digital receipt..." : "Membuka WhatsApp untuk mengirim struk digital",
      "info"
    );
  };

  const handleCopyReceiptText = () => {
    const text = generateWhatsAppReceiptText();
    navigator.clipboard.writeText(text);
    setCopiedWA(true);
    addToast(
      isEnglish ? "Receipt text copied to clipboard!" : "Teks struk berhasil disalin ke clipboard",
      "success"
    );
    setTimeout(() => setCopiedWA(false), 2000);
  };

  const handlePrint = () => {
    window.print();
    addToast(
      isEnglish ? "Opening print dialog..." : "Membuka dialog cetak struk...",
      "info"
    );
  };

  const handlePrintRawBT = () => {
    const text = generateWhatsAppReceiptText();
    try {
      const utf8Bytes = new TextEncoder().encode(text);
      let binary = "";
      for (let i = 0; i < utf8Bytes.length; i++) {
        binary += String.fromCharCode(utf8Bytes[i]);
      }
      const base64 = btoa(binary);
      window.location.href = `rawbt:base64,${base64}`;
      addToast(
        isEnglish ? "Sending receipt to RawBT Bluetooth..." : "Mengirim struk ke aplikasi RawBT Bluetooth...",
        "info"
      );
    } catch {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative flex flex-col w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 max-h-[92vh] overflow-hidden">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {isEnglish ? "Transaction Successful" : "Transaksi Berhasil"}
              </h2>
              <p className="text-[11px] text-slate-500">
                {isEnglish ? "Thermal Receipt Preview" : "Pratinjau Struk Thermal"}
              </p>
            </div>
          </div>

          {/* Toggle 58mm / 80mm */}
          <div className="flex items-center gap-1.5">
            <div className="flex rounded-lg border border-slate-200 bg-white p-0.5 text-[10px] font-bold dark:border-slate-700 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setReceiptWidth("58mm")}
                className={`rounded px-2 py-1 transition ${
                  receiptWidth === "58mm"
                    ? "bg-emerald-600 text-white"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-300"
                }`}
              >
                58mm
              </button>
              <button
                type="button"
                onClick={() => setReceiptWidth("80mm")}
                className={`rounded px-2 py-1 transition ${
                  receiptWidth === "80mm"
                    ? "bg-emerald-600 text-white"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-300"
                }`}
              >
                80mm
              </button>
            </div>

            <button
              onClick={() => setReceiptModalOpen(false)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Receipt Preview */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100 dark:bg-slate-950 flex justify-center">
          
          <div
            className={`thermal-receipt-paper receipt-printable-area rounded-xl p-5 border border-dashed border-slate-300 text-slate-900 text-xs shadow-md transition-all ${
              receiptWidth === "58mm" ? "w-[280px]" : "w-[360px]"
            }`}
          >
            {/* Header Store */}
            <div className="text-center pb-3 border-b border-dashed border-slate-300">
              <div className="text-base font-black tracking-tight uppercase">
                {settings.storeName}
              </div>
              <div className="text-[10px] text-slate-600 mt-0.5">
                {settings.tagline}
              </div>
              <div className="text-[10px] text-slate-500 mt-1 leading-tight">
                {settings.address}
              </div>
              <div className="text-[10px] text-slate-600 font-mono mt-0.5">
                Telp: {settings.phone}
              </div>
            </div>

            {/* Invoice Meta */}
            <div className="py-2.5 border-b border-dashed border-slate-300 text-[11px] font-mono space-y-0.5">
              <div className="flex justify-between">
                <span>{isEnglish ? "Inv No:" : "No. Inv:"}</span>
                <span className="font-bold">{order.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>{isEnglish ? "Time:" : "Waktu:"}</span>
                <span>{formatDate(order.timestamp)}</span>
              </div>
              <div className="flex justify-between">
                <span>{isEnglish ? "Cashier:" : "Kasir:"}</span>
                <span>{order.cashierName}</span>
              </div>
              <div className="flex justify-between">
                <span>{isEnglish ? "Type:" : "Tipe:"}</span>
                <span className="font-bold">
                  {order.orderType === "dine_in"
                    ? `${isEnglish ? "Dine-In" : "Dine-In"} (${order.tableNumber})`
                    : isEnglish ? "Takeaway" : "Takeaway"}
                </span>
              </div>
              {order.customerName && (
                <div className="flex justify-between text-slate-700">
                  <span>{isEnglish ? "Customer:" : "Pelanggan:"}</span>
                  <span className="font-semibold">{order.customerName}</span>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="py-2.5 border-b border-dashed border-slate-300 space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="text-[11px]">
                  <div className="flex justify-between font-bold">
                    <span>{item.name}</span>
                    <span>{formatRupiah(item.subtotal)}</span>
                  </div>
                  {item.notes && (
                    <div className="text-[10px] text-slate-500 italic">
                      * {item.notes}
                    </div>
                  )}
                  <div className="text-[10px] text-slate-500 font-mono">
                    {item.quantity} x {formatRupiah(item.price)}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="py-2.5 border-b border-dashed border-slate-300 space-y-1 text-[11px] font-mono">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatRupiah(order.subtotal)}</span>
              </div>
              {order.discountNominal > 0 && (
                <div className="flex justify-between text-rose-600 font-bold">
                  <span>{isEnglish ? "Discount:" : "Diskon:"}</span>
                  <span>-{formatRupiah(order.discountNominal)}</span>
                </div>
              )}
              {order.taxNominal > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>{isEnglish ? "VAT" : "PPN"} ({settings.taxPercentage}%):</span>
                  <span>{formatRupiah(order.taxNominal)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black pt-1 border-t border-dotted border-slate-300">
                <span>TOTAL:</span>
                <span>{formatRupiah(order.total)}</span>
              </div>
            </div>

            {/* Payment Details */}
            <div className="py-2.5 border-b border-dashed border-slate-300 space-y-1 text-[11px] font-mono">
              <div className="flex justify-between">
                <span>{isEnglish ? "Method:" : "Metode:"}</span>
                <span className="font-bold uppercase">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>{isEnglish ? "Paid:" : "Bayar:"}</span>
                <span>{formatRupiah(order.amountPaid)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>{isEnglish ? "Change:" : "Kembalian:"}</span>
                <span>{formatRupiah(order.changeAmount)}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 text-center text-[10px] space-y-1.5 text-slate-600">
              <p className="font-medium">{settings.receiptFooterMessage}</p>
              <div className="flex items-center justify-center gap-2 text-[9px] text-slate-500">
                <span>IG: {settings.instagram}</span>
                <span>•</span>
                <span>TikTok: {settings.tiktok}</span>
              </div>
              <div className="text-[9px] font-mono text-slate-500">
                WiFi: {settings.wifiName} (Pass: {settings.wifiPassword})
              </div>
            </div>

          </div>

        </div>

        {/* Android Bluetooth Guide Expandable */}
        <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 px-4 py-2 text-xs">
          <button
            type="button"
            onClick={() => setShowAndroidGuide(!showAndroidGuide)}
            className="flex w-full items-center justify-between text-slate-700 dark:text-slate-300 font-bold hover:text-emerald-600 transition"
          >
            <span className="flex items-center gap-1.5">
              <Smartphone className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>{isEnglish ? "How to Print on Android (Bluetooth Printer)" : "Cara Cetak di HP / Tablet Android (Printer Bluetooth)"}</span>
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold underline">
              {showAndroidGuide
                ? isEnglish ? "Close Guide" : "Tutup Panduan"
                : isEnglish ? "View Guide" : "Lihat Panduan"}
            </span>
          </button>

          {showAndroidGuide && (
            <div className="mt-2.5 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] space-y-2 text-slate-600 dark:text-slate-300">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Bluetooth className="h-3.5 w-3.5 text-blue-500" />
                <span>{isEnglish ? "Steps to connect Bluetooth printer on Android:" : "Langkah Menghubungkan Printer Bluetooth di Android:"}</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 pl-1 leading-relaxed">
                <li>
                  {isEnglish
                    ? "Turn on thermal printer & pair via Android Bluetooth menu (PIN is usually 0000 or 1234)."
                    : "Nyalakan printer thermal & pasangkan (pairing) Bluetooth di menu Bluetooth Android Anda (PIN biasanya 0000 atau 1234)."}
                </li>
                <li>
                  {isEnglish
                    ? "Install the free RawBT Print Service app from Google Play Store."
                    : "Install aplikasi gratis RawBT Print Service dari Google Play Store."}
                </li>
                <li>
                  {isEnglish
                    ? "Open RawBT app > select your Bluetooth printer."
                    : "Buka aplikasi RawBT > pilih printer Bluetooth Anda."}
                </li>
                <li>
                  {isEnglish ? "In this POS app:" : "Di aplikasi kasir ini:"}
                  <ul className="list-disc list-inside pl-4 mt-0.5 space-y-0.5 font-medium text-slate-800 dark:text-slate-200">
                    <li>
                      {isEnglish
                        ? 'Click "RawBT (BT)" to print instantly with 1-click.'
                        : 'Klik tombol "RawBT (BT)" untuk cetak langsung 1-klik via bluetooth.'}
                    </li>
                    <li>
                      {isEnglish
                        ? 'Or click "Print Receipt" and choose RawBT in the Android printer dialog.'
                        : 'Atau klik "Cetak Struk" dan pilih printer RawBT pada dialog Android.'}
                    </li>
                    <li>
                      {isEnglish
                        ? 'Or use "WhatsApp" for paperless digital receipts.'
                        : 'Atau gunakan "WhatsApp" untuk struk digital tanpa kertas.'}
                    </li>
                  </ul>
                </li>
              </ol>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900 text-white py-2.5 px-2 text-xs font-bold shadow hover:bg-slate-800 transition active:scale-95 cursor-pointer"
            title={isEnglish ? "Print via system dialog (WiFi / USB / Default)" : "Cetak via dialog printer sistem (WiFi / USB / Default)"}
          >
            <Printer className="h-4 w-4 shrink-0" />
            <span>{isEnglish ? "Print Receipt" : "Cetak Struk"}</span>
          </button>

          <button
            type="button"
            onClick={handlePrintRawBT}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 text-white py-2.5 px-2 text-xs font-bold shadow hover:bg-blue-700 transition active:scale-95 cursor-pointer"
            title={isEnglish ? "Quick print via Android RawBT Bluetooth app" : "Cetak cepat via aplikasi RawBT Bluetooth Android"}
          >
            <Bluetooth className="h-4 w-4 shrink-0" />
            <span>RawBT (BT)</span>
          </button>

          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 text-white py-2.5 px-2 text-xs font-bold shadow hover:bg-emerald-700 transition active:scale-95 cursor-pointer"
            title={isEnglish ? "Send digital receipt via WhatsApp" : "Kirim struk digital via WhatsApp ke pelanggan"}
          >
            <Share2 className="h-4 w-4 shrink-0" />
            <span>WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={handleCopyReceiptText}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 transition active:scale-95 cursor-pointer"
            title={isEnglish ? "Copy receipt text to clipboard" : "Salin teks struk untuk di-paste ke aplikasi Bluetooth Print"}
          >
            <Copy className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{copiedWA ? (isEnglish ? "Copied!" : "Tersalin!") : (isEnglish ? "Copy Text" : "Salin Teks")}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
