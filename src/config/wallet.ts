import type { IconName } from "@/components/ui/Icon";

/**
 * Worker-Wallet sample data (was inline literals in wallet.jsx). Display text
 * lives in the `wallet.app` message namespace; ids / icons / colours / ฿ figures
 * live here. The card's ฿ amounts are abbreviated literals, kept as-is.
 */

export const WALLET_CARD = {
  policyNo: "TKR-W-2568-1042",
  validUntil: "14 / 03 / 2570",
} as const;

export type WalletCoverageKey = "accident" | "medical" | "life";
/** Three coverage tiles (label from `wallet.app.<key>`, amount is a ฿ literal). */
export const WALLET_COVERAGE: Array<{
  key: WalletCoverageKey;
  icon: IconName;
  color: string;
  amount: string;
}> = [
  { key: "accident", icon: "alertTri", color: "#f59e0b", amount: "฿200K" },
  { key: "medical", icon: "heart", color: "#ef4444", amount: "฿30K" },
  { key: "life", icon: "shieldCheck", color: "#1f66ee", amount: "฿500K" },
];

export type WalletHelpKey = "hospital" | "call";
/** Secondary help actions under the SOS button. */
export const WALLET_HELP_ACTIONS: Array<{
  key: WalletHelpKey;
  icon: IconName;
  color: string;
}> = [
  { key: "hospital", icon: "hospital", color: "#1f66ee" },
  { key: "call", icon: "headset", color: "#0f52c7" },
];

export type WalletTabKey = "card" | "help";
/** Bottom tab bar (label from `wallet.app.{myCard,help}`). */
export const WALLET_TABS: Array<{ key: WalletTabKey; icon: IconName; labelKey: "myCard" | "help" }> = [
  { key: "card", icon: "wallet", labelKey: "myCard" },
  { key: "help", icon: "sos", labelKey: "help" },
];
