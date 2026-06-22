# Lao (lo) — pending translations

`lo.json` currently holds **Thai placeholder text** for every namespace EXCEPT
the `wallet.app` strings, which now hold the **real Lao** seeded from the
original `wallet.jsx` `T.lo` dict. Note `wallet.hero.*` is still a Thai
placeholder (the hero was Thai-only in the source), and three `wallet.app`
strings (`emergencySub`, `offlineInfo`, `natValue`) are intentionally Thai
because the original left them untranslated even in the Lao view.

Never invent Lao — replace placeholders with reviewed translations only.

## Status by namespace
- [ ] common
- [ ] nav
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
