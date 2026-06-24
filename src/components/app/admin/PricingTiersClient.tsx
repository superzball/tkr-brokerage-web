// src/components/app/admin/PricingTiersClient.tsx
// Worker-insurance product × duration pricing table (config source of truth for
// ticketTotal). Editable base price per tier via an edit modal. Mock state +
// toast. Per-customer discounts handle variance — this is the catalog default.

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { PricingTier } from "@/types/portal";
import { DataTable, type Column } from "@/components/app/DataTable";
import { Modal } from "@/components/app/Modal";
import { Input } from "@/components/app/form";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/app/toast";
import { useBaht } from "@/lib/format";

export function PricingTiersClient({ initial }: { initial: PricingTier[] }) {
  const t = useTranslations("admin.pricing");
  const tc = useTranslations("admin.crm");
  const tcommon = useTranslations("business.common");
  const { toast } = useToast();
  const baht = useBaht();

  const [list, setList] = useState<PricingTier[]>(initial);
  const [draft, setDraft] = useState<PricingTier | null>(null);

  function save() {
    if (!draft) return;
    setList((prev) =>
      prev.map((x) => (x.product === draft.product && x.duration === draft.duration ? draft : x)),
    );
    toast(t("saved"), "success");
    setDraft(null);
  }

  const columns: Column<PricingTier>[] = [
    { key: "product", header: t("col.product"), sortValue: (r) => r.product, render: (r) => tc(`product.${r.product}`) },
    { key: "duration", header: t("col.duration"), render: (r) => tc(`duration.${r.duration}`) },
    { key: "basePrice", header: t("col.basePrice"), align: "right", sortValue: (r) => r.basePrice, render: (r) => <span className="tabnum">{baht(r.basePrice)}</span> },
  ];

  return (
    <section className="mt-8">
      <h2 className="text-lg font-700 text-ink-900 mb-1">{t("title")}</h2>
      <p className="text-sm text-ink-500 mb-4">{t("desc")}</p>
      <DataTable
        columns={columns}
        rows={list}
        pageSize={10}
        getRowKey={(r) => `${r.product}-${r.duration}`}
        onRowClick={(r) => setDraft({ ...r })}
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
        title={t("edit")}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setDraft(null)}>{tcommon("cancel")}</Button>
            <Button variant="primary" size="sm" onClick={save}>{t("save")}</Button>
          </>
        }
      >
        {draft && (
          <div className="space-y-3">
            <div className="text-sm text-ink-600">
              {tc(`product.${draft.product}`)} · {tc(`duration.${draft.duration}`)}
            </div>
            <Input type="number" min={0} label={t("perPerson")} value={draft.basePrice} onChange={(e) => setDraft({ ...draft, basePrice: Math.max(0, Number(e.target.value)) })} />
          </div>
        )}
      </Modal>
    </section>
  );
}
