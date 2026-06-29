import { defineConfig, devices } from "@playwright/test";

/**
 * E2E config for the Phase 13 critical-flow regression guard.
 *
 * The app is a mock-only Next.js build whose data layer is an in-memory store
 * mutated by some flows (guest accounts, tickets, credit ledger). That shared
 * server state makes parallel runs non-deterministic, so we pin `workers: 1`
 * and run the specs serially against a single dev server.
 *
 * Node 22+ is required (Next 16). In CI, select it before invoking Playwright.
 */
// Default to 3000 so a dev server already running locally is reused (Next 16's
// dev server is single-instance per project dir — a second one won't start).
const PORT = Number(process.env.E2E_PORT ?? 3000);
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  // The mock store is shared across the single dev server — keep tests serial.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: BASE_URL,
    locale: "th-TH",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    // Dev server (Turbopack). Reused locally if one is already up.
    command: `pnpm dev --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    // First Turbopack compile of a route can be slow.
    timeout: 180_000,
    stdout: "pipe",
    stderr: "pipe",
  },
});
