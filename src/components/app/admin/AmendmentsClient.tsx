// src/components/app/admin/AmendmentsClient.tsx
// Amendment Tickets: CRUD list of policy-change requests sent to the underwriter
// (Thip). Customer can be an existing CRM account or a free-typed name; policy
// numbers are entered one-per-line and auto-counted; an optional per-policy cost
// rolls up to a total. Create/edit/delete persist locally; CSV export is direct.
// Every create / edit / delete writes an audit entry.

"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icon";
import type { AmendmentTicket, AmendmentType } from "@/types/portal";
import { DataTable, type Column } from "@/components/app/DataTable";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Modal } from "@/components/app/Modal";
import { Input, Select, FileUpload } from "@/components/app/form";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/app/toast";
import { useBaht } from "@/lib/format";
import {
  mergeAmendments,
  addAmendment,
  patchAmendment,
  deleteAmendment,
  mockId,
} from "@/lib/mock/local-crm";
import { addAuditEntry } from "@/lib/mock/local-admin";
import { toCsv, downloadCsv } from "@/lib/csv";

type Customer = { id: string; name: string };
const TYPES: AmendmentType[] = [
  "edit_name", "edit_address", "edit_birthdate", "edit_id_number",
  "edit_coverage_start", "edit_coverage_duration", "cancel_policy",
];
const FREE = "__free__";
const todayIso = () => new Date().toISOString().slice(0, 10);

type Draft = {
  id: string | null;
  amendmentType: AmendmentType;
  customerSel: string;       // a customer id OR FREE
  customerFree: string;
  policyText: string;        // one per line
  hasCost: boolean;
  pricePerPolicy: number;
  thipStaffName: string;
  thipNote: string;
};

const emptyDraft = (firstCustomer: string): Draft => ({
  id: null,
  amendmentType: "edit_name",
  customerSel: firstCustomer || FREE,
  customerFree: "",
  policyText: "",
  hasCost: false,
  pricePerPolicy: 0,
  thipStaffName: "",
  thipNote: "",
});

