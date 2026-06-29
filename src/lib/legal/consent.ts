// src/lib/legal/consent.ts
// Client-side append-only consent store (Phase 21). Every grant/withdraw writes
// a NEW ConsentRecord to localStorage — never mutate an old one, so the history
// stays provable. The admin consent audit and the consent center merge these on
// top of the seed records. A real backend would POST to a consent table.

import type { ConsentRecord, ConsentType, ConsentSource } from "@/types/portal";

export const LOCAL_CONSENT_KEY = "tkr_consent_records";

export function readLocalConsents(): ConsentRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_CONSENT_KEY);
    return raw ? (JSON.parse(raw) as ConsentRecord[]) : [];
  } catch {
    return [];
  }
}

export type ConsentInput = {
  subjectId: string; // userId or phone/email
  type: ConsentType;
  granted: boolean;
  policyVersion: string;
  source: ConsentSource;
};

/** Append one consent record (newest first). Returns the stored record. */
export function recordConsent(input: ConsentInput): ConsentRecord {
  const entry: ConsentRecord = {
    id: `lc_${Date.now()}_${Math.round(Math.random() * 1e4)}`,
    timestamp: new Date().toISOString(),
    ...input,
  };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(
      LOCAL_CONSENT_KEY,
      JSON.stringify([entry, ...readLocalConsents()]),
    );
  }
  return entry;
}

/** Append several consents captured together (signup / guest checkout). */
export function recordConsents(inputs: ConsentInput[]): void {
  inputs.forEach(recordConsent);
}

/** Stable anonymous id so a not-logged-in visitor's cookie-banner choice is
 *  still attributable in the consent audit. Promoted to the real userId once
 *  they sign in (a real backend would reconcile the two). */
export function visitorId(): string {
  if (typeof window === "undefined") return "anonymous";
  let id = window.localStorage.getItem("tkr_visitor_id");
  if (!id) {
    id = `anon_${Date.now()}_${Math.round(Math.random() * 1e6)}`;
    window.localStorage.setItem("tkr_visitor_id", id);
  }
  return id;
}

/** Latest local record per type for a subject (most recent wins). */
export function localConsentState(
  subjectId: string,
): Partial<Record<ConsentType, ConsentRecord>> {
  const out: Partial<Record<ConsentType, ConsentRecord>> = {};
  for (const c of readLocalConsents())
    if (c.subjectId === subjectId && !out[c.type]) out[c.type] = c;
  return out;
}
