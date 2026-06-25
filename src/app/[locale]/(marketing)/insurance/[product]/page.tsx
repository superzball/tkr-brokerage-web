import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import {
  LEARN_PRODUCT_KEYS,
  type LearnProductKey,
} from "@/config/learn";
import { SEO_LANDING_SLUGS, getSeoLanding } from "@/config/conversion";
import { ProductLanding } from "@/components/learn/ProductLanding";
import { SubLanding } from "@/components/learn/SubLanding";

type Props = { params: Promise<{ locale: Locale; product: string }> };

// Flagship products render the full ProductLanding; expanded SEO sub-products
// (auto-ev, travel-international, …) render the lighter SubLanding. One route.
export function generateStaticParams() {
  const slugs = [...LEARN_PRODUCT_KEYS, ...SEO_LANDING_SLUGS];
  return routing.locales.flatMap((locale) =>
    slugs.map((product) => ({ locale, product })),
  );
}

function isFlagship(p: string): p is LearnProductKey {
  return (LEARN_PRODUCT_KEYS as string[]).includes(p);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, product } = await params;
  if (isFlagship(product)) {
    const t = await getTranslations({ locale, namespace: "learn" });
    return { title: t(`${product}.hero.title`) };
  }
  if (getSeoLanding(product)) {
    const t = await getTranslations({ locale, namespace: "seo" });
    type SeoKey = Parameters<typeof t>[0];
    return {
      title: t(`items.${product}.label` as SeoKey),
      description: t(`items.${product}.tagline` as SeoKey),
    };
  }
  return {};
}

export default async function InsuranceProductPage({ params }: Props) {
  const { locale, product } = await params;
  setRequestLocale(locale);

  if (isFlagship(product)) return <ProductLanding product={product} />;
  if (getSeoLanding(product)) return <SubLanding slug={product} />;
  notFound();
}
