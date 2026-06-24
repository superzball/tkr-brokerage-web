// src/components/app/admin/badges.ts
// Tone maps for the back-office-only statuses (orders, tickets, articles,
// staff, plans). Customer-side tones (policy/claim/invoice/license) are reused
// from business/status.ts + team/license.ts — not duplicated here.

import type { BadgeTone } from "@/components/app/StatusBadge";
import type {
  OrderStatus,
  SupportTicketStatus,
  ArticleStatus,
  SupportTicket,
  StaffUser,
  TicketStatus,
  TicketPaymentStatus,
  TicketPriority,
} from "@/types/portal";

export const orderTone: Record<OrderStatus, BadgeTone> = {
  draft: "neutral",
  awaiting_payment: "warning",
  issued: "success",
  cancelled: "danger",
};

export const supportTicketTone: Record<SupportTicketStatus, BadgeTone> = {
  open: "warning",
  pending: "info",
  resolved: "success",
};

export const priorityTone: Record<SupportTicket["priority"], BadgeTone> = {
  low: "neutral",
  medium: "info",
  high: "danger",
};

export const articleTone: Record<ArticleStatus, BadgeTone> = {
  draft: "neutral",
  scheduled: "info",
  published: "success",
};

export const staffStatusTone: Record<StaffUser["status"], BadgeTone> = {
  active: "success",
  suspended: "danger",
};

// ---- CRM ops (Phase 15) ----
export const policyTicketTone: Record<TicketStatus, BadgeTone> = {
  draft: "neutral",
  pending_send: "warning",
  sent_to_thip: "info",
  thip_processing: "info",
  completed: "success",
  rejected: "danger",
};

export const ticketPaymentTone: Record<TicketPaymentStatus, BadgeTone> = {
  pending: "warning",
  partial: "info",
  paid: "success",
  refunded: "neutral",
};

export const ticketPriorityTone: Record<TicketPriority, BadgeTone> = {
  low: "neutral",
  normal: "info",
  high: "warning",
  urgent: "danger",
};

// AR aging buckets (debtorAging)
export const bucketTone: Record<string, BadgeTone> = {
  not_due: "neutral",
  due_today: "warning",
  overdue_1_3: "warning",
  overdue_gt_3: "danger",
};
