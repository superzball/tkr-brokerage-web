import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getCoupons } from "@/lib/mock/seed";
import { PromotionsClient } from "@/components/conversion/PromotionsClient";
import { TrustBadge } from "@/components/conversion/TrustBadge";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "promotions" });
  return { title: t("title"), description: t("desc") };
}

export default async function PromotionsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("promotions");

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
      <div className="max-w-2xl">
        <h1 className="font-display font-700 text-3xl sm:text-4xl text-ink-900 tracking-tight">
          {t("title")}
        </h1>
        <p className="mt-3 text-ink-600">{t("desc")}</p>
        <TrustBadge className="mt-4" />
      </div>

      <div className="mt-10">
        <PromotionsClient coupons={getCoupons()} />
      </div>

      <p className="mt-8 text-xs text-ink-400">{t("terms")}</p>
    </main>
  );
}
