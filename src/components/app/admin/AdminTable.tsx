// src/components/app/admin/AdminTable.tsx
// One client table for every back-office list. Server pages do all i18n +
// formatting and hand over serializable rows; this wraps the shared DataTable
// (sort + paginate) and renders cells by `kind`. Badge cells are passed as
// { label, tone } so status colours stay data-driven.

"use client";

import { useTranslations } from "next-intl";
import { DataTable, type Column } from "@/components/app/DataTable";
import { StatusBadge, type BadgeTone } from "@/components/app/StatusBadge";
import { useBaht } from "@/lib/format";

export type Badge = { label: string; tone: BadgeTone };
export type AdminCol = {
  key: string;
  header: string;
  align?: "left" | "right" | "center";
  kind?: "text" | "baht" | "mono" | "badge";
  sortable?: boolean;
};
export type AdminRow = Record<string, unknown>;

export function AdminTable({
  columns,
  rows,
  empty,
  pageSize = 10,
}: {
  columns: AdminCol[];
  rows: AdminRow[];
  empty: string;
  pageSize?: number;
}) {
  const t = useTranslations("business.common");
  const baht = useBaht();

  const cols: Column<AdminRow>[] = columns.map((c) => ({
    key: c.key,
    header: c.header,
    align: c.align,
    sortValue:
      c.sortable === false
        ? undefined
        : (r) => {
            const v = r[c.key];
            if (c.kind === "badge") return (v as Badge | undefined)?.label ?? "";
            return typeof v === "number" ? v : String(v ?? "");
          },
    render: (r) => {
      const v = r[c.key];
      if (c.kind === "baht")
        return <span className="tabnum">{baht(Number(v) || 0)}</span>;
      if (c.kind === "mono") return <span className="tabnum">{String(v ?? "")}</span>;
      if (c.kind === "badge") {
        const b = v as Badge | undefined;
        return b ? <StatusBadge tone={b.tone}>{b.label}</StatusBadge> : null;
      }
      return String(v ?? "");
    },
  }));

  return (
    <DataTable
      columns={cols}
      rows={rows}
      pageSize={pageSize}
      getRowKey={(r, i) => String((r as { id?: string }).id ?? i)}
      labels={{
        empty,
        prev: t("prev"),
        next: t("next"),
        range: (from, to, total) => t("range", { from, to, total }),
      }}
    />
  );
}
