import fs from "fs";
import path from "path";
import { ServerPOSDatabase, SharedPOSData, UserAccount } from "@/types/pos";
import { 
  initialUsers, 
  initialSettings, 
  initialProducts, 
  initialIngredients, 
  initialCustomers, 
  initialOrders, 
  initialExpenses, 
  initialShift, 
  initialOpnameRecords 
} from "@/data/mockData";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "pos_database.json");
const DB_BACKUP_FILE = path.join(DATA_DIR, "pos_database.bak.json");

export function getDefaultDatabase(): ServerPOSDatabase {
  return {
    version: 1,
    lastModified: Date.now(),
    initialized: false, // will turn true once customized or saved by user
    users: initialUsers,
    settings: initialSettings,
    products: initialProducts,
    ingredients: initialIngredients,
    customers: initialCustomers,
    orders: initialOrders,
    expenses: initialExpenses,
    currentShift: initialShift,
    shiftHistory: [],
    stockOpnames: initialOpnameRecords,
  };
}

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

/**
 * Reads server database from disk.
 * If file does not exist, creates it with default data.
 */
export function getServerDatabase(): ServerPOSDatabase {
  ensureDataDir();

  if (!fs.existsSync(DB_FILE)) {
    const defaultDb = getDefaultDatabase();
    writeDatabaseFile(defaultDb);
    return defaultDb;
  }

  try {
    const content = fs.readFileSync(DB_FILE, "utf-8");
    if (!content || !content.trim()) {
      throw new Error("Empty DB file");
    }
    const parsed = JSON.parse(content) as ServerPOSDatabase;
    return parsed;
  } catch (err) {
    console.error("[serverDb] Failed to read primary DB file, trying backup:", err);
    if (fs.existsSync(DB_BACKUP_FILE)) {
      try {
        const backupContent = fs.readFileSync(DB_BACKUP_FILE, "utf-8");
        const parsed = JSON.parse(backupContent) as ServerPOSDatabase;
        writeDatabaseFile(parsed);
        return parsed;
      } catch (backupErr) {
        console.error("[serverDb] Failed to read backup DB file:", backupErr);
      }
    }
    // Fallback to default
    const fallback = getDefaultDatabase();
    writeDatabaseFile(fallback);
    return fallback;
  }
}

/**
 * Atomically writes database to disk
 */
function writeDatabaseFile(db: ServerPOSDatabase): void {
  ensureDataDir();
  const tmpFile = `${DB_FILE}.tmp.${Date.now()}`;
  const serialized = JSON.stringify(db, null, 2);

  fs.writeFileSync(tmpFile, serialized, "utf-8");
  fs.renameSync(tmpFile, DB_FILE);

  // Keep a secondary backup copy
  try {
    fs.writeFileSync(DB_BACKUP_FILE, serialized, "utf-8");
  } catch (bakErr) {
    console.warn("[serverDb] Failed to write backup copy:", bakErr);
  }
}

/**
 * Saves or merges data into server database.
 */
export function saveServerDatabase(
  incoming: Partial<SharedPOSData>,
  markInitialized: boolean = true
): ServerPOSDatabase {
  const current = getServerDatabase();

  const updated: ServerPOSDatabase = {
    ...current,
    ...incoming,
    users: incoming.users !== undefined ? incoming.users : current.users,
    settings: incoming.settings !== undefined ? incoming.settings : current.settings,
    products: incoming.products !== undefined ? incoming.products : current.products,
    ingredients: incoming.ingredients !== undefined ? incoming.ingredients : current.ingredients,
    customers: incoming.customers !== undefined ? incoming.customers : current.customers,
    orders: incoming.orders !== undefined ? incoming.orders : current.orders,
    expenses: incoming.expenses !== undefined ? incoming.expenses : current.expenses,
    currentShift: incoming.currentShift !== undefined ? incoming.currentShift : current.currentShift,
    shiftHistory: incoming.shiftHistory !== undefined ? incoming.shiftHistory : current.shiftHistory,
    stockOpnames: incoming.stockOpnames !== undefined ? incoming.stockOpnames : current.stockOpnames,
    version: (current.version || 1) + 1,
    lastModified: Date.now(),
    initialized: markInitialized ? true : current.initialized,
  };

  writeDatabaseFile(updated);
  return updated;
}

/**
 * Completely resets server database to empty state (0 products, 0 orders, etc.)
 * Preserves the active owner account so owner does not get locked out.
 */
export function resetServerDatabase(keepOwnerUser?: UserAccount | null): ServerPOSDatabase {
  const current = getServerDatabase();
  const ownerUser = keepOwnerUser || current.users.find((u) => u.role === "owner") || initialUsers[0];

  const emptyDb: ServerPOSDatabase = {
    version: (current.version || 1) + 1,
    lastModified: Date.now(),
    initialized: true,
    users: [ownerUser],
    settings: initialSettings,
    products: [],
    ingredients: [],
    customers: [],
    orders: [],
    expenses: [],
    currentShift: null,
    shiftHistory: [],
    stockOpnames: [],
  };

  writeDatabaseFile(emptyDb);
  return emptyDb;
}

/**
 * Resets server database back to full mock demo data
 */
export function loadDemoServerDatabase(): ServerPOSDatabase {
  const current = getServerDatabase();

  const demoDb: ServerPOSDatabase = {
    version: (current.version || 1) + 1,
    lastModified: Date.now(),
    initialized: true,
    users: initialUsers,
    settings: initialSettings,
    products: initialProducts,
    ingredients: initialIngredients,
    customers: initialCustomers,
    orders: initialOrders,
    expenses: initialExpenses,
    currentShift: initialShift,
    shiftHistory: [],
    stockOpnames: initialOpnameRecords,
  };

  writeDatabaseFile(demoDb);
  return demoDb;
}

/**
 * Restores entire database from an external backup JSON payload.
 */
export function restoreServerDatabase(backup: any): ServerPOSDatabase {
  if (!backup || typeof backup !== "object") {
    throw new Error("Invalid backup data format");
  }

  const restored: ServerPOSDatabase = {
    version: (backup.version || 1) + 1,
    lastModified: Date.now(),
    initialized: true,
    users: Array.isArray(backup.users) ? backup.users : initialUsers,
    settings: backup.settings || initialSettings,
    products: Array.isArray(backup.products) ? backup.products : [],
    ingredients: Array.isArray(backup.ingredients) ? backup.ingredients : [],
    customers: Array.isArray(backup.customers) ? backup.customers : [],
    orders: Array.isArray(backup.orders) ? backup.orders : [],
    expenses: Array.isArray(backup.expenses) ? backup.expenses : [],
    currentShift: backup.currentShift || null,
    shiftHistory: Array.isArray(backup.shiftHistory) ? backup.shiftHistory : [],
    stockOpnames: Array.isArray(backup.stockOpnames) ? backup.stockOpnames : [],
  };

  writeDatabaseFile(restored);
  return restored;
}

