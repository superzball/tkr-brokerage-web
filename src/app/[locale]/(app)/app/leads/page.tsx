import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getSession } from "@/lib/auth/session";
import { roleCanAccess } from "@/lib/auth/guards";
import { getLeads } from "@/lib/mock/seed";
import { PageHeader } from "@/components/app/PageHeader";
import { Forbidden } from "@/components/app/Forbidden";
import { LeadsClient } from "@/components/app/agent/LeadsClient";

type Props = { params: Promise<{ locale: Locale }> };

export default async function LeadsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getSession();
  if (!user) return null;
  if (!roleCanAccess(user.role, "/app/leads")) return <Forbidden />;

  const t = await getTranslations("agent");
  const leads = getLeads();

  return (
    <>
      <PageHeader title={t("leads.title")} description={t("leads.desc")} />
      <LeadsClient leads={leads} />
    </>
  );
}
