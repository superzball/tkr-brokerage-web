// src/components/app/admin/InvoicesClient.tsx
// Platform invoices with reconciliation: mark an unpaid/overdue invoice paid.
// Updates state, writes audit, toast. Mock.

"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { Invoice } from "@/types/portal";
import { DataTable, type Column } from "@/components/app/DataTable";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Modal } from "@/components/app/Modal";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/app/toast";
import { useSession } from "@/lib/auth/SessionProvider";
import { useBaht } from "@/lib/format";
import { addAuditEntry } from "@/lib/mock/local-admin";
import { invoiceTone } from "@/components/app/business/status";

export function InvoicesClient({ initial }: { initial: Invoice[] }) {
  const t = useTranslations("admin.invoices");
  const ta = useTranslations("admin.invoicesActions");
  const is = useTranslations("business.invoiceStatus");
  const tcommon = useTranslations("business.common");
  const { toast } = useToast();
  const me = useSession();
  const baht = useBaht();

  const [list, setList] = useState<Invoice[]>(initial);
  const [active, setActive] = useState<Invoice | null>(null);

  const outstanding = useMemo(
    () => list.filter((i) => i.status !== "paid").reduce((s, i) => s + i.amount, 0),
    [list],
  );

  function markPaid(inv: Invoice) {
    setList((prev) => prev.map((x) => (x.id === inv.id ? { ...x, status: "paid" } : x)));
    addAuditEntry({ id: `la_${Date.now()}`, actor: me.name, action: ta("auditReconcile"), target: inv.invoiceNo, time: new Date().toISOString() });
    toast(ta("paidDone"), "success");
    setActive(null);
  }

  const columns: Column<Invoice>[] = [
    { key: "invoiceNo", header: t("col.invoiceNo"), sortValue: (i) => i.invoiceNo, render: (i) => <span className="tabnum">{i.invoiceNo}</span> },
    { key: "amount", header: t("col.amount"), align: "right", sortValue: (i) => i.amount, render: (i) => <span className="tabnum">{baht(i.amount)}</span> },
    { key: "status", header: t("col.status"), sortValue: (i) => i.status, render: (i) => <StatusBadge tone={invoiceTone[i.status]}>{is(i.status)}</StatusBadge> },
    { key: "issued", header: t("col.issued"), render: (i) => i.issuedDate },
    { key: "due", header: t("col.due"), render: (i) => i.dueDate },
  ];

  return (
    <>
      <div className="card p-4 mb-4 flex items-center justify-between">
        <span className="text-sm text-ink-500">{ta("pendingTotal")}</span>
        <span className="text-xl font-700 text-ink-900 tabnum">{baht(outstanding)}</span>
      </div>

      <DataTable
        columns={columns}
        rows={list}
        pageSize={15}
        getRowKey={(i) => i.id}
        onRowClick={(i) => setActive(i)}
        labels={{
          empty: t("empty"),
          prev: tcommon("prev"),
          next: tcommon("next"),
          range: (from, to, total) => tcommon("range", { from, to, total }),
        }}
      />

      <Modal open={active !== null} onClose={() => setActive(null)} title={active ? active.invoiceNo : ""}>
        {active && (
          <div className="space-y-4">
            <div className="rounded-xl border border-ink-100 p-3 text-sm space-y-1.5">
              <div className="flex justify-between"><span className="text-ink-500">{t("col.amount")}</span><span className="font-600 tabnum">{baht(active.amount)}</span></div>
              <div className="flex justify-between"><span className="text-ink-500">{t("col.status")}</span><StatusBadge tone={invoiceTone[active.status]}>{is(active.status)}</StatusBadge></div>
              <div className="flex justify-between"><span className="text-ink-500">{t("col.due")}</span><span className="font-600">{active.dueDate}</span></div>
            </div>
            {active.status !== "paid" && (
              <Button variant="primary" size="sm" onClick={() => markPaid(active)}>
                {ta("markPaid")}
              </Button>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
