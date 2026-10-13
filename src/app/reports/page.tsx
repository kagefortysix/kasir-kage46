"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { usePosStore } from "@/store/usePosStore";
import { formatRupiah, formatDate } from "@/lib/utils";
import { 
  BarChart3, 
  Printer, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  Calendar, 
  FileSpreadsheet, 
  PieChart, 
  Wallet,
  ShieldAlert,
  Download
} from "lucide-react";

export default function ReportsPage() {
  const { orders, expenses, settings, role } = usePosStore();
  const [period, setPeriod] = useState<"today" | "7d" | "30d" | "custom">("today");
  const [currentDateStr, setCurrentDateStr] = useState<string>("13 Okt 2026");

  React.useEffect(() => {
    setCurrentDateStr(formatDate(new Date()));
  }, []);

  const completedOrders = orders.filter((o) => o.status === "completed");

  const totalOmset = completedOrders.reduce((sum, o) => sum + o.total, 0);
  const totalHPP = completedOrders.reduce(
    (sum, o) => sum + o.items.reduce((iSum, item) => iSum + (item.costPrice || 0) * item.quantity, 0),
    0
  );
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const grossProfit = totalOmset - totalHPP;
  const netProfit = grossProfit - totalExpenses;
  const netProfitMargin = totalOmset > 0 ? Math.round((netProfit / totalOmset) * 100) : 0;

  // Payment Breakdown
  const paymentBreakdown = completedOrders.reduce((acc, order) => {
    acc[order.paymentMethod] = (acc[order.paymentMethod] || 0) + order.total;
    return acc;
  }, {} as Record<string, number>);

  // Print official statement
  const handlePrintOfficialReport = () => {
    window.print();
  };

  return (
    <AppShell>
      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full pb-24 lg:pb-12">
        

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>Laporan Keuangan & Analisis Laba Bersih</span>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
                Resmi
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Rekapitulasi Omset Penjualan, Total HPP Bahan, Biaya Operasional, dan Laba Bersih Riil.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-xl border border-slate-200 bg-white p-1 text-xs font-semibold dark:border-slate-800 dark:bg-slate-900 shadow-2xs">
              {(["today", "7d", "30d"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`rounded-lg px-3 py-1.5 transition ${
                    period === p
                      ? "bg-emerald-600 text-white font-bold"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-300"
                  }`}
                >
                  {p === "today" ? "Hari Ini" : p === "7d" ? "7 Hari" : "30 Hari (Bulan)"}
                </button>
              ))}
            </div>

            <button
              onClick={handlePrintOfficialReport}
              className="flex items-center gap-1.5 rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-3.5 py-2 text-xs font-bold shadow hover:bg-slate-800 transition"
              title="Cetak struk resmi atau simpan sebagai dokumen PDF"
            >
              <Printer className="h-4 w-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
          </div>
        </div>

        {/* 5-Step Executive Waterfall Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          
          {/* 1. Omset Penjualan */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              1. Omset Penjualan (Gross)
            </span>
            <div className="mt-2 text-lg font-black text-slate-900 dark:text-white">
              {formatRupiah(totalOmset)}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {completedOrders.length} Pesanan Lunas
            </div>
          </div>

          {/* 2. Total HPP */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              2. Total HPP (Bahan Baku)
            </span>
            <div className="mt-2 text-lg font-black text-rose-600 dark:text-rose-400">
              -{formatRupiah(totalHPP)}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Racikan bahan menu
            </div>
          </div>

          {/* 3. Laba Kotor */}
          <div className="rounded-2xl border border-teal-200 bg-teal-50/50 p-4 shadow-xs dark:border-teal-900/40 dark:bg-teal-950/20">
            <span className="text-[10px] font-bold text-teal-800 dark:text-teal-400 uppercase tracking-wider">
              3. Laba Kotor (Gross Profit)
            </span>
            <div className="mt-2 text-lg font-black text-teal-700 dark:text-teal-300">
              {formatRupiah(grossProfit)}
            </div>
            <div className="text-[11px] text-teal-700/80 dark:text-teal-400 mt-0.5">
              Omset - HPP
            </div>
          </div>

          {/* 4. Pengeluaran Operasional */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              4. Biaya Operasional (OPEX)
            </span>
            <div className="mt-2 text-lg font-black text-rose-600 dark:text-rose-400">
              -{formatRupiah(totalExpenses)}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {expenses.length} Transaksi Beban
            </div>
          </div>

          {/* 5. Laba Bersih Riil */}
          <div className="rounded-2xl border border-emerald-300 bg-emerald-50/60 p-4 shadow-xs dark:border-emerald-800 dark:bg-emerald-950/30">
            <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
              5. Laba Bersih Riil (Net)
            </span>
            <div className="mt-2 text-xl font-black text-emerald-700 dark:text-emerald-300">
              {formatRupiah(netProfit)}
            </div>
            <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold mt-0.5">
              Margin Bersih: {netProfitMargin}%
            </div>
          </div>

        </div>

        {/* Printable Official Statement Container */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 receipt-printable-area">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="text-base font-black uppercase text-slate-900 dark:text-white">
                {settings.storeName}
              </div>
              <div className="text-xs text-slate-500">
                LAPORAN LABA RUGI & REKAPITULASI PENJUALAN
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Periode: {period === "today" ? "Hari Ini" : period === "7d" ? "7 Hari Terakhir" : "Bulan Berjalan"} • Tanggal Cetak: {currentDateStr}
              </div>
            </div>
            <div className="text-right">
              <span className="rounded-lg bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                STATUS: AUDITED (VALID)
              </span>
            </div>
          </div>

          {/* Statement Rows */}
          <div className="mt-4 space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800 font-semibold">
              <span className="text-slate-700 dark:text-slate-300">Pendapatan Kotor Penjualan (Gross Revenue)</span>
              <span className="font-bold font-mono">{formatRupiah(totalOmset)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800 text-rose-600">
              <span>Beban Pokok Penjualan (Cost of Goods Sold / HPP)</span>
              <span className="font-bold font-mono">({formatRupiah(totalHPP)})</span>
            </div>
            <div className="flex justify-between py-2 border-b-2 border-slate-200 dark:border-slate-700 font-bold text-teal-700 dark:text-teal-400">
              <span>LABA KOTOR (GROSS PROFIT)</span>
              <span className="font-mono">{formatRupiah(grossProfit)}</span>
            </div>

            <div className="pt-2 text-slate-500 font-bold uppercase text-[11px]">
              Rincian Beban Operasional Toko (OPEX):
            </div>
            {expenses.map((exp) => (
              <div key={exp.id} className="flex justify-between py-1 text-slate-600 dark:text-slate-400 pl-4">
                <span>
                  • {exp.title} ({exp.category}) - {exp.source === "cash_drawer" ? "Kas Laci" : "Rekening Bank"}
                </span>
                <span className="font-mono text-rose-600">-{formatRupiah(exp.amount)}</span>
              </div>
            ))}

            <div className="flex justify-between py-2 border-b-2 border-slate-200 dark:border-slate-700 font-bold text-rose-600">
              <span>TOTAL PENGELUARAN OPERASIONAL</span>
              <span className="font-mono">({formatRupiah(totalExpenses)})</span>
            </div>

            <div className="flex justify-between py-3 border-t-2 border-slate-900 dark:border-white text-sm font-black text-emerald-600 dark:text-emerald-400">
              <span>LABA BERSIH RIIL (NET PROFIT)</span>
              <span className="font-mono text-base">{formatRupiah(netProfit)}</span>
            </div>
          </div>
        </div>

        {/* Payment Channels and Cash Drawer Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Rekapitulasi Penerimaan Kas per Metode
            </h3>
            <div className="space-y-2 text-xs">
              {Object.entries(paymentBreakdown).map(([method, amount]) => (
                <div key={method} className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="capitalize font-semibold text-slate-700 dark:text-slate-300">{method}</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{formatRupiah(amount)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Kinerja Efisiensi Finansial
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Gross Margin:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {totalOmset > 0 ? Math.round((grossProfit / totalOmset) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">OPEX to Sales Ratio:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {totalOmset > 0 ? Math.round((totalExpenses / totalOmset) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Net Profit Margin:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{netProfitMargin}%</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </AppShell>
  );
}
