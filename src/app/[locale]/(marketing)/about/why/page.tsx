import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { TrustCredentials } from "@/components/conversion/TrustCredentials";
import { Reviews } from "@/components/conversion/Reviews";
import { EmptyState } from "@/components/app/EmptyState";
import { getReviews } from "@/lib/mock/seed";
import { cmsCopy } from "@/lib/cms/page-copy";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.aboutWhy" });
  return { title: t("title"), description: t("description") };
}

type Card = { icon: IconName; title: string; desc: string };

export default async function WhyTkrPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about.why");
  const cms = cmsCopy("/about/why", locale);

  const heroTitle = cms?.hero ?? t("hero.title");
  const heroSub = cms?.body ?? t("hero.sub");
  const cards = t.raw("cards") as Card[];
  const brokerPoints = t.raw("broker.points") as string[];
  const reviews = getReviews();

  return (
    <main>
      {/* hero */}
      <section className="bg-hero border-b border-ink-100/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 lg:py-20 text-center">
          <Chip className="bg-white text-brand-700 shadow-card border border-brand-100 mb-4">
            <Icon name="shieldCheck" size={15} /> {t("hero.badge")}
          </Chip>
          <h1 className="font-display font-700 text-3xl sm:text-5xl text-ink-900 tracking-tight" style={{ textWrap: "balance" }}>
            {heroTitle}
          </h1>
          <p className="mt-4 text-lg text-ink-600 max-w-2xl mx-auto">{heroSub}</p>
        </div>
      </section>

      {/* differentiator value cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 lg:py-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c, i) => (
            <div key={i} className="card card-hover p-6 reveal">
              <span className="w-12 h-12 rounded-2xl bg-sky-100 text-brand-600 flex items-center justify-center">
                <Icon name={c.icon} size={24} />
              </span>
              <h3 className="mt-4 font-700 text-ink-900">{c.title}</h3>
              <p className="mt-1.5 text-sm text-ink-600 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* why a broker beats buying direct */}
      <section className="bg-gradient-to-b from-sky-50/60 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 lg:py-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-display font-700 text-2xl sm:text-3xl text-ink-900 tracking-tight">{t("broker.title")}</h2>
            <p className="mt-3 text-ink-600">{t("broker.sub")}</p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {brokerPoints.map((p, i) => (
              <li key={i} className="card p-5 flex items-start gap-3">
                <span className="shrink-0 w-7 h-7 rounded-full bg-mint-100 text-mint-600 inline-flex items-center justify-center">
                  <Icon name="check" size={16} strokeWidth={2.4} />
                </span>
                <span className="text-ink-700 leading-relaxed">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* trust signals: OIC license + partner wall + empty awards slot */}
      <div className="text-center max-w-2xl mx-auto px-4 sm:px-6 pt-14">
        <h2 className="font-display font-700 text-2xl sm:text-3xl text-ink-900 tracking-tight">{t("trust.title")}</h2>
        <p className="mt-3 text-ink-600">{t("trust.sub")}</p>
      </div>
      <TrustCredentials />

      {/* PDPA / data privacy */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
        <div className="card p-7 sm:p-9 flex items-start gap-4">
          <span className="shrink-0 w-12 h-12 rounded-2xl bg-sky-100 text-brand-600 flex items-center justify-center">
            <Icon name="lock" size={24} />
          </span>
          <div>
            <h3 className="font-display font-700 text-xl text-ink-900">{t("pdpa.title")}</h3>
            <p className="mt-2 text-ink-600 leading-relaxed">{t("pdpa.desc")}</p>
          </div>
        </div>
      </section>

      {/* reviews teaser (placeholder, clearly labelled) */}
      <section className="bg-gradient-to-b from-white to-sky-50/60">
        {reviews.length === 0 ? (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
            <EmptyState icon="star" title={t("reviews.title")} />
          </div>
        ) : (
          <Reviews reviews={reviews} limit={3} heading={false} />
        )}
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="card card-lg bg-gradient-to-br from-brand-600 to-ink-900 text-white p-9 sm:p-12 text-center">
          <h2 className="font-display font-700 text-2xl sm:text-3xl tracking-tight" style={{ textWrap: "balance" }}>
            {t("cta.title")}
          </h2>
          <div className="mt-7 flex flex-wrap gap-3 justify-center">
            <Button href="/insurance/worker" variant="gold" size="lg">
              {t("cta.quote")} <Icon name="arrowRight" />
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
