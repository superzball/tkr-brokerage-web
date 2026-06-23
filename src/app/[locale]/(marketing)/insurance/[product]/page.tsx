import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import {
  LEARN_PRODUCT_KEYS,
  type LearnProductKey,
} from "@/config/learn";
import { ProductLanding } from "@/components/learn/ProductLanding";

type Props = { params: Promise<{ locale: Locale; product: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    LEARN_PRODUCT_KEYS.map((product) => ({ locale, product })),
  );
}

function isProduct(p: string): p is LearnProductKey {
  return (LEARN_PRODUCT_KEYS as string[]).includes(p);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, product } = await params;
  if (!isProduct(product)) return {};
  const t = await getTranslations({ locale, namespace: "learn" });
  return { title: t(`${product}.hero.title`) };
}

export default async function InsuranceProductPage({ params }: Props) {
  const { locale, product } = await params;
  setRequestLocale(locale);
  if (!isProduct(product)) notFound();

  return <ProductLanding product={product} />;
}
