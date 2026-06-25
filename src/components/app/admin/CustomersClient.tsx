// src/components/app/admin/CustomersClient.tsx
// All customers (business + individual) with add / edit, KYC verify and account
// suspend/reactivate. Staff-created customers and edits persist to the mock local
// store (localStorage) and merge on top of the seed list — a real backend would
// POST to a customers table. Row-click opens a detail modal; the "+ Add" button
// and per-row "Edit" open the same form. Mock.

"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { User } from "@/types/portal";
import { DataTable, type Column } from "@/components/app/DataTable";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Modal } from "@/components/app/Modal";
import { Input, Select, Field } from "@/components/app/form";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useToast } from "@/components/app/toast";
import { useSession } from "@/lib/auth/SessionProvider";
import {
  addAuditEntry,
  addLocalCustomer,
  saveCustomerEdit,
  readLocalCustomers,
  readCustomerEdits,
} from "@/lib/mock/local-admin";

type CustState = { kyc: boolean; active: boolean };

type Draft = {
  role: "business" | "individual";
  name: string;
  email: string;
  phone: string;
  company: string;
  taxId: string;
  nationalId: string;
  address: string;
  contactPerson: string;
  note: string;
};

const EMPTY_DRAFT: Draft = {
  role: "business",
  name: "",
  email: "",
  phone: "",
  company: "",
  taxId: "",
  nationalId: "",
  address: "",
  contactPerson: "",
  note: "",
};

const draftFromUser = (c: User): Draft => ({
  role: c.role === "business" ? "business" : "individual",
  name: c.name ?? "",
  email: c.email ?? "",
  phone: c.phone ?? "",
  company: c.company ?? "",
  taxId: c.taxId ?? "",
  nationalId: c.nationalId ?? "",
  address: c.address ?? "",
  contactPerson: c.contactPerson ?? "",
  note: c.note ?? "",
});

