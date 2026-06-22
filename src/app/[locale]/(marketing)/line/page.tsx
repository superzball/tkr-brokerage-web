import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { AppLink } from "@/components/ui/AppLink";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { IOSFrame } from "@/components/device/IOSFrame";
import { LineApp } from "@/components/line/LineApp";
import { LINE_GREEN, LINE_HERO_FEATURES } from "@/config/line";
import { ROUTES } from "@/config/nav";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.line" });
  return { title: t("title"), description: t("description") };
}

function LineHero() {
  const t = useTranslations("line.hero");
  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-ink-400 mb-3">
        <AppLink href={ROUTES.home} className="hover:text-brand-600">
          {t("breadcrumbHome")}
        </AppLink>
        <span className="opacity-50">
          <Icon name="chevR" />
        </span>
        <span className="text-ink-600">{t("breadcrumbCurrent")}</span>
      </div>
      <Chip className="mb-4 text-white shadow-card" style={{ background: LINE_GREEN }}>
        <Icon name="line" /> {t("chip")}
      </Chip>
      <h1
        className="font-display font-700 text-3xl sm:text-4xl text-ink-900 tracking-tight"
        style={{ textWrap: "balance" }}
      >
        {t("title")}
      </h1>
      <p className="mt-4 text-ink-600 leading-relaxed max-w-md">{t("desc")}</p>
      <div className="mt-7 grid sm:grid-cols-2 gap-3">
        {LINE_HERO_FEATURES.map((f) => (
          <div key={f.key} className="card p-4 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-sky-100 text-brand-600 inline-flex items-center justify-center">
              <Icon name={f.icon} />
            </span>
            <div>
              <p className="font-600 text-ink-900 text-sm">{t(`features.${f.key}.title`)}</p>
              <p className="text-xs text-ink-500">{t(`features.${f.key}.sub`)}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 text-sm text-ink-400 flex items-center gap-2">
        <Icon name="info" /> {t("hint")}
      </p>
    </div>
  );
}

export default async function LinePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <section className="bg-hero">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid lg:grid-cols-2 gap-10 items-center">
        <LineHero />
        <div className="flex justify-center">
          <IOSFrame>
            <LineApp />
          </IOSFrame>
        </div>
      </div>
    </section>
  );
}
