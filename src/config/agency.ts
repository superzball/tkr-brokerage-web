import type {
  AgencyStat,
  AgencyTier,
  AgencyTierKey,
  DownlineRow,
  LeaderboardRow,
  MediaItem,
} from "@/types";

/**
 * Agency-dashboard sample data (was the TIERS / LB / DL / MEDIA arrays + the
 * inline chart data in agency.js). All display text lives in the `agency`
 * message namespace, keyed by these ids; numbers / icons / colours live here.
 * The agent-tier logic (thresholds, current tier, ordering) is preserved 1:1.
 */

/** Loyalty tiers in ascending order. `from` = ฿M sales threshold. */
export const AGENCY_TIERS: AgencyTier[] = [
  { key: "silver", from: 0, comm: "15%", color: "#94a3b8", icon: "shield" },
  { key: "gold", from: 3, comm: "20%", color: "#eab308", icon: "medal" },
  { key: "platinum", from: 6, comm: "24%", color: "#64748b", icon: "trophy" },
  { key: "diamond", from: 10, comm: "28%", color: "#1f66ee", icon: "sparkle" },
];

/** The agent's current tier (drives done/current/next states on the rail). */
export const AGENCY_CURRENT_TIER: AgencyTierKey = "platinum";

/** Width of the filled portion of the tier-progress rail (parity with original). */
export const TIER_RAIL_PROGRESS = 78;

/** Top KPI cards. Abbreviated ฿M figures are kept as literal display strings. */
export const AGENCY_STATS: AgencyStat[] = [
  { key: "sales", icon: "coins", value: "฿8.42M", delta: "+12.4%" },
  { key: "commission", icon: "wallet", value: "฿1.68M", delta: "+8.1%" },
  { key: "clients", icon: "users", value: "486", delta: "+34" },
  { key: "policies", icon: "doc", value: "1,247", delta: "+57" },
];

/** Monthly sales trend (฿M), Jan→Dec. Month labels live in `agency.chart.months`. */
export const AGENCY_CHART_DATA = [
  4.2, 5.1, 4.8, 6.3, 5.9, 7.1, 6.8, 8.2, 7.6, 9.1, 8.8, 8.42,
];
export const AGENCY_CHART_MAX = 10;

/** Incentive / "next reward" progress (% toward the ฿10M Diamond goal). */
export const AGENCY_GOAL_PROGRESS = 84;

export const AGENCY_LEADERBOARD: LeaderboardRow[] = [
  { rank: 1, sales: "12.4M", you: false },
  { rank: 2, sales: "10.8M", you: false },
  { rank: 3, sales: "8.42M", you: true },
  { rank: 4, sales: "7.91M", you: false },
  { rank: 5, sales: "6.55M", you: false },
];

export const AGENCY_DOWNLINE: DownlineRow[] = [
  { key: "d1", tier: "gold", sales: "3.2M", clients: 142, trend: "+9%" },
  { key: "d2", tier: "silver", sales: "1.8M", clients: 88, trend: "+14%" },
  { key: "d3", tier: "gold", sales: "4.1M", clients: 167, trend: "+6%" },
  { key: "d4", tier: "silver", sales: "0.9M", clients: 41, trend: "+22%" },
];

export const AGENCY_MEDIA: MediaItem[] = [
  { key: "brochure", icon: "file" },
  { key: "social", icon: "image" },
  { key: "video", icon: "play" },
  { key: "deck", icon: "doc" },
];
