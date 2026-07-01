"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useBaht } from "@/lib/format";
import { DataTable, type Column } from "@/components/app/DataTable";
import { FilterBar } from "@/components/app/FilterBar";
import { StatusBadge, type BadgeTone } from "@/components/app/StatusBadge";
import { StatCard } from "@/components/app/StatCard";
import { Select } from "@/components/app/form";
import { readLocalSales, readCancelledSaleIds } from "@/lib/mock/local-sales";
import type { AgentSale, InsuranceType, SaleStatus } from "@/types/portal";

const STATUSES: SaleStatus[] = ["issued", "pending", "cancelled"];
const PRODUCTS: InsuranceType[] = ["worker", "auto", "travel", "pa", "fire"];
const STATUS_TONE: Record<SaleStatus, BadgeTone> = {
  issued: "success",
  pending: "warning",
  cancelled: "danger",
};

export function SalesClient({
  sales,
  stats,
}: {
  sales: AgentSale[];
  stats: { gwpThisMonth: number; policiesSold: number; pending: number; commissionYtd: number };
}) {
  const t = useTranslations("agent");
  const tc = useTranslations("business");
  const baht = useBaht();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | SaleStatus>("all");
  const [product, setProduct] = useState<"all" | InsuranceType>("all");
  // Working list = seed + on-behalf sales (localStorage), with cancellations
  // (also mock-persisted) applied. A real backend would serve this.
  const [working, setWorking] = useState<AgentSale[]>(sales);
  const [localIds, setLocalIds] = useState<Set<string>>(new Set());
  useEffect(() => {
    const local = readLocalSales();
    const cancelled = new Set(readCancelledSaleIds());
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalIds(new Set(local.map((s) => s.id)));
    setWorking(
      [...local, ...sales].map((s) =>
        cancelled.has(s.id) ? { ...s, status: "cancelled" as SaleStatus } : s,
      ),
    );
  }, [sales]);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return working.filter((s) => {
      if (status !== "all" && s.status !== status) return false;
      if (product !== "all" && s.product !== product) return false;
      if (q && !s.clientName.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [working, search, status, product]);

  const columns: Column<AgentSale>[] = [
    {
      key: "date",
      header: t("sales.col.date"),
      sortValue: (s) => s.date,
      render: (s) => <span className="tabnum">{s.date}</span>,
    },
    {
      key: "client",
      header: t("sales.col.client"),
      sortValue: (s) => s.clientName,
      render: (s) => (
        <span className="inline-flex items-center gap-2">
          <span className="font-600 text-ink-900">{s.clientName}</span>
          {localIds.has(s.id) && (
            <StatusBadge tone="success" className="text-[0.7rem]">{t("sales.newBadge")}</StatusBadge>
          )}
        </span>
      ),
    },
    { key: "product", header: t("sales.col.product"), render: (s) => tc(`type.${s.product}`) },
    {
      key: "premium",
      header: t("sales.col.premium"),
      align: "right",
      sortValue: (s) => s.premium,
      render: (s) => <span className="tabnum">{baht(s.premium)}</span>,
    },
    {
      key: "commission",
      header: t("sales.col.commission"),
      align: "right",
      sortValue: (s) => s.commission,
      render: (s) => <span className="tabnum">{baht(s.commission)}</span>,
    },
    {
      key: "status",
      header: t("sales.col.status"),
      sortValue: (s) => s.status,
      render: (s) => (
        <StatusBadge tone={STATUS_TONE[s.status]}>{t(`sales.status.${s.status}`)}</StatusBadge>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon="coins" label={t("sales.stats.gwp")} value={baht(stats.gwpThisMonth)} tone="brand" />
        <StatCard icon="shieldCheck" label={t("sales.stats.policies")} value={stats.policiesSold} tone="mint" />
        <StatCard icon="clock" label={t("sales.stats.pending")} value={stats.pending} deltaTone="flat" tone="gold" />
        <StatCard icon="wallet" label={t("sales.stats.commission")} value={baht(stats.commissionYtd)} tone="peach" />
      </div>

      <FilterBar search={search} onSearch={setSearch} placeholder={t("clients.searchPlaceholder")}>
        <Select className="w-auto" value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
          <option value="all">{t("sales.all")}</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{t(`sales.status.${s}`)}</option>
          ))}
        </Select>
        <Select className="w-auto" value={product} onChange={(e) => setProduct(e.target.value as typeof product)}>
          <option value="all">{t("sales.all")}</option>
          {PRODUCTS.map((p) => (
            <option key={p} value={p}>{tc(`type.${p}`)}</option>
          ))}
        </Select>
      </FilterBar>

      <DataTable
        columns={columns}
        rows={rows}
        getRowKey={(s) => s.id}
        onRowClick={(s) => router.push(`/app/sales/${s.id}`)}
        labels={{
          empty: t("sales.empty"),
          prev: tc("common.prev"),
          next: tc("common.next"),
          range: (from, to, total) => tc("common.range", { from, to, total }),
        }}
      />
    </div>
  );
}
