import { setRequestLocale, getTranslations, getFormatter } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getSession } from "@/lib/auth/session";
import {
  businessStats,
  individualStats,
  agentStats,
  getPolicies,
  getNotifications,
  getLeads,
} from "@/lib/mock/seed";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/app/PageHeader";
import { StatCard } from "@/components/app/StatCard";
import { StatusBadge } from "@/components/app/StatusBadge";
import { SalesChart } from "@/components/agency/SalesChart";
import { Icon, type IconName } from "@/components/ui/Icon";
import type { Notification } from "@/types/portal";

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

      {user.role === "business" && <BusinessSections userId={user.id} />}
      {user.role === "individual" && <IndividualSections userId={user.id} />}
      {user.role === "agent" && <AgentSections />}
    </>
  );
}

function daysLeft(endDate: string, now: Date) {
  return Math.max(
    0,
    Math.ceil((new Date(endDate).getTime() - now.getTime()) / 86_400_000),
  );
}

const NOTIF_ICON: Record<Notification["kind"], IconName> = {
  policy: "shieldCheck",
  claim: "alertTri",
  billing: "creditcard",
  system: "info",
};

const QUICK: Array<{ href: string; icon: IconName; key: "quickBuy" | "quickAddWorkers" | "quickFileClaim" }> = [
  { href: "/app/buy", icon: "shieldCheck", key: "quickBuy" },
  { href: "/app/workers", icon: "users", key: "quickAddWorkers" },
  { href: "/app/claims", icon: "doc", key: "quickFileClaim" },
];

