"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { DataTable, type Column } from "@/components/app/DataTable";
import { FilterBar } from "@/components/app/FilterBar";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Modal } from "@/components/app/Modal";
import { useToast } from "@/components/app/toast";
import { Icon } from "@/components/ui/Icon";
import { IOSFrame } from "@/components/device/IOSFrame";
import { WalletApp } from "@/components/wallet/WalletApp";
import type { Worker } from "@/types/portal";

export function WalletClient({
  workers,
  policies,
}: {
  workers: Worker[];
  policies: { id: string; policyNo: string }[];
}) {
  const t = useTranslations("business");
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [preview, setPreview] = useState(false);

  const policyNo = useMemo(
    () => Object.fromEntries(policies.map((p) => [p.id, p.policyNo])),
    [policies],
  );

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return workers;
    return workers.filter((w) => w.name.toLowerCase().includes(q));
  }, [workers, search]);

  const issued = (w: Worker) => w.status === "covered";

  const columns: Column<Worker>[] = [
    {
      key: "worker",
      header: t("wallet.col.worker"),
      sortValue: (w) => w.name,
      render: (w) => <span className="font-600 text-ink-900">{w.name}</span>,
    },
    {
      key: "policy",
      header: t("wallet.col.policy"),
      render: (w) =>
        w.policyId ? policyNo[w.policyId] : (
          <span className="text-ink-400">—</span>
        ),
    },
    {
      key: "card",
      header: t("wallet.col.card"),
      sortValue: (w) => (issued(w) ? 1 : 0),
      render: (w) =>
        issued(w) ? (
          <StatusBadge tone="success">{t("wallet.cardActive")}</StatusBadge>
        ) : (
          <StatusBadge tone="neutral">{t("wallet.cardPending")}</StatusBadge>
        ),
    },
    {
      key: "actions",
      header: t("common.actions"),
      align: "right",
      render: (w) =>
        issued(w) ? (
          <button
            type="button"
            onClick={() => setPreview(true)}
            className="btn btn-ghost btn-sm"
          >
            <Icon name="eye" size={16} /> {t("wallet.preview")}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => toast(t("wallet.issued"), "success")}
            className="btn btn-ghost btn-sm"
          >
            <Icon name="wallet" size={16} /> {t("wallet.issue")}
          </button>
        ),
    },
  ];

  return (
    <div className="space-y-4">
      <FilterBar
        search={search}
        onSearch={setSearch}
        placeholder={t("workers.searchPlaceholder")}
      >
        <button
          type="button"
          onClick={() => setPreview(true)}
          className="btn btn-ghost btn-md"
        >
          <Icon name="eye" /> {t("wallet.preview")}
        </button>
      </FilterBar>

      <DataTable
        columns={columns}
        rows={rows}
        getRowKey={(w) => w.id}
        labels={{
          empty: t("wallet.empty"),
          prev: t("common.prev"),
          next: t("common.next"),
          range: (from, to, total) => t("common.range", { from, to, total }),
        }}
      />

      <Modal
        open={preview}
        onClose={() => setPreview(false)}
        title={t("wallet.previewTitle")}
        className="max-w-md"
      >
        <div className="flex justify-center">
          <IOSFrame>
            <WalletApp />
          </IOSFrame>
        </div>
      </Modal>
    </div>
  );
}
