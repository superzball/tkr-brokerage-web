// src/config/loyalty.ts
// Phase 20 — Customer Loyalty & Rewards. Earn rules, member-tier ladder, and the
// premium-discount feature gate. Labels here are i18n KEYS (resolved under the
// `loyalty` namespace by the screens) — keep display copy in messages.
//
// IMPORTANT: member tiers are SEPARATE from agent tiers (see types/portal.ts).
// Earn multipliers apply to BASE points; screens must show the math transparently.

import type { EarnRule, LoyaltyAccount, MemberTier, MemberTierInfo, Reward } from "@/types/portal";

export const earnRules: EarnRule[] = [
  { source: "purchase",         label: "earnPurchase",  points: 1,   unit: "per_100_thb" },
  { source: "profile_complete", label: "earnProfile",   points: 100, oncePerCustomer: true },
  { source: "social_link",      label: "earnSocial",    points: 50,  unit: "per_channel" },
  { source: "renewal",          label: "earnRenewal",   points: 200 },
  { source: "no_claim",         label: "earnNoClaim",   points: 300, annual: true },
  { source: "referral",         label: "earnReferral",  points: 300 }, // referee gets 150
  { source: "review",           label: "earnReview",    points: 50 },
  { source: "survey",           label: "earnSurvey",    points: 30 },
  { source: "birthday",         label: "earnBirthday",  points: 100, annual: true },
  { source: "mission",          label: "earnMission",   points: 20 },
];

export const memberTiers: MemberTierInfo[] = [
  { tier: "bronze",   threshold: 0,    earnMultiplier: 1.0,  perksKeys: ["perkBaseEarn"] },
  { tier: "silver",   threshold: 1000, earnMultiplier: 1.1,  perksKeys: ["perkBirthdayGift", "perkBonusEarn10"] },
  { tier: "gold",     threshold: 3000, earnMultiplier: 1.25, perksKeys: ["perkPrioritySupport", "perkExclusiveVouchers", "perkBonusEarn25"] },
  { tier: "platinum", threshold: 8000, earnMultiplier: 1.5,  perksKeys: ["perkDedicatedLine", "perkPremiumGifts", "perkBonusEarn50"] },
];

/** Tier from lifetime points (never decreases on redeem). */
export const memberTierOf = (lifetime: number): MemberTier =>
  lifetime >= 8000 ? "platinum" : lifetime >= 3000 ? "gold" : lifetime >= 1000 ? "silver" : "bronze";

export const memberTierInfo = (tier: MemberTier): MemberTierInfo =>
  memberTiers.find((t) => t.tier === tier) ?? memberTiers[0]!;

/** The next tier up, or undefined if already at the top. */
export const nextMemberTier = (tier: MemberTier): MemberTierInfo | undefined => {
  const i = memberTiers.findIndex((t) => t.tier === tier);
  return i >= 0 ? memberTiers[i + 1] : undefined;
};

// FEATURES (loyalty): premium-discount redemption stays OFF until OIC/legal
// sign-off — reducing premium via points touches OIC rules on rebating. Rewards
// flagged `requiresLegalReview` are hidden/disabled while this is false.
export const FEATURES_LOYALTY = { pointsToPremiumDiscount: false } as const;

const TIER_RANK: Record<MemberTier, number> = { bronze: 0, silver: 1, gold: 2, platinum: 3 };

/** Why a reward can't be redeemed, or 'ok'. Used to gate the redeem button + action. */
export function redeemGuard(account: LoyaltyAccount, reward: Reward):
  "ok" | "locked" | "insufficient" | "tier" {
  if (reward.type === "premium_discount" && !FEATURES_LOYALTY.pointsToPremiumDiscount) return "locked";
  if (account.balance < reward.cost) return "insufficient";
  if (reward.minTier && TIER_RANK[account.tier] < TIER_RANK[reward.minTier]) return "tier";
  return "ok";
}
