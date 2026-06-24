// src/lib/mock/local-crm.ts
// Mock client-side persistence for CRM ops (Phase 15). The ticket / payment /
// credit flows write here; the Tickets, Payments, Credit and Debtors screens
// merge these on top of the seed data so a walkthrough survives across pages.
// A real backend would POST to tickets / payments / a credit-ledger service —
// swap-ready. Client-only (guards on `window`).
//
// Source of truth for the wallet is the APPEND-ONLY ledger: a ticket-create
// writes a `debit`, a payment writes a `credit`, and the running balanceAfter
// is computed from the previous balance — never mutated in place.

import type {
  PolicyTicket,
  CrmPayment,
  CreditTransaction,
} from "@/types/portal";

const TICKETS_KEY = "tkr_crm_tickets"; // newly created tickets
const PATCHES_KEY = "tkr_crm_ticket_patches"; // { [id]: Partial<PolicyTicket> }
const PAYMENTS_KEY = "tkr_crm_payments"; // newly recorded payments
const LEDGER_KEY = "tkr_crm_ledger"; // appended credit transactions

function readArr<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}
function writeArr<T>(key: string, value: T[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}
function readObj<T>(key: string): Record<string, T> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Record<string, T>) : {};
  } catch {
    return {};
  }
}

export const readNewTickets = () => readArr<PolicyTicket>(TICKETS_KEY);
export const readNewPayments = () => readArr<CrmPayment>(PAYMENTS_KEY);
export const readNewLedger = () => readArr<CreditTransaction>(LEDGER_KEY);
export const readPatches = () =>
  readObj<Partial<PolicyTicket>>(PATCHES_KEY);

/** Seed tickets with local patches applied, newest local creations first. */
export function mergeTickets(seed: PolicyTicket[]): PolicyTicket[] {
  const patches = readPatches();
  const patched = seed.map((t) => (patches[t.id] ? { ...t, ...patches[t.id] } : t));
  return [...readNewTickets(), ...patched];
}
/** Seed ledger then locally-appended rows (chronological). */
export function mergeLedger(seed: CreditTransaction[]): CreditTransaction[] {
  return [...seed, ...readNewLedger()];
}
/** Locally-recorded payments first, then seed payments. */
export function mergePayments(seed: CrmPayment[]): CrmPayment[] {
  return [...readNewPayments(), ...seed];
}

/** Current running balance for a customer = last merged-ledger balanceAfter. */
export function customerBalance(
  seedLedger: CreditTransaction[],
  customerId: string,
): number {
  const rows = mergeLedger(seedLedger).filter((c) => c.customerId === customerId);
  const last = rows[rows.length - 1];
  return last ? last.balanceAfter : 0;
}

export function addNewTicket(ticket: PolicyTicket): void {
  writeArr(TICKETS_KEY, [ticket, ...readNewTickets()]);
}
export function patchTicket(id: string, patch: Partial<PolicyTicket>): void {
  const patches = readPatches();
  patches[id] = { ...patches[id], ...patch };
  if (typeof window !== "undefined")
    window.localStorage.setItem(PATCHES_KEY, JSON.stringify(patches));
}
export function addLedgerTx(tx: CreditTransaction): void {
  writeArr(LEDGER_KEY, [...readNewLedger(), tx]);
}
export function addPayment(p: CrmPayment): void {
  writeArr(PAYMENTS_KEY, [p, ...readNewPayments()]);
}

let seq = 0;
/** Short unique-ish id for a mock entity (client session scope). */
export function mockId(prefix: string): string {
  seq += 1;
  return `${prefix}_${Date.now().toString(36)}${seq}`;
}
