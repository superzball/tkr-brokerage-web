// src/config/learn.ts
// Per-product config for the public "How it works" landing pages
// (/insurance/[product]). Display copy lives in the `learn` message namespace;
// only structure/numbers/routing live here.

import type { IconName } from "@/components/ui/Icon";
import type { Role } from "@/types/portal";
import { ROUTES } from "./nav";

export type LearnProductKey = "worker" | "auto" | "travel" | "health" | "fire";

/** How the plans/pricing section renders for each product. */
export type PlansKind = "worker" | "auto" | "generic";

export type GenericTier = { price: number; sum: number; recommended?: boolean };

export type LearnProduct = {
  key: LearnProductKey;
  icon: IconName;
  /** Role implied by the product — preselected on signup CTAs. */
  role: Role;
  /** Live quote route, or null when the product is contact-only. */
  quoteHref: string | null;
  plansKind: PlansKind;
  /** Three tiers (basic/standard/premium) for the generic plan comparison. */
  tiers?: [GenericTier, GenericTier, GenericTier];
};

export const LEARN_PRODUCTS: Record<LearnProductKey, LearnProduct> = {
  worker: {
    key: "worker",
    icon: "users",
    role: "business",
    quoteHref: ROUTES.worker,
    plansKind: "worker",
  },
  auto: {
    key: "auto",
    icon: "car",
    role: "individual",
    quoteHref: ROUTES.auto,
    plansKind: "auto",
  },
  travel: {
    key: "travel",
    icon: "plane",
    role: "individual",
    quoteHref: null,
    plansKind: "generic",
    tiers: [
      { price: 350, sum: 1_000_000 },
      { price: 690, sum: 3_000_000, recommended: true },
      { price: 1290, sum: 5_000_000 },
    ],
  },
  health: {
    key: "health",
    icon: "heart",
    role: "individual",
    quoteHref: null,
    plansKind: "generic",
    tiers: [
      { price: 9000, sum: 500_000 },
      { price: 18000, sum: 1_500_000, recommended: true },
      { price: 32000, sum: 5_000_000 },
    ],
  },
  fire: {
    key: "fire",
    icon: "flame",
    role: "individual",
    quoteHref: null,
    plansKind: "generic",
    tiers: [
      { price: 2500, sum: 1_000_000 },
      { price: 5500, sum: 3_000_000, recommended: true },
      { price: 9900, sum: 8_000_000 },
    ],
  },
};

export const LEARN_PRODUCT_KEYS = Object.keys(LEARN_PRODUCTS) as LearnProductKey[];
