import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { AppLink } from "@/components/ui/AppLink";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { LEARN_PRODUCTS } from "@/config/learn";
import { SEO_CATEGORIES, SEO_LANDINGS } from "@/config/conversion";
import { TrustBadge } from "@/components/conversion/TrustBadge";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.index" });
  return { title: t("title"), description: t("desc") };
}

export default async function InsuranceIndexPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("seo");
  const tl = await getTranslations("learn");
  type SeoKey = Parameters<typeof t>[0];

  const flagship = LEARN_PRODUCTS.worker;

  return (
    <main>
      {/* hero */}
      <section className="bg-hero border-b border-ink-100/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
          <Chip className="bg-white text-brand-700 shadow-card border border-brand-100 mb-4">
            {t("index.badge")}
          </Chip>
          <h1 className="font-display font-700 text-3xl sm:text-5xl text-ink-900 tracking-tight">
            {t("index.title")}
          </h1>
          <p className="mt-3 text-ink-600 max-w-2xl">{t("index.desc")}</p>
          <TrustBadge className="mt-4" />
        </div>
      </section>

      {/* flagship */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <AppLink
          href="/insurance/worker"
          className="card card-hover card-lg p-7 grid lg:grid-cols-[auto_1fr_auto] gap-5 items-center bg-gradient-to-br from-brand-600 to-ink-900 text-white border-0"
        >
          <span className="w-14 h-14 rounded-2xl bg-white/15 inline-flex items-center justify-center">
            <Icon name={flagship.icon} size={26} />
          </span>
          <div>
            <Chip className="bg-gold-400 text-ink-900 mb-2 text-xs">{t("index.badge")}</Chip>
            <h2 className="font-display font-700 text-2xl">{t("index.flagshipTitle")}</h2>
            <p className="mt-1.5 text-ink-100/90 text-sm">{t("index.flagshipDesc")}</p>
          </div>
          <span className="hidden lg:inline-flex items-center gap-2 font-600">
            {t("index.view")} <Icon name="arrowRight" />
          </span>
        </AppLink>
      </section>

      {/* personal lines by category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <h2 className="font-display font-700 text-2xl text-ink-900 tracking-tight mb-2">
          {t("index.moreTitle")}
        </h2>

        {SEO_CATEGORIES.map((cat) => {
          const items = SEO_LANDINGS.filter((s) => s.category === cat);
          if (items.length === 0) return null;
          return (
            <div key={cat} className="mt-8">
              <h3 className="font-600 text-ink-700 mb-3 flex items-center gap-2">
                <span className="text-brand-600"><Icon name={items[0]!.icon} size={18} /></span>
                {t(`cat.${cat}`)}
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((s) => (
                  <AppLink key={s.slug} href={`/insurance/${s.slug}`} className="card card-hover p-5 flex items-start gap-3">
                    <span className="w-11 h-11 rounded-xl bg-sky-100 text-brand-600 inline-flex items-center justify-center shrink-0">
                      <Icon name={s.icon} />
                    </span>
                    <div className="min-w-0">
                      <p className="font-600 text-ink-900">{t(`items.${s.slug}.label` as SeoKey)}</p>
                      <p className="mt-0.5 text-sm text-ink-500 line-clamp-2">{t(`items.${s.slug}.tagline` as SeoKey)}</p>
                    </div>
                  </AppLink>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* link back to the 5 flagship "how it works" landings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="flex flex-wrap gap-3">
          {(["auto", "travel", "pa", "fire"] as const).map((p) => (
            <AppLink key={p} href={`/insurance/${p}`} className="chip bg-ink-50 text-ink-600 hover:bg-sky-100">
              {tl(`${p}.hero.title`)}
            </AppLink>
          ))}
        </div>
      </section>
    </main>
  );
}
