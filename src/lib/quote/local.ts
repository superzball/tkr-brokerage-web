// src/lib/quote/local.ts
// Client-only companion to the pending-quote cookie. The cookie carries the
// lightweight summary (read by the server for the banner + checkout gate); the
// full worker rows are too big/private for a cookie, so they ride in
// localStorage and are rehydrated on the checkout screen after the sign-in hop.
// A real backend would persist a draft order instead. Client-only.

import type { SingleWorker } from "@/types";

export const PENDING_DETAIL_KEY = "tkr_pending_quote_detail";

export type PendingDetail = { workers: SingleWorker[] };

export function savePendingDetail(detail: PendingDetail): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PENDING_DETAIL_KEY, JSON.stringify(detail));
  } catch {
    /* quota / serialization — non-fatal, the summary still survives */
  }
}

export function readPendingDetail(): PendingDetail | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PENDING_DETAIL_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as PendingDetail;
    return Array.isArray(v?.workers) ? v : null;
  } catch {
    return null;
  }
}

export function clearPendingDetail(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PENDING_DETAIL_KEY);
}
