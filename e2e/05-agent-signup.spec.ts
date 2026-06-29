import { test, expect } from "@playwright/test";
import { p, dismissCookieBanner } from "./helpers";

test.beforeEach(async ({ context, baseURL }) => {
  await dismissCookieBanner(context, baseURL!);
});

/**
 * Phase 13 — Critical flow #5: AGENT SIGNUP (license gate) + override visible.
 *
 * Agent onboarding collects an OIC broker-license number (the license-gate
 * step), and the agency portal surfaces multi-tier override income. We use the
 * email signup path (no OTP) to reach onboarding, then assert both.
 */

test("agent signup reaches the license step, then override income is visible", async ({
  page,
}) => {
  await page.goto(p("/signup?role=agent"));

  // Details step (email method skips OTP → straight to onboarding).
  await page.getByRole("tab", { name: "สมัครด้วยอีเมล" }).click();
  await page.getByLabel("ชื่อ-นามสกุล").fill("คุณทดสอบ ตัวแทน");
  // Target inputs by type — "อีเมล" also appears in the marketing-consent label.
  await page.locator('input[type="email"]').fill("newagent@tkr.demo");
  await page.locator('input[type="password"]').fill("demo1234");
  await page.getByRole("checkbox").first().check(); // PDPA (required)
  // exact — the social buttons read "ดำเนินการต่อด้วย LINE/Facebook/…".
  await page.getByRole("button", { name: "ดำเนินการต่อ", exact: true }).click();

  // --- License gate: agent onboarding requires the OIC license number ---
  await expect(page).toHaveURL(/\/th\/onboarding\/agent/);
  const license = page.getByLabel("เลขที่ใบอนุญาตนายหน้า");
  await expect(license).toBeVisible();

  await page.getByLabel("ชื่อ-นามสกุล").fill("คุณทดสอบ ตัวแทน");
  await license.fill("บ.0099/2569");
  await page.getByLabel("เบอร์โทรศัพท์").fill("0891112222");
  await page.getByRole("button", { name: "เสร็จสิ้น" }).click();

  await expect(page.getByRole("heading", { name: "ยินดีต้อนรับสู่ทีมตัวแทน" })).toBeVisible();
  await page.getByRole("button", { name: "ไปยังหน้าหลัก" }).click();
  await expect(page).toHaveURL(/\/th\/app\/dashboard/);

  // Override income is visible in the agency team portal.
  await page.goto(p("/app/team/income"));
  await expect(page.getByRole("heading", { name: "รายได้จากทีม" })).toBeVisible();
  await expect(page.getByText("override รวม (งวดนี้)")).toBeVisible();
});
