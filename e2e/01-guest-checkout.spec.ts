import { test, expect, type Page } from "@playwright/test";
import { p, fillOtp, SESSION_COOKIE, dismissCookieBanner } from "./helpers";

/**
 * Phase 13 — Critical flow #1: GUEST CHECKOUT (not logged in).
 *
 * ซื้อเอง → phone-verify step ("ยืนยันเบอร์เพื่อรับกรมธรรม์") → OTP 123456 →
 * silent guest account (findOrCreateGuestByPhone) → payment → success.
 *
 * The phone+OTP step MUST be present before payment — this is the regression
 * this file guards. Crucially that must hold even on a REPEAT visit that still
 * carries the guest session cookie from a prior checkout: a guest is NOT a full
 * account, so it must verify/resume before payment rather than skip straight to
 * it. Both the WorkerFlow path and the /app/checkout path are covered.
 */

const PAY_CONFIRM = "ยืนยันการชำระเงินแล้ว";
const VERIFY_TITLE = "ยืนยันเบอร์เพื่อรับกรมธรรม์";

/** Plan → fill → review → pay (the sample worker is prefilled). */
async function advanceToPayStep(page: Page) {
  const next = page.getByRole("button", { name: "ถัดไป" });
  await next.click(); // plan → fill
  await next.click(); // fill → review
  await next.click(); // review → pay
}

/** On the pay step: choose ซื้อเอง (self-serve) and continue. */
async function chooseSelfServe(page: Page) {
  await expect(page.getByRole("heading", { name: "เลือกวิธีดำเนินการ" })).toBeVisible();
  await page.getByRole("button", { name: /ซื้อเอง/ }).click();
  await page.getByRole("button", { name: "ดำเนินการต่อ" }).click();
}

/** Phone + PDPA → OTP → verify. Leaves the flow on the unlocked payment panel. */
async function verifyGuestPhone(page: Page, phone: string) {
  await expect(page.getByText(VERIFY_TITLE)).toBeVisible();
  await page.getByRole("checkbox").first().check(); // PDPA (required)
  await page.getByPlaceholder("เช่น 0812345678").fill(phone);
  await page.getByRole("button", { name: "ส่งรหัส OTP" }).click();
  await expect(page.getByText("ยืนยันรหัส OTP")).toBeVisible();
  await fillOtp(page);
  await page.getByRole("button", { name: "ยืนยัน", exact: true }).click();
}

test("guest checkout: ซื้อเอง → phone-verify → OTP → guest account → payment → success", async ({
  page,
  context,
  baseURL,
}) => {
  await context.clearCookies(); // truly not logged in
  await dismissCookieBanner(context, baseURL!); // bottom banner intercepts the pay button
  await page.goto(p("/worker-insurance"));

  await advanceToPayStep(page);

  // Channel choice first; payment must NOT be reachable yet.
  await expect(page.getByRole("heading", { name: "เลือกวิธีดำเนินการ" })).toBeVisible();
  await expect(page.getByRole("button", { name: PAY_CONFIRM })).toHaveCount(0);
  await chooseSelfServe(page);

  // The phone-verify step renders, and payment is still NOT available.
  await expect(page.getByText(VERIFY_TITLE)).toBeVisible();
  await expect(page.getByRole("button", { name: PAY_CONFIRM })).toHaveCount(0);

  await verifyGuestPhone(page, "0823334444");

  // OTP verified → silent guest session started → payment now unlocked.
  await expect(page.getByRole("button", { name: PAY_CONFIRM })).toBeVisible();
  const cookies = await context.cookies();
  expect(cookies.find((c) => c.name === SESSION_COOKIE)?.value).toBeTruthy();

  // Pay → success.
  await page.getByRole("button", { name: PAY_CONFIRM }).click();
  await expect(page.getByRole("heading", { name: "รับคำสั่งซื้อเรียบร้อย" })).toBeVisible();

  // PDPA service consent captured against the phone (Phase 13 #7).
  const records = await page.evaluate(() => {
    const raw = localStorage.getItem("tkr_consent_records");
    return raw ? (JSON.parse(raw) as Array<Record<string, unknown>>) : [];
  });
  expect(
    records.some(
      (r) =>
        r.type === "pdpa_service" &&
        r.granted === true &&
        r.source === "guest_checkout" &&
        String(r.subjectId).replace(/[\s-]/g, "") === "0823334444",
    ),
  ).toBe(true);
});

test("REGRESSION: a repeat visit carrying a guest session cookie still shows phone-verify (not straight-to-payment)", async ({
  page,
  context,
  baseURL,
}) => {
  // Phase 1 — seed a real guest session: verify a phone once (creates the
  // u_guest_* account server-side and sets the tkr_session cookie).
  await context.clearCookies();
  await dismissCookieBanner(context, baseURL!);
  await page.goto(p("/worker-insurance"));
  await advanceToPayStep(page);
  await chooseSelfServe(page);
  await verifyGuestPhone(page, "0823335555");
  await expect(page.getByRole("button", { name: PAY_CONFIRM })).toBeVisible();

  // Confirm the guest cookie is now present (the lingering-session scenario).
  const cookies = await context.cookies();
  expect(cookies.find((c) => c.name === SESSION_COOKIE)?.value).toContain("guest");

  // Phase 2 — REPEAT visit with that cookie still set. A guest is not a full
  // account, so the verify step must reappear; payment must NOT be reachable
  // without re-verifying/resuming the phone.
  await page.goto(p("/worker-insurance"));
  await advanceToPayStep(page);
  await chooseSelfServe(page);

  await expect(page.getByText(VERIFY_TITLE)).toBeVisible();
  await expect(page.getByRole("button", { name: PAY_CONFIRM })).toHaveCount(0);

  // And re-verifying resumes (no forced re-registration) → payment unlocks.
  await verifyGuestPhone(page, "0823335555");
  await expect(page.getByRole("button", { name: PAY_CONFIRM })).toBeVisible();
});

test("REGRESSION: /app/checkout guest path also requires phone-verify before payment", async ({
  page,
  context,
  baseURL,
}) => {
  const CHECKOUT_CONFIRM = "ยืนยันและชำระเงิน";

  // Seed a guest session via the worker flow (creates the guest + cookie).
  await context.clearCookies();
  await dismissCookieBanner(context, baseURL!);
  await page.goto(p("/worker-insurance"));
  await advanceToPayStep(page);
  await chooseSelfServe(page);
  await verifyGuestPhone(page, "0823336666");
  await expect(page.getByRole("button", { name: PAY_CONFIRM })).toBeVisible();

  // Drop an in-progress quote so /app/checkout renders the checkout (not empty).
  const quote = encodeURIComponent(
    JSON.stringify({ product: "worker", planLabel: "แผนมาตรฐาน", count: 1, total: 1290 }),
  );
  await context.addCookies([
    { name: "tkr_pending_quote", value: quote, url: new URL(page.url()).origin },
  ]);

  await page.goto(p("/app/checkout"));
  await expect(page.getByRole("heading", { name: "สรุปคำสั่งซื้อ" })).toBeVisible();

  // ซื้อเอง → guest must verify here too; payment confirm is gated behind it.
  await page.getByRole("button", { name: /ซื้อเอง/ }).click();
  await page.getByRole("button", { name: "ดำเนินการต่อ" }).click();
  await expect(page.getByText(VERIFY_TITLE)).toBeVisible();
  await expect(page.getByRole("button", { name: CHECKOUT_CONFIRM })).toHaveCount(0);
});
