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

## Architecture

```
src/app/[locale]/
├── layout.tsx              # root: <html>, fonts, NextIntlClientProvider (no chrome)
├── (marketing)/            # public site — Navbar + Footer shell
│   ├── layout.tsx
│   ├── page.tsx            # /            (home)
│   ├── worker-insurance/ auto/ customer/ agency/ wallet/ line/ tracking/
│   └── login/page.tsx      # /login       (placeholder; full auth = Phase 8)
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
