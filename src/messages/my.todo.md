# Burmese (my) — pending translations

`my.json` currently holds **Thai placeholder text** for every namespace EXCEPT
the `wallet.app` strings, which now hold the **real Burmese** seeded from the
original `wallet.jsx` `T.my` dict. Note `wallet.hero.*` is still a Thai
placeholder (the hero was Thai-only in the source), and three `wallet.app`
strings (`emergencySub`, `offlineInfo`, `natValue`) are intentionally Thai
because the original left them untranslated even in the Burmese view.

Never invent Burmese — replace placeholders with reviewed translations only.

## Status by namespace
Re-audited Phase 13 (final), after Phases 14–16 grew the catalog: of **2211 leaf
keys**, **18 are real Burmese** (all under `wallet.app`); the remaining **2153
are Thai placeholders**. Largest backlogs: `admin` ~716, `business` ~237, `agent`
~229, `auth` ~105, `worker` ~105, `home` ~99, `nav` ~90, `team` ~73, `agency`
~72, `customer` ~59, `individual` ~47, `app` ~45, `line` ~45, `learn` ~42,
`tracking` ~41, `public` ~39, `auto` ~38, `footer` ~21, `checkout` ~18,
`metadata` ~16. Full namespace list:
- [ ] common
- [ ] nav — incl. portal sidebar keys (dashboard…support) added as Thai placeholders in Phase 7; + Phase 14 admin nav keys (overview…config) added as Thai placeholders
- [ ] app — portal shell + Phase 13 additions (notFound, close, dismiss, toggleRow, selectPage)
- [ ] auth — Phase 8 auth/onboarding copy added as Thai placeholders
- [ ] footer
- [ ] home
- [ ] worker
- [ ] auto
- [ ] customer
- [ ] agency
- [ ] tracking
- [x] wallet — `wallet.app` = real Burmese (seeded from `T.my`); `wallet.hero` still placeholder
- [ ] line
- [ ] metadata
- [ ] business — Phase 9 portal copy (shared: common/statuses/table/claims/billing/documents/wallet/settings)
- [ ] individual — Phase 10 portal copy
- [ ] agent — Phase 11 portal copy (clients/leads/commissions/sales/quote)
- [ ] learn — Phase 12 acquisition landings
- [ ] checkout — Phase 12 quote→signup handoff
- [ ] team — Phase 11.5 agent-team / override copy
- [ ] crm — Phase 15 CRM ops core copy (nav + admin.ops/finance tickets/credit/debtors), Thai placeholders
- [ ] phase16 — Issuance/amendments/public token copy (admin.issuePolicy/issued/amendments, public.ticketCheck/staffVerify, business.issued), Thai placeholders
- [ ] phase17 — Conversion & Trust copy (conversion, promotions, reviewsPage, seo, admin.coupons/reviews/partners, nav.coupons/reviews/partners/promotions/allProducts/quickRenew), Thai placeholders
- [ ] phase20 — Customer Loyalty & Rewards copy (`loyalty` namespace incl. loyalty.admin.*, + nav.rewards/loyalty/loyaltyRules/loyaltyRewards/loyaltyRedeem), Thai placeholders
- [ ] about — About marketing pages copy (`about` namespace: main/why/partners/agent, + metadata.about/aboutWhy/aboutPartners/aboutAgent), Thai placeholders
