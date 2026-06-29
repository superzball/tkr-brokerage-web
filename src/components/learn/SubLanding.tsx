// src/components/learn/SubLanding.tsx
// Lighter SEO landing for an expanded personal-lines sub-product (e.g. EV motor,
// international travel, condo, cancer). Structure from SEO_LANDINGS; copy from the
// `seo` namespace. Reuses the conversion building blocks: privacy-first trust
// badge, multi-insurer compare, plain-language glossary, social proof, trust wall,
// and the channel choice (ซื้อเอง / ตัวแทน) carried into the quote flow.

import { useTranslations } from "next-intl";
import { AppLink } from "@/components/ui/AppLink";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { ROUTES } from "@/config/nav";
import { LEARN_PRODUCTS } from "@/config/learn";
import {
  SEO_LANDINGS,
  getSeoLanding,
  comparePlansFor,
  type SeoLanding,
} from "@/config/conversion";
import { TrustBadge } from "@/components/conversion/TrustBadge";
import { CompareTable } from "@/components/conversion/CompareTable";
import { GlossarySection } from "@/components/conversion/Glossary";
import { Reviews } from "@/components/conversion/Reviews";
import { TrustCredentials } from "@/components/conversion/TrustCredentials";
import { useBaht } from "@/lib/format";
import { getReviews } from "@/lib/mock/seed";
import type { InsuranceType } from "@/types/portal";

export function SubLanding({ slug }: { slug: string }) {
  const cfg = getSeoLanding(slug) as SeoLanding;
  const t = useTranslations("seo");
  const baht = useBaht();

  // dynamic message keys (slug is a runtime string) — cast to next-intl's key type
  type SeoKey = Parameters<typeof t>[0];
  const parent = LEARN_PRODUCTS[cfg.parent];
  const signupHref = `/signup?role=${parent.role}`;
  const quoteHref = parent.quoteHref ?? signupHref; // privacy-first quote entry
  const label = t(`items.${slug}.label` as SeoKey);
  const tagline = t(`items.${slug}.tagline` as SeoKey);

  const related = SEO_LANDINGS.filter(
    (s) => s.category === cfg.category && s.slug !== slug,
  );

  return (
    <main>
      {/* ── Hero ── */}
      <section className="relative bg-hero overflow-hidden border-b border-ink-100/70">
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-14">
          <div className="flex items-center gap-2 text-sm text-ink-400 mb-4">
            <AppLink href={ROUTES.home} className="hover:text-brand-600">
              {t("sub.backToAll")}
            </AppLink>
            <span className="opacity-50"><Icon name="chevR" size={14} /></span>
            <AppLink href="/insurance" className="hover:text-brand-600">
              {t(`cat.${cfg.category}`)}
            </AppLink>
            <span className="opacity-50"><Icon name="chevR" size={14} /></span>
            <span className="text-ink-600">{label}</span>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <Chip className="bg-white text-brand-700 shadow-card border border-brand-100 mb-5">
                <span className="text-brand-600"><Icon name={cfg.icon} size={16} /></span>
                {t(`cat.${cfg.category}`)}
              </Chip>
              <h1 className="font-display font-700 text-[2.2rem] leading-[1.1] sm:text-5xl text-ink-900 tracking-tight" style={{ textWrap: "balance" }}>
                {label}
              </h1>
              <p className="mt-5 text-lg text-ink-600 leading-relaxed max-w-xl">{tagline}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button href={quoteHref} variant="primary" size="lg">
                  {t("sub.startQuote")} <Icon name="arrowRight" />
                </Button>
                {cfg.compare && (
                  <Button href="#compare" variant="ghost" size="lg">
                    {t("sub.comparePlans")}
                  </Button>
                )}
                <Button href={ROUTES.line} variant="ghost" size="lg">
                  {t("sub.contact")}
                </Button>
              </div>
              <div className="mt-5"><TrustBadge /></div>
            </div>

            <div className="lg:col-span-5">
              <div className="card card-lg p-6 shadow-pop">
                <div className="flex items-center gap-3">
                  <span className="w-12 h-12 rounded-xl bg-brand-500 text-white inline-flex items-center justify-center">
                    <Icon name={cfg.icon} />
                  </span>
                  <div>
                    <p className="text-xs text-ink-400 font-500">{t("sub.startQuote")}</p>
                    <p className="font-600 text-ink-900">{label}</p>
                  </div>
                </div>
                <p className="mt-5 text-sm text-ink-400">{t("sub.from")}</p>
                <p className="mt-1 font-display font-700 text-3xl text-brand-700 tabnum">
                  {baht(cfg.fromPrice)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Multi-insurer comparison ── */}
      {cfg.compare && (
        <section id="compare" className="max-w-7xl mx-auto px-4 sm:px-6 py-14 scroll-mt-20">
          <h2 className="font-display font-700 text-3xl text-ink-900 tracking-tight mb-6">
            {t("sub.comparePlans")}
          </h2>
          <CompareTable
            plans={comparePlansFor(cfg.parent as InsuranceType, cfg.fromPrice)}
            chooseHref={quoteHref}
          />
        </section>
      )}

      {/* ── Plain-language layer ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-4">
        <GlossarySection />
      </section>

      {/* ── Social proof ── */}
      <Reviews reviews={getReviews()} limit={3} />

      {/* ── Trust / credentials ── */}
      <TrustCredentials />

      {/* ── Related in category ── */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="font-display font-700 text-2xl text-ink-900 tracking-tight mb-6">
            {t("sub.relatedTitle")}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {related.map((r) => (
              <AppLink key={r.slug} href={`/insurance/${r.slug}`} className="card card-hover p-5 flex items-center gap-3">
                <span className="w-11 h-11 rounded-xl bg-sky-100 text-brand-600 inline-flex items-center justify-center shrink-0">
                  <Icon name={r.icon} />
                </span>
                <div className="min-w-0">
                  <p className="font-600 text-ink-900 truncate">{t(`items.${r.slug}.label` as SeoKey)}</p>
                  <p className="text-xs text-ink-500 truncate">{t(`items.${r.slug}.tagline` as SeoKey)}</p>
                </div>
              </AppLink>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
