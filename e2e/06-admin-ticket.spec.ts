import { test, expect } from "@playwright/test";
import { p, loginAs, USERS, dismissCookieBanner } from "./helpers";

test.beforeEach(async ({ context, baseURL }) => {
  await dismissCookieBanner(context, baseURL!);
});

/**
 * Phase 13 — Critical flow #6 (most complex): admin creates a policy ticket →
 * customer credit is DEBITED → admin records a payment (credit returned) →
 * admin ISSUES the policy. CRM state lives in localStorage, so the whole chain
 * runs in one browser context.
 */

test("admin: create ticket → credit debited → record payment → issue policy", async ({
  page,
  context,
  baseURL,
}) => {
  await loginAs(context, USERS.admin, baseURL!);

  // --- Create a ticket (defaults: MOU · 1 ปี · 10 คน) ---
  await page.goto(p("/admin/ops/tickets"));
  await page.getByRole("button", { name: "สร้างตั๋วประกัน" }).click();
  const createModal = page.getByRole("dialog");
  await expect(createModal).toBeVisible();
  await createModal.getByRole("button", { name: "สร้างตั๋ว", exact: true }).click();

  // Creating a ticket debits the customer's credit wallet.
  await expect(page.getByText(/ตัดเครดิต/)).toBeVisible();
  // Redirected to the new ticket's detail page.
  await expect(page).toHaveURL(/\/admin\/ops\/tickets\/[^/]+$/);
  const detailUrl = page.url();

  // --- Confirm the debit landed in the credit ledger ---
  await page.goto(p("/admin/finance/credit"));
  await expect(page.getByText(/ซื้อตั๋วประกัน/).first()).toBeVisible();

  // --- Record a payment (returns the credit) ---
  await page.goto(detailUrl);
  await page.getByRole("button", { name: "บันทึกการชำระเงิน" }).click();
  const payModal = page.getByRole("dialog");
  await expect(payModal).toBeVisible();
  // Amount is prefilled with the outstanding balance — submit a full payment.
  await payModal.getByRole("button", { name: "บันทึก", exact: true }).click();
  // Fully paid → the record-payment button becomes the disabled "paid" state.
  await expect(page.getByText("ชำระครบแล้ว")).toBeVisible();

  // --- Issue the policies (bulk, 1 per insured) ---
  await page.getByRole("button", { name: "ออกกรมธรรม์", exact: true }).click();
  const issueModal = page.getByRole("dialog");
  await expect(issueModal).toBeVisible();
  await issueModal.getByRole("button", { name: /^ออก \d+ ฉบับ$/ }).click();

  // Issued count updates on the ticket (e.g. "ออกแล้ว 10 ฉบับ …").
  await expect(page.getByText(/ออกแล้ว\s*[1-9]\d*\s*ฉบับ/)).toBeVisible();
});
