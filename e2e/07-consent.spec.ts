import { test, expect } from "@playwright/test";
import { p } from "./helpers";

/**
 * Phase 13 — Critical flow #7: cookie consent + PDPA consent capture recorded.
 *
 * The cookie banner gates analytics/marketing until a choice is made and writes
 * an auditable record. (PDPA service-consent capture at guest checkout is
 * additionally asserted in 01-guest-checkout.spec.ts.)
 */

test("accepting the cookie banner persists the choice and records consent", async ({
  page,
  context,
}) => {
  await context.clearCookies();
  await page.goto(p("/"));

  // Banner shows on first visit.
  await expect(page.getByText("เราใช้คุกกี้", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "ยอมรับทั้งหมด" }).click();

  // Choice persisted as a first-party cookie (analytics + marketing granted).
  const cookies = await context.cookies();
  const choice = cookies.find((c) => c.name === "tkr_cookie_consent");
  expect(choice).toBeTruthy();
  const parsed = JSON.parse(decodeURIComponent(choice!.value));
  expect(parsed.analytics).toBe(true);
  expect(parsed.marketing).toBe(true);

  // Append-only consent ledger captured the banner choice.
  const records = await page.evaluate(() => {
    const raw = localStorage.getItem("tkr_consent_records");
    return raw ? (JSON.parse(raw) as Array<Record<string, unknown>>) : [];
  });
  expect(
    records.some((r) => r.type === "cookies_analytics" && r.source === "cookie_banner" && r.granted === true),
  ).toBe(true);

  // Banner does not reappear once a choice exists.
  await page.reload();
  await expect(page.getByText("เราใช้คุกกี้", { exact: true })).toHaveCount(0);
});
