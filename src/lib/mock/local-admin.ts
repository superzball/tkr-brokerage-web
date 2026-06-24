// src/lib/mock/local-admin.ts
// Mock client-side persistence for back-office actions (Phase 14). The on-behalf
// sale flow writes an Order + an AuditEntry here; the Orders and Audit Log
// screens merge these on top of the seed data. A real backend would POST to an
// orders table and an audit service — swap-ready. Client-only.

import type { AuditEntry, Order } from "@/types/portal";

export const LOCAL_ORDERS_KEY = "tkr_admin_orders";
export const LOCAL_AUDIT_KEY = "tkr_admin_audit";

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

export const readLocalOrders = () => read<Order>(LOCAL_ORDERS_KEY);
export const readLocalAudit = () => read<AuditEntry>(LOCAL_AUDIT_KEY);

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
