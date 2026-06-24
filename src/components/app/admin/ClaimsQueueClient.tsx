// src/components/app/admin/ClaimsQueueClient.tsx
// Claims processing queue: review a claim → approve / reject / request docs /
// mark paid. Each decisive action updates state, writes an audit entry, toasts.
// Mock.

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Claim, ClaimStatus } from "@/types/portal";
import { DataTable, type Column } from "@/components/app/DataTable";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Modal } from "@/components/app/Modal";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/app/toast";
import { useSession } from "@/lib/auth/SessionProvider";
import { useBaht } from "@/lib/format";
import { addAuditEntry } from "@/lib/mock/local-admin";
import { claimTone } from "@/components/app/business/status";

export function ClaimsQueueClient({ initial }: { initial: Claim[] }) {
  const t = useTranslations("admin.claims");
  const tc = useTranslations("admin.claimsActions");
  const ty = useTranslations("business.type");
  const cs = useTranslations("business.claimStatus");
  const tcommon = useTranslations("business.common");
  const { toast } = useToast();
  const user = useSession();
  const baht = useBaht();

  const [list, setList] = useState<Claim[]>(initial);
  const [active, setActive] = useState<Claim | null>(null);

  function audit(action: string, target: string) {
    addAuditEntry({
      id: `la_${Date.now()}`,
      actor: user.name,
      action,
      target,
      time: new Date().toISOString(),
    });
  }

  function decide(c: Claim, status: ClaimStatus, toastMsg: string, auditAction: string) {
    setList((prev) => prev.map((x) => (x.id === c.id ? { ...x, status } : x)));
    audit(auditAction, c.claimNo);
    toast(toastMsg, status === "rejected" ? "info" : "success");
    setActive(null);
  }

  const columns: Column<Claim>[] = [
    { key: "claimNo", header: t("col.claimNo"), sortValue: (c) => c.claimNo, render: (c) => <span className="tabnum">{c.claimNo}</span> },
    { key: "claimant", header: t("col.claimant"), sortValue: (c) => c.claimant },
    { key: "type", header: t("col.type"), render: (c) => ty(c.type) },
    { key: "amount", header: t("col.amount"), align: "right", sortValue: (c) => c.amount, render: (c) => <span className="tabnum">{baht(c.amount)}</span> },
    { key: "status", header: t("col.status"), sortValue: (c) => c.status, render: (c) => <StatusBadge tone={claimTone[c.status]}>{cs(c.status)}</StatusBadge> },
    { key: "date", header: t("col.date"), sortValue: (c) => c.submittedDate, render: (c) => c.submittedDate },
  ];

  const openActions = active && (active.status === "submitted" || active.status === "reviewing");

  return (
    <>
      <DataTable
        columns={columns}
        rows={list}
        pageSize={15}
        getRowKey={(c) => c.id}
        onRowClick={(c) => setActive(c)}
        labels={{
          empty: t("empty"),
          prev: tcommon("prev"),
          next: tcommon("next"),
          range: (from, to, total) => tcommon("range", { from, to, total }),
        }}
      />

      <Modal
        open={active !== null}
        onClose={() => setActive(null)}
        title={active ? `${tc("modalTitle")} · ${active.claimNo}` : ""}
      >
        {active && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <StatusBadge tone={claimTone[active.status]}>{cs(active.status)}</StatusBadge>
            </div>
            <div className="rounded-xl border border-ink-100 p-3 text-sm space-y-1.5">
              <Row label={tc("claimant")} value={active.claimant} />
              <Row label={tc("type")} value={ty(active.type)} />
              <Row label={tc("amount")} value={baht(active.amount)} />
              <Row label={tc("incident")} value={active.incident} />
            </div>

            {openActions ? (
              <div className="grid grid-cols-2 gap-2">
                <Button variant="primary" size="sm" onClick={() => decide(active, "approved", tc("approved"), tc("auditApprove"))}>
                  {tc("approve")}
                </Button>
                <Button variant="ghost" size="sm" className="text-rose-600" onClick={() => decide(active, "rejected", tc("rejected"), tc("auditReject"))}>
                  {tc("reject")}
                </Button>
                <Button variant="ghost" size="sm" className="col-span-2" onClick={() => { toast(tc("docsRequested"), "info"); setActive(null); }}>
                  {tc("requestDocs")}
                </Button>
              </div>
            ) : active.status === "approved" ? (
              <Button variant="primary" size="sm" onClick={() => decide(active, "paid", tc("paid"), tc("auditPaid"))}>
                {tc("markPaid")}
              </Button>
            ) : null}
          </div>
        )}
      </Modal>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-ink-500 shrink-0">{label}</span>
      <span className="font-600 text-ink-900 text-right">{value}</span>
    </div>
  );
}
