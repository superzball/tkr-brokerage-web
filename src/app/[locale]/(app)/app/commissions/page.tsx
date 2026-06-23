import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getSession } from "@/lib/auth/session";
import { roleCanAccess } from "@/lib/auth/guards";
import { getCommissions, agentStats } from "@/lib/mock/seed";
import { PageHeader } from "@/components/app/PageHeader";
import { Forbidden } from "@/components/app/Forbidden";
import { CommissionsClient } from "@/components/app/agent/CommissionsClient";

type Props = { params: Promise<{ locale: Locale }> };

export default async function CommissionsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getSession();
  if (!user) return null;
  if (!roleCanAccess(user.role, "/app/commissions")) return <Forbidden />;

  const t = await getTranslations("agent");
  const commissions = getCommissions();
  const stats = {
    thisMonth: agentStats().commissionThisMonth,
    pending: commissions
      .filter((c) => c.status === "pending")
      .reduce((s, c) => s + c.amount, 0),
    paidYtd: commissions
      .filter((c) => c.status === "paid")
      .reduce((s, c) => s + c.amount, 0),
  };

  return (
    <>
      <PageHeader
        title={t("commissions.title")}
        description={t("commissions.desc")}
      />
      <CommissionsClient commissions={commissions} stats={stats} />
    </>
  );
}
