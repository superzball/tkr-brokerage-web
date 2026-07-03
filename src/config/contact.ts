/**
 * Real TKR contact channels — single source for /contact, the footer and the
 * floating LINE CTA. Edit here once; never hardcode these in components.
 *
 * ⚠️ VERIFY BEFORE GO-LIVE: LINE id was provided as `@tkrbroker` (TKR) while
 * email/Facebook/brand are all TKR — likely a transposition. Confirm the real
 * handle (and that the google-maps short link resolves to the right address).
 */
export const contactInfo = {
  phone: "096-047-1919",
  phoneHref: "tel:+66960471919",
  line: "@tkrbroker", // VERIFY (see above)
  lineHref: "https://line.me/R/ti/p/@tkrbroker", // update if id changes
  email: "support@tkrbroker.com",
  emailHref: "mailto:support@tkrbroker.com",
  facebook: "https://www.facebook.com/tkrbrokerages",
  facebookLabel: "facebook.com/tkrbrokerages",
  tiktok: "https://www.tiktok.com/@tkrofficial_1", // tracking params stripped
  tiktokLabel: "@tkrofficial_1",
  address:
    "เลขที่ 9/19 ซอยนวมินทร์ 36 ถนนนวมินทร์ แขวงคลองกุ่ม เขตบึงกุ่ม กรุงเทพมหานคร 10240",
  /** condensed one-liner for the footer */
  addressShort: "9/19 ซ.นวมินทร์ 36 เขตบึงกุ่ม กรุงเทพฯ 10240",
  googleMap: "https://maps.app.goo.gl/54JJ3SGvhCdmgubw8",
} as const;
