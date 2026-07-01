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
  // "travel" appears in both the nav Products mega and the footer (they share one
  // flag → stay in sync); the nav row renders first, so target it.
  await page.getByRole("switch", { name: "ประกันเดินทาง" }).first().click();

  await page.goto(p("/"));
  await expect(travelInHeader).toHaveCount(0);
  // The parent Products menu is still present (its other links remain).
  await expect(page.locator('header a[href="/th/insurance/auto"]').first()).toBeAttached();
});

test("toggling a footer-only link off removes it from the footer", async ({
  page,
}) => {
  // "ศูนย์ลูกค้า" (customer) lives only in the footer services column.
  const customerInFooter = page.locator('footer a[href="/th/customer"]');

  await page.goto(p("/"));
  await expect(customerInFooter.first()).toBeAttached();

  await page.goto(p("/admin/content/navigation"));
  await page.getByRole("switch", { name: "ศูนย์ลูกค้า" }).click();

  await page.goto(p("/"));
  await expect(customerInFooter).toHaveCount(0);
});

test("toggling the renew action off removes it from the nav surfaces", async ({
  page,
}) => {
  // "ต่ออายุประกัน" (renew) renders as a right-side action in the mobile drawer.
  const renewInHeader = page.locator('header a[href*="/app/buy"]');

  await page.goto(p("/"));
  await expect(renewInHeader.first()).toBeAttached();

  await page.goto(p("/admin/content/navigation"));
  await page.getByRole("switch", { name: "ต่ออายุประกัน" }).click();

  await page.goto(p("/"));
  await expect(renewInHeader).toHaveCount(0);
});
