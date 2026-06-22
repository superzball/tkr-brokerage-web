import type { IconName } from "@/components/ui/Icon";

/**
 * LINE Concierge mockup data (was the SCRIPT / RICH_MENU arrays + inline flex
 * cards in line.jsx). All display text lives in the `line` message namespace,
 * keyed by these ids; message order / icons / colours live here.
 */

export const LINE_GREEN = "#06C755";
export const LINE_CHAT_BG = "#8aabd4";

export type LineChatKey = "time" | "bot1" | "me1" | "bot2" | "me2" | "bot3";

/** The scripted conversation, in order. Bubbles resolve text from `line.chat.<key>`. */
export type LineScriptItem =
  | { kind: "sys"; textKey: LineChatKey }
  | { kind: "bot"; textKey: LineChatKey }
  | { kind: "me"; textKey: LineChatKey }
  | { kind: "flexPolicy" }
  | { kind: "flexRenew" };

export const LINE_SCRIPT: LineScriptItem[] = [
  { kind: "sys", textKey: "time" },
  { kind: "bot", textKey: "bot1" },
  { kind: "me", textKey: "me1" },
  { kind: "bot", textKey: "bot2" },
  { kind: "flexPolicy" },
  { kind: "me", textKey: "me2" },
  { kind: "bot", textKey: "bot3" },
  { kind: "flexRenew" },
];

/** Flex "policy" card detail rows (label + value from `line.policy.rows.<key>`). */
export type LinePolicyRowKey = "policyNo" | "sum" | "until";
export const LINE_POLICY_ROWS: LinePolicyRowKey[] = ["policyNo", "sum", "until"];

/** Rich-menu grid (6 buttons; label from `line.richMenu.<key>`). */
export type LineRichKey = "check" | "renew" | "claim" | "info" | "buy" | "contact";
export const LINE_RICH_MENU: Array<{ key: LineRichKey; icon: IconName }> = [
  { key: "check", icon: "doc" },
  { key: "renew", icon: "refresh" },
  { key: "claim", icon: "alertTri" },
  { key: "info", icon: "info" },
  { key: "buy", icon: "plus" },
  { key: "contact", icon: "headset" },
];

/** Hero feature cards (label/sub from `line.hero.features.<key>`). */
export type LineFeatureKey = "check" | "claim" | "auto" | "agent";
export const LINE_HERO_FEATURES: Array<{ key: LineFeatureKey; icon: IconName }> = [
  { key: "check", icon: "doc" },
  { key: "claim", icon: "alertTri" },
  { key: "auto", icon: "sparkle" },
  { key: "agent", icon: "headset" },
];
