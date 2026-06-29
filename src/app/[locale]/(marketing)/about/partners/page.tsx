import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { EmptyState } from "@/components/app/EmptyState";
import { getInsurerPartners } from "@/lib/mock/seed";
import { cmsCopy } from "@/lib/cms/page-copy";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.aboutPartners" });
  return { title: t("title"), description: t("description") };
}

type Meaning = { title: string; desc: string };

export default async function PartnersPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about.partners");
  const cms = cmsCopy("/about/partners", locale);

  const heroTitle = cms?.hero ?? t("hero.title");
  const heroSub = cms?.body ?? t("hero.sub");
  const partners = getInsurerPartners();
  const meaning = t.raw("meaning.points") as Meaning[];

  return (
    <main>
      {/* hero */}
      <section className="bg-hero border-b border-ink-100/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 lg:py-20 text-center">
          <Chip className="bg-white text-brand-700 shadow-card border border-brand-100 mb-4">
            <Icon name="shield" size={15} /> {t("hero.badge")}
          </Chip>
          <h1 className="font-display font-700 text-3xl sm:text-5xl text-ink-900 tracking-tight" style={{ textWrap: "balance" }}>
            {heroTitle}
          </h1>
          <p className="mt-4 text-lg text-ink-600 max-w-2xl mx-auto">{heroSub}</p>
        </div>
      </section>

      {/* partner logo wall — placeholder logos (names), clearly marked */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 lg:py-20">
        <div className="text-center mb-8">
          <h2 className="font-display font-700 text-2xl sm:text-3xl text-ink-900 tracking-tight">{t("wall.title")}</h2>
        </div>

        {partners.length === 0 ? (
          <EmptyState icon="shield" title={t("wall.empty")} />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {partners.map((p) => (
                <div
                  key={p.id}
                  className="card p-6 flex flex-col items-center justify-center text-center min-h-[110px]"
                >
                  {/* placeholder logo tile — real logos pending usage rights */}
                  <span className="w-10 h-10 rounded-xl bg-ink-100 text-ink-400 flex items-center justify-center mb-2">
                    <Icon name="building" size={20} />
                  </span>
                  <span className="font-600 text-sm text-ink-800 leading-tight">{p.name}</span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-center text-xs text-ink-500 flex items-center justify-center gap-2">
              <Icon name="info" size={14} /> {t("wall.note")}
            </p>
          </>
        )}
      </section>

      {/* what the partnership means for customers */}
      <section className="bg-gradient-to-b from-mint-50/80 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 lg:py-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-display font-700 text-2xl sm:text-3xl text-ink-900 tracking-tight">{t("meaning.title")}</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {meaning.map((m, i) => (
              <div key={i} className="card p-6 reveal">
                <span className="w-12 h-12 rounded-2xl bg-sky-100 text-brand-600 flex items-center justify-center">
                  <Icon name="check" size={24} />
                </span>
                <h3 className="mt-4 font-700 text-ink-900">{m.title}</h3>
                <p className="mt-1.5 text-sm text-ink-600 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* underwriter relationships note (generic until confirmed) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
        <div className="card p-7 sm:p-9 flex items-start gap-4">
          <span className="shrink-0 w-12 h-12 rounded-2xl bg-sky-100 text-brand-600 flex items-center justify-center">
            <Icon name="shieldCheck" size={24} />
          </span>
          <div>
            <h3 className="font-display font-700 text-xl text-ink-900">{t("underwriter.title")}</h3>
            <p className="mt-2 text-ink-600 leading-relaxed">{t("underwriter.desc")}</p>
          </div>
        </div>
      </section>

      {/* "interested in partnering" CTA → contact */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <div className="card card-lg bg-gradient-to-r from-brand-600 to-brand-500 text-white p-9 sm:p-12 text-center">
          <h2 className="font-display font-700 text-2xl sm:text-3xl tracking-tight" style={{ textWrap: "balance" }}>
            {t("cta.title")}
          </h2>
          <p className="mt-3 text-brand-50 max-w-xl mx-auto">{t("cta.desc")}</p>
          <div className="mt-7 flex justify-center">
            <Button href="/contact" variant="gold" size="lg">
              {t("cta.button")} <Icon name="arrowRight" />
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
