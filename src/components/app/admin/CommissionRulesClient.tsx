// src/components/app/admin/CommissionRulesClient.tsx
// Commission rules per product/tier: inline active-toggle, edit rate, add rule.
// State + toast. Mock.

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { CommissionRule, InsuranceType, Tier } from "@/types/portal";
import { DataTable, type Column } from "@/components/app/DataTable";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Modal } from "@/components/app/Modal";
import { Input, Select } from "@/components/app/form";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useToast } from "@/components/app/toast";

const PRODUCTS: InsuranceType[] = ["worker", "auto", "travel", "health", "fire"];
const TIERS: Tier[] = ["Silver", "Gold", "Platinum", "Diamond"];

export function CommissionRulesClient({ initial }: { initial: CommissionRule[] }) {
  const t = useTranslations("admin.commissions");
  const ts = useTranslations("admin.status");
  const ty = useTranslations("business.type");
  const tcommon = useTranslations("business.common");
  const { toast } = useToast();

  const [list, setList] = useState<CommissionRule[]>(initial);
  const [draft, setDraft] = useState<CommissionRule | null>(null);
  const [isNew, setIsNew] = useState(false);

  function toggle(r: CommissionRule) {
    setList((prev) => prev.map((x) => (x.id === r.id ? { ...x, active: !x.active } : x)));
    toast(t("toggled"), "success");
  }
  function openNew() {
    setDraft({ id: "", product: "worker", tier: "Gold", rate: 10, active: true });
    setIsNew(true);
  }
  function save() {
    if (!draft) return;
    if (isNew) {
      setList((prev) => [{ ...draft, id: `cr_${Date.now()}` }, ...prev]);
      toast(t("added"), "success");
    } else {
      setList((prev) => prev.map((x) => (x.id === draft.id ? draft : x)));
      toast(t("saved"), "success");
    }
    setDraft(null);
  }

  const columns: Column<CommissionRule>[] = [
    { key: "product", header: t("col.product"), sortValue: (r) => r.product, render: (r) => ty(r.product) },
    { key: "tier", header: t("col.tier"), sortValue: (r) => r.tier },
    { key: "rate", header: t("col.rate"), align: "right", sortValue: (r) => r.rate, render: (r) => <span className="tabnum">{r.rate}%</span> },
    {
      key: "status",
      header: t("col.status"),
      render: (r) => (
        <button onClick={(e) => { e.stopPropagation(); toggle(r); }} aria-label={t("active")}>
          <StatusBadge tone={r.active ? "success" : "neutral"}>{r.active ? ts("on") : ts("off")}</StatusBadge>
        </button>
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-end mb-3">
        <Button variant="primary" size="sm" onClick={openNew}>
          <Icon name="plus" size={14} /> {t("addRule")}
        </Button>
      </div>

      <DataTable
        columns={columns}
        rows={list}
        pageSize={15}
        getRowKey={(r) => r.id}
        onRowClick={(r) => { setDraft({ ...r }); setIsNew(false); }}
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
        title={isNew ? t("addRule") : t("edit")}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setDraft(null)}>{tcommon("cancel")}</Button>
            <Button variant="primary" size="sm" onClick={save}>{t("save")}</Button>
          </>
        }
      >
        {draft && (
          <div className="space-y-3">
            <Select label={t("col.product")} value={draft.product} onChange={(e) => setDraft({ ...draft, product: e.target.value as InsuranceType })}>
              {PRODUCTS.map((p) => <option key={p} value={p}>{ty(p)}</option>)}
            </Select>
            <Select label={t("col.tier")} value={draft.tier} onChange={(e) => setDraft({ ...draft, tier: e.target.value as Tier })}>
              {TIERS.map((tr) => <option key={tr} value={tr}>{tr}</option>)}
            </Select>
            <Input type="number" label={t("rate")} value={draft.rate} onChange={(e) => setDraft({ ...draft, rate: Number(e.target.value) })} />
            <label className="flex items-center gap-2 text-sm text-ink-700 cursor-pointer">
              <input type="checkbox" checked={draft.active} onChange={(e) => setDraft({ ...draft, active: e.target.checked })} className="w-4 h-4 accent-brand-500" />
              {t("active")}
            </label>
          </div>
        )}
      </Modal>
    </>
  );
}
