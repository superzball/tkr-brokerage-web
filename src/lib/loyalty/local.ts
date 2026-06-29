// src/lib/loyalty/local.ts
// Mock client-side persistence for the loyalty program (Phase 20). Earn events
// (profile-complete, social-link, review, missions, checkout) and redemptions are
// appended here; the Rewards hub merges these on top of the seed ledger so the
// balance/tier update live without a backend. A real backend would POST to a
// points-ledger table — swap-ready. Client-only.

import type {
  EarnSource, LoyaltyAccount, PointsEntry, Redemption, Reward,
} from "@/types/portal";
import { memberTierOf } from "@/config/loyalty";

export const LOCAL_EARNS_KEY = "tkr_loyalty_earns";
export const LOCAL_REDEMPTIONS_KEY = "tkr_loyalty_redemptions";
export const LOCAL_EARNED_ONCE_KEY = "tkr_loyalty_earned_once"; // sources already granted (oncePerCustomer / missions)

/** Fires whenever the local loyalty store changes — the Rewards hub listens to refresh live. */
export const LOYALTY_CHANGE_EVENT = "tkr-loyalty-change";
function notifyChange(): void {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(LOYALTY_CHANGE_EVENT));
}

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

export const readLocalEarns = () => read<PointsEntry>(LOCAL_EARNS_KEY);
export const readLocalRedemptions = () => read<Redemption>(LOCAL_REDEMPTIONS_KEY);

/** Net of all locally-stored ledger entries (earns minus redeems). Excludes seed. */
export const localBalance = () => readLocalEarns().reduce((s, e) => s + e.points, 0);

export function readEarnedOnce(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_EARNED_ONCE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

/** A unique tag (e.g. "profile_complete" or "mission:m1") already granted to this device. */
export function hasEarnedOnce(tag: string): boolean {
  return readEarnedOnce().includes(tag);
}

function markEarnedOnce(tag: string): void {
  if (typeof window === "undefined") return;
  const cur = readEarnedOnce();
  if (cur.includes(tag)) return;
  window.localStorage.setItem(LOCAL_EARNED_ONCE_KEY, JSON.stringify([tag, ...cur]));
}

/** Compose the effective account = seed + local earns + local redemptions. */
export function effectiveAccount(
  seed: LoyaltyAccount,
  earns: PointsEntry[],
  reds: Redemption[],
): LoyaltyAccount {
  const earnSum = earns.reduce((s, e) => s + e.points, 0);
  const redSum = reds.reduce((s, r) => s + r.pointsSpent, 0);
  const lifetimePoints = seed.lifetimePoints + earns.filter((e) => e.points > 0).reduce((s, e) => s + e.points, 0);
  const balance = seed.balance + earnSum - redSum;
  return { customerId: seed.customerId, balance, lifetimePoints, tier: memberTierOf(lifetimePoints) };
}

/**
 * Append an earn event. `balanceAfter` is computed from the passed-in current
 * balance so the ledger stays a valid running total. Returns the new entry.
 * `tag` (when given) is recorded so once-only earns can't be granted twice.
 */
export function addLocalEarn(args: {
  customerId: string;
  source: EarnSource;
  points: number;
  description: string;
  currentBalance: number;
  ref?: string;
  tag?: string;
}): PointsEntry {
  const entry: PointsEntry = {
    id: `ptl_${Date.now()}`,
    customerId: args.customerId,
    type: "earn",
    source: args.source,
    points: args.points,
    balanceAfter: args.currentBalance + args.points,
    description: args.description,
    date: new Date().toISOString().slice(0, 10),
    ref: args.ref,
  };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(LOCAL_EARNS_KEY, JSON.stringify([entry, ...readLocalEarns()]));
    if (args.tag) markEarnedOnce(args.tag);
    notifyChange();
  }
  return entry;
}

/**
 * Convenience earn used by off-hub hooks (checkout, profile-complete) that don't
 * track the running balance themselves. balanceAfter is derived from the local
 * net + an optional seed balance. Skips if `tag` was already granted once.
 * Returns the entry, or null if it was a once-only earn already taken.
 */
export function recordEarn(args: {
  source: EarnSource;
  points: number;
  description: string;
  customerId?: string;
  seedBalance?: number;
  ref?: string;
  tag?: string;
}): PointsEntry | null {
  if (args.tag && hasEarnedOnce(args.tag)) return null;
  return addLocalEarn({
    customerId: args.customerId ?? "self",
    source: args.source,
    points: args.points,
    description: args.description,
    currentBalance: (args.seedBalance ?? 0) + localBalance(),
    ref: args.ref,
    tag: args.tag,
  });
}

/** Generate a mock coupon code for an issued reward. */
export function issueRewardCode(reward: Reward): string {
  const prefix =
    reward.type === "voucher" ? "TKR-VCH" :
    reward.type === "gift" ? "TKR-GIFT" :
    reward.type === "service" ? "TKR-SVC" :
    reward.type === "premium_discount" ? "TKR-PRM" : "TKR-DON";
  const n = String(Date.now()).slice(-4);
  return `${prefix}-${n}`;
}

/** Append a redemption + the matching negative ledger entry. Returns the redemption. */
export function addLocalRedemption(args: {
  customerId: string;
  reward: Reward;
  currentBalance: number;
}): Redemption {
  const { customerId, reward } = args;
  const isDonation = reward.type === "donation";
  const code = isDonation ? undefined : issueRewardCode(reward);
  const date = new Date().toISOString().slice(0, 10);
  const redemption: Redemption = {
    id: `rdl_${Date.now()}`,
    customerId,
    rewardId: reward.id,
    pointsSpent: reward.cost,
    code,
    status: "issued",
    date,
  };
  // matching ledger entry (negative) so points history stays consistent
  const ledgerEntry: PointsEntry = {
    id: `ptl_${Date.now()}r`,
    customerId,
    type: "redeem",
    points: -reward.cost,
    balanceAfter: args.currentBalance - reward.cost,
    description: `แลก ${reward.id}`,
    date,
    ref: `RWD-${reward.id}`,
  };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(LOCAL_REDEMPTIONS_KEY, JSON.stringify([redemption, ...readLocalRedemptions()]));
    window.localStorage.setItem(LOCAL_EARNS_KEY, JSON.stringify([ledgerEntry, ...readLocalEarns()]));
    notifyChange();
  }
  return redemption;
}
