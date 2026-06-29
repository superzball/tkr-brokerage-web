# TKR Platform (Next.js 16)

Thai insurance-brokerage platform — marketing site + mock-only product portals.
Next.js 16 (App Router, Turbopack), React 19, TypeScript strict, Tailwind v4,
next-intl (`th` default · `en` · `my` · `lo`).

## Run

Requires **Node ≥ 20.9** (use Node 22). The shell default may be Node 18 — run
`nvm use` (`.nvmrc` pins 22) first. Package manager is **pnpm**.

```bash
pnpm dev        # Turbopack dev server (http://localhost:3000)
pnpm build      # production build
pnpm typecheck  # tsc --noEmit
pnpm lint
```

> If `pnpm dev` 404s every route, a previous `pnpm build` left a production
> `.next/`. Fix: `rm -rf .next` then `pnpm dev`.

## E2E tests — Phase 13 critical-flow regression guard

Playwright specs in [e2e/](e2e/) lock the seven Phase-13 critical flows so they
can't silently break (esp. the guest-checkout **phone+OTP-before-payment** step):

```bash
pnpm test:e2e        # run all 7 flows (headless, Chromium)
pnpm test:e2e:ui     # interactive UI mode
pnpm exec playwright test e2e/01-guest-checkout.spec.ts   # one flow
```

