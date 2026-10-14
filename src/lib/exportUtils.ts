/**
 * Export Utilities for KASIR POS KAGE46
 * Exports data to CSV with UTF-8 BOM for Microsoft Excel compatibility
 */

export function downloadCSV(filename: string, csvContent: string) {
  // Add UTF-8 BOM (\uFEFF) so Excel opens UTF-8 Indonesian accents & formatting correctly
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function formatCSVRow(fields: (string | number | boolean | null | undefined)[]): string {
  return fields
    .map((field) => {
      if (field === null || field === undefined) return '""';
      const str = String(field).replace(/"/g, '""'); // Escape double quotes
      return `"${str}"`;
    })
    .join(",");
}

/**
 * Export Transactions History to CSV
 */
export function exportTransactionsToCSV(orders: any[], filename = "Riwayat_Transaksi.csv") {
  const headers = [
    "No. Invoice",
    "Tanggal & Waktu",
    "Tipe Pesanan",
    "Meja",
    "Pelanggan",
    "Kasir Bertugas",
    "Rincian Menu Item",
    "Subtotal (Rp)",
    "Diskon (Rp)",
    "PPN (Rp)",
    "Total Tagihan (Rp)",
    "Metode Pembayaran",
    "Status Transaksi"
  ];

  const rows = orders.map((o) => {
    const itemsSummary = (o.items || [])
      .map((it: any) => `${it.name} x${it.quantity}`)
      .join("; ");

    return [
      o.invoiceNumber,
      o.timestamp,
      o.orderType === "dine_in" ? "Dine In" : "Takeaway",
      o.tableNumber || "-",
      o.customerName || "-",
      o.cashierName,
      itemsSummary,
      o.subtotal,
      o.discountNominal,
      o.taxNominal,
      o.total,
      o.paymentMethod.toUpperCase(),
      o.status.toUpperCase()
    ];
  });

  const csv = [
    formatCSVRow(headers),
    ...rows.map((row) => formatCSVRow(row))
  ].join("\r\n");

  downloadCSV(filename, csv);
}

/**
 * Export Financial Statement Report to CSV
 */
export function exportFinancialReportToCSV(
  reportData: {
    period: string;
    generatedAt: string;
    storeName: string;
    totalOmset: number;
    totalHPP: number;
    grossProfit: number;
    totalExpenses: number;
    netProfit: number;
    netProfitMargin: number;
    expensesList: any[];
    paymentBreakdown: Record<string, number>;
  },
  filename = "Laporan_Keuangan.csv"
) {
  const rows: string[] = [
    formatCSVRow(["LAPORAN LABA RUGI & FINANSIAL", reportData.storeName]),
    formatCSVRow(["Periode Laporan", reportData.period]),
    formatCSVRow(["Tanggal Cetak", reportData.generatedAt]),
    formatCSVRow([]),
    formatCSVRow(["KOMPONEN KEUANGAN", "NOMINAL (RP)", "KETERANGAN"]),
    formatCSVRow(["1. Omset Penjualan Kotor (Gross Revenue)", reportData.totalOmset, "Total transaksi lunas"]),
    formatCSVRow(["2. Harga Pokok Penjualan (HPP Bahan & Overhead)", -reportData.totalHPP, "Bahan baku resep + sewa & kemasan"]),
    formatCSVRow(["3. Laba Kotor (Gross Profit)", reportData.grossProfit, "Omset - HPP"]),
    formatCSVRow(["4. Beban Operasional Toko (OPEX)", -reportData.totalExpenses, "Biaya operasional kas & transfer"]),
    formatCSVRow(["5. Laba Bersih Riil (Net Profit)", reportData.netProfit, `Net Margin: ${reportData.netProfitMargin}%`]),
    formatCSVRow([]),
    formatCSVRow(["RINCIAN BEBAN OPERASIONAL (OPEX)"]),
    formatCSVRow(["Nama Beban", "Kategori", "Sumber Dana", "Nominal (Rp)", "Catatan"]),
    ...reportData.expensesList.map((exp: any) =>
      formatCSVRow([
        exp.title,
        exp.category,
        exp.source === "cash_drawer" ? "Kas Laci" : "Rekening Bank",
        exp.amount,
        exp.note || "-"
      ])
    ),
    formatCSVRow([]),
    formatCSVRow(["REKAPITULASI PENERIMAAN KAS PER METODE"]),
    formatCSVRow(["Metode Pembayaran", "Total Diterima (Rp)"]),
    ...Object.entries(reportData.paymentBreakdown).map(([method, amount]) =>
      formatCSVRow([method.toUpperCase(), amount])
    )
  ];

  downloadCSV(filename, rows.join("\r\n"));
}

/**
 * Export Inventory & Ingredients to CSV
 */
export function exportInventoryToCSV(ingredients: any[], filename = "Inventori_Bahan_Baku.csv") {
  const headers = [
    "ID Bahan",
    "Nama Bahan Baku",
    "Kategori",
    "Stok Fisik Saat Ini",
    "Satuan Unit",
    "Batas Minimum Alert",
    "Harga Kemasan (Rp)",
    "Isi Per Kemasan",
    "Biaya Pokok Per Unit (Rp)",
    "Total Valuasi Stok Gudang (Rp)",
    "Status Stok"
  ];

  const rows = ingredients.map((ing) => {
    const isLow = ing.currentStock <= ing.minStockAlert;
    const valuation = ing.currentStock * ing.unitCost;

    return [
      ing.id,
      ing.name,
      ing.category,
      ing.currentStock,
      ing.unit,
      ing.minStockAlert,
      ing.packagePrice,
      `${ing.packageSize} ${ing.unit}`,
      ing.unitCost,
      valuation,
      isLow ? "KRITIS (MENIPIS)" : "AMAN"
    ];
  });

  const csv = [
    formatCSVRow(headers),
    ...rows.map((row) => formatCSVRow(row))
  ].join("\r\n");

  downloadCSV(filename, csv);
}
