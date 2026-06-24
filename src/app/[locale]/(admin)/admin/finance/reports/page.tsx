import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getSession } from "@/lib/auth/session";
import { staffCan } from "@/lib/auth/rbac";
import { AdminForbidden } from "@/components/app/admin/AdminForbidden";
import { PageHeader } from "@/components/app/PageHeader";
import { StatCard } from "@/components/app/StatCard";
import { BarChart, type Bar } from "@/components/app/admin/BarChart";
import {
  getAllPolicies,
  getAllClaims,
  getOrders,
  getAgentSales,
} from "@/lib/mock/seed";
import type { InsuranceType, PolicyStatus, OrderChannel } from "@/types/portal";

type Props = { params: Promise<{ locale: Locale }> };

export default async function ReportsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getSession();
  if (!user || !staffCan(user, "ops")) return <AdminForbidden />;

  const t = await getTranslations("admin.reports");
  const ty = await getTranslations("business.type");
  const ps = await getTranslations("business.policyStatus");
  const tch = await getTranslations("admin.channel");
  const format = await getFormatter();
  const baht = (n: number) =>
    format.number(n, { style: "currency", currency: "THB", currencyDisplay: "narrowSymbol", maximumFractionDigits: 0 });

  const policies = getAllPolicies();
  const claims = getAllClaims();
  const orders = getOrders();
  const sales = getAgentSales();

  const totalGwp = policies.reduce((s, p) => s + p.premium, 0);

  // GWP by product
  const byProduct = new Map<InsuranceType, number>();
  policies.forEach((p) => byProduct.set(p.type, (byProduct.get(p.type) ?? 0) + p.premium));
  const gwpBars: Bar[] = [...byProduct.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => ({ label: ty(k), value: v, display: baht(v) }));

  // policies by status
  const byStatus = new Map<PolicyStatus, number>();
  policies.forEach((p) => byStatus.set(p.status, (byStatus.get(p.status) ?? 0) + 1));
  const statusBars: Bar[] = [...byStatus.entries()].map(([k, v]) => ({ label: ps(k), value: v, display: String(v) }));

  // orders by channel
  const byChannel = new Map<OrderChannel, number>();
  orders.forEach((o) => byChannel.set(o.channel, (byChannel.get(o.channel) ?? 0) + 1));
  const channelBars: Bar[] = [...byChannel.entries()].map(([k, v]) => ({ label: tch(k), value: v, display: String(v) }));

  const cards = [
    { icon: "coins" as const, label: t("totalGwp"), value: baht(totalGwp) },
    { icon: "shieldCheck" as const, label: t("totalPolicies"), value: policies.length },
    { icon: "file" as const, label: t("totalClaims"), value: claims.length },
    { icon: "box" as const, label: t("totalOrders"), value: orders.length + sales.length },
  ];

  return (
    <>
      <PageHeader title={t("title")} description={t("desc")} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <StatCard key={c.label} icon={c.icon} label={c.label} value={c.value} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="card p-5">
          <h2 className="font-700 text-ink-900 mb-4">{t("gwpByProduct")}</h2>
          <BarChart bars={gwpBars} />
        </section>
        <section className="card p-5">
          <h2 className="font-700 text-ink-900 mb-4">{t("policiesByStatus")}</h2>
          <BarChart bars={statusBars} />
        </section>
        <section className="card p-5 lg:col-span-2">
          <h2 className="font-700 text-ink-900 mb-4">{t("ordersByChannel")}</h2>
          <BarChart bars={channelBars} />
        </section>
      </div>
    </>
  );
}
