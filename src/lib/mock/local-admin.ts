// src/lib/mock/local-admin.ts
// Mock client-side persistence for back-office actions (Phase 14). The on-behalf
// sale flow writes an Order + an AuditEntry here; staff-created/edited customers
// are stored here too. The Orders, Audit Log and Customers screens merge these on
// top of the seed data. A real backend would POST to the matching tables — swap-
// ready. Client-only.

import type { AuditEntry, Order, User } from "@/types/portal";

export const LOCAL_ORDERS_KEY = "tkr_admin_orders";
export const LOCAL_AUDIT_KEY = "tkr_admin_audit";
export const LOCAL_CUSTOMERS_KEY = "tkr_admin_customers"; // staff-created customers
export const LOCAL_CUSTOMER_EDITS_KEY = "tkr_admin_customer_edits"; // edits to any customer

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function readMap<V>(key: string): Record<string, V> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Record<string, V>) : {};
  } catch {
    return {};
  }
}

export const readLocalOrders = () => read<Order>(LOCAL_ORDERS_KEY);
export const readLocalAudit = () => read<AuditEntry>(LOCAL_AUDIT_KEY);
export const readLocalCustomers = () => read<User>(LOCAL_CUSTOMERS_KEY);
export const readCustomerEdits = () => readMap<Partial<User>>(LOCAL_CUSTOMER_EDITS_KEY);

/** Add a staff-created customer (prepended so it shows first). */
export function addLocalCustomer(customer: User): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    LOCAL_CUSTOMERS_KEY,
    JSON.stringify([customer, ...readLocalCustomers()]),
  );
}

/** Merge an edit patch for any customer (seed or staff-created), keyed by id. */
export function saveCustomerEdit(id: string, patch: Partial<User>): void {
  if (typeof window === "undefined") return;
  const edits = readCustomerEdits();
  edits[id] = { ...edits[id], ...patch };
  window.localStorage.setItem(LOCAL_CUSTOMER_EDITS_KEY, JSON.stringify(edits));
}

export function addLocalOrder(order: Order): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    LOCAL_ORDERS_KEY,
    JSON.stringify([order, ...readLocalOrders()]),
  );
}

export function addAuditEntry(entry: AuditEntry): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    LOCAL_AUDIT_KEY,
    JSON.stringify([entry, ...readLocalAudit()]),
  );
}
