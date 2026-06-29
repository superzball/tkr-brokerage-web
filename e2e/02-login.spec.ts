import { test, expect } from "@playwright/test";
import { p, fillOtp } from "./helpers";

/**
 * Phase 13 — Critical flow #2: LOGIN → correct portal per role.
 *
 * Covers both methods: phone+OTP and email+password, and asserts the role's
 * landing redirect (customer roles → /app/dashboard, admin → /admin).
 */

test.beforeEach(async ({ context }) => {
  await context.clearCookies();
});

test("email+password login lands a customer on the app dashboard", async ({ page }) => {
  await page.goto(p("/login"));
  await page.getByRole("tab", { name: "อีเมล" }).click();
  await page.getByPlaceholder("business@tkr.demo").fill("business@tkr.demo");
  await page.getByPlaceholder("demo1234").fill("demo1234");
  await page.getByRole("button", { name: "เข้าสู่ระบบ" }).click();
  await expect(page).toHaveURL(/\/th\/app\/dashboard/);
});

test("email+password login lands admin on the back-office console", async ({ page }) => {
  await page.goto(p("/login"));
  await page.getByRole("tab", { name: "อีเมล" }).click();
  await page.getByPlaceholder("business@tkr.demo").fill("admin@tkr.demo");
  await page.getByPlaceholder("demo1234").fill("demo1234");
  await page.getByRole("button", { name: "เข้าสู่ระบบ" }).click();
  await expect(page).toHaveURL(/\/th\/admin(\/|$)/);
});

test("phone+OTP login routes through verify-otp to the right portal", async ({ page }) => {
  await page.goto(p("/login"));
  // Phone tab is the default/primary method.
  await page.locator('input[type="tel"]').fill("0810000001"); // business demo phone
  await page.getByRole("button", { name: "ส่งรหัส OTP" }).click();

  await expect(page).toHaveURL(/\/th\/verify-otp/);
  await expect(page.getByRole("heading", { name: "ยืนยันรหัส OTP" })).toBeVisible();

  await fillOtp(page);
  await page.getByRole("button", { name: "ยืนยัน", exact: true }).click();

  await expect(page).toHaveURL(/\/th\/app\/dashboard/);
});
