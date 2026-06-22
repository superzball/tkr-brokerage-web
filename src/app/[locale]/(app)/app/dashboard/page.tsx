import { setRequestLocale, getTranslations, getFormatter } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getSession } from "@/lib/auth/session";
import {
  businessStats,
  individualStats,
  agentStats,
} from "@/lib/mock/seed";
import { PageHeader } from "@/components/app/PageHeader";
import { StatCard } from "@/components/app/StatCard";
import type { IconName } from "@/components/ui/Icon";

type Props = { params: Promise<{ locale: Locale }> };

type Stat = { icon: IconName; label: string; value: string | number };

export default async function DashboardPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getSession();
  if (!user) return null;

  const t = await getTranslations("app.dashboard");
  const format = await getFormatter();
  const baht = (n: number) =>
    format.number(n, {
      style: "currency",
      currency: "THB",
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: 0,
    });

  let stats: Stat[];
  if (user.role === "business") {
    const s = businessStats(user.id);
    stats = [
      { icon: "shieldCheck", label: t("business.activePolicies"), value: s.activePolicies },
      { icon: "users", label: t("business.workersCovered"), value: s.workersCovered },
      { icon: "clock", label: t("business.expiringSoon"), value: s.expiringSoon },
      { icon: "alertTri", label: t("business.openClaims"), value: s.openClaims },
    ];
  } else if (user.role === "individual") {
    const s = individualStats(user.id);
    stats = [
      { icon: "shieldCheck", label: t("individual.activePolicies"), value: s.activePolicies },
      { icon: "refresh", label: t("individual.renewalsDue"), value: s.renewalsDue },
      { icon: "alertTri", label: t("individual.openClaims"), value: s.openClaims },
    ];
  } else {
    const s = agentStats();
    stats = [
      { icon: "coins", label: t("agent.commissionThisMonth"), value: baht(s.commissionThisMonth) },
      { icon: "trophy", label: t("agent.tier"), value: s.tier },
      { icon: "users", label: t("agent.activeClients"), value: s.activeClients },
      { icon: "target", label: t("agent.openLeads"), value: s.openLeads },
    ];
  }

  return (
    <>
      <PageHeader
        title={t("greeting", { name: user.name })}
        description={t("subtitle")}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} icon={s.icon} label={s.label} value={s.value} />
        ))}
      </div>
    </>
  );
}
