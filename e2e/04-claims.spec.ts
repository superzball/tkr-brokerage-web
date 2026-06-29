import { test, expect } from "@playwright/test";
import { p, loginAs, USERS, dismissCookieBanner } from "./helpers";

test.beforeEach(async ({ context, baseURL }) => {
  await dismissCookieBanner(context, baseURL!);
});

/**
 * Phase 13 — Critical flow #4: FILE A CLAIM → status tracker.
 *
 * Uses the individual portal, where the claimant is the logged-in user
 * (read-only), so the wizard only needs a policy + incident details.
 */

test("file a claim through the wizard, then open the status tracker", async ({
  page,
  context,
  baseURL,
}) => {
  await loginAs(context, USERS.individual, baseURL!);
  await page.goto(p("/app/claims"));

  // Open the new-claim wizard.
  await page.getByRole("button", { name: "เปิดเคลมใหม่" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();

  // Step 0 — pick a policy (claimant is prefilled read-only).
  await dialog.getByLabel("กรมธรรม์").selectOption({ index: 1 });
  await dialog.getByRole("button", { name: "ถัดไป" }).click();

  // Step 1 — incident details.
  await dialog.getByLabel("วันที่เกิดเหตุ").fill("2026-06-01");
  await dialog.getByLabel("จำนวนเงินที่เคลม (บาท)").fill("5000");
  await dialog.getByRole("button", { name: "ถัดไป" }).click();

  // Step 2 — evidence is optional.
  await dialog.getByRole("button", { name: "ถัดไป" }).click();

  // Step 3 — review & submit.
  await dialog.getByRole("button", { name: "ส่งเคลม" }).click();
  await expect(page.getByText("ส่งเคลมแล้ว (เดโม)")).toBeVisible();

  // Open an existing claim row → the status tracker timeline. The responsive
  // DataTable renders the value in both the desktop table and a mobile card, so
  // scope to the first match.
  await page.getByText("CLM-2026-08412").first().click();
  await expect(page.getByRole("heading", { name: "สถานะเคลม" })).toBeVisible();
});
