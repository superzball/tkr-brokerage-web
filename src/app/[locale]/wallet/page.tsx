import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { AppLink } from "@/components/ui/AppLink";
import { Chip } from "@/components/ui/Chip";
import { Icon, type IconName } from "@/components/ui/Icon";
import { IOSFrame } from "@/components/device/IOSFrame";
import { WalletApp } from "@/components/wallet/WalletApp";
import { ROUTES } from "@/config/nav";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.wallet" });
  return { title: t("title"), description: t("description") };
}

/** Hero feature rows (icon + tint live here; text in `wallet.hero.features.<key>`). */
const HERO_FEATURES: Array<{ key: "lang" | "qr" | "sos"; icon: IconName; cls: string }> = [
  { key: "lang", icon: "globe", cls: "bg-sky-100 text-brand-600" },
  { key: "qr", icon: "qr", cls: "bg-sky-100 text-brand-600" },
  { key: "sos", icon: "phone", cls: "bg-rose-50 text-rose-500" },
];

function WalletHero() {
  const t = useTranslations("wallet.hero");
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
      <Chip className="bg-white border border-brand-100 text-brand-600 shadow-card mb-4">
        <Icon name="wallet" /> {t("chip")}
      </Chip>
      <h1
        className="font-display font-700 text-3xl sm:text-4xl text-ink-900 tracking-tight"
        style={{ textWrap: "balance" }}
      >
        {t("title")}
      </h1>
      <p className="mt-4 text-ink-600 leading-relaxed max-w-md">{t("desc")}</p>
      <ul className="mt-7 space-y-3.5">
        {HERO_FEATURES.map((f) => (
          <li key={f.key} className="flex items-center gap-3">
            <span className={`w-9 h-9 rounded-lg inline-flex items-center justify-center ${f.cls}`}>
              <Icon name={f.icon} />
            </span>
            <span className="text-ink-700">
              <strong className="text-ink-900 font-600">
                {t(`features.${f.key}.title`)}
              </strong>{" "}
              — {t(`features.${f.key}.desc`)}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-7 text-sm text-ink-400 flex items-center gap-2">
        <Icon name="info" /> {t("hint")}
      </p>
    </div>
  );
}

export default async function WalletPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <section className="bg-hero">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid lg:grid-cols-2 gap-10 items-center">
        <WalletHero />
        <div className="flex justify-center">
          <IOSFrame>
            <WalletApp />
          </IOSFrame>
        </div>
      </div>
    </section>
  );
}
