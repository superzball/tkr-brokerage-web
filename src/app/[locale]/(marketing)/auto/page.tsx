import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { AutoPageHead } from "@/components/auto/AutoPageHead";
import { AutoCompare } from "@/components/auto/AutoCompare";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.auto" });
  return { title: t("title"), description: t("description") };
}

export default async function AutoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <AutoPageHead />
      <AutoCompare />
    </main>
  );
}
