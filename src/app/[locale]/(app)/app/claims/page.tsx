import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { PortalPlaceholder } from "@/components/app/PortalPlaceholder";

type Props = { params: Promise<{ locale: Locale }> };

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "nav" });
  return <PortalPlaceholder href="/app/claims" title={t("claims")} />;
}
