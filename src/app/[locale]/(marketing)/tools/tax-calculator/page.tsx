import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { FEATURES } from "@/config/features";
import { TaxCalculator } from "@/components/conversion/TaxCalculator";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tax" });
  return { title: t("title"), description: t("sub") };
}

// Tax tools belong to a LIFE / tax-deduction vertical TKR may or may not sell.
// The UI is fully built but gated behind FEATURES.taxTools (default OFF) until
// that business decision is made — the route 404s while the flag is off.
export default async function TaxCalculatorPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  if (!FEATURES.taxTools) notFound();

  return (
    <main>
      <TaxCalculator />
    </main>
  );
}
