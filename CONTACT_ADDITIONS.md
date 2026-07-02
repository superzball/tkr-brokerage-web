# CONTACT INFO — single source for /contact, footer, LINE concierge

Real TKR contact channels. One config consumed everywhere (contact page, footer,
floating LINE CTA), so it's edited once.

## ⚠️ VERIFY BEFORE GO-LIVE
- **LINE id**: provided as `@trkbroker` (TRK), but email/Facebook/brand are all
  **TKR** (support@tkrbroker.com, /tkrbrokerages). Likely a transposition — confirm
  whether the real handle is `@tkrbroker` or `@trkbroker`. A wrong LINE id means
  customers can't add the account.

## DATA
```ts
export const contactInfo = {
  phone: '096-047-1919',
  phoneHref: 'tel:+66960471919',
  line: '@trkbroker',                       // VERIFY (see above)
  lineHref: 'https://line.me/R/ti/p/@trkbroker',   // update if id changes
  email: 'support@tkrbroker.com',
  emailHref: 'mailto:support@tkrbroker.com',
  facebook: 'https://www.facebook.com/tkrbrokerages',
  tiktok: 'https://www.tiktok.com/@tkrofficial_1',   // tracking params stripped
  address: 'เลขที่ 9/19 ซอยนวมินทร์ 36 ถนนนวมินทร์ แขวงคลองกุ่ม เขตบึงกุ่ม กรุงเทพมหานคร 10240',
  googleMap: 'https://maps.app.goo.gl/54JJ3SGvhCdmgubw8',
};
```
Note: the original address link (Bing) and TikTok URL carried tracking params
(fbclid / is_from_webapp) — stripped to clean canonical URLs above.

## USAGE
- /contact page: show all channels as tappable links (phone→tel:, email→mailto:,
  LINE→lineHref, FB/TikTok→new tab rel=noopener), address text + a "ดูแผนที่"
  link/embed to googleMap (open in new tab; if embedding a map, lazy-load it).
- Footer: phone, LINE, email, address (short), social icons (FB, TikTok, LINE).
- Floating LINE concierge CTA → lineHref.
- External links: target=_blank rel="noopener noreferrer".
- i18n: labels th+en; the values themselves are shared.

## GUARDRAILS
- Don't hardcode these in components — read from contactInfo so one edit updates
  all surfaces.
- Verify the LINE id (above) and that the google-maps short link resolves to the
  correct address before go-live.