export function CustomersClient({ customers }: { customers: User[] }) {
  const t = useTranslations("admin.customers");
  const ta = useTranslations("admin.customersActions");
  const tcommon = useTranslations("business.common");
  const { toast } = useToast();
  const me = useSession();

  // localStorage is client-only — load after mount to avoid hydration mismatch.
  const [localAdded, setLocalAdded] = useState<User[]>([]);
  const [edits, setEdits] = useState<Record<string, Partial<User>>>({});
  useEffect(() => {
    setLocalAdded(readLocalCustomers());
    setEdits(readCustomerEdits());
  }, []);

  const [state, setState] = useState<Record<string, CustState>>({});
  const [active, setActive] = useState<User | null>(null);
  const [form, setForm] = useState<{ mode: "create" | "edit"; id?: string; draft: Draft } | null>(null);

  // Seed (props) + staff-created (local), with per-customer edits applied. Local
  // additions win on id collisions and sort first.
  const rows = useMemo(() => {
    const seen = new Set<string>();
    const merged: User[] = [];
    for (const c of [...localAdded, ...customers]) {
      if (seen.has(c.id)) continue;
      seen.add(c.id);
      merged.push(edits[c.id] ? { ...c, ...edits[c.id] } : c);
    }
    return merged;
  }, [localAdded, customers, edits]);

  const stOf = (id: string): CustState => state[id] ?? { kyc: false, active: true };

  function audit(action: string, target: string) {
    addAuditEntry({ id: `la_${Date.now()}`, actor: me.name, action, target, time: new Date().toISOString() });
  }
  function patch(id: string, p: Partial<CustState>) {
    setState((prev) => ({ ...prev, [id]: { ...stOf(id), ...p } }));
  }

  function saveForm() {
    if (!form) return;
    const d = form.draft;
    const name = d.name.trim();
    if (!name) {
      toast(ta("required"), "error");
      return;
    }
    const business = d.role === "business";
    const clean = (v: string) => v.trim() || undefined;
    const profile = {
      role: d.role,
      name,
      email: clean(d.email),
      phone: clean(d.phone),
      company: business ? clean(d.company) : undefined,
      taxId: business ? clean(d.taxId) : undefined,
      nationalId: business ? undefined : clean(d.nationalId),
      address: clean(d.address),
      contactPerson: business ? clean(d.contactPerson) : undefined,
      note: clean(d.note),
    } satisfies Partial<User>;

    if (form.mode === "create") {
      const user: User = { id: `lc_${Date.now()}`, ...profile };
      addLocalCustomer(user);
      setLocalAdded((prev) => [user, ...prev]);
      audit(ta("auditCreate"), name);
      toast(ta("created"), "success");
    } else if (form.id) {
      const id = form.id;
      saveCustomerEdit(id, profile);
      setEdits((prev) => ({ ...prev, [id]: { ...prev[id], ...profile } }));
      audit(ta("auditEdit"), name);
      toast(ta("updated"), "success");
    }
    setForm(null);
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
    { key: "phone", header: t("col.phone"), render: (c) => c.phone || "—" },
    { key: "email", header: t("col.email"), render: (c) => c.email || "—" },
    {
      key: "kyc",
      header: ta("kycCol"),
      render: (c) =>
        stOf(c.id).kyc ? (
          <StatusBadge tone="success">{ta("kycVerified")}</StatusBadge>
        ) : (
          <StatusBadge tone="warning">{ta("kycUnverified")}</StatusBadge>
        ),
    },
    {
      key: "acc",
      header: ta("account"),
      render: (c) =>
        stOf(c.id).active ? (
          <StatusBadge tone="success">{ta("accActive")}</StatusBadge>
        ) : (
          <StatusBadge tone="danger">{ta("accSuspended")}</StatusBadge>
        ),
    },
  ];

  const s = active ? stOf(active.id) : undefined;

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button variant="primary" size="md" onClick={() => setForm({ mode: "create", draft: EMPTY_DRAFT })}>
          <Icon name="plus" /> {ta("add")}
        </Button>
      </div>

      <DataTable
        columns={columns}
        rows={rows}
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

      {/* ---- detail modal ---- */}
      <Modal open={active !== null} onClose={() => setActive(null)} title={active ? `${ta("modalTitle")} · ${active.name}` : ""}>
        {active && s && (
          <div className="space-y-4">
            <div className="rounded-xl border border-ink-100 p-3 text-sm space-y-1.5">
              <Row label={t("col.type")} value={active.role === "business" ? t("typeBusiness") : t("typeIndividual")} />
              {active.role === "business" && active.company && <Row label={t("field.company")} value={active.company} />}
              {active.role === "business" ? (
                <Row label={t("field.taxId")} value={active.taxId || "—"} />
              ) : (
                <Row label={t("field.nationalId")} value={active.nationalId || "—"} />
              )}
              <Row label={t("col.email")} value={active.email || "—"} />
              <Row label={t("col.phone")} value={active.phone || "—"} />
              <Row label={t("field.address")} value={active.address || "—"} />
              {active.role === "business" && <Row label={t("field.contactPerson")} value={active.contactPerson || "—"} />}
              {active.note && <Row label={t("field.note")} value={active.note} />}
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const c = active;
                  setActive(null);
                  setForm({ mode: "edit", id: c.id, draft: draftFromUser(c) });
                }}
              >
                {ta("edit")}
              </Button>
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

      {/* ---- add / edit form ---- */}
      <Modal
        open={form !== null}
        onClose={() => setForm(null)}
        title={form?.mode === "edit" ? ta("editTitle") : ta("createTitle")}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="md" onClick={() => setForm(null)}>
              {ta("cancel")}
            </Button>
            <Button variant="primary" size="md" onClick={saveForm}>
              {ta("save")}
            </Button>
          </div>
        }
      >
        {form && (
          <CustomerForm draft={form.draft} onChange={(d) => setForm({ ...form, draft: d })} />
        )}
      </Modal>
    </>
  );
}

function CustomerForm({ draft, onChange }: { draft: Draft; onChange: (d: Draft) => void }) {
  const t = useTranslations("admin.customers");
  const set = (p: Partial<Draft>) => onChange({ ...draft, ...p });
  const business = draft.role === "business";

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Select
        label={t("col.type")}
        value={draft.role}
        onChange={(e) => set({ role: e.target.value as Draft["role"] })}
      >
        <option value="business">{t("typeBusiness")}</option>
        <option value="individual">{t("typeIndividual")}</option>
      </Select>

      <Input label={t("col.name")} value={draft.name} onChange={(e) => set({ name: e.target.value })} />

      {business ? (
        <>
          <Input label={t("field.company")} value={draft.company} onChange={(e) => set({ company: e.target.value })} />
          <Input label={t("field.taxId")} value={draft.taxId} onChange={(e) => set({ taxId: e.target.value })} />
          <Input label={t("field.contactPerson")} value={draft.contactPerson} onChange={(e) => set({ contactPerson: e.target.value })} />
        </>
      ) : (
        <Input label={t("field.nationalId")} value={draft.nationalId} onChange={(e) => set({ nationalId: e.target.value })} />
      )}

      <Input label={t("col.phone")} value={draft.phone} onChange={(e) => set({ phone: e.target.value })} />
      <Input type="email" label={t("col.email")} value={draft.email} onChange={(e) => set({ email: e.target.value })} />

      <div className="sm:col-span-2">
        <Input label={t("field.address")} value={draft.address} onChange={(e) => set({ address: e.target.value })} />
      </div>
      <div className="sm:col-span-2">
        <Field label={t("field.note")}>
          <textarea
            className="field"
            rows={2}
            value={draft.note}
            onChange={(e) => set({ note: e.target.value })}
          />
        </Field>
      </div>
    </div>
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
