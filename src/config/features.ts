// src/config/features.ts
// Build-time feature flags. Keep business-gated verticals here so the UI can be
// fully built yet hidden until the commercial decision is made. Read these from
// components/pages — never hardcode the gate inline.
export const FEATURES = {
  taxTools: false,        // life / tax-deduction calculator + plans — flip ON if TKR sells that vertical
  cashInstallment: false, // requires a finance partner; show option only when partner is live
  mascot: false,          // placeholder mascot hidden until a real one ships — flip ON to restore it everywhere
} as const;

export type FeatureFlag = keyof typeof FEATURES;
