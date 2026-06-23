import { setRequestLocale, getTranslations, getFormatter } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getSession } from "@/lib/auth/session";
import { roleCanAccess } from "@/lib/auth/guards";
import { getClients, getCommissions } from "@/lib/mock/seed";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import { Forbidden } from "@/components/app/Forbidden";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

type Props = { params: Promise<{ locale: Locale; id: string }> };

export default async function ClientDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const user = await getSession();
  if (!user) return null;
  if (!roleCanAccess(user.role, "/app/clients")) return <Forbidden />;

  const t = await getTranslations("agent");
  const format = await getFormatter();
  const baht = (n: number) =>
    format.number(n, {
      style: "currency",
      currency: "THB",
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: 0,
    });

  const client = getClients().find((c) => c.id === id);
  if (!client) {
    return (
      <>
        <PageHeader title={t("clients.title")} />
        <EmptyState
          icon="alertTri"
          title={t("clients.notFound")}
          action={
            <Button href="/app/clients" variant="ghost" size="md">
              {t("clients.detail.back")}
            </Button>
          }
        />
      </>
    );
  }

  // The agent's commissions for this client double as their policy + history record.
  const history = getCommissions().filter((c) => c.clientName === client.name);
  const policies = Array.from(new Set(history.map((c) => c.policyNo))).map(
    (policyNo) => history.find((c) => c.policyNo === policyNo)!,
  );

  const facts = [
    { label: t("clients.detail.policiesCount"), value: String(client.policies) },
    { label: t("clients.detail.premiumYtd"), value: baht(client.premiumYtd) },
    { label: t("clients.detail.since"), value: client.since },
  ];

  return (
    <>
      <Link
        href="/app/clients"
        className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-brand-600 mb-4"
      >
        <Icon name="chevR" size={16} className="rotate-180" />
        {t("clients.detail.back")}
      </Link>

      <PageHeader
        title={client.name}
        description={t(`clients.type.${client.type}`)}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="card p-6 lg:col-span-1">
          <dl className="space-y-3.5 text-sm">
            {facts.map((f) => (
              <div key={f.label} className="flex justify-between gap-4">
                <dt className="text-ink-500">{f.label}</dt>
                <dd className="font-600 text-ink-900 text-right tabnum">
                  {f.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="card p-6 lg:col-span-2">
          <h2 className="font-700 text-ink-900 mb-4">
            {t("clients.detail.policiesTitle")}
          </h2>
          {policies.length === 0 ? (
            <p className="text-sm text-ink-400 py-6 text-center">
              {t("clients.detail.policiesEmpty")}
            </p>
          ) : (
            <ul className="divide-y divide-ink-50">
              {policies.map((p) => (
                <li
                  key={p.policyNo}
                  className="flex items-center justify-between py-3"
                >
                  <span className="font-600 text-ink-900">{p.policyNo}</span>
                  <span className="text-sm text-ink-500 tabnum">
                    {baht(p.base)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card p-6 lg:col-span-3">
          <h2 className="font-700 text-ink-900 mb-4">
            {t("clients.detail.historyTitle")}
          </h2>
          {history.length === 0 ? (
            <p className="text-sm text-ink-400 py-6 text-center">
              {t("clients.detail.historyEmpty")}
            </p>
          ) : (
            <ul className="divide-y divide-ink-50">
              {history.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div>
                    <p className="font-600 text-ink-900">{c.policyNo}</p>
                    <p className="text-xs text-ink-500">
                      {c.period} · {c.rate}%
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-600 text-ink-900 tabnum">
                      {baht(c.amount)}
                    </span>
                    <StatusBadge tone={c.status === "paid" ? "success" : "warning"}>
                      {t(`commissions.status.${c.status}`)}
                    </StatusBadge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
