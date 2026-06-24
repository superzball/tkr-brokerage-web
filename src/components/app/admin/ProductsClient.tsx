// src/components/app/admin/ProductsClient.tsx
// Product plans with inline active-toggle + an edit modal (name/insurer/
// coverage/base premium/active). State + toast. Mock.

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { ProductPlan } from "@/types/portal";
import { DataTable, type Column } from "@/components/app/DataTable";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Modal } from "@/components/app/Modal";
import { Input } from "@/components/app/form";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/app/toast";
import { useBaht } from "@/lib/format";

export function ProductsClient({ initial }: { initial: ProductPlan[] }) {
  const t = useTranslations("admin.plans");
  const ta = useTranslations("admin.productsActions");
  const ts = useTranslations("admin.status");
  const ty = useTranslations("business.type");
  const tcommon = useTranslations("business.common");
  const { toast } = useToast();
  const baht = useBaht();

  const [list, setList] = useState<ProductPlan[]>(initial);
  const [draft, setDraft] = useState<ProductPlan | null>(null);

  function toggle(p: ProductPlan) {
    setList((prev) => prev.map((x) => (x.id === p.id ? { ...x, active: !x.active } : x)));
    toast(ta("toggled"), "success");
  }
  function save() {
    if (!draft) return;
    setList((prev) => prev.map((x) => (x.id === draft.id ? draft : x)));
    toast(ta("saved"), "success");
    setDraft(null);
  }

  const columns: Column<ProductPlan>[] = [
    { key: "planName", header: t("col.plan"), sortValue: (p) => p.planName },
    { key: "product", header: t("col.product"), render: (p) => ty(p.product) },
    { key: "insurer", header: t("col.insurer") },
    { key: "coverage", header: t("col.coverage"), align: "right", sortValue: (p) => p.coverage, render: (p) => <span className="tabnum">{baht(p.coverage)}</span> },
    { key: "basePremium", header: t("col.premium"), align: "right", sortValue: (p) => p.basePremium, render: (p) => <span className="tabnum">{baht(p.basePremium)}</span> },
    {
      key: "status",
      header: t("col.status"),
      render: (p) => (
        <button
          onClick={(e) => { e.stopPropagation(); toggle(p); }}
          className="cursor-pointer"
          aria-label={ta("active")}
        >
          <StatusBadge tone={p.active ? "success" : "neutral"}>
            {p.active ? ts("on") : ts("off")}
          </StatusBadge>
        </button>
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        rows={list}
        getRowKey={(p) => p.id}
        onRowClick={(p) => setDraft({ ...p })}
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
        title={ta("modalTitle")}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setDraft(null)}>{tcommon("cancel")}</Button>
            <Button variant="primary" size="sm" onClick={save}>{ta("save")}</Button>
          </>
        }
      >
        {draft && (
          <div className="space-y-3">
            <Input label={ta("planName")} value={draft.planName} onChange={(e) => setDraft({ ...draft, planName: e.target.value })} />
            <Input label={ta("insurer")} value={draft.insurer} onChange={(e) => setDraft({ ...draft, insurer: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <Input type="number" label={ta("coverage")} value={draft.coverage} onChange={(e) => setDraft({ ...draft, coverage: Number(e.target.value) })} />
              <Input type="number" label={ta("basePremium")} value={draft.basePremium} onChange={(e) => setDraft({ ...draft, basePremium: Number(e.target.value) })} />
            </div>
            <label className="flex items-center gap-2 text-sm text-ink-700 cursor-pointer">
              <input type="checkbox" checked={draft.active} onChange={(e) => setDraft({ ...draft, active: e.target.checked })} className="w-4 h-4 accent-brand-500" />
              {ta("active")}
            </label>
          </div>
        )}
      </Modal>
    </>
  );
}
