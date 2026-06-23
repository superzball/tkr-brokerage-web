"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useBaht } from "@/lib/format";
import { DataTable, type Column } from "@/components/app/DataTable";
import { StatCard } from "@/components/app/StatCard";
import { StatusBadge } from "@/components/app/StatusBadge";
import { useToast } from "@/components/app/toast";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import type { Commission } from "@/types/portal";

export function CommissionsClient({
  commissions,
  stats,
}: {
  commissions: Commission[];
  stats: { thisMonth: number; pending: number; paidYtd: number };
}) {
  const t = useTranslations("agent");
  const tc = useTranslations("business");
  const baht = useBaht();
  const { toast } = useToast();

  // Payout history: paid commissions grouped by period.
  const payouts = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of commissions) {
      if (c.status !== "paid") continue;
      map.set(c.period, (map.get(c.period) ?? 0) + c.amount);
    }
    return [...map.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, [commissions]);

  const columns: Column<Commission>[] = [
    { key: "period", header: t("commissions.col.period"), sortValue: (c) => c.period },
    {
      key: "policyNo",
      header: t("commissions.col.policyNo"),
      render: (c) => <span className="font-600 text-ink-900">{c.policyNo}</span>,
    },
    { key: "client", header: t("commissions.col.client"), render: (c) => c.clientName },
    {
      key: "base",
      header: t("commissions.col.base"),
      align: "right",
      sortValue: (c) => c.base,
      render: (c) => <span className="tabnum">{baht(c.base)}</span>,
    },
    {
      key: "rate",
      header: t("commissions.col.rate"),
      align: "right",
      render: (c) => <span className="tabnum">{c.rate}%</span>,
    },
    {
      key: "amount",
      header: t("commissions.col.amount"),
      align: "right",
      sortValue: (c) => c.amount,
      render: (c) => <span className="font-600 tabnum">{baht(c.amount)}</span>,
    },
    {
      key: "status",
      header: t("commissions.col.status"),
      sortValue: (c) => c.status,
      render: (c) => (
        <StatusBadge tone={c.status === "paid" ? "success" : "warning"}>
          {t(`commissions.status.${c.status}`)}
        </StatusBadge>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon="coins" label={t("commissions.statThisMonth")} value={baht(stats.thisMonth)} />
        <StatCard icon="clock" label={t("commissions.statPending")} value={baht(stats.pending)} deltaTone="flat" />
        <StatCard icon="wallet" label={t("commissions.statPaidYtd")} value={baht(stats.paidYtd)} />
      </div>

      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="md"
          onClick={() => toast(t("commissions.downloaded"), "success")}
        >
          <Icon name="download" /> {t("commissions.download")}
        </Button>
      </div>

      <DataTable
        columns={columns}
        rows={commissions}
        getRowKey={(c) => c.id}
        labels={{
          empty: t("commissions.empty"),
          prev: tc("common.prev"),
          next: tc("common.next"),
          range: (from, to, total) => tc("common.range", { from, to, total }),
        }}
      />

      <section className="card p-6">
        <h2 className="font-700 text-ink-900 mb-4">{t("commissions.payoutTitle")}</h2>
        {payouts.length === 0 ? (
          <p className="text-sm text-ink-400 py-4 text-center">
            {t("commissions.payoutEmpty")}
          </p>
        ) : (
          <ul className="divide-y divide-ink-50">
            {payouts.map(([period, total]) => (
              <li key={period} className="flex items-center justify-between py-3">
                <span className="font-600 text-ink-900 tabnum">{period}</span>
                <span className="font-600 text-ink-900 tabnum">{baht(total)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
