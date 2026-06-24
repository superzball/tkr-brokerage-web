"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useBaht } from "@/lib/format";
import { DataTable, type Column } from "@/components/app/DataTable";
import { StatCard } from "@/components/app/StatCard";
import { StatusBadge } from "@/components/app/StatusBadge";
import { useToast } from "@/components/app/toast";
import { Icon } from "@/components/ui/Icon";
import { overrideRate } from "@/lib/mock/seed";
import type { TeamOverride, DownlineMember } from "@/types/portal";

export function TeamIncomeClient({
  overrides,
  pendingMembers,
  total,
}: {
  overrides: TeamOverride[];
  pendingMembers: DownlineMember[];
  total: number;
}) {
  const t = useTranslations("team");
  const tc = useTranslations("business");
  const baht = useBaht();
  const { toast } = useToast();

  const byGen = useMemo(() => {
    const map = new Map<number, number>();
    for (const o of overrides) map.set(o.generation, (map.get(o.generation) ?? 0) + o.amount);
    return [...map.entries()].sort((a, b) => a[0] - b[0]);
  }, [overrides]);

  const columns: Column<TeamOverride>[] = [
    {
      key: "source",
      header: t("income.col.source"),
      sortValue: (o) => o.sourceName,
      render: (o) => <span className="font-600 text-ink-900">{o.sourceName}</span>,
    },
    {
      key: "generation",
      header: t("income.col.generation"),
      align: "center",
      sortValue: (o) => o.generation,
      render: (o) => t("common.gen", { n: o.generation }),
    },
    {
      key: "base",
      header: t("income.col.base"),
      align: "right",
      sortValue: (o) => o.baseGwp,
      render: (o) => <span className="tabnum">{baht(o.baseGwp)}</span>,
    },
    {
      key: "rate",
      header: t("income.col.rate"),
      align: "right",
      render: (o) => <span className="tabnum">{o.rate}%</span>,
    },
    {
      key: "amount",
      header: t("income.col.amount"),
      align: "right",
      sortValue: (o) => o.amount,
      render: (o) => <span className="font-600 tabnum">{baht(o.amount)}</span>,
    },
    {
      key: "status",
      header: t("income.col.status"),
      render: (o) => (
        <StatusBadge tone={o.status === "paid" ? "success" : "warning"}>
          {t(`common.status${o.status === "paid" ? "Paid" : "Pending"}`)}
        </StatusBadge>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon="coins" label={t("income.total")} value={baht(total)} />
      </div>

      {/* by generation (matches the override schedule) */}
      <section className="card p-6">
        <h2 className="font-700 text-ink-900 mb-4">{t("income.byGeneration")}</h2>
        {byGen.length === 0 && (
          <p className="text-sm text-ink-400">{tc("common.tableEmpty")}</p>
        )}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {byGen.map(([gen, amount]) => (
            <div key={gen} className="rounded-xl border border-ink-100 p-4">
              <p className="text-sm text-ink-500">
                {t("common.gen", { n: gen })} · {overrideRate(gen)}%
              </p>
              <p className="mt-1.5 text-xl font-700 text-brand-700 tabnum">{baht(amount)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* by source member */}
      <section>
        <h2 className="font-700 text-ink-900 mb-3">{t("income.bySource")}</h2>
        <DataTable
          columns={columns}
          rows={overrides}
          getRowKey={(o) => o.id}
          labels={{
            empty: tc("common.tableEmpty"),
            prev: tc("common.prev"),
            next: tc("common.next"),
            range: (from, to, total2) => tc("common.range", { from, to, total: total2 }),
          }}
        />
      </section>

      {/* compliance gate — pending-license members earn 0 */}
      {pendingMembers.length > 0 && (
        <section className="card p-6 border border-amber-200 bg-amber-50/50">
          <h2 className="font-700 text-ink-900 flex items-center gap-2">
            <span className="text-amber-600"><Icon name="alertTri" size={18} /></span>
            {t("income.pendingTitle")}
          </h2>
          <p className="mt-1.5 text-sm text-ink-600">{t("income.pendingDesc")}</p>
          <ul className="mt-4 divide-y divide-amber-100">
            {pendingMembers.map((m) => (
              <li key={m.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-600 text-ink-900">{m.name}</p>
                  <p className="text-xs text-amber-700">{t("common.notEarning")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-600 text-ink-400 tabnum">{baht(0)}</span>
                  <button
                    onClick={() => toast(t("common.verifySent"), "success")}
                    className="chip bg-gold-100 text-gold-600 hover:bg-gold-200"
                  >
                    {t("common.verify")}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
