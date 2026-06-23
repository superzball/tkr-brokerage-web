// src/lib/mock/local-sales.ts
// Mock client-side persistence for sales the agent closes on behalf of a client
// (from the Create Quote flow). Real backend would POST an order; here we stash
// in localStorage so the sale shows up on /app/sales. Client-only.

import type { AgentSale } from "@/types/portal";

export const LOCAL_SALES_KEY = "tkr_local_sales";

export function readLocalSales(): AgentSale[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_SALES_KEY);
    return raw ? (JSON.parse(raw) as AgentSale[]) : [];
  } catch {
    return [];
  }
}

export function addLocalSale(sale: AgentSale): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    LOCAL_SALES_KEY,
    JSON.stringify([sale, ...readLocalSales()]),
  );
}
