import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { 
  UserRole, 
  Product, 
  Ingredient, 
  Customer, 
  Order, 
  CartItem, 
  Expense, 
  Shift, 
  StoreSettings, 
  StockOpnameRecord, 
  OrderType, 
  PaymentMethod,
  ProductCategory,
  UserAccount
} from "@/types/pos";
import { 
  initialProducts, 
  initialIngredients, 
  initialCustomers, 
  initialOrders, 
  initialExpenses, 
  initialShift, 
  initialSettings, 
  initialOpnameRecords,
  initialUsers
} from "@/data/mockData";
import { generateId } from "@/lib/utils";

export interface ToastItem {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
}

interface PosState {
  // User Accounts & Authentication
  users: UserAccount[];
  currentUser: UserAccount | null;
  role: UserRole;
  setRole: (role: UserRole) => void;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addUser: (userData: Omit<UserAccount, "id" | "createdAt">) => boolean;
  updateUser: (id: string, userData: Partial<UserAccount>) => void;
  deleteUser: (id: string) => void;
  toggleUserActive: (id: string) => void;

  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Store Settings
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  resetAllData: () => void;
  loadDemoData: () => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, "id" | "sku">) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  quickAddProduct: (name: string, price: number, category: ProductCategory) => Product;

  // Inventory & Ingredients
  ingredients: Ingredient[];
  stockOpnames: StockOpnameRecord[];
  addIngredient: (ingredient: Omit<Ingredient, "id" | "unitCost" | "lastRestockedAt">) => void;
  updateIngredient: (id: string, ingredient: Partial<Ingredient>) => void;
  recordStockOpname: (data: {
    ingredientId: string;
    actualStock: number;
    reason: StockOpnameRecord["reason"];
    recordedBy: string;
    note?: string;
  }) => void;

  // Cart
  cart: CartItem[];
  orderType: OrderType;
  tableNumber: string;
  selectedCustomerId?: string;
  discountNominal: number;
  taxEnabled: boolean;
  addToCart: (product: Product, notes?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  updateCartItemNotes: (cartItemId: string, notes: string) => void;
  setOrderType: (type: OrderType) => void;
  setTableNumber: (table: string) => void;
  setSelectedCustomerId: (id?: string) => void;
  setDiscountNominal: (discount: number) => void;
  setTaxEnabled: (enabled: boolean) => void;
  clearCart: () => void;
  loadOrderIntoCart: (order: Order) => void;

  // Orders & Transactions
  orders: Order[];
  activeReceiptOrder: Order | null;
  setActiveReceiptOrder: (order: Order | null) => void;
  completeCheckout: (paymentMethod: PaymentMethod, amountPaid: number, cashierName: string) => Order | null;
  saveOpenBill: (cashierName: string) => Order | null;
  settleOpenBill: (orderId: string, paymentMethod: PaymentMethod, amountPaid: number) => Order | null;
  voidOrder: (orderId: string, reason: string, restoreStock: boolean) => void;

  // Shifts
  currentShift: Shift | null;
  shiftHistory: Shift[];
  openShift: (startingCash: number, cashierName: string, notes?: string) => void;
  closeShift: (actualCash: number, notes?: string) => Shift | null;

  // Expenses
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, "id" | "timestamp">) => void;

  // Customers
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, "id" | "totalVisits" | "totalSpend" | "points" | "lastVisit">) => Customer;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  // UI Modals & Drawers
  isCartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
  isCheckoutModalOpen: boolean;
  setCheckoutModalOpen: (open: boolean) => void;
  isReceiptModalOpen: boolean;
  setReceiptModalOpen: (open: boolean) => void;
  isShiftModalOpen: boolean;
  setShiftModalOpen: (open: boolean) => void;
  isExpenseModalOpen: boolean;
  setExpenseModalOpen: (open: boolean) => void;
  isQuickAddModalOpen: boolean;
  setQuickAddModalOpen: (open: boolean) => void;
  isOpenBillsDrawerOpen: boolean;
  setOpenBillsDrawerOpen: (open: boolean) => void;

  // Toasts
  toasts: ToastItem[];
  addToast: (message: string, type?: ToastItem["type"]) => void;
  removeToast: (id: string) => void;
}

