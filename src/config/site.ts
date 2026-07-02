/** Brand-level constants (non-localized). User-facing copy lives in messages. */
export const site = {
  name: "TKR",
  logos: {
    /** color mark — light surfaces (navbar) */
    color: "/logo-tkr.png",
    /** white mark — reserved for dark surfaces */
    white: "/logo-tkr-white.png",
    /** mono-white mark — footer on dark */
    monoWhite: "/logo-tkr-mono-white.png",
  },
  // Social / contact links live in @/config/contact (contactInfo) — real
  // channels, single source for /contact, footer and the LINE CTA.
} as const;

/**
 * Environment facts for robots/sitemap/OG URLs. Both values come from
 * apphosting.yaml (per backend/branch):
 *  - NEXT_PUBLIC_SITE_URL — canonical origin of THIS deployment, no trailing
 *    slash (UAT: the *.hosted.app domain; prod: the real domain).
 *  - NEXT_PUBLIC_SITE_ENV — "production" | "uat". Anything other than
 *    "production" (including unset, i.e. local dev) is non-indexable, so a
 *    misconfigured env can never expose staging to crawlers — worst case
 *    production blocks itself, which is loud and quickly noticed, rather
 *    than UAT being silently indexed.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.tkrbroker.com"
).replace(/\/$/, "");

export const IS_INDEXABLE = process.env.NEXT_PUBLIC_SITE_ENV === "production";