- **Server.** [playwright.config.ts](playwright.config.ts) starts `pnpm dev` on
  port 3000 and **reuses an already-running dev server** locally (Next 16's dev
  server is single-instance per dir — a second one won't start). CI spawns its
  own. Override the port with `E2E_PORT`.
- **Serial by design.** Some flows mutate shared mock state (the server's
  in-memory guest store; localStorage CRM ledger), so `workers: 1`.
- **Auth shortcut.** Non-login flows plant the `tkr_session` cookie (a bare
  `User.id`) via `loginAs()` in [e2e/helpers.ts](e2e/helpers.ts) instead of
  driving the login UI.
- **Selectors** are Thai user-facing copy + ARIA roles (no `data-testid` exists);
  a deliberate copy change to `messages/th.json` may require updating a spec.
- **Cookie banner.** The fixed-bottom consent banner intercepts clicks near the
  page bottom, so interactive specs call `dismissCookieBanner()` (plants a choice
  cookie) — the exception is `07-consent`, which exercises the banner itself.
- **Guest gate.** `01-guest-checkout` includes two regression cases that fail if
  a lingering guest session cookie short-circuits the phone-verify step (the
  WorkerFlow and `/app/checkout` paths) — a guest is not a full account and must
  verify/resume before payment.
- **Node 22+** required (Next 16). In CI, select it before `pnpm test:e2e`.

The 7 specs map 1:1 to the Phase-13 list: `01` guest checkout, `02` login
(phone-OTP + email → portal per role), `03` buy (logged-in customer + agent
on-behalf), `04` file-a-claim → status tracker, `05` agent signup license-gate +
override visible, `06` admin ticket → credit debit → payment → issue, `07`
cookie + PDPA consent capture.

## Architecture

```
src/app/[locale]/
├── layout.tsx              # root: <html>, fonts, NextIntlClientProvider (no chrome)
├── (marketing)/            # public site — Navbar + Footer shell
│   ├── layout.tsx
│   ├── page.tsx            # /            (home)
│   ├── worker-insurance/ auto/ customer/ agency/ wallet/ line/ tracking/
│   └── login/page.tsx      # /login       (placeholder; full auth = Phase 8)
├── (auth)/                 # login / signup / OTP / onboarding — focused shell
├── (admin)/                # back-office console — Sidebar (portalNav.admin) under /admin/*
│   └── layout.tsx          # reads session, gates by staffRole
├── (public)/               # UNauthenticated token pages — brand-header shell, no app chrome
│   └── ticket/check/[ticketNumber]/ · ticket/staff-verify/[ticketNumber]/[token]/
└── (app)/                  # authenticated portals — Sidebar + TopBar shell
    ├── layout.tsx          # reads session, redirects anon → /login
    └── app/<route>/page.tsx
```

Route groups `(marketing)` / `(app)` only pick the layout shell — they add
nothing to the URL. The portal lives under the literal `app/` segment, so every
authenticated screen is `/{locale}/app/*`.

### Roles, URL scheme & landing

Three roles (`business` · `individual` · `agent`), one shared URL space under
`/app/*`. A user has exactly one role; the **Sidebar renders `portalNav[role]`**
([src/config/portal-nav.ts](src/config/portal-nav.ts) — the locked IA). After
sign-in every role lands at **`/app/dashboard`**, which renders role-specific
content. Routes a role's sidebar doesn't list are blocked (403 via `roleCanAccess`).

### Mock auth (no backend)

[src/lib/auth/](src/lib/auth/) — cookie session storing a `User.id`:
`signInWithPassword` · `requestOtp`/`verifyOtp` · `signInSocial` · `signInAsRole`
· `signOut` (server actions), `getSession()` (server), `useSession()` (client).
The proxy ([src/proxy.ts](src/proxy.ts)) runs locale routing, then bounces
anonymous `/app/*` hits to `/login`.

**Auth screens** live in the `(auth)` route group ([src/app/[locale]/(auth)/](src/app/[locale]/(auth)/),
forms in [src/components/auth/](src/components/auth/)): `/login` (phone+OTP
primary tab / email+password / 4 social buttons), `/signup` (role cards →
phone-first form), `/verify-otp` (6-digit, resend timer — shared by phone login
& signup), `/forgot-password`, `/reset-password`, and `/onboarding/{business,
individual,agent}` (Stepper wizards; "done" creates the session). Phone login
and social/demo all funnel through `startSession` → `landingPath(role)`.

Demo accounts (password `demo1234`, OTP `123456`):

| email | phone | role |
|---|---|---|
| business@tkr.demo | 081-000-0001 | business |
| me@tkr.demo | 081-000-0002 | individual |
| agent@tkr.demo | 081-000-0003 | agent |

### Mock data

[src/lib/mock/seed.ts](src/lib/mock/seed.ts) — typed seed (policies, workers,
claims, invoices, documents, clients, commissions, leads, notifications) + query
helpers (`getPolicies(userId)`, `businessStats(userId)`, …). **Screens call the
helpers, never the raw arrays**, so a real API can replace them later. Entity
types: [src/types/portal.ts](src/types/portal.ts).

### App-shell components

[src/components/app/](src/components/app/): `AppShell`, `Sidebar`, `TopBar`,
`PageHeader`, `StatCard`, `DataTable`, `FilterBar`, `EmptyState`, `Skeleton`,
`StatusBadge`, `Tabs`, `Modal`, `Drawer`, `toast` (`ToastProvider`/`useToast`),
and the form set in [form.tsx](src/components/app/form.tsx)
(`Field`/`Input`/`Select`/`DatePicker`/`FileUpload`). They reuse the existing
theme + `ui/` primitives — don't introduce a new design language.

## How to…

**…add a portal screen.** Add the route to the relevant role(s) in
`portalNav[role]` (key = i18n key under the `nav` namespace, href = `/app/<seg>`,
icon = a lucide name registered in [NavIcon.tsx](src/components/app/NavIcon.tsx)).
Add the label to `nav` in `messages/{th,en}.json` (my/lo = Thai placeholder +
mark in the `*.todo.md`). Create `app/[locale]/(app)/app/<seg>/page.tsx` (copy an
existing one); guard with `roleCanAccess` or wrap in `PortalPlaceholder`.

**…add a nav item / section.** Edit `portalNav` only — the Sidebar derives
sections + active state from it. A section gets a heading by giving the
`NavSection` a `key` (also a `nav`-namespace message key).

**…add a role.** Extend the `Role` union in `src/types/portal.ts`, add its
`portalNav[role]` entry + a demo user in `seed.ts`, and a dashboard branch in
`app/[locale]/(app)/app/dashboard/page.tsx`.

**…add a locale / message key.** Locales live only in
[src/i18n/routing.ts](src/i18n/routing.ts). `th.json` is the typed source of
truth (see [src/global.d.ts](src/global.d.ts)); add keys there + `en`, and Thai
placeholders for `my`/`lo` (never invent Burmese/Lao — track in `*.todo.md`).

**…add a CRM mutation (mock, Phase 15).** Server admin pages pass *seed* arrays
(`getTickets`, `getCreditLedger`, `getCrmPayments`) to a client component, which
merges client-only changes from
[src/lib/mock/local-crm.ts](src/lib/mock/local-crm.ts) on mount (`mergeTickets`
/ `mergeLedger` / `mergePayments`) — the same swap-ready pattern as
`local-admin.ts`. The credit **wallet + ledger are internal-only**: render them
only under `/admin/finance/*`, never in an `/app/*` customer portal. The ledger
is append-only — a ticket-create writes a `debit`, a payment writes a `credit`,
`balanceAfter` is computed from the previous balance, and an over-payment guard
keeps `paidAmount ≤ totalPrice`. Worker pricing is config-driven
(`pricingTiers` + `ticketTotal()`), never hardcoded.

**…issue policies / amendments (mock, Phase 16).** "Issue Policy" on a ticket
detail bulk-mints `IssuedPolicy` rows (one per insured) via `addIssuedPolicies`,
stamps `ticket.issuedCount`, and writes an audit entry; the report at
`/admin/ops/issued` (`IssuedReportClient`) groups by ticket, offers page sizes
25/50/100/200, and a **mocked async CSV export** (idle → preparing → ready →
download) built with [src/lib/csv.ts](src/lib/csv.ts) (`toCsv`/`downloadCsv`).
Issued policies surface read-only in the customer portal via
`IssuedPoliciesReadonly` on `/app/policies`. Amendment tickets
(`/admin/ops/amendments`, `AmendmentsClient`) are full CRUD over
`local-crm.ts` (`addAmendment`/`patchAmendment`/`deleteAmendment` +
`mergeAmendments`). Every issue/amend action writes to `/admin/audit`.

**…add a conversion/trust piece (Phase 17).** Reusable D2C building blocks live
in [src/components/conversion/](src/components/conversion): `TrustBadge`
(privacy-first "see a price with no personal data" badge — drop near every quote
entry), `ChannelChoice` (the non-negotiable ซื้อเอง / ให้ตัวแทนช่วย step — `onSelf`
continues the self-serve flow, the agent path is self-contained; **never remove
it**), `CouponInstallment` (apply-coupon via `applyCoupon` + 0% installment
selector, used in `PayStep` + `CheckoutClient`), `CompareTable` (reusable
multi-insurer comparison — feed it `comparePlansFor(product, base)` from
[src/config/conversion.ts](src/config/conversion.ts)), `Glossary`
(`PlainLanguageProvider`/`GlossarySection` for the "อ่านแบบเข้าใจง่าย" toggle +
jargon tooltips, copy from `glossary` seed), `Reviews` + `TrustCredentials`
(social proof + OIC/partner wall — **only real signals; the awards slot stays
empty**), `LineChatWidget` (floating 24/7 LINE CTA in the marketing layout), and
`QuickRenew`. Coupons/reviews/partners are managed under `/admin/content/*`
(perm `content`). Sample reviews + `trustStats` are **placeholders** — never
present them as real customer quotes or fabricated awards.

**…add an SEO landing page (Phase 17).** Flagship lines stay in
`LEARN_PRODUCTS`; expanded personal-lines sub-products are config rows in
`SEO_LANDINGS` ([src/config/conversion.ts](src/config/conversion.ts)) with copy
under the `seo.items.<slug>` namespace. The single `/insurance/[product]` route
renders `ProductLanding` for flagship keys and the lighter `SubLanding` for sub
slugs; `/insurance` is the taxonomy index. Add a row + its `seo.items` copy and
it's picked up by `generateStaticParams` automatically.

**…add a public (unauthenticated) page.** Put it in the `(public)` route group.
The proxy only guards `/app/*` and `/admin/*`, so `/{locale}/<anything-else>` is
reachable without a session — the group just supplies a brand-header shell. The
two token pages resolve the seed ticket server-side (`getTicketByNumber`) and
merge locally-created tickets client-side; the status check is gated by the
6-digit `customerCode` (rate-limited) and the staff-verify form validates the
URL `token` against `ticket.publicToken` (mock signed/expiring) before letting
the underwriter patch the ticket's thip fields. Never render the internal credit
wallet on a public or `/app/*` page.

**…add a decision tool / payment option (Phase 18).** More reusable conversion
pieces live in [src/components/conversion/](src/components/conversion):
`FitRecommender` (guided Q&A from `getFitQuestions`, filtered to the product's
plan cards, → a recommended plan), `ProductPlans` (the upgraded PlanCard grid
from `getPlanCards(product)` — highlights, starting premium, coupon-on-card,
badge, a session **shortlist** with a side-by-side compare modal, and a detail
modal; owns the shortlist state shared with the recommender), and
`PaymentMethods` (checkout payment experience from `getCheckoutOptions()` +
the `instantCoverage` note). `ProductPlans` mounts in `ProductLanding`'s
`#plans` section and renders only for products that have plan cards
(worker/auto). The checkout (`CheckoutClient`) keeps the `ChannelChoice` gate,
then reveals coupon/installment + `PaymentMethods`. All plan data is **generic
placeholder** — real numbers come from the admin catalog.

**…add or fix an e2e critical-flow test (Phase 13).** Specs live in
[e2e/](e2e/), one numbered file per flow, with shared auth/OTP helpers in
[e2e/helpers.ts](e2e/helpers.ts). Authenticate by planting the `tkr_session`
cookie with `loginAs(context, USERS.<role>, baseURL)` (the cookie value is a bare
`User.id` — see [src/lib/auth/session.ts](src/lib/auth/session.ts)); only the
login spec drives `/login`. Select elements by their Thai copy + ARIA role, so a
deliberate `messages/th.json` change is what (correctly) trips a test. Keep new
specs serial-safe — they share the mock store — and use a non-demo phone for
guest checkout so the OTP creates a fresh guest rather than resuming a demo
account. Run with `pnpm test:e2e`.

**…gate a vertical behind a feature flag.** Build-time flags live in
[src/config/features.ts](src/config/features.ts) (`FEATURES`). `cashInstallment`
(default OFF) hides the partner-dependent cash-installment payment option in
`PaymentMethods`. `taxTools` (default OFF) gates the LIFE / tax-deduction
vertical: the `/tools/tax-calculator` route (`TaxCalculator`) calls `notFound()`
while the flag is off, so the UI is fully built but 404s until TKR decides to
sell it. Read the flag from the page/component — never hardcode the gate inline.
