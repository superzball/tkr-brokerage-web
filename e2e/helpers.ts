import { expect, type BrowserContext, type Page } from "@playwright/test";

/**
 * Shared helpers for the Phase 13 critical-flow e2e suite.
 *
 * Auth in this app is a single httpOnly cookie holding a User.id (see
 * src/lib/auth/cookie.ts + session.ts). Tests that aren't specifically
 * exercising the login UI can just plant that cookie and skip the login screen.
 */

export const SESSION_COOKIE = "tkr_session";
export const DEMO_OTP = "123456";

/** Demo user ids from src/lib/mock/seed.ts. */
export const USERS = {
  business: "u_biz",
  individual: "u_indiv",
  agent: "u_agent",
  admin: "u_admin",
} as const;

/** Locale-prefixed path (the app always prefixes the locale, e.g. /th/...). */
export function p(path: string, locale = "th"): string {
  return `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Plant the session cookie so the context is authenticated as `userId`. */
export async function loginAs(
  context: BrowserContext,
  userId: string,
  baseURL: string,
): Promise<void> {
  await context.addCookies([
    {
      name: SESSION_COOKIE,
      value: userId,
      url: baseURL,
      httpOnly: true,
      sameSite: "Lax",
    },
  ]);
}

/**
 * Pre-dismiss the site-wide cookie-consent banner by planting a choice cookie.
 * The banner is a fixed bottom bar (z-[70]) that otherwise intercepts clicks on
 * buttons near the bottom of the page. Call this in any spec that isn't the
 * consent test itself.
 */
export async function dismissCookieBanner(
  context: BrowserContext,
  baseURL: string,
): Promise<void> {
  await context.addCookies([
    {
      name: "tkr_cookie_consent",
      value: encodeURIComponent(
        JSON.stringify({ v: "e2e", analytics: false, marketing: false, ts: "2026-01-01T00:00:00.000Z" }),
      ),
      url: baseURL,
      sameSite: "Lax",
    },
  ]);
}

/**
 * Type a 6-digit OTP into the per-digit input row. Works for both the auth
 * OTP screen and the guest-checkout OTP step (both render 6 single-char inputs
 * with inputmode="numeric"). Scope to a container to disambiguate.
 */
export async function fillOtp(
  scope: Page | ReturnType<Page["locator"]>,
  code = DEMO_OTP,
): Promise<void> {
  const boxes = scope.locator('input[inputmode="numeric"]');
  await expect(boxes).toHaveCount(6);
  for (let i = 0; i < 6; i++) {
    await boxes.nth(i).fill(code[i]);
  }
}
