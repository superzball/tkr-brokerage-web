import type { CustomerPolicy, NotifItem, TimelineStep } from "@/types";

/**
 * Customer-center sample data (was the POLICIES / TIMELINE / NOTIFS arrays in
 * customer.html). All display text lives in the `customer` message namespace,
 * keyed by these ids; numbers / icons / status live here.
 */

export const CUSTOMER_POLICIES: CustomerPolicy[] = [
  { id: "worker", status: "active", icon: "users", premium: 124000, no: "TKR-W-2568-1042" },
  { id: "auto", status: "expiring", icon: "car", premium: 14200, no: "TKR-A-2568-3387" },
  { id: "pa", status: "active", icon: "shield", premium: 22800, no: "TKR-PA-2568-5521" },
  { id: "travel", status: "expiring", icon: "plane", premium: 1890, no: "TKR-T-2568-7710" },
  { id: "fire", status: "expired", icon: "flame", premium: 3200, no: "TKR-F-2567-2204" },
];

/** Top-of-dashboard summary figures (premium is a ฿ amount). */
export const CUSTOMER_STATS = {
  active: 5,
  expiring: 2,
  premium: 48200,
  documents: 12,
} as const;

/** Status colours (Tailwind classes + the left-bar hex). */
export const POLICY_STATUS_STYLE = {
  active: { chip: "bg-mint-50 text-mint-600", bar: "#14ad76" },
  expiring: { chip: "bg-amber-50 text-amber-600", bar: "#f59e0b" },
  expired: { chip: "bg-rose-50 text-rose-500", bar: "#ef4444" },
} as const;

export const CUSTOMER_TIMELINE: TimelineStep[] = [
  { key: "s1", state: "done" },
  { key: "s2", state: "done" },
  { key: "s3", state: "current" },
  { key: "s4", state: "pending" },
];

export const CUSTOMER_NOTIFS: NotifItem[] = [
  { key: "n1", icon: "clock", color: "amber" },
  { key: "n2", icon: "checkCircle", color: "mint" },
  { key: "n3", icon: "gift", color: "brand" },
];

export const NOTIF_COLOR: Record<string, string> = {
  amber: "bg-amber-50 text-amber-600",
  mint: "bg-mint-50 text-mint-600",
  brand: "bg-sky-100 text-brand-600",
};
