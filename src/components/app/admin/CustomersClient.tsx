// src/components/app/admin/CustomersClient.tsx
// All customers with KYC verify + account suspend/reactivate. Row-click opens a
// detail modal; actions update client state, write an audit entry, toast. Mock.

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { User } from "@/types/portal";
import { DataTable, type Column } from "@/components/app/DataTable";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Modal } from "@/components/app/Modal";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/app/toast";
import { useSession } from "@/lib/auth/SessionProvider";
import { addAuditEntry } from "@/lib/mock/local-admin";

type CustState = { kyc: boolean; active: boolean };

export function CustomersClient({ customers }: { customers: User[] }) {
  const t = useTranslations("admin.customers");
  const ta = useTranslations("admin.customersActions");
  const tcommon = useTranslations("business.common");
  const { toast } = useToast();
  const me = useSession();

  const [state, setState] = useState<Record<string, CustState>>(() =>
    Object.fromEntries(customers.map((c) => [c.id, { kyc: false, active: true }])),
  );
  const [active, setActive] = useState<User | null>(null);

  function audit(action: string, target: string) {
    addAuditEntry({ id: `la_${Date.now()}`, actor: me.name, action, target, time: new Date().toISOString() });
  }
  function patch(id: string, p: Partial<CustState>) {
    setState((prev) => ({ ...prev, [id]: { ...prev[id]!, ...p } }));
  }

  const columns: Column<User>[] = [
    { key: "name", header: t("col.name"), sortValue: (c) => c.name },
    {
      key: "type",
      header: t("col.type"),
      render: (c) => (
        <StatusBadge tone={c.role === "business" ? "info" : "neutral"}>
          {c.role === "business" ? t("typeBusiness") : t("typeIndividual")}
        </StatusBadge>
      ),
    },
    { key: "email", header: t("col.email"), render: (c) => c.email ?? "—" },
    {
      key: "kyc",
      header: ta("kycCol"),
      render: (c) =>
        state[c.id]?.kyc ? (
          <StatusBadge tone="success">{ta("kycVerified")}</StatusBadge>
        ) : (
          <StatusBadge tone="warning">{ta("kycUnverified")}</StatusBadge>
        ),
    },
    {
      key: "acc",
      header: ta("account"),
      render: (c) =>
        state[c.id]?.active ? (
          <StatusBadge tone="success">{ta("accActive")}</StatusBadge>
        ) : (
          <StatusBadge tone="danger">{ta("accSuspended")}</StatusBadge>
        ),
    },
  ];

  const s = active ? state[active.id] : undefined;

  return (
    <>
      <DataTable
        columns={columns}
        rows={customers}
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

      <Modal open={active !== null} onClose={() => setActive(null)} title={active ? `${ta("modalTitle")} · ${active.name}` : ""}>
        {active && s && (
          <div className="space-y-4">
            <div className="rounded-xl border border-ink-100 p-3 text-sm space-y-1.5">
              <Row label={t("col.email")} value={active.email ?? "—"} />
              <Row label={t("col.phone")} value={active.phone ?? "—"} />
              {active.company && <Row label="" value={active.company} />}
              <div className="flex justify-between pt-1">
                <span className="text-ink-500">{ta("kyc")}</span>
                <StatusBadge tone={s.kyc ? "success" : "warning"}>
                  {s.kyc ? ta("kycVerified") : ta("kycUnverified")}
                </StatusBadge>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-500">{ta("account")}</span>
                <StatusBadge tone={s.active ? "success" : "danger"}>
                  {s.active ? ta("accActive") : ta("accSuspended")}
                </StatusBadge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {!s.kyc && (
                <Button variant="primary" size="sm" onClick={() => { patch(active.id, { kyc: true }); audit(ta("auditVerify"), active.name); toast(ta("kycDone"), "success"); }}>
                  {ta("verifyKyc")}
                </Button>
              )}
              {s.active ? (
                <Button variant="ghost" size="sm" className="text-rose-600" onClick={() => { patch(active.id, { active: false }); audit(ta("auditSuspend"), active.name); toast(ta("suspended"), "info"); }}>
                  {ta("suspend")}
                </Button>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => { patch(active.id, { active: true }); toast(ta("reactivated"), "success"); }}>
                  {ta("reactivate")}
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
      <span className="text-ink-500 shrink-0">{label}</span>
      <span className="font-600 text-ink-900 text-right">{value}</span>
    </div>
  );
}
