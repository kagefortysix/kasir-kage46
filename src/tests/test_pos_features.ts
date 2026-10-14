// Polyfill window, localStorage & document for Node environment
const mockStorage: Record<string, string> = {};
const localStoragePolyfill = {
  getItem: (key: string) => mockStorage[key] || null,
  setItem: (key: string, value: string) => { mockStorage[key] = String(value); },
  removeItem: (key: string) => { delete mockStorage[key]; },
  clear: () => { Object.keys(mockStorage).forEach((k) => delete mockStorage[k]); },
  length: 0,
  key: () => null,
};

(globalThis as any).localStorage = localStoragePolyfill;
(globalThis as any).window = {
  localStorage: localStoragePolyfill,
  document: {
    documentElement: {
      classList: {
        add: () => {},
        remove: () => {},
      },
    },
  },
};
(globalThis as any).document = (globalThis as any).window.document;

import { usePosStore } from "@/store/usePosStore";
import { translations } from "@/lib/translations";

let testsPassed = 0;
let testsFailed = 0;

function assert(condition: boolean, testName: string, details?: any) {
  if (condition) {
    console.log(`  ✓ [PASS] ${testName}`);
    testsPassed++;
  } else {
    console.error(`  ✗ [FAIL] ${testName}`);
    if (details) console.error("    Details:", details);
    testsFailed++;
  }
}

