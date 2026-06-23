// src/components/app/business/status.ts
// Maps domain statuses to StatusBadge tones, shared across the business screens.

import type { BadgeTone } from "@/components/app/StatusBadge";
import type {
  PolicyStatus,
  ClaimStatus,
  InvoiceStatus,
  Worker,
} from "@/types/portal";

export const policyTone: Record<PolicyStatus, BadgeTone> = {
  active: "success",
  expiring: "warning",
  expired: "danger",
  pending: "info",
};

export const claimTone: Record<ClaimStatus, BadgeTone> = {
  submitted: "info",
  reviewing: "warning",
  approved: "success",
  paid: "success",
  rejected: "danger",
};

export const invoiceTone: Record<InvoiceStatus, BadgeTone> = {
  paid: "success",
  unpaid: "warning",
  overdue: "danger",
};

export const workerTone: Record<Worker["status"], BadgeTone> = {
  covered: "success",
  pending: "warning",
  expired: "danger",
};

/** Ordered claim lifecycle for the status-tracker timeline (rejected is terminal). */
export const CLAIM_TIMELINE: ClaimStatus[] = [
  "submitted",
  "reviewing",
  "approved",
  "paid",
];
