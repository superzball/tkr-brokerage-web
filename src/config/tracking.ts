import type { TrackItem, TrackStage, TrackState } from "@/types";

/**
 * Policy-issuance tracking sample data (was the STAGES / ITEMS arrays in the
 * inline <script> of tracking.html). All display text lives in the `tracking`
 * message namespace, keyed by these ids; numbers / state / ids live here.
 */

/** Order reference shown in the hero (alphanumeric id, not localized). */
export const TRACK_ORDER_NO = "#TKR-2569-08842";

/** Overall progress (% issued) + the headline counts. */
export const TRACK_PROGRESS = 75;
export const TRACK_COUNTS = {
  issued: 186,
  processing: 62,
  problem: 0,
  total: 248,
} as const;

export const TRACK_STAGES: TrackStage[] = [
  { key: "s1", state: "done" },
  { key: "s2", state: "done" },
  { key: "s3", state: "current" },
  { key: "s4", state: "pending" },
  { key: "s5", state: "pending" },
];

export const TRACK_ITEMS: TrackItem[] = [
  { key: "i1", pp: "MB2847163", state: "done" },
  { key: "i2", pp: "LA1938472", state: "done" },
  { key: "i3", pp: "MB7261540", state: "current" },
  { key: "i4", pp: "MB3948271", state: "current" },
  { key: "i5", pp: "LA5647382", state: "pending" },
];

/** Per-item status-badge styling (label text lives in `tracking.itemStatus`).
 *  Text-only chips — the original destructures an icon here but never renders it. */
export const TRACK_ITEM_BADGE: Record<TrackState, { cls: string }> = {
  done: { cls: "bg-mint-50 text-mint-600" },
  current: { cls: "bg-brand-50 text-brand-600" },
  pending: { cls: "bg-ink-50 text-ink-400" },
};
