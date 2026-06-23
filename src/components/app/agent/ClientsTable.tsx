"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useBaht } from "@/lib/format";
import { DataTable, type Column } from "@/components/app/DataTable";
import { FilterBar } from "@/components/app/FilterBar";
import { StatusBadge } from "@/components/app/StatusBadge";
import type { Client } from "@/types/portal";

export function ClientsTable({ clients }: { clients: Client[] }) {
  const t = useTranslations("agent");
  const tc = useTranslations("business"); // shared common.* labels
  const baht = useBaht();
  const router = useRouter();
  const [search, setSearch] = useState("");

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter((c) => c.name.toLowerCase().includes(q));
  }, [clients, search]);

  const columns: Column<Client>[] = [
    {
      key: "name",
      header: t("clients.col.name"),
      sortValue: (c) => c.name,
      render: (c) => <span className="font-600 text-ink-900">{c.name}</span>,
    },
    {
      key: "type",
      header: t("clients.col.type"),
      sortValue: (c) => c.type,
      render: (c) => (
        <StatusBadge tone={c.type === "business" ? "info" : "neutral"}>
          {t(`clients.type.${c.type}`)}
        </StatusBadge>
      ),
    },
    {
      key: "policies",
      header: t("clients.col.policies"),
      align: "right",
      sortValue: (c) => c.policies,
      render: (c) => <span className="tabnum">{c.policies}</span>,
    },
    {
      key: "premiumYtd",
      header: t("clients.col.premiumYtd"),
      align: "right",
      sortValue: (c) => c.premiumYtd,
      render: (c) => <span className="tabnum">{baht(c.premiumYtd)}</span>,
    },
    {
      key: "since",
      header: t("clients.col.since"),
      align: "right",
      sortValue: (c) => c.since,
      render: (c) => <span className="tabnum">{c.since}</span>,
    },
  ];

  return (
    <div className="space-y-4">
      <FilterBar
        search={search}
        onSearch={setSearch}
        placeholder={t("clients.searchPlaceholder")}
      />
      <DataTable
        columns={columns}
        rows={rows}
        getRowKey={(c) => c.id}
        onRowClick={(c) => router.push(`/app/clients/${c.id}`)}
        labels={{
          empty: t("clients.empty"),
          prev: tc("common.prev"),
          next: tc("common.next"),
          range: (from, to, total) => tc("common.range", { from, to, total }),
        }}
      />
    </div>
  );
}
