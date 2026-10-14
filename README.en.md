# ☕ KASIR POS KAGE46

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-v5-443E38?style=for-the-badge)](https://zustand-demo.pmnd.rs/)
[![Supabase Ready](https://img.shields.io/badge/Supabase-Ready-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

🌐 **Language / Bahasa:** [🇮🇩 Bahasa Indonesia](README.md) | [🇬🇧 English](README.en.md)

---

**KASIR POS KAGE46** is a modern, high-performance web-based Point of Sale (POS) system specifically built for the Food & Beverage (F&B) industry, specialty coffee shops, artisan kitchens, and restaurants.

The system embraces an **Offline-First**, **Mobile-Friendly**, and **Cloud-Ready** architecture with a premium SaaS-grade user interface (Glassmorphism, Dark/Light Mode, micro-animations, and full responsiveness on smartphones, tablets, and cashier desktop PCs).

---

## 📑 Table of Contents

- [Project Overview](#-project-overview)
- [Technology Stack](#-technology-stack)
- [Key Features](#-key-features)
  - [1. Smart POS (Point of Sale)](#1-smart-pos-point-of-sale)
  - [2. Transactions & Multi-Payment Methods](#2-transactions--multi-payment-methods)
  - [3. Thermal Receipt Printing & WhatsApp Share](#3-thermal-receipt-printing--whatsapp-share)
  - [4. Inventory Management & Stock Opname](#4-inventory-management--stock-opname)
  - [5. Recipe Costing & Automated COGS (HPP)](#5-recipe-costing--automated-cogs-hpp)
  - [6. Financial Statements & Net Profit Analysis](#6-financial-statements--net-profit-analysis)
  - [7. Shift Management & Cash Drawer Control](#7-shift-management--cash-drawer-control)
  - [8. Operational Expense Tracker (OPEX)](#8-operational-expense-tracker-opex)
  - [9. Customer Database & Loyalty CRM](#9-customer-database--loyalty-crm)
  - [10. Authentication & Multi-User RBAC](#10-authentication--multi-user-rbac)
  - [11. Data Export to Excel/CSV](#11-data-export-to-excelcsv)
  - [12. Store Settings & Customization](#12-store-settings--customization)
- [Default Demo Credentials](#-default-demo-credentials)
- [Installation & Getting Started](#-installation--getting-started)
- [Local Network Access (Multi-Device / Smartphone)](#-local-network-access-multi-device--smartphone)
- [Cloud Supabase Database Integration (Optional)](#-cloud-supabase-database-integration-optional)
- [Project Directory Structure](#-project-directory-structure)

---

## 💡 Project Overview

Coffee shops and culinary businesses demand a cashier system that not only executes rapid order processing during peak hours, but also maintains strict ingredient cost controls and transparent profitability. **KASIR POS KAGE46** solves these critical needs:
- **Precision Recipe Costing (COGS/HPP)**: Ties each menu portion directly to warehouse raw materials measured in grams, milliliters, or units.
- **True Profitability Transparency**: Displays actual Net Profit after deducting raw material costs and operational cash expenses from gross revenues.
- **High Portability**: Operates natively on a cashier's smartphone or a server's tablet without requiring native app store downloads.
- **Autonomous System**: Operates seamlessly offline using browser LocalStorage synchronization (via Zustand Persist) and is ready for real-time cloud backup with PostgreSQL Supabase.

---

## 🛠 Technology Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) | High-performance React framework with optimal rendering & routing |
| **UI Library** | [React 19](https://react.dev/) | Modern reactive component lifecycle management |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Strict type-safety ensuring runtime stability and maintainability |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Modern utility-first styling with Glassmorphism and native Dark Mode |
| **State Management** | [Zustand v5](https://github.com/pmndrs/zustand) | Lightweight global store with `persist` middleware for LocalStorage caching |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, consistent, and scalable vector icons |
| **Cloud Database** | [Supabase](https://supabase.com/) | Optional PostgreSQL backend for centralized multi-branch data synchronization |
| **Print Engine** | Custom `@media print` CSS | Pixel-perfect layout for standard 58mm and 80mm thermal receipt printers |
| **Internationalization** | In-App Translation Engine | Full bilingual support (**Bahasa Indonesia** & **English**) |

---

## 🚀 Key Features

### 1. Smart POS (Point of Sale)
- **Fast Catalog & Category Filters**: Instant switching between menu categories (*Signature, Coffee, Non-Coffee, Food, Snacks, All*), real-time search, and SKU/barcode shortcuts.
- **Integrated Order Modes**:
  - **Dine-In**: Visual table selector (*Table 01 - 20, VIP 01 - 03, Outdoor 01 - 04*) with clear indicators for currently occupied tables (*Open Bills*).
  - **Takeaway**: One-click takeout ordering.
- **Order Customization**: Flexible quantity adjustments, per-item special notes (*e.g., less sugar, oat milk, extra shot, no ice, spicy level*), and instant cart reset.
- **Responsive Adaptive Layout**:
  - **Desktop / Tablet**: Side-docked cart pane for rapid high-volume cashier workflow.
  - **Smartphone**: Sticky bottom action bar with slide-in cart drawer.
- **Quick Menu Add (+ Instant Product)**: Add a new product on the fly directly from the POS screen without configuring a recipe upfront. The item is saved to the catalog and immediately added to the current cart.

### 2. Transactions & Multi-Payment Methods
- **Multi-Payment Gateways**:
  - **Cash**: Quick cash shortcuts (Rp 20.000, Rp 50.000, Rp 100.000, Rp 200.000, and Exact Amount) with real-time change calculation.
  - **Dynamic QRIS**: Dynamic QR code display showing outlet Merchant NMID.
  - **Bank Transfer**: Outlet bank account details (BCA/other banks) with account number and holder name.
  - **Debit / EDC Cards**: Direct logging for cashier EDC terminal card swipes.
- **Discounts & VAT (PPN)**: Nominal bill discounts and a 1-click toggle for VAT (11% PPN) per transaction.
- **Open Bill / Pay Later System**:
  - Park active dining table orders pending settlement.
  - Append new items to the table's running bill at any time.
  - Rapid settlement through the slide-out Open Bills drawer.
- **Transaction History & Void Control**:
  - Complete history log with status filters (*Completed, Open Bill, Void*).
  - Filter by payment method, invoice number, or customer name.
  - **Safe Void Feature**: Order cancellation requires a mandatory audit reason and provides an option to **automatically restore deducted ingredients** back to warehouse inventory.

### 3. Thermal Receipt Printing & WhatsApp Share
- **Dual-Size Thermal Printer Switch**: Toggle seamlessly between **58mm** and **80mm** receipt widths.
- **Full Cashier Receipt Format**:
  - Store identity (Logo, Store Name, Tagline, Address, Phone Number).
  - Official invoice number, timestamp, and cashier on duty.
  - Order type (Dine-In + Table Number / Takeaway) and customer name.
  - Itemized menu breakdown, modifier notes, subtotal, discount, VAT, and grand total.
  - Payment method, tender amount, and change due.
  - Store guest Wi-Fi details (SSID & Password) and social media handles (Instagram & TikTok).
  - Customizable receipt footer greeting message.
- **Direct Thermal Printing**: Clean thermal layout via browser `@media print` without margins or header artifacts (Bluetooth & USB printer ready).
- **Share Receipt via WhatsApp**: Auto-formats a digital receipt into a WhatsApp message and opens `wa.me` directly to the customer's phone number with a single click.
- **Copy Text**: Copy plain-text receipt contents to the clipboard.

### 4. Inventory Management & Stock Opname
- **Ingredient Warehouse**: Full tracking of raw materials (*Coffee Beans, Dairy, Syrups & Flavours, Powders, Packaging, Toppings*).
- **Bulk-to-Unit Cost Conversion**: Automatically computes the exact cost per gram, milliliter, or unit from large bulk purchase packages.
- **Automatic Stock Deduction**: Selling menu items at the POS automatically deducts corresponding raw material quantities based on recipe formulas.
- **Low Stock Alerts**: Prominent visual warnings when inventory levels drop below defined alert thresholds.
- **Live Inventory Asset Valuation**: Real-time monetary valuation of total stored inventory.
- **Comprehensive Stock Opname**:
  - Routine physical audit reconciliation against system inventory.
  - Log discrepancy reasons (*Spillage, Expired, Damaged/Spoiled, Counting Discrepancy, Others*).
  - Historical opname audit trail with dates, timestamps, and staff signatures.

### 5. Recipe Costing & Automated COGS (HPP)
- **Menu Portion Recipe Formulation**: Combine exact ingredient measurements per serving (e.g., 18g Espresso Beans + 150ml Fresh Milk + 20ml Palm Sugar).
- **Raw Material Costing**: Live calculation of material costs based on current ingredient purchase prices.
- **Overhead & Rent Allocation**:
  - Assign rent and utility expenses per serving.
  - Built-in rent allocation calculator: divides monthly rent by monthly cup sales targets.
- **Packaging Cost Allocation**: Account for cup, lid, straw, and bag costs per portion.
- **Full COGS (HPP) Calculation**: Comprehensive HPP = Raw Materials + Overhead/Rent + Packaging.
- **Margin Simulation & Selling Price Recommendations**:
  - Displays live gross profit and margin percentages.
  - Automated price recommendations for 50%, 60% (Cafe Benchmark), and 70% (Premium) profit targets.
  - 1-click button to apply recommended prices directly to the menu catalog.

### 6. Financial Statements & Net Profit Analysis
- **Financial Waterfall Breakdown**:
  1. **Gross Revenue** (Total settled sales)
  2. **Cost of Goods Sold - COGS/HPP** (Raw materials + overhead allocation)
  3. **Gross Profit** (Gross Revenue - COGS)
  4. **Operating Expenses - OPEX** (Store expenses)
  5. **Real Net Profit** (Gross Profit - OPEX) & Net Margin (%)
- **Period Filters**: Today, Last 7 Days, and Last 30 Days.
- **Payment Method Distribution**: Breakdown of cash, QRIS, bank transfers, and EDC cards.
- **Official Statement Printout**: Printable formal profit-and-loss financial statement (Print to PDF / accounting slip).

### 7. Shift Management & Cash Drawer Control
- **Open Cashier Shift**: Record starting change fund (*Starting Cash*).
- **Shift Settlement Slip**:
  - Opening cash fund.
  - Total cash sales & non-cash receipts.
  - Cash paid out from the drawer for petty expenses.
  - Expected cash in drawer vs actual physical cash counted.
  - Auto-detection of cash discrepancy (*Cash Over / Short*).
- **Shift Archive**: Historical log of past cashier shift closures.

### 8. Operational Expense Tracker (OPEX)
- **Daily Petty Cash Tracking**: Record day-to-day operational expenses (e.g., tube ice refills, LPG gas, sanitation supplies, packaging supplies, logistics).
- **Source of Funds Options**:
  - **Cash Drawer**: Automatically deducts from the cashier's active shift drawer (*reduces Expected Cash*).
  - **Bank Account**: Recorded in financial operating expenses without affecting drawer balance.

### 9. Customer Database & Loyalty CRM
- **Customer Directory**: Store customer names, WhatsApp phone numbers, and email addresses.
- **Loyalty Metrics**: Automatically tracks total visits, total historical spend, and accumulated loyalty points.
- **Instant WhatsApp Chat**: Launch direct WhatsApp conversations pre-filled with personalized greetings from the store.

### 10. Authentication & Multi-User RBAC
- **Strict Login Barrier**: System is securely locked behind a login screen requiring valid username and password credentials.
- **Role-Based Access Control (RBAC)**:
  - **Owner / Master**: Unrestricted access to all modules including recipes, COGS, net profit analytics, warehouse inventory, user accounts, and store settings.
  - **Cashier**: Focused on POS operations, table orders, transaction history, shift management, and cash drawer expenses. Protected from viewing confidential recipe margins and net profit reports.
- **Staff Account Management**: Owners can create new cashiers, toggle active statuses, update profiles, and reset passwords.

### 11. Data Export to Excel/CSV
- Export all tabular data into **CSV format with UTF-8 BOM encoding** for instant, flawless opening in Microsoft Excel, Google Sheets, or Apple Numbers:
  - Export Sales Transaction History
  - Export Profit & Loss Financial Statements
  - Export Warehouse Inventory & Valuations

### 12. Store Settings & Customization
- **Outlet Identity**: Store name, tagline, address, and contact numbers.
- **Guest Wi-Fi**: Network SSID and password printed directly onto customer receipts.
- **Social Media**: Store Instagram and TikTok handles.
- **Tax & Bank Account**: VAT percentage (PPN) and bank account numbers for wire transfers.
- **Bilingual Support**: Toggle between **Bahasa Indonesia** and **English** on the fly.
- **Dark Mode / Light Mode**: Seamless theme switching for day and night shifts.
- **Data Utilities**: One-click demo data reset or total store factory reset.

---

## 🔑 Default Demo Credentials

The application is pre-loaded with comprehensive demo data. You can log in using any of the following accounts:

| Role | Username | Password | Access Permissions |
| :--- | :--- | :--- | :--- |
| **Owner / Master** | `owner` | `kage46owner` | Full Access (POS, Recipes, COGS, Inventory, Net Profit, Settings, Staff) |
| **Cashier 1** | `kasir1` | `kasir123` | Operational Cashier POS, Transactions, Shifts, Drawer Expenses |
| **Cashier 2** | `kasir2` | `kasir123` | Operational Cashier POS, Transactions, Shifts, Drawer Expenses |

> [!TIP]
> You can create or modify cashier accounts at any time from the **Settings & Accounts** screen while logged in as **Owner**.

---

## 💻 Installation & Getting Started

### Prerequisites
- **Node.js**: Version `18.17` or higher (Node.js v20+ recommended)
- **npm**, **yarn**, or **pnpm**

### Step-by-Step Guide

1. **Navigate to the project root**:
   ```bash
   cd "c:\Users\Administrator\Documents\antigravity\kasir kage46"
   ```

2. **Install all dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open the web application**:
   Navigate to [http://localhost:3000](http://localhost:3000) using Google Chrome, Microsoft Edge, Safari, or Firefox.

5. **Production Build (Optional)**:
   ```bash
   npm run build
   npm run start
   ```

---

## 📱 Local Network Access (Multi-Device / Smartphone)

The development server runs with `-H 0.0.0.0`, enabling other devices (cashier smartphones, server tablets) on the same Wi-Fi network to access the POS:

1. Open a terminal on your host machine and find your local IP address:
   ```bash
   ipconfig
   ```
2. Note your **IPv4 Address** (e.g., `192.168.1.46`).
3. Open a browser on any smartphone or tablet connected to the same Wi-Fi, and navigate to:
   ```
   http://192.168.1.46:3000
   ```
4. Staff can now take orders directly from their mobile devices!

---

## ☁️ Cloud Supabase Database Integration (Optional)

By default, the application runs 100% autonomously (**Offline-First**) using browser LocalStorage. To connect to a cloud Supabase backend:

1. Create a new project on the [Supabase Dashboard](https://database.new).
2. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```
3. Open `.env.local` and paste your Supabase API credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```
4. In your Supabase Dashboard, open the **SQL Editor**, open the [supabase/schema.sql](file:///c:/Users/Administrator/Documents/antigravity/kasir%20kage46/supabase/schema.sql) file, and execute the SQL script to provision the tables.

---

## 📂 Project Directory Structure

```
kasir-kage46/
├── public/                 # Static assets & icons
├── src/
│   ├── app/                # Next.js App Router Pages
│   │   ├── layout.tsx      # Root HTML Layout, Metadata & Theme Loader
│   │   ├── globals.css     # Tailwind CSS styles & @media print rules
│   │   ├── page.tsx        # Dashboard, Sales Analytics & Top Selling Menu
│   │   ├── pos/            # Smart POS Screen (Catalog, Cart & Checkout)
│   │   ├── products/       # Menu Management, Recipes & HPP Simulation
│   │   ├── inventory/      # Warehouse Raw Materials & Stock Opname
│   │   ├── transactions/   # Transaction History, Open Bills & Void Orders
│   │   ├── customers/      # Customer Database, Loyalty Points & WhatsApp
│   │   ├── reports/        # Financial Statement, Net Profit & PDF Print
│   │   └── settings/       # Store Settings, Taxes, Receipt & Staff Accounts
│   ├── components/         # Reusable UI Components
│   │   ├── auth/           # LoginScreen, LoginModal, UserFormModal, EditProfileModal
│   │   ├── inventory/      # IngredientFormModal, StockOpnameModal
│   │   ├── layout/         # AppShell, Header, Sidebar, MobileBottomNav
│   │   ├── pos/            # ProductGrid, ProductCard, CartPane, CheckoutModal,
│   │   │                   # ReceiptModal, TablePickerModal, QuickAddProductModal
│   │   ├── products/       # RecipeModal (HPP Calculator), ProductFormModal
│   │   ├── shared/         # ShiftModal, ExpenseModal, OpenBillsDrawer, ToastContainer
│   │   └── transactions/   # TransactionDetailModal, VoidModal
│   ├── data/
│   │   └── mockData.ts     # Initial seed data (Users, Products, Ingredients, Orders)
│   ├── lib/
│   │   ├── exportUtils.ts  # CSV / Excel export engine with UTF-8 BOM
│   │   ├── supabase.ts     # Supabase client setup & connection check
│   │   ├── translations.ts # Bilingual dictionary (Indonesian & English)
│   │   └── utils.ts        # IDR Currency formatting, dates & ID generator
│   ├── store/
│   │   └── usePosStore.ts  # Zustand global store with LocalStorage persistence
│   └── types/
│       └── pos.ts          # Comprehensive TypeScript data models
├── supabase/
│   └── schema.sql          # Complete PostgreSQL schema for Supabase
├── .env.local.example      # Environment variables template
├── package.json            # Dependencies and npm scripts
├── tsconfig.json           # TypeScript configuration
├── LICENSE                 # Open source license (MIT License)
├── README.md               # Documentation in Indonesian (Bahasa Indonesia)
└── README.en.md            # Documentation in English
```

---

## 📄 License

This project is open-source software licensed under the **[MIT License](LICENSE)**. You are free to use, modify, adapt, and distribute this software for commercial, personal, or educational purposes.
