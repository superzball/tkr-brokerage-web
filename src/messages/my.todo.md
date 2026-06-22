# Burmese (my) — pending translations

`my.json` currently holds **Thai placeholder text** for every namespace EXCEPT
the `wallet.app` strings, which now hold the **real Burmese** seeded from the
original `wallet.jsx` `T.my` dict. Note `wallet.hero.*` is still a Thai
placeholder (the hero was Thai-only in the source), and three `wallet.app`
strings (`emergencySub`, `offlineInfo`, `natValue`) are intentionally Thai
because the original left them untranslated even in the Burmese view.

Never invent Burmese — replace placeholders with reviewed translations only.

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
- [x] wallet — `wallet.app` = real Burmese (seeded from `T.my`); `wallet.hero` still placeholder
- [ ] line
- [ ] metadata
