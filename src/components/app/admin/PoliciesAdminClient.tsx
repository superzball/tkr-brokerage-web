// src/components/app/admin/PoliciesAdminClient.tsx
// Platform policies with lifecycle actions (issue / endorse / renew / cancel).
// Row-click opens a manage modal; status-changing actions update state, write an
// audit entry, and toast. Mock.

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Policy, PolicyStatus } from "@/types/portal";
import { DataTable, type Column } from "@/components/app/DataTable";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Modal } from "@/components/app/Modal";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/app/toast";
import { useSession } from "@/lib/auth/SessionProvider";
import { useBaht } from "@/lib/format";
import { addAuditEntry } from "@/lib/mock/local-admin";
import { policyTone } from "@/components/app/business/status";

export function PoliciesAdminClient({ initial }: { initial: Policy[] }) {
  const t = useTranslations("admin.policies");
  const ta = useTranslations("admin.policiesActions");
  const ty = useTranslations("business.type");
  const ps = useTranslations("business.policyStatus");
  const tcommon = useTranslations("business.common");
  const { toast } = useToast();
  const user = useSession();
  const baht = useBaht();

  const [list, setList] = useState<Policy[]>(initial);
  const [active, setActive] = useState<Policy | null>(null);

  function audit(action: string, target: string) {
    addAuditEntry({
      id: `la_${Date.now()}`,
      actor: user.name,
      action,
      target,
      time: new Date().toISOString(),
    });
  }

  function apply(p: Policy, status: PolicyStatus, toastMsg: string, auditAction?: string) {
    setList((prev) => prev.map((x) => (x.id === p.id ? { ...x, status } : x)));
    if (auditAction) audit(auditAction, p.policyNo);
    toast(toastMsg, "success");
    setActive(null);
  }

  const columns: Column<Policy>[] = [
    { key: "policyNo", header: t("col.policyNo"), sortValue: (p) => p.policyNo, render: (p) => <span className="tabnum">{p.policyNo}</span> },
    { key: "type", header: t("col.type"), render: (p) => ty(p.type) },
    { key: "insurer", header: t("col.insurer") },
    { key: "premium", header: t("col.premium"), align: "right", sortValue: (p) => p.premium, render: (p) => <span className="tabnum">{baht(p.premium)}</span> },
    { key: "status", header: t("col.status"), sortValue: (p) => p.status, render: (p) => <StatusBadge tone={policyTone[p.status]}>{ps(p.status)}</StatusBadge> },
    { key: "end", header: t("col.end"), sortValue: (p) => p.endDate, render: (p) => p.endDate },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        rows={list}
        pageSize={15}
        getRowKey={(p) => p.id}
        onRowClick={(p) => setActive(p)}
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
        title={active ? `${ta("modalTitle")} · ${active.policyNo}` : ""}
      >
        {active && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-ink-500">{ta("currentStatus")}:</span>
              <StatusBadge tone={policyTone[active.status]}>{ps(active.status)}</StatusBadge>
            </div>
            <div className="rounded-xl border border-ink-100 p-3 text-sm space-y-1.5">
              <Row label={t("col.type")} value={ty(active.type)} />
              <Row label={t("col.insurer")} value={active.insurer} />
              <Row label={t("col.premium")} value={baht(active.premium)} />
              <Row label={t("col.end")} value={active.endDate} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {active.status === "pending" && (
                <Button variant="primary" size="sm" onClick={() => apply(active, "active", ta("issued"), ta("auditIssue"))}>
                  {ta("issue")}
                </Button>
              )}
              {(active.status === "expiring" || active.status === "expired") && (
                <Button variant="primary" size="sm" onClick={() => apply(active, "active", ta("renewed"), ta("auditRenew"))}>
                  {ta("renew")}
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => { audit(ta("endorse"), active.policyNo); toast(ta("endorsed"), "success"); setActive(null); }}>
                {ta("endorse")}
              </Button>
              {active.status !== "expired" && (
                <Button variant="ghost" size="sm" className="text-rose-600" onClick={() => apply(active, "expired", ta("cancelled"), ta("auditCancel"))}>
                  {ta("cancel")}
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-ink-500">{label}</span>
      <span className="font-600 text-ink-900">{value}</span>
    </div>
  );
}
