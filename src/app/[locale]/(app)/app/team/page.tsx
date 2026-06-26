import { setRequestLocale, getTranslations, getFormatter } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getSession } from "@/lib/auth/session";
import { roleCanAccess } from "@/lib/auth/guards";
import { buildDownlineTree, teamStats } from "@/lib/mock/seed";
import { PageHeader } from "@/components/app/PageHeader";
import { StatCard } from "@/components/app/StatCard";
import { Forbidden } from "@/components/app/Forbidden";
import { Icon } from "@/components/ui/Icon";
import { TeamTree } from "@/components/app/team/TeamTree";
import type { IconName } from "@/components/ui/Icon";

type Props = { params: Promise<{ locale: Locale }> };

export default async function TeamPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getSession();
  if (!user) return null;
  if (!roleCanAccess(user.role, "/app/team")) return <Forbidden />;

  const t = await getTranslations("team");
  const format = await getFormatter();
  const baht = (n: number) =>
    format.number(n, { style: "currency", currency: "THB", currencyDisplay: "narrowSymbol", maximumFractionDigits: 0 });

  const stats = teamStats();
  const tree = buildDownlineTree();

  const cards: Array<{ icon: IconName; label: string; value: string | number; tone: "brand" | "mint" | "gold" | "peach" }> = [
    { icon: "users", label: t("stats.directCount"), value: stats.directCount, tone: "brand" },
    { icon: "users", label: t("stats.teamSize"), value: stats.teamSize, tone: "mint" },
    { icon: "coins", label: t("stats.teamGwp"), value: baht(stats.teamGwp), tone: "gold" },
    { icon: "wallet", label: t("stats.overrideIncome"), value: baht(stats.overrideIncome), tone: "peach" },
  ];

  return (
    <>
      <PageHeader title={t("tree.title")} description={t("tree.desc")} />

      {/* compliance banner */}
      <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-sm text-emerald-800">
        <Icon name="shieldCheck" size={18} className="shrink-0 mt-0.5" />
        {t("compliance.noFees")}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {cards.map((c) => (
          <StatCard key={c.label} icon={c.icon} label={c.label} value={c.value} tone={c.tone} />
        ))}
      </div>

      <TeamTree tree={tree} rootName={user.name} />
    </>
  );
}
