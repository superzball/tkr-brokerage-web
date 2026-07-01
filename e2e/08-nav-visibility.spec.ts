import { test, expect } from "@playwright/test";
import { p, loginAs, dismissCookieBanner, USERS } from "./helpers";

/**
 * Phase 13 — Critical flow #8: PUBLIC NAV VISIBILITY (NAV_VISIBILITY).
 *
 * Admin toggles a public menu item off under /admin/content/navigation; the item
 * then disappears from every public nav surface (navbar + mega-menu + mobile
 * drawer, all rendered inside <header>), and reappears when toggled back on.
 * Settings persist as a localStorage override that the public Navbar merges over
 * the seed defaults — same origin, so the admin write is visible to the site.
 */

test.beforeEach(async ({ context, baseURL }) => {
  await context.clearCookies();
  await loginAs(context, USERS.admin, baseURL!);
  await dismissCookieBanner(context, baseURL!);
});

test("toggling a top-level item off removes it from the navbar, then back on restores it", async ({
  page,
}) => {
  // A simple top-level link — rendered in both the desktop center nav and the
  // (in-DOM) mobile drawer, so count > 1 while shown.
  const promoLinks = page.locator('header a[href="/th/promotions"]');

  await page.goto(p("/"));
  await expect(promoLinks.first()).toBeVisible();

  // Turn it OFF from the admin Navigation panel.
  await page.goto(p("/admin/content/navigation"));
  const promoSwitch = page.getByRole("switch", { name: "โปรโมชั่น" });
  await expect(promoSwitch).toHaveAttribute("aria-checked", "true");
  await promoSwitch.click();
  await expect(promoSwitch).toHaveAttribute("aria-checked", "false");

  // Gone from every public nav surface.
  await page.goto(p("/"));
  await expect(promoLinks).toHaveCount(0);

  // Turn it back ON — it reappears.
  await page.goto(p("/admin/content/navigation"));
  await page.getByRole("switch", { name: "โปรโมชั่น" }).click();
  await page.goto(p("/"));
  await expect(promoLinks.first()).toBeVisible();
});

test("toggling a single mega-menu link off drops just that link from the menu", async ({
  page,
}) => {
  // "ประกันเดินทาง" (travel) is a link inside the Products mega menu.
  const travelInHeader = page.locator('header a[href="/th/insurance/travel"]');

  await page.goto(p("/"));
  await expect(travelInHeader.first()).toBeAttached();

  await page.goto(p("/admin/content/navigation"));
  await page.getByRole("switch", { name: "ประกันเดินทาง" }).click();

  await page.goto(p("/"));
  await expect(travelInHeader).toHaveCount(0);
  // The parent Products menu is still present (its other links remain).
  await expect(page.locator('header a[href="/th/insurance/auto"]').first()).toBeAttached();
});
