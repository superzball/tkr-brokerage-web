# Burmese (my) — translation status

All Thai placeholder strings have been replaced with **Burmese (Myanmar)**
translations (Phase 15 bulk pass). Source of truth was `th.json`. The file is
valid JSON and its key set / structure is **identical to `th.json`** (3412 leaf
keys, verified).

> ⚠️ **These are AI/machine translations.** Every namespace below is translated
> but **unreviewed**. See "Needs native-speaker review" — insurance, claims,
> legal, consent (PDPA), and payment/commission copy MUST be reviewed by a native
> Burmese speaker (ideally with insurance domain knowledge) before production.

## Intentionally still Thai (matches source design — do NOT translate blindly)
- `wallet.app.emergencySub`, `wallet.app.offlineInfo` — left Thai in the original
  source even in the Burmese view.
- `worker.bulk.fileName`, `worker.review.company` — Thai sample/demo data (a Thai
  employer's file/company name).
- Brand/Latin terms kept as-is: TKR, LINE, OTP, PDPA, QR, KYC, insurer names,
  tier names (Silver/Gold/Platinum/Diamond), `฿` amounts, sample plate `1กข 1234`,
  sample person names, order IDs. BE year values (2567–2569) kept unchanged.
- `wallet.app.natValue` = "မြန်မာ" (already Burmese).

## Status by namespace — all translated (AI), pending native review
- [x] common, topnav, homeFaq, nav, app, auth, footer, home, worker, auto,
      customer, agency, tracking, line, metadata
- [x] wallet — `wallet.app` real Burmese (seeded); `wallet.hero` now translated
- [x] business, individual, agent, learn, checkout, team, guest
- [x] public, conversion, tax, promotions, reviewsPage, seo, articles, help, contact
- [x] loyalty, about, consent, legal
- [x] admin (all sub-namespaces: dashboard…legal, issuance/amendments/coupons/reviews/partners)

## Needs native-speaker review (flagged by translators)
**MANDATORY (legal/regulatory):**
- `legal` (privacy/terms/cookies/dataRequest) + `consent` (PDPA capture, cookie
  banner) + `admin.legal` — highest risk. Confirm PDPA terms, legal-basis wording,
  DSAR/data-subject terms, limitation-of-liability. TODO markers preserved in
  `legal.reviewTodo`, `legal.privacy.sections`, `legal.terms.sections`.

**High (insurance / claims / payment / commission accuracy):**
- worker, auto, customer, business, individual, checkout, agent, team, learn,
  tracking, agency, loyalty, public, tax, conversion, about, help, contact, line, auth
- admin: orders/payments/credit/debtors/policyTickets/claims/payouts/commissions/
  approvals/issuePolicy/amendments

**Cross-cutting consistency (needs a glossary pass):**
- "กรมธรรม์" (policy) rendered inconsistently across namespaces (အာမခံစာချုပ် /
  ပေါ်လစီ / အာမခံ) — pick one standard term.
- "เคลม" (claim) — mixes လျော်ကြေး / နစ်နာကြေး / descriptive forms.
- "override" (commission override) kept as the English term in several places.
- "คปภ." standardized to "OIC" during QA.
- Transliterated Thai sample person names are phonetic approximations.
- BE years (2567–2569) kept literally; confirm presentation convention.

## TODO — Home banner carousel (HOME_BANNER_ADDITIONS) — NOT yet translated
Added 2026-06-30. These keys currently hold **English placeholder** values and
need native translation/review:
- `nav.banners`
- `home.banners.*` (region, prev, next, goToSlide, slideOf, pause, play)
- `admin.banners.*` (title, desc, placeholderBanner, empty, add, count, live,
  scheduled, inactive, window, toggle, delete, created, deleted, activated,
  deactivated, sampleTitle, sampleCta)
Note: `homeBanners` slide copy itself is CMS content (seed.ts), not message keys.
