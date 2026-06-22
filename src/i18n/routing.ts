import { defineRouting } from "next-intl/routing";

/**
 * Single source of truth for locales across the whole app.
 * Adding/removing a locale = edit this array (and add the matching
 * src/messages/<locale>.json). Everything else derives from here.
 */
export const locales = ["th", "en", "my", "lo"] as const;
export const defaultLocale = "th" satisfies (typeof locales)[number];

export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale,
  // Always show the locale prefix, including the default (`/th/...`).
  localePrefix: "always",
});
