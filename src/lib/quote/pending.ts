// src/lib/quote/pending.ts
// A tiny "quote in progress" stash shared across the public→auth→portal hop.
// Pure helpers only (no next/headers), so this is importable from client and
// server alike. The client writes the cookie at the checkout gate; the server
// (app layout + /app/checkout) reads it; a server action clears it on completion.

export const PENDING_QUOTE_COOKIE = "tkr_pending_quote";

export type PendingQuote = {
  product: string; // e.g. "worker"
  planLabel: string; // localized plan name at gate time
  count: number;
  total: number; // THB
};

export function encodePendingQuote(q: PendingQuote): string {
  return encodeURIComponent(JSON.stringify(q));
}

export function decodePendingQuote(raw: string | undefined): PendingQuote | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(decodeURIComponent(raw)) as PendingQuote;
    if (typeof v?.product === "string" && typeof v?.total === "number") return v;
    return null;
  } catch {
    return null;
  }
}
