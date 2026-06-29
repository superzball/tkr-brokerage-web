import { test, expect, type Page } from "@playwright/test";
import { p, loginAs, USERS, dismissCookieBanner } from "./helpers";

test.beforeEach(async ({ context, baseURL }) => {
  await dismissCookieBanner(context, baseURL!);
});

/**
 * Phase 13 — Critical flow #3: BUY via a logged-in customer, and BUY via an
 * agent on-behalf. Logged-in users skip the guest phone-verify step, so the
 * channel choice (ซื้อเอง) leads straight to payment.
 */

/** Drive the shared WorkerFlow from the plan step through to success. */
async function completeWorkerPurchase(page: Page) {
  const next = page.getByRole("button", { name: "ถัดไป" });
  await next.click(); // plan → fill (sample worker is prefilled)
  await next.click(); // fill → review
  await next.click(); // review → pay

  // Channel choice — pick self-serve, then continue to payment.
  await expect(page.getByRole("heading", { name: "เลือกวิธีดำเนินการ" })).toBeVisible();
  await page.getByRole("button", { name: /ซื้อเอง/ }).click();
  await page.getByRole("button", { name: "ดำเนินการต่อ" }).click();

  // Authed buyer: no phone-verify wall — pay directly.
  await page.getByRole("button", { name: "ยืนยันการชำระเงินแล้ว" }).click();
  await expect(page.getByRole("heading", { name: "รับคำสั่งซื้อเรียบร้อย" })).toBeVisible();
}

test("logged-in business customer buys worker insurance", async ({ page, context, baseURL }) => {
  await loginAs(context, USERS.business, baseURL!);
  await page.goto(p("/app/buy"));
  await completeWorkerPurchase(page);
});

test("agent buys on behalf of a client and the sale is recorded", async ({ page, context, baseURL }) => {
  await loginAs(context, USERS.agent, baseURL!);
  await page.goto(p("/app/quote"));

  // Pick the client the quote is for (index 0 is the placeholder option).
  await page.getByLabel("ลูกค้า").selectOption({ index: 1 });
  await expect(page.getByText(/เสนอราคาให้/)).toBeVisible();

  await completeWorkerPurchase(page);

  // The on-behalf sale is logged to the agent's book (mock).
  await expect(page.getByText("บันทึกการขายแล้ว (เดโม)")).toBeVisible();
});
