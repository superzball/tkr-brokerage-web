import { setRequestLocale, getTranslations, getFormatter } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getSession } from "@/lib/auth/session";
import { roleCanAccess } from "@/lib/auth/guards";
import {
  getPolicy,
  getWorkers,
  getDocuments,
} from "@/lib/mock/seed";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import { Forbidden } from "@/components/app/Forbidden";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { policyTone, workerTone } from "@/components/app/business/status";

type Props = { params: Promise<{ locale: Locale; id: string }> };

export default async function PolicyDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const user = await getSession();
  if (!user) return null;
  if (!roleCanAccess(user.role, "/app/policies")) return <Forbidden />;

  const t = await getTranslations("business");
  const format = await getFormatter();
  const baht = (n: number) =>
    format.number(n, {
      style: "currency",
      currency: "THB",
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: 0,
    });

  const policy = getPolicy(id);
  if (!policy || policy.holderId !== user.id) {
    return (
      <>
        <PageHeader title={t("policies.title")} />
        <EmptyState
          icon="alertTri"
          title={t("policies.notFound")}
          action={
            <Button href="/app/policies" variant="ghost" size="md">
              {t("policies.detail.back")}
            </Button>
          }
        />
      </>
    );
  }

  const workers = getWorkers([policy.id]).filter((w) => w.policyId === policy.id);
  const docs = getDocuments([policy.id]).filter((d) => d.policyId === policy.id);

  const facts: Array<{ label: string; value: string }> = [
    { label: t("policies.detail.insurer"), value: policy.insurer },
    { label: t("policies.detail.sumInsured"), value: baht(policy.coverage) },
    { label: t("policies.detail.premium"), value: baht(policy.premium) },
    {
      label: t("policies.detail.period"),
      value: `${policy.startDate} → ${policy.endDate}`,
    },
  ];

  return (
    <>
      <Link
        href="/app/policies"
        className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-brand-600 mb-4"
      >
        <Icon name="chevR" size={16} className="rotate-180" />
        {t("policies.detail.back")}
      </Link>

      <PageHeader
        title={policy.policyNo}
        description={`${t(`type.${policy.type}`)} · ${policy.insurer}`}
        actions={
          <>
            <StatusBadge tone={policyTone[policy.status]}>
              {t(`policyStatus.${policy.status}`)}
            </StatusBadge>
            <Button
              href={`/app/buy?renew=${policy.id}`}
              variant="primary"
              size="md"
            >
              <Icon name="refresh" /> {t("policies.detail.renew")}
            </Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* coverage */}
        <section className="card p-6 lg:col-span-1">
          <h2 className="font-700 text-ink-900 mb-4">
            {t("policies.detail.coverageTitle")}
          </h2>
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

        {/* covered workers (worker policies only) */}
        {policy.type === "worker" && (
        <section className="card p-6 lg:col-span-2">
          <h2 className="font-700 text-ink-900 mb-4 flex items-center gap-2">
            {t("policies.detail.workersTitle")}
            {policy.workersCount != null && (
              <span className="text-sm font-500 text-ink-400">
                {t("policies.detail.workersCount", { n: policy.workersCount })}
              </span>
            )}
          </h2>
          {workers.length === 0 ? (
            <p className="text-sm text-ink-400 py-6 text-center">
              {t("policies.detail.noWorkers")}
            </p>
          ) : (
            <ul className="divide-y divide-ink-50">
              {workers.map((w) => (
                <li
                  key={w.id}
                  className="flex items-center justify-between py-3"
                >
                  <div>
                    <p className="font-600 text-ink-900">{w.name}</p>
                    <p className="text-xs text-ink-500">
                      {w.nationality} · {w.passport} · {w.job}
                    </p>
                  </div>
                  <StatusBadge tone={workerTone[w.status]}>
                    {t(`workerStatus.${w.status}`)}
                  </StatusBadge>
                </li>
              ))}
            </ul>
          )}
        </section>
        )}

        {/* documents */}
        <section className="card p-6 lg:col-span-3">
          <h2 className="font-700 text-ink-900 mb-4">
            {t("policies.detail.documentsTitle")}
          </h2>
          {docs.length === 0 ? (
            <p className="text-sm text-ink-400 py-6 text-center">
              {t("documents.empty")}
            </p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {docs.map((d) => (
                <li
                  key={d.id}
                  className="flex items-center gap-3 rounded-xl border border-ink-100 p-3"
                >
                  <span className="w-10 h-10 rounded-lg bg-sky-100 text-brand-600 flex items-center justify-center shrink-0">
                    <Icon name="doc" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-600 text-ink-900 truncate">{d.name}</p>
                    <p className="text-xs text-ink-500">
                      {t(`documents.kind.${d.kind}`)} · {d.date}
                    </p>
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
