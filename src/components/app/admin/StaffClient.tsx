// src/components/app/admin/StaffClient.tsx
// Staff & permissions (RBAC): assign staffRole + suspend/activate. Each change
// writes an audit entry + toast. Mock.

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { StaffUser, StaffRole } from "@/types/portal";
import { DataTable, type Column } from "@/components/app/DataTable";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Modal } from "@/components/app/Modal";
import { Select } from "@/components/app/form";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/app/toast";
import { useSession } from "@/lib/auth/SessionProvider";
import { addAuditEntry } from "@/lib/mock/local-admin";
import { staffStatusTone } from "./badges";

const ROLES: StaffRole[] = ["superadmin", "ops", "content", "sales"];

export function StaffClient({ initial }: { initial: StaffUser[] }) {
  const t = useTranslations("admin.staff");
  const ta = useTranslations("admin.staffActions");
  const tr = useTranslations("admin.staffRole");
  const ts = useTranslations("admin.status");
  const tcommon = useTranslations("business.common");
  const { toast } = useToast();
  const me = useSession();

  const [list, setList] = useState<StaffUser[]>(initial);
  const [draft, setDraft] = useState<StaffUser | null>(null);

  function save() {
    if (!draft) return;
    setList((prev) => prev.map((x) => (x.id === draft.id ? draft : x)));
    addAuditEntry({ id: `la_${Date.now()}`, actor: me.name, action: ta("auditRole"), target: draft.email, time: new Date().toISOString() });
    toast(ta("saved"), "success");
    setDraft(null);
  }

  const columns: Column<StaffUser>[] = [
    { key: "name", header: t("col.name"), sortValue: (s) => s.name },
    { key: "email", header: t("col.email") },
    { key: "role", header: t("col.role"), sortValue: (s) => s.staffRole, render: (s) => tr(s.staffRole) },
    { key: "status", header: t("col.status"), render: (s) => <StatusBadge tone={staffStatusTone[s.status]}>{ts(s.status)}</StatusBadge> },
    { key: "lastActive", header: t("col.lastActive"), render: (s) => s.lastActive },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        rows={list}
        getRowKey={(s) => s.id}
        onRowClick={(s) => setDraft({ ...s })}
        labels={{
          empty: t("empty"),
          prev: tcommon("prev"),
          next: tcommon("next"),
          range: (from, to, total) => tcommon("range", { from, to, total }),
        }}
      />

      <Modal
        open={draft !== null}
        onClose={() => setDraft(null)}
        title={draft ? `${ta("modalTitle")} · ${draft.name}` : ""}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setDraft(null)}>{tcommon("cancel")}</Button>
            <Button variant="primary" size="sm" onClick={save}>{ta("save")}</Button>
          </>
        }
      >
        {draft && (
          <div className="space-y-4">
            <Select label={ta("assignRole")} value={draft.staffRole} onChange={(e) => setDraft({ ...draft, staffRole: e.target.value as StaffRole })}>
              {ROLES.map((r) => <option key={r} value={r}>{tr(r)}</option>)}
            </Select>
            <div className="flex items-center justify-between">
              <StatusBadge tone={staffStatusTone[draft.status]}>{ts(draft.status)}</StatusBadge>
              {draft.status === "active" ? (
                <Button variant="ghost" size="sm" className="text-rose-600" onClick={() => { setDraft({ ...draft, status: "suspended" }); toast(ta("suspended"), "info"); }}>
                  {ta("suspend")}
                </Button>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => { setDraft({ ...draft, status: "active" }); toast(ta("activated"), "success"); }}>
                  {ta("activate")}
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
