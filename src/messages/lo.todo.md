# Lao (lo) — pending translations

`lo.json` currently holds **Thai placeholder text** for every namespace EXCEPT
the `wallet.app` strings, which now hold the **real Lao** seeded from the
original `wallet.jsx` `T.lo` dict. Note `wallet.hero.*` is still a Thai
placeholder (the hero was Thai-only in the source), and three `wallet.app`
strings (`emergencySub`, `offlineInfo`, `natValue`) are intentionally Thai
because the original left them untranslated even in the Lao view.

Never invent Lao — replace placeholders with reviewed translations only.

## Status by namespace
Audited Phase 13: of 1542 leaf keys, **17 are real Lao** (all under
`wallet.app`); the remaining **1525 are Thai placeholders**. Full namespace list:
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
- [x] wallet — `wallet.app` = real Lao (seeded from `T.lo`); `wallet.hero` still placeholder
- [ ] line
- [ ] metadata
- [ ] business — Phase 9 portal copy (shared: common/statuses/table/claims/billing/documents/wallet/settings)
- [ ] individual — Phase 10 portal copy
- [ ] agent — Phase 11 portal copy (clients/leads/commissions/sales/quote)
- [ ] learn — Phase 12 acquisition landings
- [ ] checkout — Phase 12 quote→signup handoff
- [ ] team — Phase 11.5 agent-team / override copy
