"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useBaht } from "@/lib/format";
import { DataTable, type Column } from "@/components/app/DataTable";
import { FilterBar } from "@/components/app/FilterBar";
import { StatusBadge } from "@/components/app/StatusBadge";
import { StatCard } from "@/components/app/StatCard";
import { Modal } from "@/components/app/Modal";
import { useToast } from "@/components/app/toast";
import { Button } from "@/components/ui/Button";
import type { Invoice } from "@/types/portal";
import { invoiceTone } from "./status";

export function BillingClient({
  invoices,
  policies,
}: {
  invoices: Invoice[];
  policies: { id: string; policyNo: string }[];
}) {
  const t = useTranslations("business");
  const baht = useBaht();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<Invoice | null>(null);

  const policyNo = useMemo(
    () => Object.fromEntries(policies.map((p) => [p.id, p.policyNo])),
    [policies],
  );

  const outstanding = useMemo(
    () =>
      invoices
        .filter((i) => i.status !== "paid")
        .reduce((s, i) => s + i.amount, 0),
    [invoices],
  );
  const history = useMemo(
    () => invoices.filter((i) => i.status === "paid"),
    [invoices],
  );

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return invoices;
    return invoices.filter((i) => i.invoiceNo.toLowerCase().includes(q));
  }, [invoices, search]);

  const columns: Column<Invoice>[] = [
    {
      key: "invoiceNo",
      header: t("billing.col.invoiceNo"),
      sortValue: (i) => i.invoiceNo,
      render: (i) => <span className="font-600 text-ink-900">{i.invoiceNo}</span>,
    },
    {
      key: "policy",
      header: t("billing.col.policy"),
      render: (i) => policyNo[i.policyId] ?? "—",
    },
    {
      key: "amount",
      header: t("billing.col.amount"),
      align: "right",
      sortValue: (i) => i.amount,
      render: (i) => <span className="tabnum">{baht(i.amount)}</span>,
    },
    {
      key: "due",
      header: t("billing.col.due"),
      align: "right",
      sortValue: (i) => i.dueDate,
      render: (i) => <span className="tabnum">{i.dueDate}</span>,
    },
    {
      key: "status",
      header: t("billing.col.status"),
      sortValue: (i) => i.status,
      render: (i) => (
        <StatusBadge tone={invoiceTone[i.status]}>
          {t(`invoiceStatus.${i.status}`)}
        </StatusBadge>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon="coins"
          label={t("billing.outstanding")}
          value={baht(outstanding)}
          deltaTone="flat"
        />
      </div>

      <FilterBar
        search={search}
        onSearch={setSearch}
        placeholder={t("billing.searchPlaceholder")}
      />

      <DataTable
        columns={columns}
        rows={rows}
        getRowKey={(i) => i.id}
        onRowClick={(i) => setOpen(i)}
        labels={{
          empty: t("billing.empty"),
          prev: t("common.prev"),
          next: t("common.next"),
          range: (from, to, total) => t("common.range", { from, to, total }),
        }}
      />

      {/* payment history */}
      <section className="card p-6">
        <h2 className="font-700 text-ink-900 mb-4">{t("billing.historyTitle")}</h2>
        {history.length === 0 ? (
          <p className="text-sm text-ink-400 py-4 text-center">
            {t("billing.historyEmpty")}
          </p>
        ) : (
          <ul className="divide-y divide-ink-50">
            {history.map((i) => (
              <li key={i.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-600 text-ink-900">{i.invoiceNo}</p>
                  <p className="text-xs text-ink-500">
                    {policyNo[i.policyId]} · {i.issuedDate}
                  </p>
                </div>
                <span className="font-600 text-ink-900 tabnum">
                  {baht(i.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* invoice detail */}
      <Modal
        open={open != null}
        onClose={() => setOpen(null)}
        title={open ? t("billing.detailTitle", { invoiceNo: open.invoiceNo }) : ""}
        footer={
          open && open.status !== "paid" ? (
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                toast(t("billing.paid"), "success");
                setOpen(null);
              }}
            >
              {t("billing.payNow")} · {baht(open.amount)}
            </Button>
          ) : (
            <Button variant="ghost" size="md" onClick={() => setOpen(null)}>
              {t("common.close")}
            </Button>
          )
        }
      >
        {open && (
          <dl className="space-y-3 text-sm">
            {[
              [t("billing.col.policy"), policyNo[open.policyId]],
              [t("billing.col.amount"), baht(open.amount)],
              [t("billing.col.issued"), open.issuedDate],
              [t("billing.col.due"), open.dueDate],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4">
                <dt className="text-ink-500">{k}</dt>
                <dd className="font-600 text-ink-900 text-right tabnum">{v}</dd>
              </div>
            ))}
            <div className="flex justify-between gap-4 pt-1">
              <dt className="text-ink-500">{t("billing.col.status")}</dt>
              <dd>
                <StatusBadge tone={invoiceTone[open.status]}>
                  {t(`invoiceStatus.${open.status}`)}
                </StatusBadge>
              </dd>
            </div>
          </dl>
        )}
      </Modal>
    </div>
  );
}