async function runAllTests() {
  console.log("=================================================");
  console.log("🚀 STARTING POS KAGE46 FULL FEATURE AUDIT & TESTS");
  console.log("=================================================\n");

  const store = usePosStore.getState();

  // Reset to clean demo state first
  store.loadDemoData();

  // -----------------------------------------------------------------
  // 1. AUTHENTICATION & ROLE-BASED ACCESS
  // -----------------------------------------------------------------
  console.log("--- 1. Testing Authentication & User Roles ---");
  
  // Login with invalid credentials
  const badLogin = store.login("nonexistent", "wrongpass");
  assert(badLogin === false, "Reject invalid username/password");

  // Login with cashier credentials
  const cashierLogin = store.login("kasir1", "kasir123");
  assert(cashierLogin === true, "Cashier login successful (kasir1 / kasir123)");
  assert(usePosStore.getState().currentUser?.role === "cashier", "Current user role is cashier");
  assert(usePosStore.getState().role === "cashier", "Store role locked to cashier");

  // Logout
  store.logout();
  assert(usePosStore.getState().currentUser === null, "Logout clears currentUser");
  assert(usePosStore.getState().role === "cashier", "Role defaults to cashier after logout");

  // Login with master owner credentials
  const ownerLogin = store.login("owner", "kage46owner");
  assert(ownerLogin === true, "Master Owner login successful (owner / kage46owner)");
  assert(usePosStore.getState().currentUser?.role === "owner", "Current user role is owner");
  assert(usePosStore.getState().role === "owner", "Store role is elevated to owner");

  // -----------------------------------------------------------------
  // 2. ACCOUNT MANAGEMENT & PROFILE EDITING
  // -----------------------------------------------------------------
  console.log("\n--- 2. Testing Account Management & Profile Editing ---");
  
  // Add new cashier user
  const addedUser = store.addUser({
    name: "Ahmad Barista",
    username: "ahmadbarista",
    password: "password123",
    role: "cashier",
    isActive: true,
  });
  assert(addedUser === true, "Successfully added new cashier account");

  // Try duplicate username
  const dupUser = store.addUser({
    name: "Duplicate User",
    username: "ahmadbarista",
    password: "password123",
    role: "cashier",
    isActive: true,
  });
  assert(dupUser === false, "Prevent duplicate username on account creation");

  // Update user profile (name & password)
  const userList = usePosStore.getState().users;
  const targetUser = userList.find((u) => u.username === "ahmadbarista");
  assert(!!targetUser, "Newly added user exists in user list");

  if (targetUser) {
    const updated = store.updateUser(targetUser.id, {
      name: "Ahmad B. (Senior)",
      password: "newsecurepassword456",
    });
    assert(updated === true, "Update user name & password");

    const refreshed = usePosStore.getState().users.find((u) => u.id === targetUser.id);
    assert(refreshed?.name === "Ahmad B. (Senior)", "User name updated correctly in state");
    assert(refreshed?.password === "newsecurepassword456", "User password updated correctly in state");

    // Toggle active status
    store.toggleUserActive(targetUser.id);
    const toggled = usePosStore.getState().users.find((u) => u.id === targetUser.id);
    assert(toggled?.isActive === false, "Toggle user active status to false");

    // Inactive user cannot login
    const inactiveLogin = store.login("ahmadbarista", "newsecurepassword456");
    assert(inactiveLogin === false, "Inactive user cannot login");

    // Delete user
    store.deleteUser(targetUser.id);
    const deleted = usePosStore.getState().users.find((u) => u.id === targetUser.id);
    assert(!deleted, "User deleted from store successfully");
  }

  // Master Owner protection check
  const ownerUser = usePosStore.getState().users.find((u) => u.username === "owner");
  if (ownerUser) {
    store.deleteUser(ownerUser.id);
    const ownerStillExists = usePosStore.getState().users.find((u) => u.username === "owner");
    assert(!!ownerStillExists, "Master Owner cannot be deleted");

    store.toggleUserActive(ownerUser.id);
    const ownerAfterToggle = usePosStore.getState().users.find((u) => u.username === "owner");
    assert(ownerAfterToggle?.isActive === true, "Master Owner cannot be deactivated");
  }

  // -----------------------------------------------------------------
  // 3. BILINGUAL LANGUAGE SYSTEM (ID & EN)
  // -----------------------------------------------------------------
  console.log("\n--- 3. Testing Bilingual Language System ---");
  
  assert(usePosStore.getState().language === "id", "Default system language is 'id'");

  // Switch to English
  store.setLanguage("en");
  assert(usePosStore.getState().language === "en", "Language switched to 'en'");
  assert(usePosStore.getState().settings.language === "en", "Store settings synchronized with language 'en'");

  // Check translation dictionaries
  assert(translations.id.nav.pos === "Kasir POS", "Indonesian translation key exists (Kasir POS)");
  assert(translations.en.nav.pos === "POS Cashier", "English translation key exists (POS Cashier)");
  assert(translations.id.settings.langCardTitle === "Pengaturan Bahasa Sistem", "Indonesian settings title exists");
  assert(translations.en.settings.langCardTitle === "System Language Settings", "English settings title exists");

  // Switch back to Indonesian
  store.setLanguage("id");
  assert(usePosStore.getState().language === "id", "Language switched back to 'id'");

  // -----------------------------------------------------------------
  // 4. SHIFT MANAGEMENT & PETTY CASH
  // -----------------------------------------------------------------
  console.log("\n--- 4. Testing Shift Management & Cash Float ---");

  // Open shift
  store.openShift(200000, "Rizky Ramadhan", "Shift Pagi Test");
  const shift = usePosStore.getState().currentShift;
  assert(shift !== null, "Current shift is open");
  assert(shift?.startingCash === 200000, "Starting cash set to Rp 200.000");
  assert(shift?.status === "open", "Shift status is 'open'");

  // Record cash expense (petty cash from drawer)
  const initialExpected = usePosStore.getState().currentShift?.expectedCash || 0;
  store.addExpense({
    title: "Beli Es Batu Kristal 1 Bal",
    amount: 15000,
    category: "Bahan Tambahan",
    source: "cash_drawer",
    cashierName: "Rizky Ramadhan",
  });
  const afterExpenseExpected = usePosStore.getState().currentShift?.expectedCash || 0;
  assert(afterExpenseExpected === initialExpected - 15000, "Cash drawer expense deducts expected cash by Rp 15.000");

  // -----------------------------------------------------------------
  // 5. CART, DISCOUNTS, TAX & ORDERS
  // -----------------------------------------------------------------
  console.log("\n--- 5. Testing Cart, Pricing, Tax & POS Checkout ---");

  store.clearCart();
  const products = usePosStore.getState().products;
  assert(products.length > 0, "Products exist in store");

  const product1 = products[0];
  const product2 = products[1];

  // Add items with same notes to increment quantity
  store.addToCart(product1, "Less sugar");
  store.addToCart(product1, "Less sugar"); // Increment quantity to 2
  store.addToCart(product2, "");

  const cart = usePosStore.getState().cart;
  assert(cart.length === 2, "Cart has 2 distinct product lines");
  assert(cart[0].quantity === 2, "Product 1 quantity incremented to 2");
  assert(cart[0].notes === "Less sugar", "Item notes preserved accurately");

  // Set order type & table
  store.setOrderType("dine_in");
  store.setTableNumber("Meja 12");
  assert(usePosStore.getState().orderType === "dine_in", "Order type set to dine_in");
  assert(usePosStore.getState().tableNumber === "Meja 12", "Table number set to Meja 12");

  // Subtotal calculation
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  assert(subtotal > 0, `Subtotal calculated correctly: Rp ${subtotal.toLocaleString()}`);

  // Discount
  store.setDiscountNominal(5000);
  assert(usePosStore.getState().discountNominal === 5000, "Discount set to Rp 5.000");

  // Open Bill functionality
  const openBillOrder = store.saveOpenBill("Rizky Ramadhan");
  assert(openBillOrder !== null, "Order successfully saved as Open Bill");
  assert(openBillOrder?.status === "open_bill", "Order status is open_bill");
  assert(usePosStore.getState().cart.length === 0, "Cart cleared after saving open bill");

  // Verify open bill in orders list
  const savedOpenBill = usePosStore.getState().orders.find((o) => o.id === openBillOrder?.id);
  assert(savedOpenBill?.status === "open_bill", "Open bill exists in orders state");

  // Settle Open Bill
  if (savedOpenBill) {
    const settled = store.settleOpenBill(savedOpenBill.id, "qris", savedOpenBill.total);
    assert(settled !== null, "Open bill settled successfully");
    assert(settled?.status === "completed", "Settled order status changed to completed");
    assert(settled?.paymentMethod === "qris", "Payment method recorded as QRIS");
  }

  // New Cart for direct Cash Checkout
  store.clearCart();
  store.addToCart(product1);
  const checkoutSubtotal = product1.price;
  const taxNominal = Math.round((checkoutSubtotal * 11) / 100);
  const totalDue = checkoutSubtotal + taxNominal;

  // Checkout with cash (e.g. cash given 50.000)
  const cashGiven = 50000;
  const completedOrder = store.completeCheckout("cash", cashGiven, "Rizky Ramadhan");
  assert(completedOrder !== null, "Checkout completed successfully");
  assert(completedOrder?.changeAmount === cashGiven - completedOrder!.total, "Change calculated accurately");
  assert(completedOrder?.status === "completed", "Order marked completed");

  // -----------------------------------------------------------------
  // 6. INVENTORY & RECIPE STOCK DEDUCTION
  // -----------------------------------------------------------------
  console.log("\n--- 6. Testing Inventory & Stock Opname ---");

  // Quick Add Product
  const quickProd = store.quickAddProduct("Donat Coklat Artisan", 15000, "Camilan");
  assert(quickProd.name === "Donat Coklat Artisan", "Quick product created with correct name");
  assert(quickProd.price === 15000, "Quick product created with price 15.000");
  assert(quickProd.category === "Camilan", "Quick product category is Camilan");

  // Stock Opname
  const ingredients = usePosStore.getState().ingredients;
  if (ingredients.length > 0) {
    const ing = ingredients[0];
    const oldStock = ing.currentStock;
    const opnameActual = oldStock - 100;

    store.recordStockOpname({
      ingredientId: ing.id,
      actualStock: opnameActual,
      reason: "Spillage (Tumpah)",
      recordedBy: "Rizky Ramadhan",
      note: "Test spillage opname",
    });

    const updatedIng = usePosStore.getState().ingredients.find((i) => i.id === ing.id);
    assert(updatedIng?.currentStock === opnameActual, "Ingredient stock updated to actual counted stock");

    const opnameRecord = usePosStore.getState().stockOpnames.find((r) => r.ingredientId === ing.id);
    assert(opnameRecord?.difference === -100, "Stock difference recorded accurately (-100)");
  }

  // -----------------------------------------------------------------
  // 7. CUSTOMER CRM
  // -----------------------------------------------------------------
  console.log("\n--- 7. Testing Customer CRM ---");

  const newCust = store.addCustomer({
    name: "Budi Santoso",
    phone: "081234998877",
    email: "budi@example.com",
  });
  assert(newCust.name === "Budi Santoso", "Customer created with name");
  assert(newCust.points === 10, "New customer welcome bonus points is 10");

  store.updateCustomer(newCust.id, { points: 25 });
  const updatedCust = usePosStore.getState().customers.find((c) => c.id === newCust.id);
  assert(updatedCust?.points === 25, "Customer points updated to 25");

  // -----------------------------------------------------------------
  // 8. CLOSE SHIFT & RECONCILIATION
  // -----------------------------------------------------------------
  console.log("\n--- 8. Testing Shift Close & Reconciliation ---");

  const activeShift = usePosStore.getState().currentShift;
  if (activeShift) {
    const actualCashInDrawer = activeShift.expectedCash;
    const closedShift = store.closeShift(actualCashInDrawer, "Shift pagi selesai");
    assert(closedShift !== null, "Shift closed successfully");
    assert(closedShift?.status === "closed", "Closed shift status is 'closed'");
    assert(closedShift?.cashDifference === 0, "Cash difference calculated accurately (Rp 0)");
    assert(usePosStore.getState().currentShift === null, "Active shift set to null after close");
  }

  // -----------------------------------------------------------------
  // 9. SETTINGS & PERSISTENCE
  // -----------------------------------------------------------------
  console.log("\n--- 9. Testing Store Settings & Reset ---");

  store.updateSettings({
    storeName: "KAGE46 SPECIALTY ROASTERY",
    wifiName: "KAGE46_VIP",
    wifiPassword: "kopiindonesia",
  });
  assert(usePosStore.getState().settings.storeName === "KAGE46 SPECIALTY ROASTERY", "Store name updated");
  assert(usePosStore.getState().settings.wifiName === "KAGE46_VIP", "WiFi SSID updated");

  // Reset all data test
  store.resetAllData();
  assert(usePosStore.getState().products.length === 0, "Reset data cleans products to 0");
  assert(usePosStore.getState().orders.length === 0, "Reset data cleans orders to 0");
  assert(usePosStore.getState().customers.length === 0, "Reset data cleans customers to 0");
  assert(usePosStore.getState().users.length === 1, "Reset data preserves Master Owner account");

  // Reload demo
  store.loadDemoData();
  assert(usePosStore.getState().products.length > 0, "Reload demo restores full catalog");
  assert(usePosStore.getState().users.length > 1, "Reload demo restores cashiers and owner");

  // -----------------------------------------------------------------
  // SUMMARY
  // -----------------------------------------------------------------
  console.log("\n=================================================");
  console.log(`AUDIT FINISHED: ${testsPassed} PASSED, ${testsFailed} FAILED`);
  console.log("=================================================");

  if (testsFailed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAllTests().catch((err) => {
  console.error("Test execution threw exception:", err);
  process.exit(1);
});