export function AmendmentsClient({
  seed,
  customers,
}: {
  seed: AmendmentTicket[];
  customers: Customer[];
}) {
  const t = useTranslations("admin.amendments");
  const tcommon = useTranslations("business.common");
  const { toast } = useToast();
  const baht = useBaht();

  const [rows, setRows] = useState<AmendmentTicket[]>(seed);
  useEffect(() => setRows(mergeAmendments(seed)), [seed]);

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(emptyDraft(customers[0]?.id ?? ""));

  const policyNumbers = useMemo(
    () => draft.policyText.split(/\r?\n/).map((s) => s.trim()).filter(Boolean),
    [draft.policyText],
  );
  const total = draft.hasCost ? draft.pricePerPolicy * policyNumbers.length : 0;

  function openNew() {
    setDraft(emptyDraft(customers[0]?.id ?? ""));
    setOpen(true);
  }
  function openEdit(a: AmendmentTicket) {
    const existing = customers.find((c) => c.name === a.customerRef);
    setDraft({
      id: a.id,
      amendmentType: a.amendmentType,
      customerSel: existing ? existing.id : FREE,
      customerFree: existing ? "" : a.customerRef,
      policyText: a.policyNumbers.join("\n"),
      hasCost: a.hasCost,
      pricePerPolicy: a.pricePerPolicy,
      thipStaffName: a.thipStaffName ?? "",
      thipNote: a.thipNote ?? "",
    });
    setOpen(true);
  }

  function save() {
    const customerRef =
      draft.customerSel === FREE
        ? draft.customerFree.trim()
        : customers.find((c) => c.id === draft.customerSel)?.name ?? "";
    if (!customerRef || policyNumbers.length === 0) {
      toast(t("invalid"), "error");
      return;
    }
    const record: AmendmentTicket = {
      id: draft.id ?? mockId("am"),
      amendmentType: draft.amendmentType,
      customerRef,
      policyNumbers,
      hasCost: draft.hasCost,
      pricePerPolicy: draft.hasCost ? draft.pricePerPolicy : 0,
      totalCost: total,
      thipStaffName: draft.thipStaffName || undefined,
      thipNote: draft.thipNote || undefined,
      createdBy: "u_admin",
      createdAt: draft.id ? rows.find((r) => r.id === draft.id)?.createdAt ?? todayIso() : todayIso(),
    };
    if (draft.id) {
      patchAmendment(draft.id, record);
      addAuditEntry({ id: mockId("au"), actor: "คุณกานต์ ผู้ดูแลระบบ", action: t("auditEdit"), target: customerRef, time: new Date().toISOString() });
    } else {
      addAmendment(record);
      addAuditEntry({ id: mockId("au"), actor: "คุณกานต์ ผู้ดูแลระบบ", action: t("auditCreate"), target: customerRef, time: new Date().toISOString() });
    }
    setRows(mergeAmendments(seed));
    setOpen(false);
    toast(draft.id ? t("saved") : t("created"), "success");
  }

  function remove(a: AmendmentTicket) {
    deleteAmendment(a.id);
    addAuditEntry({ id: mockId("au"), actor: "คุณกานต์ ผู้ดูแลระบบ", action: t("auditDelete"), target: a.customerRef, time: new Date().toISOString() });
    setRows(mergeAmendments(seed));
    toast(t("deleted"), "success");
  }

  function exportCsv() {
    const csv = toCsv(
      [t("col.type"), t("col.customer"), t("col.policies"), t("col.hasCost"), t("col.total"), t("col.created")],
      rows.map((a) => [
        t(`type.${a.amendmentType}`), a.customerRef, a.policyNumbers.join(" | "),
        a.hasCost ? t("yes") : t("no"), a.totalCost, a.createdAt,
      ]),
    );
    downloadCsv(`amendments-${todayIso()}.csv`, csv);
  }

  const columns: Column<AmendmentTicket>[] = [
    { key: "type", header: t("col.type"), sortValue: (r) => r.amendmentType, render: (r) => t(`type.${r.amendmentType}`) },
    { key: "customer", header: t("col.customer"), sortValue: (r) => r.customerRef, render: (r) => <span className="font-600 text-ink-900">{r.customerRef}</span> },
    { key: "policies", header: t("col.policies"), align: "right", sortValue: (r) => r.policyNumbers.length, render: (r) => <span className="tabnum">{r.policyNumbers.length}</span> },
    { key: "hasCost", header: t("col.hasCost"), render: (r) => r.hasCost ? <StatusBadge tone="info">{baht(r.totalCost)}</StatusBadge> : <span className="text-ink-400">{t("free")}</span> },
    { key: "created", header: t("col.created"), sortValue: (r) => r.createdAt, render: (r) => <span className="tabnum">{r.createdAt}</span> },
    {
      key: "actions", header: t("col.actions"), align: "right",
      render: (r) => (
        <span className="inline-flex gap-2" onClick={(e) => e.stopPropagation()}>
          <button type="button" onClick={() => openEdit(r)} className="text-brand-600 hover:underline font-600">{tcommon("edit")}</button>
          <button type="button" onClick={() => remove(r)} className="text-rose-600 hover:underline font-600">{tcommon("delete")}</button>
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={exportCsv} disabled={rows.length === 0}>
          <Icon name="download" size={16} /> {t("export")}
        </Button>
        <Button variant="primary" size="sm" onClick={openNew}>
          <Icon name="plus" size={16} /> {t("newCta")}
        </Button>
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        pageSize={15}
        getRowKey={(r) => r.id}
        labels={{
          empty: t("empty"),
          prev: tcommon("prev"),
          next: tcommon("next"),
          range: (from, to, total) => tcommon("range", { from, to, total }),
        }}
      />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={draft.id ? t("editTitle") : t("createTitle")}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>{tcommon("cancel")}</Button>
            <Button variant="primary" size="sm" onClick={save}>{tcommon("save")}</Button>
          </>
        }
      >
        <div className="space-y-3">
          <Select label={t("form.type")} value={draft.amendmentType} onChange={(e) => setDraft({ ...draft, amendmentType: e.target.value as AmendmentType })}>
            {TYPES.map((ty) => <option key={ty} value={ty}>{t(`type.${ty}`)}</option>)}
          </Select>

          <Select label={t("form.customer")} value={draft.customerSel} onChange={(e) => setDraft({ ...draft, customerSel: e.target.value })}>
            {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            <option value={FREE}>{t("form.freeType")}</option>
          </Select>
          {draft.customerSel === FREE && (
            <Input label={t("form.customerFree")} value={draft.customerFree} onChange={(e) => setDraft({ ...draft, customerFree: e.target.value })} placeholder={t("form.customerFreePlaceholder")} />
          )}

          <div>
            <label className="field-label">{t("form.policies")}</label>
            <textarea
              className="field min-h-[88px] font-mono text-xs"
              value={draft.policyText}
              onChange={(e) => setDraft({ ...draft, policyText: e.target.value })}
              placeholder={t("form.policiesPlaceholder")}
            />
            <p className="mt-1 text-xs text-ink-400">{t("form.policiesCount", { count: policyNumbers.length })}</p>
          </div>

          <label className="flex items-center gap-2 text-sm font-600 text-ink-700">
            <input type="checkbox" checked={draft.hasCost} onChange={(e) => setDraft({ ...draft, hasCost: e.target.checked })} className="accent-brand-600" />
            {t("form.hasCost")}
          </label>
          {draft.hasCost && (
            <div className="grid grid-cols-2 gap-3 items-end">
              <Input type="number" min={0} label={t("form.pricePerPolicy")} value={draft.pricePerPolicy} onChange={(e) => setDraft({ ...draft, pricePerPolicy: Math.max(0, Number(e.target.value)) })} />
              <div className="rounded-xl bg-sky-50 p-3 flex items-center justify-between">
                <span className="text-sm text-ink-600">{t("form.total")}</span>
                <span className="tabnum font-700 text-ink-900">{baht(total)}</span>
              </div>
            </div>
          )}

          <Input label={t("form.thipStaff")} value={draft.thipStaffName} onChange={(e) => setDraft({ ...draft, thipStaffName: e.target.value })} />
          <div>
            <label className="field-label">{t("form.thipNote")}</label>
            <textarea className="field min-h-[64px]" value={draft.thipNote} onChange={(e) => setDraft({ ...draft, thipNote: e.target.value })} />
          </div>
          <FileUpload label={t("form.thipFiles")} buttonLabel={t("form.thipFilesBtn")} accept="image/*,application/pdf,.zip" />
        </div>
      </Modal>
    </div>
  );
}
