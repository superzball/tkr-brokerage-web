// src/lib/legal/cookies.ts
// Cookie-consent choice persisted in a first-party cookie (client-readable, so
// the banner and the script gates can react without a server round-trip).
// Essential cookies are always on; analytics + marketing are opt-in and their
// scripts must NOT load until consented. Swap-ready: a real CMP would sync this.

export const COOKIE_CONSENT_KEY = "tkr_cookie_consent";
export const COOKIE_CONSENT_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

// Fired on window when the choice changes (banner save) — script gates listen.
export const COOKIE_CONSENT_EVENT = "tkr:cookie-consent";
// Fired to (re)open the preferences manager from anywhere (e.g. footer link).
export const COOKIE_PREFS_EVENT = "tkr:open-cookie-prefs";

export type CookieCategory = "essential" | "analytics" | "marketing";
export const OPTIONAL_CATEGORIES: CookieCategory[] = ["analytics", "marketing"];

export interface CookieChoice {
  v: string; // policy version the choice was made against
  analytics: boolean;
  marketing: boolean;
  ts: string; // ISO timestamp of the choice
}

/** Read the stored choice, or null on first visit / unreadable cookie. */
export function readCookieChoice(): CookieChoice | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((c) => c.startsWith(COOKIE_CONSENT_KEY + "="));
  if (!match) return null;
  try {
    return JSON.parse(
      decodeURIComponent(match.split("=").slice(1).join("=")),
    ) as CookieChoice;
  } catch {
    return null;
  }
}

/** Persist the choice + broadcast it so the script gates re-evaluate live. */
export function writeCookieChoice(choice: CookieChoice): void {
  if (typeof document === "undefined") return;
  document.cookie =
    `${COOKIE_CONSENT_KEY}=${encodeURIComponent(JSON.stringify(choice))}; ` +
    `path=/; max-age=${COOKIE_CONSENT_MAX_AGE}; SameSite=Lax`;
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: choice }));
}