async function BusinessSections({ userId }: { userId: string }) {
  const t = await getTranslations("business");
  const now = new Date();
  const policies = getPolicies(userId);
  const expiring = policies
    .filter((p) => p.status === "expiring" || p.status === "expired")
    .map((p) => ({
      ...p,
      days: Math.max(
        0,
        Math.ceil(
          (new Date(p.endDate).getTime() - now.getTime()) / 86_400_000,
        ),
      ),
    }))
    .sort((a, b) => a.days - b.days);
  const activity = getNotifications();

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-3">
      {/* quick actions */}
      <section className="card p-6">
        <h2 className="font-700 text-ink-900 mb-4">{t("dashboard.quickTitle")}</h2>
        <div className="space-y-2.5">
          {QUICK.map((q) => (
            <Link
              key={q.key}
              href={q.href}
              className="flex items-center gap-3 rounded-xl border border-ink-100 p-3 hover:border-brand-200 hover:bg-sky-50/60 transition-colors"
            >
              <span className="w-9 h-9 rounded-lg bg-sky-100 text-brand-600 flex items-center justify-center shrink-0">
                <Icon name={q.icon} size={18} />
              </span>
              <span className="font-600 text-ink-900 text-sm">
                {t(`dashboard.${q.key}`)}
              </span>
              <Icon name="chevR" size={16} className="ml-auto text-ink-300" />
            </Link>
          ))}
        </div>
      </section>

      {/* expiring soon */}
      <section className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-700 text-ink-900">{t("dashboard.expiringTitle")}</h2>
          <Link
            href="/app/policies"
            className="text-xs font-600 text-brand-600 hover:underline"
          >
            {t("dashboard.viewAll")}
          </Link>
        </div>
        {expiring.length === 0 ? (
          <p className="text-sm text-ink-400 py-4 text-center">
            {t("dashboard.expiringEmpty")}
          </p>
        ) : (
          <ul className="space-y-3">
            {expiring.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3">
                <Link
                  href={`/app/policies/${p.id}`}
                  className="min-w-0 hover:text-brand-600"
                >
                  <p className="font-600 text-ink-900 truncate text-sm">
                    {p.policyNo}
                  </p>
                  <p className="text-xs text-ink-500">{t(`type.${p.type}`)}</p>
                </Link>
                <StatusBadge tone={p.status === "expired" ? "danger" : "warning"}>
                  {t("dashboard.expiringIn", { days: p.days })}
                </StatusBadge>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* recent activity */}
      <section className="card p-6">
        <h2 className="font-700 text-ink-900 mb-4">
          {t("dashboard.activityTitle")}
        </h2>
        {activity.length === 0 ? (
          <p className="text-sm text-ink-400 py-4 text-center">
            {t("dashboard.activityEmpty")}
          </p>
        ) : (
          <ul className="space-y-3.5">
            {activity.map((n) => (
              <li key={n.id} className="flex gap-3">
                <span className="w-8 h-8 rounded-lg bg-sky-100 text-brand-600 flex items-center justify-center shrink-0">
                  <Icon name={NOTIF_ICON[n.kind]} size={16} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm text-ink-800 leading-snug">{n.title}</p>
                  <p className="text-xs text-ink-400 mt-0.5">
                    {n.time.slice(0, 10)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

const INDIV_QUICK: Array<{ href: string; icon: IconName; key: "quickBuy" | "quickClaim" | "quickPolicies" }> = [
  { href: "/app/buy", icon: "shieldCheck", key: "quickBuy" },
  { href: "/app/claims", icon: "doc", key: "quickClaim" },
  { href: "/app/policies", icon: "eye", key: "quickPolicies" },
];

async function IndividualSections({ userId }: { userId: string }) {
  const t = await getTranslations("individual");
  const tb = await getTranslations("business");
  const now = new Date();
  const policies = getPolicies(userId);
  const renewals = policies
    .filter((p) => p.status === "expiring" || p.status === "expired")
    .map((p) => ({ ...p, days: daysLeft(p.endDate, now) }))
    .sort((a, b) => a.days - b.days);

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-3">
      {/* quick actions */}
      <section className="card p-6">
        <h2 className="font-700 text-ink-900 mb-4">{t("dashboard.quickTitle")}</h2>
        <div className="space-y-2.5">
          {INDIV_QUICK.map((q) => (
            <Link
              key={q.key}
              href={q.href}
              className="flex items-center gap-3 rounded-xl border border-ink-100 p-3 hover:border-brand-200 hover:bg-sky-50/60 transition-colors"
            >
              <span className="w-9 h-9 rounded-lg bg-sky-100 text-brand-600 flex items-center justify-center shrink-0">
                <Icon name={q.icon} size={18} />
              </span>
              <span className="font-600 text-ink-900 text-sm">
                {t(`dashboard.${q.key}`)}
              </span>
              <Icon name="chevR" size={16} className="ml-auto text-ink-300" />
            </Link>
          ))}
        </div>
      </section>

      {/* my policies */}
      <section className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-700 text-ink-900">{t("dashboard.myPoliciesTitle")}</h2>
          <Link
            href="/app/policies"
            className="text-xs font-600 text-brand-600 hover:underline"
          >
            {t("dashboard.viewAll")}
          </Link>
        </div>
        {policies.length === 0 ? (
          <p className="text-sm text-ink-400 py-4 text-center">
            {t("dashboard.myPoliciesEmpty")}
          </p>
        ) : (
          <ul className="space-y-3">
            {policies.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3">
                <Link
                  href={`/app/policies/${p.id}`}
                  className="min-w-0 hover:text-brand-600"
                >
                  <p className="font-600 text-ink-900 truncate text-sm">
                    {p.policyNo}
                  </p>
                  <p className="text-xs text-ink-500">{tb(`type.${p.type}`)}</p>
                </Link>
                <StatusBadge
                  tone={
                    p.status === "active"
                      ? "success"
                      : p.status === "expired"
                        ? "danger"
                        : "warning"
                  }
                >
                  {tb(`policyStatus.${p.status}`)}
                </StatusBadge>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* upcoming renewals (individual) */}
      <section className="card p-6">
        <h2 className="font-700 text-ink-900 mb-4">{t("dashboard.upcomingTitle")}</h2>
        {renewals.length === 0 ? (
          <p className="text-sm text-ink-400 py-4 text-center">
            {t("dashboard.upcomingEmpty")}
          </p>
        ) : (
          <ul className="space-y-3">
            {renewals.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3">
                <Link
                  href={`/app/policies/${p.id}`}
                  className="min-w-0 hover:text-brand-600"
                >
                  <p className="font-600 text-ink-900 truncate text-sm">
                    {p.policyNo}
                  </p>
                  <p className="text-xs text-ink-500">{tb(`type.${p.type}`)}</p>
                </Link>
                <StatusBadge tone={p.status === "expired" ? "danger" : "warning"}>
                  {tb("dashboard.expiringIn", { days: p.days })}
                </StatusBadge>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

const AGENT_QUICK: Array<{ href: string; icon: IconName; key: "quickQuote" | "quickLeads" | "quickCommissions" }> = [
  { href: "/app/quote", icon: "doc", key: "quickQuote" },
  { href: "/app/leads", icon: "target", key: "quickLeads" },
  { href: "/app/commissions", icon: "coins", key: "quickCommissions" },
];

async function AgentSections() {
  const t = await getTranslations("agent");
  const tb = await getTranslations("business");
  const leads = getLeads()
    .filter((l) => l.stage !== "won" && l.stage !== "lost")
    .sort((a, b) => (a.createdDate < b.createdDate ? 1 : -1));

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-3 items-start">
      <SalesChart />

      <div className="space-y-6">
        {/* quick actions */}
        <section className="card p-6">
          <h2 className="font-700 text-ink-900 mb-4">{t("dashboard.quickTitle")}</h2>
          <div className="space-y-2.5">
            {AGENT_QUICK.map((q) => (
              <Link
                key={q.key}
                href={q.href}
                className="flex items-center gap-3 rounded-xl border border-ink-100 p-3 hover:border-brand-200 hover:bg-sky-50/60 transition-colors"
              >
                <span className="w-9 h-9 rounded-lg bg-sky-100 text-brand-600 flex items-center justify-center shrink-0">
                  <Icon name={q.icon} size={18} />
                </span>
                <span className="font-600 text-ink-900 text-sm">
                  {t(`dashboard.${q.key}`)}
                </span>
                <Icon name="chevR" size={16} className="ml-auto text-ink-300" />
              </Link>
            ))}
          </div>
        </section>

        {/* leads needing action */}
        <section className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-700 text-ink-900">{t("dashboard.leadsTitle")}</h2>
            <Link
              href="/app/leads"
              className="text-xs font-600 text-brand-600 hover:underline"
            >
              {t("dashboard.viewAll")}
            </Link>
          </div>
          {leads.length === 0 ? (
            <p className="text-sm text-ink-400 py-4 text-center">
              {t("dashboard.leadsEmpty")}
            </p>
          ) : (
            <ul className="space-y-3">
              {leads.map((l) => (
                <li key={l.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-600 text-ink-900 truncate text-sm">
                      {l.name}
                    </p>
                    <p className="text-xs text-ink-500">{tb(`type.${l.interest}`)}</p>
                  </div>
                  <StatusBadge tone="warning">
                    {t(`leads.stage.${l.stage}`)}
                  </StatusBadge>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
