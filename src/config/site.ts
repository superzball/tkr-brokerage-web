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
