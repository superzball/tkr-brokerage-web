"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useBaht } from "@/lib/format";
import { DataTable, type Column } from "@/components/app/DataTable";
import { FilterBar } from "@/components/app/FilterBar";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Select } from "@/components/app/form";
import type { Policy, PolicyStatus } from "@/types/portal";
import { policyTone } from "./status";

const STATUSES: PolicyStatus[] = ["active", "expiring", "expired", "pending"];

export function PoliciesTable({ policies }: { policies: Policy[] }) {
  const t = useTranslations("business");
  const baht = useBaht();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | PolicyStatus>("all");

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return policies.filter((p) => {
      if (status !== "all" && p.status !== status) return false;
      if (!q) return true;
      return (
        p.policyNo.toLowerCase().includes(q) ||
        p.insurer.toLowerCase().includes(q)
      );
    });
  }, [policies, search, status]);

  const columns: Column<Policy>[] = [
    {
      key: "type",
      header: t("policies.col.type"),
      sortValue: (p) => p.type,
      render: (p) => t(`type.${p.type}`),
    },
    {
      key: "policyNo",
      header: t("policies.col.policyNo"),
      sortValue: (p) => p.policyNo,
      render: (p) => <span className="font-600 text-ink-900">{p.policyNo}</span>,
    },
    {
      key: "insurer",
      header: t("policies.col.insurer"),
      sortValue: (p) => p.insurer,
    },
    {
      key: "workers",
      header: t("policies.col.workers"),
      align: "right",
      sortValue: (p) => p.workersCount ?? -1,
      render: (p) => <span className="tabnum">{p.workersCount ?? "—"}</span>,
    },
    {
      key: "premium",
      header: t("policies.col.premium"),
      align: "right",
      sortValue: (p) => p.premium,
      render: (p) => <span className="tabnum">{baht(p.premium)}</span>,
    },
    {
      key: "status",
      header: t("policies.col.status"),
      sortValue: (p) => p.status,
      render: (p) => (
        <StatusBadge tone={policyTone[p.status]}>
          {t(`policyStatus.${p.status}`)}
        </StatusBadge>
      ),
    },
    {
      key: "expiry",
      header: t("policies.col.expiry"),
      align: "right",
      sortValue: (p) => p.endDate,
      render: (p) => <span className="tabnum">{p.endDate}</span>,
    },
  ];

  return (
    <div className="space-y-4">
      <FilterBar
        search={search}
        onSearch={setSearch}
        placeholder={t("policies.searchPlaceholder")}
      >
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value as typeof status)}
          className="w-auto"
        >
          <option value="all">{t("common.all")}</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {t(`policyStatus.${s}`)}
            </option>
          ))}
        </Select>
      </FilterBar>

      <DataTable
        columns={columns}
        rows={rows}
        getRowKey={(p) => p.id}
        onRowClick={(p) => router.push(`/app/policies/${p.id}`)}
        labels={{
          empty: t("policies.empty"),
          prev: t("common.prev"),
          next: t("common.next"),
          range: (from, to, total) => t("common.range", { from, to, total }),
        }}
      />
    </div>
  );
}