export const usePosStore = create<PosState>()(
  persist(
    (set, get) => ({
      // User Accounts & Authentication
      users: initialUsers,
      currentUser: null, // Default logged out, requires manual login
      role: "cashier",
      setRole: () => {
        // Role is strictly locked to currentUser.role
        const current = get().currentUser;
        if (current) {
          set({ role: current.role });
        }
      },
      login: (username, password) => {
        const user = get().users.find(
          (u) => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password
        );
        if (!user) {
          get().addToast("Username atau password salah!", "error");
          return false;
        }
        if (!user.isActive) {
          get().addToast("Akun kasir ini telah dinonaktifkan oleh Owner!", "warning");
          return false;
        }
        set({ currentUser: user, role: user.role });
        get().addToast(`Selamat datang kembali, ${user.name}!`, "success");
        return true;
      },
      logout: () => {
        set({ currentUser: null, role: "cashier" });
        get().addToast("Anda telah keluar dari sistem kasir", "info");
      },
      addUser: (userData) => {
        const exists = get().users.some(
          (u) => u.username.toLowerCase() === userData.username.trim().toLowerCase()
        );
        if (exists) {
          get().addToast(`Username "${userData.username}" sudah digunakan!`, "error");
          return false;
        }
        const newUser: UserAccount = {
          id: generateId("usr"),
          ...userData,
          createdAt: new Date().toISOString().slice(0, 10),
        };
        set((state) => ({ users: [newUser, ...state.users] }));
        get().addToast(`Akun ${newUser.role.toUpperCase()} "${newUser.name}" berhasil dibuat!`, "success");
        return true;
      },
      updateUser: (id, userData) => {
        set((state) => ({
          users: state.users.map((u) => (u.id === id ? { ...u, ...userData } : u)),
          currentUser: state.currentUser?.id === id ? { ...state.currentUser, ...userData } : state.currentUser,
        }));
        get().addToast("Data akun berhasil diperbarui", "success");
      },
      deleteUser: (id) => {
        const target = get().users.find((u) => u.id === id);
        if (target?.username === "owner") {
          get().addToast("Akun Master Owner tidak dapat dihapus!", "error");
          return;
        }
        set((state) => ({
          users: state.users.filter((u) => u.id !== id),
        }));
        get().addToast(`Akun "${target?.name}" berhasil dihapus`, "info");
      },
      toggleUserActive: (id) => {
        const target = get().users.find((u) => u.id === id);
        if (target?.username === "owner") {
          get().addToast("Akun Master Owner tidak dapat dinonaktifkan!", "error");
          return;
        }
        set((state) => ({
          users: state.users.map((u) =>
            u.id === id ? { ...u, isActive: !u.isActive } : u
          ),
        }));
        get().addToast(`Status akun ${target?.name} diubah`, "info");
      },

      // Theme
      isDarkMode: false,
      toggleDarkMode: () => {
        const next = !get().isDarkMode;
        set({ isDarkMode: next });
        if (typeof document !== "undefined") {
          if (next) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        }
      },

      // Settings
      settings: initialSettings,
      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
          taxEnabled: newSettings.taxEnabled !== undefined ? newSettings.taxEnabled : state.taxEnabled,
        }));
        get().addToast("Pengaturan berhasil disimpan", "success");
      },
      resetAllData: () => {
        set({
          users: [initialUsers[0]], // Tetap simpan akun Master Owner
          currentUser: initialUsers[0],
          role: "owner",
          products: [], // Kosongkan produk
          ingredients: [], // Kosongkan bahan baku gudang
          customers: [], // Kosongkan pelanggan
          orders: [], // Kosongkan transaksi
          expenses: [], // Kosongkan pengeluaran
          currentShift: null, // Tutup shift kasir
          shiftHistory: [], // Kosongkan riwayat shift
          stockOpnames: [], // Kosongkan riwayat stock opname
          settings: initialSettings,
          taxEnabled: initialSettings.taxEnabled,
          cart: [], // Kosongkan keranjang
          discountNominal: 0,
        });
        get().addToast("Semua data demo telah dikosongkan. Sistem bersih siap diisi data riil toko!", "info");
      },
      loadDemoData: () => {
        set({
          users: initialUsers,
          currentUser: initialUsers[0],
          role: "owner",
          products: initialProducts,
          ingredients: initialIngredients,
          customers: initialCustomers,
          orders: initialOrders,
          expenses: initialExpenses,
          currentShift: initialShift,
          shiftHistory: [],
          stockOpnames: initialOpnameRecords,
          settings: initialSettings,
          taxEnabled: initialSettings.taxEnabled,
          cart: [],
          discountNominal: 0,
        });
        get().addToast("Data contoh demo berhasil dimuat kembali!", "success");
      },

      // Products
      products: initialProducts,
      addProduct: (productData) => {
        const sku = `KGE-${productData.category.slice(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;
        const newProduct: Product = {
          ...productData,
          id: generateId("prod"),
          sku,
        };
        set((state) => ({ products: [newProduct, ...state.products] }));
        get().addToast(`Menu "${newProduct.name}" berhasil ditambahkan`, "success");
      },
      updateProduct: (id, updated) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updated } : p)),
        }));
        get().addToast("Produk berhasil diperbarui", "success");
      },
      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
        get().addToast("Produk dihapus", "info");
      },
      quickAddProduct: (name, price, category) => {
        const newProduct: Product = {
          id: generateId("prod-quick"),
          sku: `QCK-${Math.floor(100 + Math.random() * 900)}`,
          name,
          category,
          price,
          costPrice: Math.round(price * 0.4), // default estimated 40% HPP
          stock: 99,
          minStockAlert: 5,
          imageUrl: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80",
          isAvailable: true,
          isQuickItem: true,
          hasRecipe: false,
          description: "Menu instan kasir cepat tanpa resep.",
        };
        set((state) => ({
          products: [newProduct, ...state.products],
        }));
        // Auto add to cart as well!
        get().addToCart(newProduct);
        get().addToast(`Menu instan "${name}" dibuat & masuk keranjang!`, "success");
        return newProduct;
      },

      // Ingredients & Opname
      ingredients: initialIngredients,
      stockOpnames: initialOpnameRecords,
      addIngredient: (data) => {
        const unitCost = Math.round(data.packagePrice / (data.packageSize || 1));
        const newIng: Ingredient = {
          ...data,
          id: generateId("ing"),
          unitCost,
          lastRestockedAt: new Date().toISOString().split("T")[0],
        };
        set((state) => ({ ingredients: [newIng, ...state.ingredients] }));
        get().addToast(`Bahan "${newIng.name}" berhasil ditambahkan`, "success");
      },
      updateIngredient: (id, updated) => {
        set((state) => ({
          ingredients: state.ingredients.map((ing) => {
            if (ing.id !== id) return ing;
            const pkgPrice = updated.packagePrice ?? ing.packagePrice;
            const pkgSize = updated.packageSize ?? ing.packageSize;
            const unitCost = Math.round(pkgPrice / (pkgSize || 1));
            return { ...ing, ...updated, unitCost };
          }),
        }));
        get().addToast("Bahan baku diperbarui", "success");
      },
      recordStockOpname: ({ ingredientId, actualStock, reason, recordedBy, note }) => {
        const ing = get().ingredients.find((i) => i.id === ingredientId);
        if (!ing) return;
        const systemStock = ing.currentStock;
        const difference = actualStock - systemStock;

        const newRecord: StockOpnameRecord = {
          id: generateId("opn"),
          ingredientId,
          ingredientName: ing.name,
          unit: ing.unit,
          systemStock,
          actualStock,
          difference,
          reason,
          recordedBy,
          timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
          note,
        };

        set((state) => ({
          stockOpnames: [newRecord, ...state.stockOpnames],
          ingredients: state.ingredients.map((i) =>
            i.id === ingredientId ? { ...i, currentStock: actualStock } : i
          ),
        }));
        get().addToast(`Stock Opname "${ing.name}" tercatat (Selisih: ${difference > 0 ? "+" : ""}${difference} ${ing.unit})`, "info");
      },

      // Cart
      cart: [],
      orderType: "dine_in",
      tableNumber: "Meja 01",
      selectedCustomerId: undefined,
      discountNominal: 0,
      taxEnabled: initialSettings.taxEnabled,
      addToCart: (product, notes = "") => {
        const state = get();
        // check if same product and same notes already in cart
        const existingIndex = state.cart.findIndex(
          (item) => item.productId === product.id && (item.notes || "") === notes
        );

        if (existingIndex > -1) {
          const newCart = [...state.cart];
          newCart[existingIndex].quantity += 1;
          set({ cart: newCart });
        } else {
          const newItem: CartItem = {
            id: generateId("cart-item"),
            productId: product.id,
            name: product.name,
            price: product.price,
            costPrice: product.costPrice || 0,
            quantity: 1,
            notes,
            category: product.category,
          };
          set({ cart: [...state.cart, newItem] });
        }
        get().addToast(`+1 ${product.name} dimasukkan keranjang`, "info");
      },
      removeFromCart: (cartItemId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== cartItemId),
        }));
      },
      updateCartQuantity: (cartItemId, delta) => {
        set((state) => {
          const newCart = state.cart
            .map((item) => {
              if (item.id === cartItemId) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : null;
              }
              return item;
            })
            .filter(Boolean) as CartItem[];
          return { cart: newCart };
        });
      },
      updateCartItemNotes: (cartItemId, notes) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === cartItemId ? { ...item, notes } : item
          ),
        }));
      },
      setOrderType: (orderType) => set({ orderType }),
      setTableNumber: (tableNumber) => set({ tableNumber }),
      setSelectedCustomerId: (id) => set({ selectedCustomerId: id }),
      setDiscountNominal: (discountNominal) => set({ discountNominal }),
      setTaxEnabled: (taxEnabled) => set({ taxEnabled }),
      clearCart: () => set((state) => ({ 
        cart: [], 
        discountNominal: 0,
        taxEnabled: state.settings.taxEnabled,
      })),
      loadOrderIntoCart: (order) => {
        const cartItems: CartItem[] = order.items.map((item) => ({
          id: item.id || generateId("cart"),
          productId: item.productId,
          name: item.name,
          price: item.price,
          costPrice: item.costPrice,
          quantity: item.quantity,
          notes: item.notes,
          category: item.category,
        }));
        set({
          cart: cartItems,
          orderType: order.orderType,
          tableNumber: order.tableNumber || "Meja 01",
          discountNominal: order.discountNominal,
          taxEnabled: order.taxNominal > 0,
        });
        get().addToast(`Tagihan "${order.invoiceNumber}" dimuat ke kasir`, "info");
      },

      // Orders & Transactions
      orders: initialOrders,
      activeReceiptOrder: null,
      setActiveReceiptOrder: (order) => set({ activeReceiptOrder: order }),

      completeCheckout: (paymentMethod, amountPaid, cashierName) => {
        const state = get();
        if (state.cart.length === 0) return null;

        const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const taxRate = state.taxEnabled ? state.settings.taxPercentage / 100 : 0;
        const taxNominal = Math.round((subtotal - state.discountNominal) * taxRate);
        const total = Math.max(0, subtotal - state.discountNominal + taxNominal);
        const changeAmount = paymentMethod === "cash" ? Math.max(0, amountPaid - total) : 0;

        // Customer details if selected
        let custName = undefined;
        let custPhone = undefined;
        if (state.selectedCustomerId) {
          const cust = state.customers.find((c) => c.id === state.selectedCustomerId);
          if (cust) {
            custName = cust.name;
            custPhone = cust.phone;
          }
        }

        const newOrder: Order = {
          id: generateId("ord"),
          invoiceNumber: `INV-${new Date().toISOString().slice(2, 10).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`,
          timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
          orderType: state.orderType,
          tableNumber: state.orderType === "dine_in" ? state.tableNumber : undefined,
          customerName: custName,
          customerPhone: custPhone,
          cashierName,
          items: state.cart.map((c) => ({ ...c, subtotal: c.price * c.quantity })),
          subtotal,
          discountNominal: state.discountNominal,
          taxNominal,
          total,
          paymentMethod,
          amountPaid: paymentMethod === "cash" ? amountPaid : total,
          changeAmount,
          status: "completed",
        };

        // Automatic Recipe Ingredient Deductions & Product Stock deduction
        const updatedIngredients = [...state.ingredients];
        const updatedProducts = [...state.products];

        newOrder.items.forEach((item) => {
          const product = updatedProducts.find((p) => p.id === item.productId);
          if (product) {
            product.stock = Math.max(0, product.stock - item.quantity);
            if (product.hasRecipe && product.recipe) {
              product.recipe.forEach((r) => {
                const ingIndex = updatedIngredients.findIndex((i) => i.id === r.ingredientId);
                if (ingIndex > -1) {
                  const needed = r.amount * item.quantity;
                  updatedIngredients[ingIndex] = {
                    ...updatedIngredients[ingIndex],
                    currentStock: Math.max(0, updatedIngredients[ingIndex].currentStock - needed),
                  };
                }
              });
            }
          }
        });

        // Update shift totals if shift is currently open
        let updatedShift = state.currentShift;
        if (updatedShift && updatedShift.status === "open") {
          const isCash = paymentMethod === "cash";
          const newCashSales = isCash ? updatedShift.totalCashSales + total : updatedShift.totalCashSales;
          const newNonCashSales = !isCash ? updatedShift.totalNonCashSales + total : updatedShift.totalNonCashSales;
          const newExpectedCash = updatedShift.startingCash + newCashSales - updatedShift.totalExpenses;

          updatedShift = {
            ...updatedShift,
            totalCashSales: newCashSales,
            totalNonCashSales: newNonCashSales,
            expectedCash: newExpectedCash,
          };
        }

        // Update customer spend & visits if customer linked
        let updatedCustomers = state.customers;
        if (state.selectedCustomerId) {
          updatedCustomers = state.customers.map((c) => {
            if (c.id === state.selectedCustomerId) {
              return {
                ...c,
                totalVisits: c.totalVisits + 1,
                totalSpend: c.totalSpend + total,
                points: c.points + Math.floor(total / 5000), // 1 point per Rp 5000
                lastVisit: newOrder.timestamp,
              };
            }
            return c;
          });
        }

        set({
          orders: [newOrder, ...state.orders],
          ingredients: updatedIngredients,
          products: updatedProducts,
          customers: updatedCustomers,
          currentShift: updatedShift,
          activeReceiptOrder: newOrder,
          cart: [],
          discountNominal: 0,
          taxEnabled: state.settings.taxEnabled,
          isCheckoutModalOpen: false,
          isReceiptModalOpen: true,
        });

        get().addToast(`Transaksi ${newOrder.invoiceNumber} berhasil diselesaikan!`, "success");
        return newOrder;
      },

      saveOpenBill: (cashierName) => {
        const state = get();
        if (state.cart.length === 0) return null;

        const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const taxRate = state.taxEnabled ? state.settings.taxPercentage / 100 : 0;
        const taxNominal = Math.round((subtotal - state.discountNominal) * taxRate);
        const total = Math.max(0, subtotal - state.discountNominal + taxNominal);

        let custName = undefined;
        let custPhone = undefined;
        if (state.selectedCustomerId) {
          const cust = state.customers.find((c) => c.id === state.selectedCustomerId);
          if (cust) {
            custName = cust.name;
            custPhone = cust.phone;
          }
        }

        const openBillOrder: Order = {
          id: generateId("ord-open"),
          invoiceNumber: `BILL-${new Date().toISOString().slice(2, 10).replace(/-/g, "")}-${Math.floor(100 + Math.random() * 900)}`,
          timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
          orderType: state.orderType,
          tableNumber: state.orderType === "dine_in" ? state.tableNumber : "Takeaway Hold",
          customerName: custName,
          customerPhone: custPhone,
          cashierName,
          items: state.cart.map((c) => ({ ...c, subtotal: c.price * c.quantity })),
          subtotal,
          discountNominal: state.discountNominal,
          taxNominal,
          total,
          paymentMethod: "cash",
          amountPaid: 0,
          changeAmount: 0,
          status: "open_bill",
          notes: `Open Bill (${state.orderType === "dine_in" ? state.tableNumber : "Takeaway"})`,
        };

        set({
          orders: [openBillOrder, ...state.orders],
          cart: [],
          discountNominal: 0,
          taxEnabled: state.settings.taxEnabled,
        });

        get().addToast(`Open Bill ${openBillOrder.tableNumber} berhasil disimpan!`, "info");
        return openBillOrder;
      },

      settleOpenBill: (orderId, paymentMethod, amountPaid) => {
        const state = get();
        const existing = state.orders.find((o) => o.id === orderId);
        if (!existing) return null;

        const changeAmount = paymentMethod === "cash" ? Math.max(0, amountPaid - existing.total) : 0;

        // Deduct inventory ingredients when open bill is settled
        const updatedIngredients = [...state.ingredients];
        const updatedProducts = [...state.products];

        existing.items.forEach((item) => {
          const product = updatedProducts.find((p) => p.id === item.productId);
          if (product) {
            product.stock = Math.max(0, product.stock - item.quantity);
            if (product.hasRecipe && product.recipe) {
              product.recipe.forEach((r) => {
                const ingIndex = updatedIngredients.findIndex((i) => i.id === r.ingredientId);
                if (ingIndex > -1) {
                  const needed = r.amount * item.quantity;
                  updatedIngredients[ingIndex] = {
                    ...updatedIngredients[ingIndex],
                    currentStock: Math.max(0, updatedIngredients[ingIndex].currentStock - needed),
                  };
                }
              });
            }
          }
        });

        // Update shift
        let updatedShift = state.currentShift;
        if (updatedShift && updatedShift.status === "open") {
          const isCash = paymentMethod === "cash";
          const newCashSales = isCash ? updatedShift.totalCashSales + existing.total : updatedShift.totalCashSales;
          const newNonCashSales = !isCash ? updatedShift.totalNonCashSales + existing.total : updatedShift.totalNonCashSales;
          const newExpectedCash = updatedShift.startingCash + newCashSales - updatedShift.totalExpenses;

          updatedShift = {
            ...updatedShift,
            totalCashSales: newCashSales,
            totalNonCashSales: newNonCashSales,
            expectedCash: newExpectedCash,
          };
        }

        const settledOrder: Order = {
          ...existing,
          status: "completed",
          paymentMethod,
          amountPaid: paymentMethod === "cash" ? amountPaid : existing.total,
          changeAmount,
          timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
        };

        set({
          orders: state.orders.map((o) => (o.id === orderId ? settledOrder : o)),
          ingredients: updatedIngredients,
          products: updatedProducts,
          currentShift: updatedShift,
          activeReceiptOrder: settledOrder,
          isReceiptModalOpen: true,
        });

        get().addToast(`Pelunasan Open Bill ${settledOrder.invoiceNumber} berhasil!`, "success");
        return settledOrder;
      },

      voidOrder: (orderId, reason, restoreStock) => {
        const state = get();
        const target = state.orders.find((o) => o.id === orderId);
        if (!target) return;

        let updatedIngredients = [...state.ingredients];
        let updatedProducts = [...state.products];

        if (restoreStock && target.status === "completed") {
          target.items.forEach((item) => {
            const product = updatedProducts.find((p) => p.id === item.productId);
            if (product) {
              product.stock += item.quantity;
              if (product.hasRecipe && product.recipe) {
                product.recipe.forEach((r) => {
                  const ingIndex = updatedIngredients.findIndex((i) => i.id === r.ingredientId);
                  if (ingIndex > -1) {
                    const returnAmt = r.amount * item.quantity;
                    updatedIngredients[ingIndex] = {
                      ...updatedIngredients[ingIndex],
                      currentStock: updatedIngredients[ingIndex].currentStock + returnAmt,
                    };
                  }
                });
              }
            }
          });
        }

        // Adjust shift if voided completed order during active shift
        let updatedShift = state.currentShift;
        if (updatedShift && updatedShift.status === "open" && target.status === "completed") {
          const isCash = target.paymentMethod === "cash";
          const newCash = isCash ? Math.max(0, updatedShift.totalCashSales - target.total) : updatedShift.totalCashSales;
          const newNonCash = !isCash ? Math.max(0, updatedShift.totalNonCashSales - target.total) : updatedShift.totalNonCashSales;
          updatedShift = {
            ...updatedShift,
            totalCashSales: newCash,
            totalNonCashSales: newNonCash,
            expectedCash: updatedShift.startingCash + newCash - updatedShift.totalExpenses,
          };
        }

        const voidedOrder: Order = {
          ...target,
          status: "void",
          voidReason: reason,
          voidedAt: new Date().toISOString().replace("T", " ").slice(0, 19),
          restoredStock: restoreStock,
        };

        set({
          orders: state.orders.map((o) => (o.id === orderId ? voidedOrder : o)),
          ingredients: updatedIngredients,
          products: updatedProducts,
          currentShift: updatedShift,
        });

        get().addToast(`Transaksi ${target.invoiceNumber} berhasil Dibatalkan (Void)`, "warning");
      },

      // Shifts
      currentShift: initialShift,
      shiftHistory: [],
      openShift: (startingCash, cashierName, notes = "") => {
        const newShift: Shift = {
          id: generateId("shift"),
          cashierName,
          openedAt: new Date().toISOString().replace("T", " ").slice(0, 19),
          startingCash,
          totalCashSales: 0,
          totalNonCashSales: 0,
          totalExpenses: 0,
          expectedCash: startingCash,
          status: "open",
          notes,
        };
        set({ currentShift: newShift, isShiftModalOpen: false });
        get().addToast(`Shift baru berhasil dibuka oleh ${cashierName}`, "success");
      },
      closeShift: (actualCash, notes = "") => {
        const state = get();
        if (!state.currentShift) return null;

        const expectedCash = state.currentShift.expectedCash;
        const cashDifference = actualCash - expectedCash;
        const closedShift: Shift = {
          ...state.currentShift,
          closedAt: new Date().toISOString().replace("T", " ").slice(0, 19),
          actualCash,
          cashDifference,
          status: "closed",
          notes: notes || state.currentShift.notes,
        };

        set({
          currentShift: null,
          shiftHistory: [closedShift, ...state.shiftHistory],
          isShiftModalOpen: false,
        });
        get().addToast("Shift kasir berhasil ditutup & slip settlement dibuat", "info");
        return closedShift;
      },

      // Expenses
      expenses: initialExpenses,
      addExpense: (expenseData) => {
        const state = get();
        const newExpense: Expense = {
          ...expenseData,
          id: generateId("exp"),
          timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
        };

        let updatedShift = state.currentShift;
        if (expenseData.source === "cash_drawer" && updatedShift && updatedShift.status === "open") {
          const newExpTotal = updatedShift.totalExpenses + expenseData.amount;
          updatedShift = {
            ...updatedShift,
            totalExpenses: newExpTotal,
            expectedCash: updatedShift.startingCash + updatedShift.totalCashSales - newExpTotal,
          };
        }

        set({
          expenses: [newExpense, ...state.expenses],
          currentShift: updatedShift,
          isExpenseModalOpen: false,
        });
        get().addToast(`Pengeluaran Rp ${expenseData.amount.toLocaleString()} berhasil dicatat`, "info");
      },

      // Customers
      customers: initialCustomers,
      addCustomer: (data) => {
        const newCust: Customer = {
          ...data,
          id: generateId("cust"),
          totalVisits: 1,
          totalSpend: 0,
          points: 10,
          lastVisit: new Date().toISOString().replace("T", " ").slice(0, 16),
        };
        set((state) => ({ customers: [newCust, ...state.customers] }));
        get().addToast(`Pelanggan "${newCust.name}" didaftarkan`, "success");
        return newCust;
      },
      updateCustomer: (id, data) => {
        set((state) => ({
          customers: state.customers.map((c) => (c.id === id ? { ...c, ...data } : c)),
        }));
        get().addToast("Data pelanggan diperbarui", "success");
      },
      deleteCustomer: (id) => {
        const target = get().customers.find((c) => c.id === id);
        set((state) => ({
          customers: state.customers.filter((c) => c.id !== id),
          selectedCustomerId: state.selectedCustomerId === id ? undefined : state.selectedCustomerId,
        }));
        get().addToast(`Pelanggan "${target?.name || ''}" berhasil dihapus`, "info");
      },

      // UI States
      isCartDrawerOpen: false,
      setCartDrawerOpen: (open) => set({ isCartDrawerOpen: open }),
      isCheckoutModalOpen: false,
      setCheckoutModalOpen: (open) => set({ isCheckoutModalOpen: open }),
      isReceiptModalOpen: false,
      setReceiptModalOpen: (open) => set({ isReceiptModalOpen: open }),
      isShiftModalOpen: false,
      setShiftModalOpen: (open) => set({ isShiftModalOpen: open }),
      isExpenseModalOpen: false,
      setExpenseModalOpen: (open) => set({ isExpenseModalOpen: open }),
      isQuickAddModalOpen: false,
      setQuickAddModalOpen: (open) => set({ isQuickAddModalOpen: open }),
      isOpenBillsDrawerOpen: false,
      setOpenBillsDrawerOpen: (open) => set({ isOpenBillsDrawerOpen: open }),

      // Toasts
      toasts: [],
      addToast: (message, type = "info") => {
        const id = generateId("toast");
        set((state) => ({
          toasts: [...state.toasts.slice(-4), { id, message, type }],
        }));
        setTimeout(() => {
          set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
          }));
        }, 3500);
      },
      removeToast: (id) => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      },
    }),
    {
      name: "kage46-pos-storage-v1",
      version: 2,
      migrate: (persistedState: any, version: number) => {
        if (!version || version < 2) {
          return {
            ...persistedState,
            currentUser: null,
            role: "cashier",
          };
        }
        return persistedState;
      },
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        users: state.users,
        currentUser: state.currentUser,
        role: state.role,
        isDarkMode: state.isDarkMode,
        settings: state.settings,
        taxEnabled: state.taxEnabled,
        products: state.products,
        ingredients: state.ingredients,
        customers: state.customers,
        orders: state.orders,
        expenses: state.expenses,
        currentShift: state.currentShift,
        shiftHistory: state.shiftHistory,
        stockOpnames: state.stockOpnames,
      }),
    }
  )
);
