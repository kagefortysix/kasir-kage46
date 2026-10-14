export type AppLanguage = "id" | "en";

export type UserRole = "owner" | "cashier";

export type OrderType = "dine_in" | "takeaway";

export type OrderStatus = "completed" | "open_bill" | "void";

export type PaymentMethod = "cash" | "qris" | "transfer" | "card";

export type ProductCategory = 
  | "Semua"
  | "Kopi"
  | "Non-Kopi"
  | "Makanan"
  | "Camilan"
  | "Signature";

export interface UserAccount {
  id: string;
  username: string;
  password?: string;
  name: string;
  role: UserRole; // 'owner' | 'cashier'
  isActive: boolean;
  createdAt: string;
}

export interface RecipeItem {
  ingredientId: string;
  ingredientName: string;
  amount: number; // e.g. 18 (grams), 150 (ml), 1 (pcs)
  unit: string;   // 'gr', 'ml', 'pcs'
  costPerUnit: number; // calculated cost
  subtotalCost: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: ProductCategory;
  price: number;
  costPrice: number; // Calculated or manually set HPP (Termasuk bahan baku + sewa tempat + kemasan)
  rawMaterialCost?: number; // Khusus modal bahan baku racikan
  overheadCost?: number; // Alokasi sewa tempat & operasional per cup (e.g. Rp 2.000)
  packagingCost?: number; // Biaya kemasan/cup per cup (e.g. Rp 1.500)
  stock: number; // calculated or tracked
  minStock?: number;
  minStockAlert?: number;
  imageUrl?: string;
  isQuickItem?: boolean; // Instantly added without recipe
  hasRecipe?: boolean;
  recipe?: RecipeItem[];
  description?: string;
  isAvailable: boolean;
}

export interface Ingredient {
  id: string;
  name: string;
  category: "Biji Kopi" | "Dairy" | "Sirup & Flavour" | "Bubuk Powder" | "Packaging" | "Topping / Lainnya";
  unit: "gr" | "ml" | "pcs" | "pack";
  currentStock: number;
  minStockAlert: number;
  packagePrice: number; // e.g. Rp 120.000
  packageSize: number;  // e.g. 1000 gr
  unitCost: number;     // packagePrice / packageSize = Rp 120/gr
  lastRestockedAt: string;
}

export interface StockOpnameRecord {
  id: string;
  ingredientId: string;
  ingredientName: string;
  unit: string;
  systemStock: number;
  actualStock: number;
  difference: number;
  reason: "Spillage (Tumpah)" | "Kadaluarsa" | "Rusak / Basi" | "Selisih Hitung" | "Lainnya";
  recordedBy: string;
  timestamp: string;
  note?: string;
}

export interface CartItem {
  id: string; // unique item uuid in cart
  productId: string;
  name: string;
  price: number;
  costPrice: number;
  quantity: number;
  notes?: string;
  category: ProductCategory;
}

export interface OrderItem extends CartItem {
  subtotal: number;
}

export interface Order {
  id: string;
  invoiceNumber: string;
  timestamp: string;
  orderType: OrderType;
  tableNumber?: string;
  customerName?: string;
  customerPhone?: string;
  cashierName: string;
  items: OrderItem[];
  subtotal: number;
  discountNominal: number;
  taxNominal: number;
  total: number;
  paymentMethod: PaymentMethod;
  amountPaid: number;
  changeAmount: number;
  status: OrderStatus;
  voidReason?: string;
  voidedAt?: string;
  restoredStock?: boolean;
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  totalVisits: number;
  totalSpend: number;
  points: number;
  lastVisit: string;
}

export interface Shift {
  id: string;
  cashierName: string;
  openedAt: string;
  closedAt?: string;
  startingCash: number; // Modal uang kembalian awal
  totalCashSales: number;
  totalNonCashSales: number;
  totalExpenses: number; // Pengeluaran dari laci kasir
  expectedCash: number; // startingCash + totalCashSales - totalExpenses
  actualCash?: number;
  cashDifference?: number; // actualCash - expectedCash
  status: "open" | "closed";
  notes?: string;
}

export interface Expense {
  id: string;
  title: string;
  category: "Bahan Tambahan" | "Utilitas & Listrik" | "Operasional Toko" | "Transport & Logistik" | "Lainnya";
  amount: number;
  source: "cash_drawer" | "bank_transfer";
  cashierName: string;
  timestamp: string;
  note?: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  address: string;
  phone: string;
  instagram: string;
  tiktok: string;
  wifiName: string;
  wifiPassword: string;
  taxPercentage: number; // e.g. 10%
  taxEnabled: boolean;
  receiptSize: "58mm" | "80mm";
  receiptFooterMessage: string;
  qrisMerchantName: string;
  language?: AppLanguage;
  bankAccount: {
    bankName: string;
    accountNumber: string;
    holderName: string;
  };
}

export interface SharedPOSData {
  users: UserAccount[];
  settings: StoreSettings;
  products: Product[];
  ingredients: Ingredient[];
  customers: Customer[];
  orders: Order[];
  expenses: Expense[];
  currentShift: Shift | null;
  shiftHistory: Shift[];
  stockOpnames: StockOpnameRecord[];
}

export interface ServerPOSDatabase extends SharedPOSData {
  version: number;
  lastModified: number;
  initialized: boolean;
}

export type SyncStatus = "idle" | "synced" | "syncing" | "offline" | "error";

