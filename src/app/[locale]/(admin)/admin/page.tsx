import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { Icon, type IconName } from "@/components/ui/Icon";
import { PageHeader } from "@/components/app/PageHeader";
import { StatCard } from "@/components/app/StatCard";
import { StatusBadge } from "@/components/app/StatusBadge";
import {
  adminStats,
  getAuditLog,
  getOrders,
  getDownline,
} from "@/lib/mock/seed";

type Props = { params: Promise<{ locale: Locale }> };

export default async function AdminDashboard({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("admin.dashboard");
  const format = await getFormatter();
  const baht = (n: number) =>
    format.number(n, {
      style: "currency",
      currency: "THB",
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: 0,
    });

  const stats = adminStats();
  const pendingApprovals = getDownline().filter(
    (d) => d.licenseStatus !== "verified",
  ).length;
  const awaitingOrders = getOrders().filter(
    (o) => o.status === "awaiting_payment",
  ).length;
  const recent = getAuditLog().slice(0, 6);

  const cards: { icon: IconName; label: string; value: string | number }[] = [
    { icon: "coins", label: t("gwp"), value: baht(stats.gwp) },
    { icon: "shieldCheck", label: t("activePolicies"), value: stats.activePolicies },
    { icon: "file", label: t("pendingClaims"), value: stats.pendingClaims },
    { icon: "headset", label: t("openTickets"), value: stats.openTickets },
    { icon: "doc", label: t("draftArticles"), value: stats.draftArticles },
  ];

  const queues: { href: string; icon: IconName; label: string; count: number }[] = [
    { href: "/admin/claims", icon: "file", label: t("qClaims"), count: stats.pendingClaims },
    { href: "/admin/approvals", icon: "shieldCheck", label: t("qApprovals"), count: pendingApprovals },
    { href: "/admin/support", icon: "headset", label: t("qTickets"), count: stats.openTickets },
    { href: "/admin/sales/orders", icon: "creditcard", label: t("qOrders"), count: awaitingOrders },
  ];

  return (
    <>
      <PageHeader title={t("title")} description={t("subtitle")} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((c) => (
          <StatCard key={c.label} icon={c.icon} label={c.label} value={c.value} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* needs-action queues */}
        <section className="card p-5">
          <h2 className="font-700 text-ink-900 mb-3">{t("queuesTitle")}</h2>
          <ul className="space-y-1">
            {queues.map((q) => (
              <li key={q.href}>
                <Link
                  href={q.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-sky-50 transition-colors"
                >
                  <span className="w-9 h-9 rounded-xl bg-sky-100 text-brand-600 flex items-center justify-center shrink-0">
                    <Icon name={q.icon} size={18} />
                  </span>
                  <span className="flex-1 text-sm text-ink-700">{q.label}</span>
                  <span className="tabnum text-lg font-700 text-ink-900">{q.count}</span>
                  <Icon name="chevR" size={16} className="text-ink-300" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* recent activity (audit) */}
        <section className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-700 text-ink-900">{t("recentAudit")}</h2>
            <Link href="/admin/audit" className="text-xs font-600 text-brand-600 hover:underline">
              {t("viewAll")}
            </Link>
          </div>
          <ul className="space-y-2.5">
            {recent.map((a) => (
              <li key={a.id} className="flex items-start gap-3">
                <span className="mt-0.5 w-8 h-8 rounded-lg bg-ink-50 text-ink-500 flex items-center justify-center shrink-0">
                  <Icon name="clock" size={15} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-ink-800 leading-snug">
                    <span className="font-600">{a.actor}</span> · {a.action}
                  </p>
                  <p className="text-xs text-ink-400">
                    {format.dateTime(new Date(a.time), { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <StatusBadge tone="neutral" className="text-xs shrink-0">{a.target}</StatusBadge>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
