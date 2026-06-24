// src/components/app/admin/PayoutsClient.tsx
// Commission + team-override payouts with "Approve & run" (batch-pay all pending
// in the active tab) and per-row mark-paid. Each run writes an audit entry +
// toast. Override only accrues for verified-license downline (amount already 0
// otherwise in the seed). Mock.

"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { Commission, TeamOverride } from "@/types/portal";
import { DataTable, type Column } from "@/components/app/DataTable";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Tabs } from "@/components/app/Tabs";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/app/toast";
import { useSession } from "@/lib/auth/SessionProvider";
import { useBaht } from "@/lib/format";
import { addAuditEntry } from "@/lib/mock/local-admin";

type Pay = {
  id: string;
  period: string;
  name: string;
  base: number;
  rate: number;
  amount: number;
  status: "pending" | "paid";
};

export function PayoutsClient({
  commissions,
  overrides,
}: {
  commissions: Commission[];
  overrides: TeamOverride[];
}) {
  const t = useTranslations("admin.payouts");
  const ta = useTranslations("admin.payoutsActions");
  const tc = useTranslations("team.common");
  const tcommon = useTranslations("business.common");
  const { toast } = useToast();
  const me = useSession();
  const baht = useBaht();

  const [tab, setTab] = useState<"commission" | "override">("commission");
  const [comm, setComm] = useState<Pay[]>(
    commissions.map((c) => ({ id: c.id, period: c.period, name: c.clientName, base: c.base, rate: c.rate, amount: c.amount, status: c.status })),
  );
  const [over, setOver] = useState<Pay[]>(
    overrides.map((o) => ({ id: o.id, period: o.period, name: o.sourceName, base: o.baseGwp, rate: o.rate, amount: o.amount, status: o.status })),
  );

  const rows = tab === "commission" ? comm : over;
  const setRows = tab === "commission" ? setComm : setOver;
  const pendingTotal = useMemo(
    () => rows.filter((r) => r.status === "pending").reduce((s, r) => s + r.amount, 0),
    [rows],
  );

  function audit() {
    addAuditEntry({ id: `la_${Date.now()}`, actor: me.name, action: ta("auditPayout"), target: tab === "commission" ? t("tabCommission") : t("tabOverride"), time: new Date().toISOString() });
  }
  function runAll() {
    setRows((prev) => prev.map((r) => (r.status === "pending" ? { ...r, status: "paid" } : r)));
    audit();
    toast(ta("batchDone"), "success");
  }
  function markPaid(id: string) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: "paid" } : r)));
    toast(ta("paidDone"), "success");
  }

  const columns: Column<Pay>[] = [
    { key: "period", header: t("col.period"), sortValue: (r) => r.period },
    { key: "name", header: t("col.name"), sortValue: (r) => r.name },
    { key: "base", header: t("col.base"), align: "right", sortValue: (r) => r.base, render: (r) => <span className="tabnum">{baht(r.base)}</span> },
    { key: "rate", header: t("col.rate"), align: "right", render: (r) => <span className="tabnum">{r.rate}%</span> },
    { key: "amount", header: t("col.amount"), align: "right", sortValue: (r) => r.amount, render: (r) => <span className="tabnum">{baht(r.amount)}</span> },
    {
      key: "status",
      header: t("col.status"),
      render: (r) =>
        r.status === "paid" ? (
          <StatusBadge tone="success">{tc("statusPaid")}</StatusBadge>
        ) : (
          <button onClick={() => markPaid(r.id)} className="chip bg-gold-100 text-gold-600 hover:bg-gold-200">
            {ta("markPaid")}
          </button>
        ),
    },
  ];

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <Tabs<"commission" | "override">
          tabs={[
            { key: "commission", label: t("tabCommission") },
            { key: "override", label: t("tabOverride") },
          ]}
          value={tab}
          onChange={setTab}
        />
        <div className="flex items-center gap-3">
          <span className="text-sm text-ink-500">
            {ta("pendingTotal")}: <span className="font-700 text-ink-900 tabnum">{baht(pendingTotal)}</span>
          </span>
          <Button variant="primary" size="sm" onClick={runAll} disabled={pendingTotal === 0}>
            {ta("approveRun")}
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        pageSize={10}
        getRowKey={(r) => r.id}
        labels={{
          empty: t("empty"),
          prev: tcommon("prev"),
          next: tcommon("next"),
          range: (from, to, total) => tcommon("range", { from, to, total }),
        }}
      />
    </>
  );
}
