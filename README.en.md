# ☕ KASIR POS KAGE46

[![Live Demo](https://img.shields.io/badge/LIVE%20DEMO-kasir--kage46.vercel.app-0070F3?style=for-the-badge&logo=vercel&logoColor=white)](https://kasir-kage46.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-v5-443E38?style=for-the-badge)](https://zustand-demo.pmnd.rs/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

---

🌐 **Language / Pilih Bahasa:**  
[![English](https://img.shields.io/badge/🇬🇧_Language-English-blue?style=for-the-badge)](README.en.md)
[![Bahasa Indonesia](https://img.shields.io/badge/🇮🇩_Bahasa-Indonesia-red?style=for-the-badge)](README.md)

---

### 🚀 Try It Live (Web Demo)
Click the button below to test the live application directly in your browser:

[![Open Live Demo Kasir KAGE46](https://img.shields.io/badge/👉_CLICK_HERE_TO_OPEN_LIVE_DEMO-0070F3?style=for-the-badge&logo=vercel&logoColor=white)](https://kasir-kage46.vercel.app/)

> **Live URL:** [https://kasir-kage46.vercel.app/](https://kasir-kage46.vercel.app/)

---

## 💡 About the Application

**KASIR POS KAGE46** is a modern, high-performance web-based Point of Sale (POS) system specifically built for **F&B businesses, Specialty Coffee Shops, Artisan Kitchens, and Restaurants**.

It delivers lightning-fast order taking, **automated Recipe & COGS (HPP) Costing**, warehouse inventory tracking, real-time Net Profit reporting, and a **Centralized Server Database** that seamlessly synchronizes in real-time across cashier desktop PCs and mobile devices via local Wi-Fi or Cloudflare Tunnel.

---

## 🔑 Default Demo Accounts

| Role | Username | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **👑 Owner / Master** | `owner` | `kage46owner` | **Full Access** (POS, Recipe Costing, Net Profit, Inventory, Store Settings, Staff Accounts) |
| **☕ Cashier** | `kasir1` | `kasir123` | **Cashier Operations** (POS, Table Orders, Shift Open/Close, Cash Drawer) |

---

## ✨ Comprehensive Key Features

### 1. 🛒 Smart Point of Sale (POS)
- **Fast Catalog & Filters**: Instant category filters (*Signature, Coffee, Non-Coffee, Food, Snacks*), live text search, and SKU barcodes.
- **Order Types**:
  - **Dine-In**: Interactive table picker (*Table 01 - 20, VIP, Outdoor*) with active bill indicators.
  - **Takeaway**: Automatic to-go packaging option.
- **Quick Menu Creation (+ Quick Add)**: Add new items on the fly straight from the cashier screen without creating raw ingredient recipes first.
- **Adaptive Responsive Design**: Docked cart panel on desktop/tablets and slide-in drawer on mobile smartphones.

### 2. 💳 Multi-Payment & Open Bills
- **Payment Methods**:
  - **Cash**: Quick money shortcuts and real-time change calculation.
  - **Dynamic QRIS**: Instant QR code display with merchant NMID details.
  - **Bank Transfer & EDC**: Bank account verification and card swipe logging.
- **Discounts & Taxes**: Flexible nominal discounts and 11% VAT tax toggle.
- **Open Bills (Pay Later)**: Hold open table orders, add follow-up items, and settle payments anytime.
- **Safe Transaction Voiding**: Order cancellation requires reason logging and includes an option to **automatically restore raw ingredient stock**.

### 3. 🖨️ Thermal Receipts & WhatsApp Sharing
- **Dual-Size Thermal Printing**: Direct toggle between **58mm** and **80mm** receipt layouts.
- **Accurate CSS Printing**: Clean layout via `@media print` without messy margins for Bluetooth & USB thermal printers.
- **WhatsApp Direct Sharing**: Send formatted digital receipt texts straight to customers' WhatsApp in 1 click.
- **Complete Receipt Info**: Store logo, cashier name, table number, item details, Wi-Fi credentials, social media, and footer note.

### 4. 🧪 Recipe Costing & Automated COGS (HPP)
- **Ingredient Composition**: Define exact grams/ml per serving (Espresso, Milk, Syrup, Cup, Straw).
- **Overhead & Rent Allocation**: Allocate monthly utilities and rent into per-cup overhead costs.
- **Packaging Costing**: Automatic accounting for cups, lids, and straws per serving.
- **Profit Margin Simulation**: Automated selling price recommendations for 50%, 60% (Cafe Standard), and 70% (Premium) target margins with 1-click price application.

### 5. 📦 Warehouse Inventory & Stock Opname
- **Ingredient Database**: Units (gr, ml, pcs) with automatic packaging-to-unit cost conversions.
- **Auto-Deduct Stock**: Real-time ingredient depletion upon successful checkout.
- **Low Stock Alerts**: Red badges when ingredient levels dip below threshold.
- **Integrated Stock Opname**: Physical audit logging with difference calculation and discrepancy reasoning (*Spillage, Expired, Damaged*).
- **Asset Valuation**: Real-time warehouse inventory valuation in local currency.

### 6. 📊 Financial Statements & True Net Profit
- **Financial Waterfall**:
  1. **Gross Revenue**
  2. **Total Cost of Goods Sold (Raw Materials & Packaging)**
  3. **Gross Profit**
  4. **Operational Expenses (OPEX)**
  5. **True Net Profit & Net Margin Percentage**
- **Period Filtering**: Today, Last 7 Days, and Last 30 Days.
- **Printable Statements**: Clean official financial statement formatting (Print to PDF).

### 7. 💵 Shift Management & Cash Float Control
- **Open Shift**: Record initial cashier starting cash.
- **Close Shift & Reconciliation**:
  - Summarizes starting cash, cash sales, non-cash sales, and cash drawer payouts.
  - Calculates **Expected Cash** vs **Actual Cash** and flags cash drawer differences (*Over/Short*).
- **Shift Archive**: Historical cashier shift records preserved permanently.

### 8. 📝 OPEX Tracker (Daily Expenses)
- Log ad-hoc store purchases (ice cubes, cooking gas, cleaning supplies, water gallons).
- Fund sources: **Cash Drawer** (deducts expected cash from active shift) or **Bank Transfer**.

### 9. 👥 Customer CRM & Loyalty Points
- Customer directory (Name, WhatsApp number, Email).
- Metrics: Total visit count, accumulated spend, and loyalty points.
- Instant WhatsApp chat button with pre-filled personalized store greeting.

### 10. 🛡️ Authentication & Multi-User RBAC
- **Strict Login Gate**: Application locks when logged out.
- **Role-Based Access Control**: Cashiers restricted to POS and shifts; recipe secrets, profit statements, and store settings reserved for **Owner**.
- **User Management**: Owner can add cashiers, update credentials, or deactivate accounts.

### 11. ⚙️ Store Settings & Data Controls
- Store branding, tagline, address, phone number, Wi-Fi info, and VAT rates.
- **Backup & Restore**: Download full `.json` database backups or restore at any time.
- **Reset All Data**: Clean all mock items to start fresh with real production store data.
- **Load Demo Data**: Reload complete sample catalog for onboarding and simulation.
- **Themes & Languages**: Dark/Light mode support and full bilingual switching (**Indonesian & English**).

### 12. 🔄 Centralized Server Database & Multi-Device Sync
- **Single Source of Truth**: Data safely stored in local server JSON (`data/pos_database.json`) with atomic writes and rolling backups (`.bak.json`).
- **Real-Time Synchronization**: Orders placed by waiters on mobile phones appear immediately on the cashier PC; new menu items added on PC appear on waiters' phones.
- **Multi-Device Ready**: Works over local store Wi-Fi (LAN) and globally via **Cloudflare Tunnel**.

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) |
| **UI Library** | [React 19](https://react.dev/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **State Management** | [Zustand v5](https://zustand-demo.pmnd.rs/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Server Storage** | Local Server JSON Database |
| **Cloud Database** | [Supabase](https://supabase.com/) (Optional) |

---

## 💻 Running Locally

### 1. Requirements
- [Node.js](https://nodejs.org/) (v18.17+ or v20+).

### 2. Setup & Run
```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

Open your browser at: **[http://localhost:3000](http://localhost:3000)**

---

## 📱 Waiter Smartphone / Tablet Access

### LAN Wi-Fi (Same Network)
1. Find your cashier PC's IPv4 address:
   ```bash
   ipconfig
   ```
2. Open the mobile browser on your phone/tablet and navigate to:
   ```
   http://YOUR_PC_IP:3000
   ```

### Internet Access via Cloudflare Tunnel
1. Start the tunnel on your cashier PC:
   ```bash
   cloudflared tunnel --url http://localhost:3000
   ```
2. Open the generated HTTPS URL on any mobile device.

---

## 📄 License

Released under the **[MIT License](LICENSE)**. Free for commercial, business, and educational use.
