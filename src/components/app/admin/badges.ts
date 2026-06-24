// src/components/app/admin/badges.ts
// Tone maps for the back-office-only statuses (orders, tickets, articles,
// staff, plans). Customer-side tones (policy/claim/invoice/license) are reused
// from business/status.ts + team/license.ts — not duplicated here.

import type { BadgeTone } from "@/components/app/StatusBadge";
import type {
  OrderStatus,
  TicketStatus,
  ArticleStatus,
  SupportTicket,
  StaffUser,
} from "@/types/portal";

export const orderTone: Record<OrderStatus, BadgeTone> = {
  draft: "neutral",
  awaiting_payment: "warning",
  issued: "success",
  cancelled: "danger",
};

export const ticketTone: Record<TicketStatus, BadgeTone> = {
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
