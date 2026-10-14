"use client";

import { SharedPOSData, SyncStatus, UserAccount } from "@/types/pos";
import { initialUsers } from "@/data/mockData";

let storeGetter: (() => any) | null = null;
let serverUpdateFlagSetter: ((val: boolean) => void) | null = null;

export function registerSyncStore(getter: () => any, flagSetter: (val: boolean) => void) {
  storeGetter = getter;
  serverUpdateFlagSetter = flagSetter;
}

class SyncService {
  private lastModified: number = 0;
  private syncStatus: SyncStatus = "idle" as any;
  private isSyncing: boolean = false;
  private pollInterval: any = null;
  private initialized: boolean = false;
  private listeners: Set<(status: SyncStatus) => void> = new Set();

  public subscribe(listener: (status: SyncStatus) => void) {
    this.listeners.add(listener);
    listener(this.syncStatus);
    return () => this.listeners.delete(listener);
  }

  public setStatus(status: SyncStatus) {
    this.syncStatus = status;
    const store = storeGetter ? storeGetter() : null;
    if (store && store.setSyncStatus) {
      store.setSyncStatus(status);
    }
    this.listeners.forEach((l) => l(status));
  }

  public getStatus(): SyncStatus {
    return this.syncStatus;
  }

  public getLastModified(): number {
    return this.lastModified;
  }

  /**
   * Initializes the synchronization engine in the browser.
   */
  public async init() {
    if (typeof window === "undefined" || this.initialized) return;
    this.initialized = true;

    // 1. Initial fetch and reconciliation
    await this.performInitialSync();

    // 2. Setup periodic background polling every 4 seconds
    this.startPolling(4000);

    // 3. Setup event listeners for tab focus and online events
    window.addEventListener("focus", () => {
      this.pullUpdates(false);
    });

    window.addEventListener("online", () => {
      this.setStatus("syncing");
      this.pullUpdates(false);
    });

    window.addEventListener("offline", () => {
      this.setStatus("offline");
    });

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        this.pullUpdates(false);
      }
    });
  }

  /**
   * First sync when app mounts:
   * Reconciles local data (e.g. from existing localhost session) with server DB.
   */
  private async performInitialSync() {
    this.setStatus("syncing");
    try {
      const res = await fetch("/api/sync", {
        method: "GET",
        headers: { "Cache-Control": "no-cache" },
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json();
      this.lastModified = json.lastModified || Date.now();

      const store = storeGetter ? storeGetter() : null;

      // Check if server is uninitialized, but this client already has customized data
      // (e.g. localhost user has changed passwords or added custom products)
      const hasCustomLocalData = this.detectLocalCustomization(store);

      if (!json.initialized && hasCustomLocalData) {
        console.log("[SyncService] Initializing server database from local customized data...");
        await this.pushCurrentStoreToServer(true);
      } else if (json.data && store) {
        if (serverUpdateFlagSetter) serverUpdateFlagSetter(true);
        try {
          store.applyServerData(json.data);
        } finally {
          if (serverUpdateFlagSetter) serverUpdateFlagSetter(false);
        }
      }

      this.setStatus("synced");
    } catch (err) {
      console.warn("[SyncService] Failed to perform initial sync, continuing offline-first:", err);
      this.setStatus("offline");
    }
  }

  /**
   * Detects if local store has modified data compared to default mock template
   */
  private detectLocalCustomization(store: any): boolean {
    if (!store) return false;
    // Check if owner password was changed from default
    const owner = store.users?.find((u: any) => u.username === "owner");
    const defaultOwner = initialUsers.find((u) => u.username === "owner");
    if (owner && defaultOwner && owner.password !== defaultOwner.password) {
      return true;
    }
    // Check if extra users were created
    if (store.users && store.users.length > initialUsers.length) {
      return true;
    }
    // Check if store name was customized
    if (store.settings?.storeName && store.settings.storeName !== "KASIR POS KAGE46") {
      return true;
    }
    return false;
  }

  /**
   * Pulls latest updates from server if server has newer lastModified
   */
  public async pullUpdates(force: boolean = false): Promise<boolean> {
    if (this.isSyncing) return false;

    try {
      const url = `/api/sync?since=${this.lastModified}${force ? "&force=true" : ""}`;
      const res = await fetch(url, {
        method: "GET",
        headers: { "Cache-Control": "no-cache" },
      });

      if (!res.ok) {
        this.setStatus("offline");
        return false;
      }

      const json = await res.json();
      this.lastModified = json.lastModified || this.lastModified;

      if (json.hasUpdates && json.data) {
        this.setStatus("syncing");
        const store = storeGetter ? storeGetter() : null;
        if (store) {
          if (serverUpdateFlagSetter) serverUpdateFlagSetter(true);
          try {
            store.applyServerData(json.data);
          } finally {
            if (serverUpdateFlagSetter) serverUpdateFlagSetter(false);
          }
        }
        this.setStatus("synced");
        return true;
      }

      this.setStatus("synced");
      return false;
    } catch (err) {
      this.setStatus("offline");
      return false;
    }
  }

  /**
   * Pushes current Zustand store shared data to server
   */
  public async pushCurrentStoreToServer(markInitialized: boolean = true): Promise<boolean> {
    if (typeof window === "undefined") return false;

    const store = storeGetter ? storeGetter() : null;
    if (!store) return false;

    const payload: SharedPOSData = {
      users: store.users,
      settings: store.settings,
      products: store.products,
      ingredients: store.ingredients,
      customers: store.customers,
      orders: store.orders,
      expenses: store.expenses,
      currentShift: store.currentShift,
      shiftHistory: store.shiftHistory,
      stockOpnames: store.stockOpnames,
    };

    return this.pushToServer(payload, markInitialized);
  }

  /**
   * Pushes specific data to server
   */
  public async pushToServer(
    data: Partial<SharedPOSData>,
    markInitialized: boolean = true
  ): Promise<boolean> {
    this.setStatus("syncing");
    this.isSyncing = true;

    try {
      const res = await fetch("/api/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data,
          markInitialized,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json();
      this.lastModified = json.lastModified || Date.now();
      this.setStatus("synced");
      return true;
    } catch (err) {
      console.warn("[SyncService] Failed to push data to server:", err);
      this.setStatus("offline");
      return false;
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Resets server database to clean empty state (0 products, orders, etc.)
   */
  public async resetAllDataOnServer(keepOwnerUser?: UserAccount | null): Promise<boolean> {
    if (typeof window === "undefined") return false;
    this.setStatus("syncing");
    this.isSyncing = true;

    try {
      const res = await fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reset",
          keepOwnerUser,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      this.lastModified = json.lastModified || Date.now();
      this.setStatus("synced");
      return true;
    } catch (err) {
      console.warn("[SyncService] Failed to reset data on server:", err);
      this.setStatus("offline");
      return false;
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Reloads demo mock data into server database
   */
  public async loadDemoDataOnServer(): Promise<boolean> {
    if (typeof window === "undefined") return false;
    this.setStatus("syncing");
    this.isSyncing = true;

    try {
      const res = await fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "load_demo",
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      this.lastModified = json.lastModified || Date.now();
      this.setStatus("synced");
      return true;
    } catch (err) {
      console.warn("[SyncService] Failed to load demo data on server:", err);
      this.setStatus("offline");
      return false;
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Starts background polling
   */
  public startPolling(intervalMs: number = 4000) {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
    this.pollInterval = setInterval(() => {
      this.pullUpdates();
    }, intervalMs);
  }

  /**
   * Stops background polling
   */
  public stopPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }
}

export const syncService = new SyncService();
