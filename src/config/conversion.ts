// src/config/conversion.ts
// Phase 17 — Conversion & Trust layer. Structure/routing only; display copy
// lives in the `conversion` / `seo` message namespaces. Two things live here:
//  1. the expanded personal-lines SEO taxonomy (sub-products under the 5 flagship
//     lines), driving the /insurance index + sub-landing pages.
//  2. a helper that builds a mock multi-insurer comparison set for a product so
//     the reusable <CompareTable/> works across personal lines, not just auto.

import type { IconName } from "@/components/ui/Icon";
import type { InsuranceType } from "@/types/portal";
import type { LearnProductKey } from "./learn";
import { getInsurerPartners, insurerShortName } from "@/lib/mock/seed";

export type SeoCategory = "auto" | "travel" | "home" | "tax";

export type SeoLanding = {
  slug: string;                 // URL slug under /insurance/<slug>
  category: SeoCategory;
  /** Flagship product this sub-line inherits quote/compare behaviour from. */
  parent: LearnProductKey;
  icon: IconName;
  /** Whether the reusable multi-insurer comparison renders on this page. */
  compare: boolean;
  /** Starting premium used to seed the mock comparison + "from" price. */
  fromPrice: number;
};

export const SEO_CATEGORIES: SeoCategory[] = ["auto", "travel", "home", "tax"];

export const SEO_LANDINGS: SeoLanding[] = [
  // ── motor ──
  { slug: "auto-ev",          category: "auto",   parent: "auto",   icon: "car",      compare: true,  fromPrice: 12900 },
  { slug: "auto-class1",      category: "auto",   parent: "auto",   icon: "car",      compare: true,  fromPrice: 13600 },
  { slug: "auto-2plus",       category: "auto",   parent: "auto",   icon: "car",      compare: true,  fromPrice: 7900 },
  { slug: "auto-3plus",       category: "auto",   parent: "auto",   icon: "car",      compare: true,  fromPrice: 5400 },
  { slug: "auto-shortterm",   category: "auto",   parent: "auto",   icon: "car",      compare: true,  fromPrice: 1900 },
  { slug: "auto-van",         category: "auto",   parent: "auto",   icon: "truck",    compare: true,  fromPrice: 9900 },
  // ── travel ──
  { slug: "travel-domestic",      category: "travel", parent: "travel", icon: "map",   compare: false, fromPrice: 120 },
  { slug: "travel-international",  category: "travel", parent: "travel", icon: "plane", compare: true,  fromPrice: 350 },
  // ── home & condo ──
  { slug: "home-house",  category: "home", parent: "fire", icon: "building", compare: true,  fromPrice: 2500 },
  { slug: "home-condo",  category: "home", parent: "fire", icon: "building", compare: true,  fromPrice: 1800 },
  // ── tax-deduction ──
  { slug: "tax-savings", category: "tax", parent: "pa", icon: "coins", compare: false, fromPrice: 24000 },
  { slug: "tax-annuity", category: "tax", parent: "pa", icon: "coins", compare: false, fromPrice: 30000 },
];

export const SEO_LANDING_SLUGS = SEO_LANDINGS.map((s) => s.slug);

export function getSeoLanding(slug: string): SeoLanding | undefined {
  return SEO_LANDINGS.find((s) => s.slug === slug);
}

// ---- reusable multi-insurer comparison data ----
export type ComparePlan = {
  id: string;
  insurer: string;
  price: number;
  sum: number;
  deduct: number | null;
  rating: number;
  reviews: number;
  best?: boolean;
  value?: boolean;
};

/**
 * Builds a deterministic mock comparison set for a product from the real partner
 * insurers. Spreads price/coverage around a base so sort-by-price/coverage/rating
 * all show meaningful order. Deterministic (index-based) — no Math.random.
 */
export function comparePlansFor(
  product: InsuranceType,
  base: number,
  coverageBase = 1_000_000,
): ComparePlan[] {
  const spread = [0, 0.06, -0.04, 0.12, 0.02, -0.07];
  const covSpread = [1, 1.15, 0.85, 1.3, 1.05, 0.9];
  const ratings = [4.7, 4.8, 4.5, 4.6, 4.3, 4.4];
  const reviews = [2140, 1860, 3210, 1540, 980, 1120];
  // Use the featured insurers (6) for a focused, readable comparison set — the
  // spread arrays above are sized for that. Short display names keep cells tidy.
  const plans = getInsurerPartners({ featuredOnly: true }).map((p, i) => ({
    id: `${product}-${p.id}`,
    insurer: insurerShortName(p.name),
    price: Math.round((base * (1 + (spread[i] ?? 0))) / 100) * 100,
    sum: Math.round((coverageBase * (covSpread[i] ?? 1)) / 10000) * 10000,
    deduct: i % 3 === 0 ? null : (i % 3) * 1000,
    rating: ratings[i] ?? 4.5,
    reviews: reviews[i] ?? 1000,
  }));
  const cheapest = plans.reduce((a, b) => (b.price < a.price ? b : a), plans[0]!);
  const top = plans.reduce((a, b) => (b.rating > a.rating ? b : a), plans[0]!);
  return plans.map((p) => ({
    ...p,
    value: p.id === cheapest.id,
    best: p.id === top.id,
  }));
}
