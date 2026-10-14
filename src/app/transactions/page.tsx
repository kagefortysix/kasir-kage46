"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { usePosStore } from "@/store/usePosStore";
import { useTranslation } from "@/lib/translations";
import { Order, OrderStatus } from "@/types/pos";
import { formatRupiah, formatDate } from "@/lib/utils";
import { TransactionDetailModal } from "@/components/transactions/TransactionDetailModal";
import { 
  Receipt, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Eye, 
  Printer, 
  ArrowUpRight,
  FileSpreadsheet,
  Download
} from "lucide-react";

export default function TransactionsPage() {
  const { orders } = usePosStore();
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<"all" | "open_bills">("all");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const openBills = orders.filter((o) => o.status === "open_bill");

  const filteredOrders = orders.filter((order) => {
    // If on open bills tab
    if (activeTab === "open_bills" && order.status !== "open_bill") return false;

    // Filter status
    if (activeTab === "all" && statusFilter !== "all" && order.status !== statusFilter) return false;

    // Filter method
    if (methodFilter !== "all" && order.paymentMethod !== methodFilter) return false;

    // Filter search
    const matchSearch =
      order.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      (order.customerName && order.customerName.toLowerCase().includes(search.toLowerCase())) ||
      (order.tableNumber && order.tableNumber.toLowerCase().includes(search.toLowerCase()));

    return matchSearch;
  });

  const totalOmset = orders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <AppShell>
      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full pb-24 lg:pb-12">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 w-full">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex flex-wrap items-center gap-2">
              <span>{t.transactions.pageTitle}</span>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 shrink-0">
                {t.transactions.receiptsCountBadge.replace("{count}", String(orders.length))}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {t.transactions.pageSubtitle}
            </p>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <span className="text-[11px] text-slate-400 font-medium block">{t.transactions.totalSettledLabel}</span>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {formatRupiah(totalOmset)}
            </div>
          </div>
        </div>

        {/* Tabs: Semua Transaksi vs Open Bill Aktif */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-none w-full max-w-full">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition shrink-0 whitespace-nowrap ${
              activeTab === "all"
                ? "border-emerald-600 text-emerald-600 dark:text-emerald-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Receipt className="h-4 w-4" />
            <span>{t.transactions.tabAll} ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("open_bills")}
            className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition shrink-0 whitespace-nowrap ${
              activeTab === "open_bills"
                ? "border-emerald-600 text-emerald-600 dark:text-emerald-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Clock className="h-4 w-4 text-emerald-600" />
            <span>{t.transactions.tabOpenBills} ({openBills.length})</span>
          </button>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-stretch sm:items-center justify-between w-full">
          <div className="relative flex-1 max-w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.transactions.searchPlaceholder}
              className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2 text-xs sm:text-sm font-medium text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {activeTab === "all" && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 sm:flex-initial rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              >
                <option value="all">{t.transactions.filterAllStatus}</option>
                <option value="completed">{t.transactions.filterCompleted}</option>
                <option value="open_bill">{t.transactions.filterOpenBill}</option>
                <option value="void">{t.transactions.filterVoid}</option>
              </select>
            )}

            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="flex-1 sm:flex-initial rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              <option value="all">{t.transactions.filterAllMethods}</option>
              <option value="cash">{t.transactions.filterCash}</option>
              <option value="qris">{t.transactions.filterQris}</option>
              <option value="transfer">{t.transactions.filterTransfer}</option>
              <option value="card">{t.transactions.filterCard}</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider dark:border-slate-800 dark:bg-slate-800">
                <tr>
                  <th className="p-4">{t.transactions.thInvoice}</th>
                  <th className="p-4">{t.transactions.thTime}</th>
                  <th className="p-4">{t.transactions.thTypeTable}</th>
                  <th className="p-4">{t.transactions.thCustomer}</th>
                  <th className="p-4">{t.transactions.thOrderedItems}</th>
                  <th className="p-4">{t.transactions.thMethod}</th>
                  <th className="p-4">{t.transactions.thTotal}</th>
                  <th className="p-4">{t.transactions.thStatus}</th>
                  <th className="p-4 text-right">{t.transactions.thAction}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-slate-400">
                      {t.transactions.emptyTransactions}
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);

                    return (
                      <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">
                          {order.invoiceNumber}
                        </td>
                        <td className="p-4 text-slate-500 font-mono">
                          {formatDate(order.timestamp)}
                        </td>
                        <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">
                          {order.orderType === "dine_in" ? order.tableNumber || t.transactions.dineInText : t.transactions.takeawayText}
                        </td>
                        <td className="p-4 text-slate-600 dark:text-slate-300">
                          {order.customerName || "-"}
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {itemCount} {t.transactions.portionsUnit}
                          </span>{" "}
                          <span className="text-[11px] text-slate-400">
                            ({order.items.map((i) => i.name).slice(0, 2).join(", ")}
                            {order.items.length > 2 ? "..." : ""})
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            {order.paymentMethod}
                          </span>
                        </td>
                        <td className="p-4 font-bold font-mono text-slate-900 dark:text-white">
                          {formatRupiah(order.total)}
                        </td>
                        <td className="p-4">
                          {order.status === "completed" && (
                            <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 w-fit">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>{t.transactions.badgePaid}</span>
                            </span>
                          )}
                          {order.status === "open_bill" && (
                            <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 w-fit animate-pulse">
                              <Clock className="h-3 w-3" />
                              <span>{t.transactions.badgeOpenBill}</span>
                            </span>
                          )}
                          {order.status === "void" && (
                            <span className="flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 w-fit">
                              <AlertTriangle className="h-3 w-3" />
                              <span>{t.transactions.badgeVoid}</span>
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>{t.transactions.actionDetail}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Transaction Detail Modal */}
        {selectedOrder && (
          <TransactionDetailModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}

      </div>
    </AppShell>
  );
}
