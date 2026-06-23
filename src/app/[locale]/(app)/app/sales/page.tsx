import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getSession } from "@/lib/auth/session";
import { roleCanAccess } from "@/lib/auth/guards";
import { getAgentSales, agentSalesStats } from "@/lib/mock/seed";
import { PageHeader } from "@/components/app/PageHeader";
import { Forbidden } from "@/components/app/Forbidden";
import { SalesClient } from "@/components/app/agent/SalesClient";

type Props = { params: Promise<{ locale: Locale }> };

export default async function SalesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getSession();
  if (!user) return null;
  if (!roleCanAccess(user.role, "/app/sales")) return <Forbidden />;

  const t = await getTranslations("agent");

  return (
    <>
      <PageHeader title={t("sales.title")} description={t("sales.desc")} />
      <SalesClient sales={getAgentSales()} stats={agentSalesStats()} />
    </>
  );
}
