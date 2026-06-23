// src/components/learn/ProductLanding.tsx
// Rich public "How it works" landing for a product, composed from the home/
// product visual vocabulary (bg-hero, cards, chips, reveal). Server component
// (next-intl hooks are isomorphic). Copy: `learn` namespace; structure: LEARN_PRODUCTS.

import { useTranslations, useFormatter } from "next-intl";
import { AppLink } from "@/components/ui/AppLink";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { LEARN_PRODUCTS, type LearnProductKey } from "@/config/learn";
import { WORKER_PLANS, AUTO_PLANS } from "@/config/insurance";
import { ROUTES } from "@/config/nav";

type Pair = { title: string; desc: string };
type Qa = { q: string; a: string };
const TIER_KEYS = ["basic", "standard", "premium"] as const;

export function ProductLanding({ product }: { product: LearnProductKey }) {
  const cfg = LEARN_PRODUCTS[product];
  const t = useTranslations("learn");
  const tw = useTranslations("worker");
  const format = useFormatter();
  const baht = (n: number) =>
    format.number(n, {
      style: "currency",
      currency: "THB",
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: 0,
    });

  const why = t.raw(`${product}.why`) as Pair[];
  const coverage = t.raw(`${product}.coverage`) as string[];
  const faq = t.raw(`${product}.faq`) as Qa[];
  const steps = t.raw("common.steps") as Pair[];
  const trust = t.raw("common.trust") as Pair[];

  const signupHref = `/signup?role=${cfg.role}`;
  const primaryHref = cfg.quoteHref ?? signupHref;
  const primaryLabel = cfg.quoteHref ? t("common.startQuote") : t("common.getStarted");

  return (
    <main>
      {/* ── Hero ── */}
      <section className="relative bg-hero overflow-hidden border-b border-ink-100/70">
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div
          className="absolute -top-24 -right-24 w-[460px] h-[460px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle,rgba(31,102,238,.18),transparent 70%)" }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-16 lg:pt-14 lg:pb-20">
          <div className="flex items-center gap-2 text-sm text-ink-400 mb-4">
            <AppLink href={ROUTES.home} className="hover:text-brand-600">
              {t("common.breadcrumbHome")}
            </AppLink>
            <span className="opacity-50">
              <Icon name="chevR" size={14} />
            </span>
            <span className="text-ink-600">{t(`${product}.hero.title`)}</span>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <Chip className="bg-white text-brand-700 shadow-card border border-brand-100 mb-5">
                <span className="text-brand-600">
                  <Icon name={cfg.icon} size={16} />
                </span>
                {t(`${product}.hero.badge`)}
              </Chip>
              <h1
                className="font-display font-700 text-[2.4rem] leading-[1.1] sm:text-5xl text-ink-900 tracking-tight"
                style={{ textWrap: "balance" }}
              >
                {t(`${product}.hero.title`)}
              </h1>
              <p className="mt-5 text-lg text-ink-600 leading-relaxed max-w-xl">
                {t(`${product}.hero.subtitle`)}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button href={primaryHref} variant="primary" size="lg">
                  {primaryLabel} <Icon name="arrowRight" />
                </Button>
                <Button href="#plans" variant="ghost" size="lg">
                  {t("common.seePlans")}
                </Button>
              </div>
              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-500">
                <span className="flex items-center gap-2">
                  <span className="text-emerald-600"><Icon name="shieldCheck" size={16} /></span>
                  {trust[0]?.title}
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-emerald-600"><Icon name="lock" size={16} /></span>
                  {trust[1]?.title}
                </span>
              </div>
            </div>

            {/* coverage teaser card */}
            <div className="lg:col-span-5">
              <div className="card card-lg p-6 -rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center gap-3">
                  <span className="w-12 h-12 rounded-xl bg-brand-500 text-white inline-flex items-center justify-center">
                    <Icon name={cfg.icon} />
                  </span>
                  <div>
                    <p className="text-xs text-ink-400 font-500">{t("common.coverageTitle")}</p>
                    <p className="font-600 text-ink-900">{t(`${product}.hero.title`)}</p>
                  </div>
                </div>
                <ul className="mt-5 space-y-2.5 text-sm text-ink-700">
                  {coverage.map((c) => (
                    <li key={c} className="flex items-start gap-2.5">
                      <span className="text-emerald-500 shrink-0 mt-0.5">
                        <Icon name="checkCircle" size={16} />
                      </span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why us ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center max-w-2xl mx-auto reveal">
          <h2 className="font-display font-700 text-3xl sm:text-4xl text-ink-900 tracking-tight">
            {t("common.whyTitle")}
          </h2>
        </div>
        <div className="mt-10 grid sm:grid-cols-3 gap-5">
          {why.map((w) => (
            <div key={w.title} className="card card-hover p-6 reveal">
              <span className="w-12 h-12 rounded-xl bg-sky-100 text-brand-600 inline-flex items-center justify-center">
                <Icon name={cfg.icon} />
              </span>
              <h3 className="mt-4 font-600 text-lg text-ink-900">{w.title}</h3>
              <p className="mt-1.5 text-sm text-ink-600 leading-relaxed">{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4-step process ── */}
      <section className="bg-sky-50/60 border-y border-ink-100/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="font-display font-700 text-3xl text-ink-900 tracking-tight text-center reveal">
            {t("common.processTitle")}
          </h2>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((s, i) => (
              <div key={s.title} className="card p-6 reveal relative">
                <span className="w-10 h-10 rounded-full bg-brand-500 text-white font-700 inline-flex items-center justify-center">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-600 text-ink-900">{s.title}</h3>
                <p className="mt-1.5 text-sm text-ink-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Plans & pricing ── */}
      <section id="plans" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto reveal">
          <Chip className="bg-brand-50 text-brand-600 mb-3">{t("common.plansTitle")}</Chip>
          <h2 className="font-display font-700 text-3xl sm:text-4xl text-ink-900 tracking-tight">
            {t("common.plansTitle")}
          </h2>
          <p className="mt-3 text-ink-600">{t("common.plansSub")}</p>
        </div>

        {cfg.plansKind === "worker" && (
          <div className="mt-10 grid sm:grid-cols-3 gap-5">
            {WORKER_PLANS.map((p) => (
              <div
                key={p.id}
                className={cn(
                  "card p-6 relative reveal",
                  p.recommended && "ring-2 ring-brand-400",
                )}
              >
                {p.recommended && (
                  <Chip className="bg-brand-500 text-white absolute -top-3 left-6 text-xs">
                    {t("common.recommended")}
                  </Chip>
                )}
                <p className="font-600 text-ink-900">{tw(`plan.names.${p.id}`)}</p>
                <p className="mt-2 font-display font-700 text-3xl text-brand-700 tabnum">
                  {baht(p.per)}
                  <span className="text-sm font-500 text-ink-400"> {t("common.perWorker")}</span>
                </p>
                <ul className="mt-4 space-y-2.5 text-sm text-ink-600">
                  <li className="flex justify-between">
                    <span>{tw("plan.rows.life")}</span>
                    <span className="font-600 text-ink-900 tabnum">{baht(p.life)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>{tw("plan.rows.medical")}</span>
                    <span className="font-600 text-ink-900 tabnum">{baht(p.medical)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>{tw("plan.rows.repatriation")}</span>
                    <span className={cn("font-600", p.repatriation ? "text-emerald-600" : "text-ink-400")}>
                      {p.repatriation ? tw("plan.included") : tw("plan.notIncluded")}
                    </span>
                  </li>
                </ul>
                <Button href={primaryHref} variant={p.recommended ? "primary" : "ghost"} size="md" className="w-full mt-5">
                  {t("common.choose")}
                </Button>
              </div>
            ))}
          </div>
        )}

        {cfg.plansKind === "auto" && (
          <div className="mt-10 card card-lg p-8 text-center reveal max-w-2xl mx-auto">
            <p className="font-display font-700 text-4xl text-brand-700 tabnum">
              {AUTO_PLANS.length}+
            </p>
            <p className="mt-2 text-ink-600">{t("common.compareNote")}</p>
            <Button href={cfg.quoteHref ?? ROUTES.auto} variant="primary" size="lg" className="mt-6">
              {t("common.compareCta")} <Icon name="arrowRight" />
            </Button>
          </div>
        )}

        {cfg.plansKind === "generic" && cfg.tiers && (
          <div className="mt-10 grid sm:grid-cols-3 gap-5">
            {cfg.tiers.map((tier, i) => {
              const tierKey = TIER_KEYS[i];
              return (
                <div
                  key={tierKey}
                  className={cn(
                    "card p-6 relative reveal",
                    tier.recommended && "ring-2 ring-brand-400",
                  )}
                >
                  {tier.recommended && (
                    <Chip className="bg-brand-500 text-white absolute -top-3 left-6 text-xs">
                      {t("common.recommended")}
                    </Chip>
                  )}
                  <p className="font-600 text-ink-900">{t(`common.tiers.${tierKey}`)}</p>
                  <p className="mt-2 font-display font-700 text-3xl text-brand-700 tabnum">
                    {baht(tier.price)}
                    <span className="text-sm font-500 text-ink-400"> {t("common.perYear")}</span>
                  </p>
                  <ul className="mt-4 space-y-2.5 text-sm text-ink-600">
                    <li className="flex justify-between">
                      <span>{t("common.planSum")}</span>
                      <span className="font-600 text-ink-900 tabnum">{baht(tier.sum)}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-500"><Icon name="check" size={14} /></span>
                      {t("common.planFeature1")}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-500"><Icon name="check" size={14} /></span>
                      {t("common.planFeature2")}
                    </li>
                  </ul>
                  <Button href={signupHref} variant={tier.recommended ? "primary" : "ghost"} size="md" className="w-full mt-5">
                    {t("common.choose")}
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Trust / credentials ── */}
      <section className="bg-ink-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <h2 className="font-display font-700 text-2xl sm:text-3xl tracking-tight text-center mb-10">
            {t("common.trustTitle")}
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {trust.map((c) => (
              <div key={c.title} className="text-center sm:text-left">
                <span className="w-11 h-11 rounded-xl bg-white/10 text-brand-300 inline-flex items-center justify-center mb-3">
                  <Icon name="shieldCheck" />
                </span>
                <h3 className="font-600 text-white">{c.title}</h3>
                <p className="mt-1 text-sm text-ink-300">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="font-display font-700 text-3xl text-ink-900 tracking-tight text-center mb-8 reveal">
          {t("common.faqTitle")}
        </h2>
        <div className="card divide-y divide-ink-50">
          {faq.map((item) => (
            <details key={item.q} className="group p-5">
              <summary className="flex cursor-pointer items-center justify-between gap-3 font-600 text-ink-900 list-none">
                {item.q}
                <Icon
                  name="chevD"
                  size={18}
                  className="text-ink-400 transition-transform group-open:rotate-180 shrink-0"
                />
              </summary>
              <p className="mt-2.5 text-sm text-ink-600 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="card card-lg overflow-hidden relative reveal bg-gradient-to-br from-brand-600 to-ink-900 text-white border-0">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="relative p-9 sm:p-12 text-center">
            <h2 className="font-display font-700 text-3xl sm:text-4xl tracking-tight" style={{ textWrap: "balance" }}>
              {t("common.ctaTitle")}
            </h2>
            <p className="mt-3 text-ink-100/90 max-w-xl mx-auto">{t("common.ctaSub")}</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button href={primaryHref} variant="gold" size="lg">
                {primaryLabel} <Icon name="arrowRight" />
              </Button>
              <AppLink
                href={signupHref}
                className="btn btn-ghost btn-lg bg-white/10 text-white hover:bg-white/20 border-0"
              >
                {t("common.signupCta")}
              </AppLink>
              <Button href={ROUTES.line} variant="ghost" size="lg" className="bg-white/10 text-white hover:bg-white/20 border-0">
                {t("common.contact")}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
