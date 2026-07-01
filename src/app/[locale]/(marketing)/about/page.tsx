import type { Metadata } from "next";
import { setRequestLocale, getTranslations, getFormatter } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { trustStats } from "@/lib/mock/seed";
import { cmsCopy } from "@/lib/cms/page-copy";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.about" });
  return { title: t("title"), description: t("description") };
}

type WhatCard = { key: "broker" | "mission" | "vision"; icon: IconName };
const WHAT: WhatCard[] = [
  { key: "broker", icon: "search" },
  { key: "mission", icon: "heart" },
  { key: "vision", icon: "sparkle" },
];

type Milestone = { year: string; title: string; desc: string };
type Product = { key: string; title: string; desc: string; href: string };
const PRODUCT_ICON: Record<string, IconName> = {
  worker: "users",
  auto: "car",
  travel: "plane",
  pa: "shield",
  fire: "flame",
};

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about.main");
  const format = await getFormatter();
  const cms = cmsCopy("/about", locale);

  const heroTitle = cms?.hero ?? t("hero.title");
  const heroSub = cms?.body ?? t("hero.sub");
  const milestones = t.raw("story.milestones") as Milestone[];
  const products = t.raw("products.items") as Product[];

  return (
    <main>
      {/* hero */}
      <section className="bg-hero border-b border-ink-100/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 lg:py-20 text-center">
          <Chip className="bg-white text-brand-700 shadow-card border border-brand-100 mb-4">
            <Icon name="building" size={15} /> {t("hero.badge")}
          </Chip>
          <h1 className="font-display font-700 text-3xl sm:text-5xl text-ink-900 tracking-tight" style={{ textWrap: "balance" }}>
            {heroTitle}
          </h1>
          <p className="mt-4 text-lg text-ink-600 max-w-2xl mx-auto">{heroSub}</p>
        </div>
      </section>

      {/* what we do */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 lg:py-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="font-display font-700 text-2xl sm:text-3xl text-ink-900 tracking-tight">{t("whatWeDo.title")}</h2>
          <p className="mt-3 text-ink-600 leading-relaxed">{t("whatWeDo.sub")}</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {WHAT.map((c) => (
            <div key={c.key} className="card p-6 reveal">
              <span className="w-12 h-12 rounded-2xl bg-sky-100 text-brand-600 flex items-center justify-center">
                <Icon name={c.icon} size={24} />
              </span>
              <h3 className="mt-4 font-700 text-ink-900">{t(`whatWeDo.${c.key}.title`)}</h3>
              <p className="mt-1.5 text-sm text-ink-600 leading-relaxed">{t(`whatWeDo.${c.key}.desc`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* by the numbers (trustStats — placeholder values, clearly noted) */}
      <section className="bg-gradient-to-br from-brand-900 via-ink-900 to-ink-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-display font-700 text-2xl sm:text-3xl tracking-tight">{t("numbers.title")}</h2>
            <p className="mt-3 text-ink-300">{t("numbers.sub")}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div>
              <span className="w-11 h-11 rounded-xl bg-white/10 text-brand-300 inline-flex items-center justify-center mb-3">
                <Icon name="shieldCheck" />
              </span>
              <p className="font-600 text-white">{t("numbers.license")}</p>
              <p className="mt-1 text-sm text-ink-300">{trustStats.oicLicense}</p>
            </div>
            <div>
              <p className="font-display font-700 text-4xl text-white tabnum">
                {trustStats.insurers}<span className="text-brand-400">+</span>
              </p>
              <p className="mt-2 text-ink-300">{t("numbers.insurers")}</p>
            </div>
            <div>
              <p className="font-display font-700 text-4xl text-white tabnum">
                {format.number(trustStats.customersServed)}<span className="text-brand-400">+</span>
              </p>
              <p className="mt-2 text-ink-300">{t("numbers.customers")}</p>
            </div>
            <div>
              <p className="font-display font-700 text-4xl text-white tabnum">
                {trustStats.claimsPaidPct}<span className="text-brand-400">%</span>
              </p>
              <p className="mt-2 text-ink-300">{t("numbers.claims")}</p>
            </div>
          </div>
          <p className="mt-8 text-center text-xs text-ink-400 max-w-xl mx-auto">{t("numbers.note")}</p>
        </div>
      </section>

      {/* story / milestones (CMS-driven placeholders) */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-14 lg:py-20">
        <div className="text-center mb-10">
          <h2 className="font-display font-700 text-2xl sm:text-3xl text-ink-900 tracking-tight">{t("story.title")}</h2>
          <p className="mt-3 text-ink-600">{t("story.sub")}</p>
        </div>
        <ol className="relative border-l border-ink-100 ml-3 space-y-8">
          {milestones.map((m, i) => (
            <li key={i} className="ml-6">
              <span className="absolute -left-[9px] w-4 h-4 rounded-full bg-brand-500 ring-4 ring-white" />
              <p className="font-display font-700 text-lg text-brand-600 tabnum">{m.year}</p>
              <h3 className="mt-0.5 font-700 text-ink-900">{m.title}</h3>
              <p className="mt-1 text-sm text-ink-600 leading-relaxed">{m.desc}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 rounded-2xl border border-dashed border-ink-200 p-5 text-center text-xs text-ink-500 flex items-center justify-center gap-2">
          <Icon name="info" size={14} /> {t("story.note")}
        </div>
      </section>

      {/* products at a glance + partner teaser */}
      <section className="bg-gradient-to-b from-sky-50/60 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 lg:py-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-display font-700 text-2xl sm:text-3xl text-ink-900 tracking-tight">{t("products.title")}</h2>
            <p className="mt-3 text-ink-600">{t("products.sub")}</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <Link key={p.key} href={p.href} className="card card-hover p-6 group">
                <span className="w-12 h-12 rounded-2xl bg-sky-100 text-brand-600 flex items-center justify-center">
                  <Icon name={PRODUCT_ICON[p.key] ?? "shield"} size={24} />
                </span>
                <h3 className="mt-4 font-700 text-ink-900 group-hover:text-brand-700 transition-colors">{p.title}</h3>
                <p className="mt-1.5 text-sm text-ink-600 leading-relaxed">{p.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-600 text-brand-600">
                  <Icon name="arrowRight" size={15} />
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-8 card card-lg p-7 sm:p-9 flex flex-col sm:flex-row sm:items-center gap-5 justify-between">
            <div>
              <h3 className="font-display font-700 text-xl text-ink-900">{t("products.partnerTeaser.title")}</h3>
              <p className="mt-1.5 text-ink-600 leading-relaxed max-w-xl">{t("products.partnerTeaser.desc")}</p>
            </div>
            <Button href="/about/partners" variant="ghost" size="md">
              {t("products.partnerTeaser.cta")} <Icon name="arrowRight" size={16} />
            </Button>
          </div>
        </div>
      </section>

      {/* CTAs */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="card card-lg bg-gradient-to-br from-brand-600 to-ink-900 text-white p-9 sm:p-12 text-center">
          <h2 className="font-display font-700 text-2xl sm:text-3xl tracking-tight" style={{ textWrap: "balance" }}>
            {t("cta.title")}
          </h2>
          <p className="mt-3 text-brand-50">{t("cta.sub")}</p>
          <div className="mt-7 flex flex-wrap gap-3 justify-center">
            <Button href="/insurance/worker" variant="gold" size="lg">
              {t("cta.quote")} <Icon name="arrowRight" />
            </Button>
            <Button href="/about/agent" variant="ghost" size="lg" className="bg-white/10 text-white border-white/30">
              {t("cta.agent")}
            </Button>
            <Button href="/contact" variant="ghost" size="lg" className="bg-white/10 text-white border-white/30">
              {t("cta.contact")}
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
