"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { usePosStore } from "@/store/usePosStore";
import { formatRupiah } from "@/lib/utils";
import { 
  TrendingUp, 
  ShoppingCart, 
  Receipt, 
  DollarSign, 
  ArrowUpRight, 
  Package, 
  AlertTriangle, 
  PlusCircle, 
  Wallet
} from "lucide-react";

export default function DashboardPage() {
  const { 
    orders, 
    expenses, 
    ingredients, 
    currentShift, 
    setShiftModalOpen, 
    setExpenseModalOpen
  } = usePosStore();

  const [period, setPeriod] = useState<"today" | "7d" | "30d">("today");

  // Calculate metrics
  const completedOrders = orders.filter((o) => o.status === "completed");
  const openBills = orders.filter((o) => o.status === "open_bill");

  const totalOmset = completedOrders.reduce((sum, o) => sum + o.total, 0);
  const totalHPP = completedOrders.reduce(
    (sum, o) => sum + o.items.reduce((iSum, item) => iSum + (item.costPrice || 0) * item.quantity, 0),
    0
  );
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const grossProfit = totalOmset - totalHPP;
  const netProfit = grossProfit - totalExpenses;
  const averageTicket = completedOrders.length > 0 ? Math.round(totalOmset / completedOrders.length) : 0;

  // Payment Breakdown
  const paymentCounts = completedOrders.reduce((acc, order) => {
    acc[order.paymentMethod] = (acc[order.paymentMethod] || 0) + order.total;
    return acc;
  }, {} as Record<string, number>);

  // Critical Ingredients (stock <= minStockAlert)
  const criticalIngredients = ingredients.filter((ing) => ing.currentStock <= ing.minStockAlert);

  // Top Selling Items (no photos needed!)
  const itemSales = completedOrders.reduce((acc, order) => {
    order.items.forEach((item) => {
      if (!acc[item.productId]) {
        acc[item.productId] = {
          name: item.name,
          category: item.category,
          quantity: 0,
          totalRevenue: 0,
        };
      }
      acc[item.productId].quantity += item.quantity;
      acc[item.productId].totalRevenue += item.subtotal;
    });
    return acc;
  }, {} as Record<string, { name: string; category: string; quantity: number; totalRevenue: number }>);

  const topItems = Object.entries(itemSales)
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  // Simulated 7-day trend bars
  const trendData = [
    { day: "Sen", sales: 480000, profit: 290000 },
    { day: "Sel", chip: "620k", sales: 620000, profit: 375000 },
    { day: "Rab", chip: "550k", sales: 550000, profit: 330000 },
    { day: "Kam", chip: "740k", sales: 740000, profit: 460000 },
    { day: "Jum", chip: "890k", sales: 890000, profit: 540000 },
    { day: "Sab", chip: "1.2M", sales: 1250000, profit: 790000 },
    { day: "Hari Ini", sales: totalOmset || 640000, profit: netProfit || 380000 },
  ];
  const maxSale = Math.max(...trendData.map((d) => d.sales));

  return (
    <AppShell>
      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full pb-24 lg:pb-12">
        
        {/* Welcome & Top Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Dashboard Overview
              </h1>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                Outlet KAGE46
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Ringkasan performa penjualan harian, laba bersih riil, dan aktivitas kasir.
            </p>
          </div>

          {/* Quick Period Buttons & POS shortcut */}
          <div className="flex items-center gap-2">
            <div className="flex rounded-xl border border-slate-200 bg-white p-1 text-xs font-semibold dark:border-slate-800 dark:bg-[#111827] shadow-2xs">
              <button
                onClick={() => setPeriod("today")}
                className={`rounded-lg px-3 py-1.5 transition ${
                  period === "today"
                    ? "bg-emerald-600 text-white font-bold"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-300"
                }`}
              >
                Hari Ini
              </button>
              <button
                onClick={() => setPeriod("7d")}
                className={`rounded-lg px-3 py-1.5 transition ${
                  period === "7d"
                    ? "bg-emerald-600 text-white font-bold"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-300"
                }`}
              >
                7 Hari
              </button>
              <button
                onClick={() => setPeriod("30d")}
                className={`rounded-lg px-3 py-1.5 transition ${
                  period === "30d"
                    ? "bg-emerald-600 text-white font-bold"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-300"
                }`}
              >
                30 Hari
              </button>
            </div>

            <Link
              href="/pos"
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Buka Kasir POS</span>
            </Link>
          </div>
        </div>

        {/* 4 Core KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1. Omset Penjualan */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs dark:border-slate-800 dark:bg-[#111827] transition-all hover:border-slate-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Omset Penjualan
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-black text-slate-900 dark:text-white font-mono">
              {formatRupiah(totalOmset)}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>+18.4% dari kemarin</span>
            </div>
          </div>

          {/* 2. Total Transaksi & AOV */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs dark:border-slate-800 dark:bg-[#111827] transition-all hover:border-slate-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Pesanan Sukses
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400">
                <Receipt className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-black text-slate-900 dark:text-white">
              {completedOrders.length} Pesanan
            </div>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Rata-rata: <span className="font-bold text-slate-700 dark:text-slate-200 font-mono">{formatRupiah(averageTicket)}</span> / nota
            </div>
          </div>

          {/* 3. Laba Bersih Riil */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs dark:border-slate-800 dark:bg-[#111827] transition-all hover:border-slate-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Laba Bersih Riil
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-400">
                <DollarSign className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {formatRupiah(netProfit)}
            </div>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Laba Kotor: {formatRupiah(grossProfit)} • Beban: {formatRupiah(totalExpenses)}
            </div>
          </div>

          {/* 4. Kas Operasional Laci */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs dark:border-slate-800 dark:bg-[#111827] transition-all hover:border-slate-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Uang Laci Kasir
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400">
                <Wallet className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-black text-slate-900 dark:text-white font-mono">
              {currentShift ? formatRupiah(currentShift.expectedCash) : "Rp 0"}
            </div>
            <div className="mt-1 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                {currentShift ? `Kasir: ${currentShift.cashierName}` : "Shift Tutup"}
              </span>
              <button
                onClick={() => setShiftModalOpen(true)}
                className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Kelola &rarr;
              </button>
            </div>
          </div>

        </div>

        {/* Quick Action Shortcuts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            href="/pos"
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-emerald-500 dark:border-slate-800 dark:bg-[#111827] transition"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Transaksi POS</div>
              <div className="text-[11px] text-slate-500">Katalog menu & kasir</div>
            </div>
          </Link>

          <button
            onClick={() => setExpenseModalOpen(true)}
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-emerald-500 dark:border-slate-800 dark:bg-[#111827] text-left transition"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-600 text-white font-bold">
              <PlusCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Catat Pengeluaran</div>
              <div className="text-[11px] text-slate-500">Belanja es, LPG, dll.</div>
            </div>
          </button>

          <Link
            href="/transactions"
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-emerald-500 dark:border-slate-800 dark:bg-[#111827] transition"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-600 text-white font-bold">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Open Bill ({openBills.length})</div>
              <div className="text-[11px] text-slate-500">Meja belum lunas</div>
            </div>
          </Link>

          <Link
            href="/inventory"
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-emerald-500 dark:border-slate-800 dark:bg-[#111827] transition"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Stock Opname</div>
              <div className="text-[11px] text-slate-500">Penyesuaian stok bahan</div>
            </div>
          </Link>
        </div>

        {/* Charts Section: 7-Day Sales Trend & Payment Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Trend Bar Chart */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-[#111827]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Tren Penjualan & Laba 7 Hari Terakhir
                </h3>
                <p className="text-xs text-slate-500">Performa mingguan coffee shop & kitchen</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-sm bg-emerald-600" />
                  <span className="text-slate-600 dark:text-slate-300">Omset</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-sm bg-teal-500" />
                  <span className="text-slate-600 dark:text-slate-300">Laba Bersih</span>
                </div>
              </div>
            </div>

            {/* Interactive Bar chart */}
            <div className="pt-6 pb-2">
              <div className="h-56 flex items-end justify-between gap-2 sm:gap-4 px-2">
                {trendData.map((item, idx) => {
                  const saleHeight = Math.round((item.sales / maxSale) * 100);
                  const profitHeight = Math.round((item.profit / maxSale) * 100);

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                      <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-full">
                        {/* Omset Bar */}
                        <div
                          style={{ height: `${saleHeight}%` }}
                          className="w-1/2 max-w-[24px] rounded-t-lg bg-emerald-600/90 group-hover:bg-emerald-600 transition-all relative flex justify-center"
                        >
                          <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-slate-900 text-white text-[10px] py-0.5 px-1.5 rounded whitespace-nowrap shadow-md pointer-events-none transition-opacity z-10 font-mono">
                            {formatRupiah(item.sales)}
                          </div>
                        </div>

                        {/* Profit Bar */}
                        <div
                          style={{ height: `${profitHeight}%` }}
                          className="w-1/2 max-w-[24px] rounded-t-lg bg-teal-500/90 group-hover:bg-teal-500 transition-all relative flex justify-center"
                        >
                          <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-teal-950 text-white text-[10px] py-0.5 px-1.5 rounded whitespace-nowrap shadow-md pointer-events-none transition-opacity z-10 font-mono">
                            {formatRupiah(item.profit)}
                          </div>
                        </div>
                      </div>

                      <span className="text-[11px] font-semibold text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white">
                        {item.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Payment Methods Breakdown */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-[#111827]">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Metode Pembayaran
            </h3>
            <p className="text-xs text-slate-500 pb-4">Distribusi transaksi pelanggan</p>

            <div className="space-y-3.5 pt-1">
              {[
                { label: "QRIS Instant", key: "qris", color: "bg-rose-500" },
                { label: "Tunai (Cash)", key: "cash", color: "bg-emerald-600" },
                { label: "Transfer Bank", key: "transfer", color: "bg-sky-500" },
                { label: "Debit / Kartu EDC", key: "card", color: "bg-indigo-500" },
              ].map((m) => {
                const amount = paymentCounts[m.key] || 0;
                const percentage = totalOmset > 0 ? Math.round((amount / totalOmset) * 100) : 0;

                return (
                  <div key={m.key} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {m.label}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white font-mono">
                        {formatRupiah(amount)} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        style={{ width: `${percentage}%` }}
                        className={`h-full ${m.color} rounded-full transition-all`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs dark:border-slate-800 dark:bg-slate-850">
              <div className="font-bold text-slate-900 dark:text-white">
                Peringatan Stok Rendah ({criticalIngredients.length})
              </div>
              {criticalIngredients.length > 0 ? (
                <ul className="mt-1 space-y-1 text-[11px] text-rose-700 dark:text-rose-400">
                  {criticalIngredients.slice(0, 2).map((ing) => (
                    <li key={ing.id} className="flex justify-between">
                      <span>• {ing.name}</span>
                      <span className="font-bold font-mono">{ing.currentStock} {ing.unit}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-[11px] text-slate-500">Semua bahan baku dalam batas aman.</p>
              )}
            </div>

          </div>

        </div>

        {/* Bottom Section: Top Selling Items Table without photos */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-[#111827]">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Menu Terlaris (Top Selling Items)
              </h3>
              <p className="text-xs text-slate-500">Menu paling diminati pelanggan KAGE46</p>
            </div>
            <Link
              href="/products"
              className="text-xs font-bold text-emerald-600 hover:underline dark:text-emerald-400"
            >
              Lihat Katalog Resep &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider dark:border-slate-800">
                  <th className="py-2.5">Menu</th>
                  <th className="py-2.5">Kategori</th>
                  <th className="py-2.5 text-center">Porsi Terjual</th>
                  <th className="py-2.5 text-right">Total Omset</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {topItems.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                    <td className="py-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        #{idx + 1}
                      </span>
                      <span>{item.name}</span>
                    </td>
                    <td className="py-3">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 text-center font-bold text-slate-900 dark:text-white">
                      {item.quantity} porsi
                    </td>
                    <td className="py-3 text-right font-black text-emerald-600 dark:text-emerald-400 font-mono">
                      {formatRupiah(item.totalRevenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AppShell>
  );
}
