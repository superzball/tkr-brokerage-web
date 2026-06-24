"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useBaht } from "@/lib/format";
import { DataTable, type Column } from "@/components/app/DataTable";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Tabs } from "@/components/app/Tabs";
import { Select } from "@/components/app/form";
import { Icon } from "@/components/ui/Icon";
import { overrideRate } from "@/lib/mock/seed";
import type { DownlineMember } from "@/types/portal";
import { licenseTone } from "./license";

export function TeamSalesClient({
  members,
  period,
}: {
  members: DownlineMember[];
  period: string;
}) {
  const t = useTranslations("team");
  const tc = useTranslations("business");
  const baht = useBaht();
  const [view, setView] = useState<"member" | "generation">("member");
  const [focus, setFocus] = useState<string | null>(null);

  // descendants of a member (drill into a subtree)
  const subtreeIds = useMemo(() => {
    if (!focus) return null;
    const ids = new Set<string>([focus]);
    let added = true;
    while (added) {
      added = false;
      for (const m of members) {
        if (m.uplineId && ids.has(m.uplineId) && !ids.has(m.id)) {
          ids.add(m.id);
          added = true;
        }
      }
    }
    return ids;
  }, [focus, members]);

  const memberRows = useMemo(
    () => (subtreeIds ? members.filter((m) => subtreeIds.has(m.id)) : members),
    [members, subtreeIds],
  );
  const focusName = members.find((m) => m.id === focus)?.name;

  const byGen = useMemo(() => {
    const map = new Map<number, { count: number; gwp: number }>();
    for (const m of members) {
      const g = map.get(m.generation) ?? { count: 0, gwp: 0 };
      g.count += 1;
      if (m.licenseStatus === "verified") g.gwp += m.personalGwp;
      map.set(m.generation, g);
    }
    return [...map.entries()].sort((a, b) => a[0] - b[0]);
  }, [members]);

  const columns: Column<DownlineMember>[] = [
    {
      key: "name",
      header: t("sales.col.member"),
      sortValue: (m) => m.name,
      render: (m) => (
        <button
          type="button"
          onClick={() => setFocus(m.id)}
          className="font-600 text-ink-900 hover:text-brand-600 inline-flex items-center gap-1.5"
        >
          {m.name}
          {m.directs > 0 && <Icon name="chevR" size={14} className="text-ink-300" />}
        </button>
      ),
    },
    {
      key: "generation",
      header: t("sales.col.generation"),
      align: "center",
      sortValue: (m) => m.generation,
      render: (m) => t("common.gen", { n: m.generation }),
    },
    {
      key: "license",
      header: t("sales.col.license"),
      render: (m) => (
        <StatusBadge tone={licenseTone[m.licenseStatus]}>
          {t(`common.${m.licenseStatus}`)}
        </StatusBadge>
      ),
    },
    {
      key: "gwp",
      header: t("sales.col.gwp"),
      align: "right",
      sortValue: (m) => m.personalGwp,
      render: (m) => <span className="tabnum">{baht(m.personalGwp)}</span>,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs<"member" | "generation">
          tabs={[
            { key: "member", label: t("sales.byMember") },
            { key: "generation", label: t("sales.byGeneration") },
          ]}
          value={view}
          onChange={setView}
        />
        <Select value={period} disabled className="w-auto">
          <option>{period}</option>
        </Select>
      </div>

      {view === "member" ? (
        <>
          {focus && (
            <button
              onClick={() => setFocus(null)}
              className="chip bg-sky-100 text-brand-700 hover:bg-sky-200"
            >
              <Icon name="x" size={14} /> {focusName}
            </button>
          )}
          <DataTable
            columns={columns}
            rows={memberRows}
            getRowKey={(m) => m.id}
            labels={{
              empty: tc("common.tableEmpty"),
              prev: tc("common.prev"),
              next: tc("common.next"),
              range: (from, to, total) => tc("common.range", { from, to, total }),
            }}
          />
        </>
      ) : byGen.length === 0 ? (
        <div className="card p-10 text-center text-sm text-ink-400">
          {tc("common.tableEmpty")}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {byGen.map(([gen, g]) => (
            <div key={gen} className="card p-5">
              <p className="text-sm font-500 text-ink-500">
                {t("common.gen", { n: gen })}
              </p>
              <p className="mt-2 text-2xl font-700 text-ink-900 tabnum">{baht(g.gwp)}</p>
              <p className="mt-1 text-xs text-ink-400">
                {g.count} · {overrideRate(gen)}%
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
