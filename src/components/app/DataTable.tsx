// src/components/app/DataTable.tsx
// Generic, client-side sortable + paginated table. Columns declare an optional
// `sortValue` to become sortable and an optional `render` for custom cells.
// All labels are passed in (i18n stays in the calling screen).

"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

export type Column<T> = {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  /** Return a comparable value to make this column sortable. */
  sortValue?: (row: T) => string | number;
  align?: "left" | "right" | "center";
};

export type DataTableLabels = {
  empty: string;
  prev: string;
  next: string;
  /** e.g. (from, to, total) => "1–10 of 42" */
  range: (from: number, to: number, total: number) => string;
};

const ALIGN = { left: "text-left", right: "text-right", center: "text-center" };

export function DataTable<T>({
  columns,
  rows,
  pageSize = 10,
  getRowKey,
  onRowClick,
  labels,
}: {
  columns: Column<T>[];
  rows: T[];
  pageSize?: number;
  getRowKey: (row: T, index: number) => string;
  onRowClick?: (row: T) => void;
  labels: DataTableLabels;
}) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);

  const sorted = useMemo(() => {
    const col = columns.find((c) => c.key === sortKey);
    if (!col?.sortValue) return rows;
    const dir = sortDir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const av = col.sortValue!(a);
      const bv = col.sortValue!(b);
      return av < bv ? -dir : av > bv ? dir : 0;
    });
  }, [rows, columns, sortKey, sortDir]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const start = safePage * pageSize;
  const pageRows = sorted.slice(start, start + pageSize);

  function toggleSort(col: Column<T>) {
    if (!col.sortValue) return;
    if (sortKey === col.key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(col.key);
      setSortDir("asc");
    }
    setPage(0);
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-100 bg-sky-50/60">
              {columns.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  aria-sort={
                    c.sortValue && sortKey === c.key
                      ? sortDir === "asc"
                        ? "ascending"
                        : "descending"
                      : undefined
                  }
                  role={c.sortValue ? "button" : undefined}
                  tabIndex={c.sortValue ? 0 : undefined}
                  className={cn(
                    "px-4 py-3 font-600 text-ink-600 whitespace-nowrap",
                    ALIGN[c.align ?? "left"],
                    c.sortValue && "cursor-pointer select-none hover:text-brand-600",
                  )}
                  onClick={() => toggleSort(c)}
                  onKeyDown={(e) => {
                    if (c.sortValue && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault();
                      toggleSort(c);
                    }
                  }}
                >
                  <span className="inline-flex items-center gap-1">
                    {c.header}
                    {c.sortValue && sortKey === c.key && (
                      <Icon
                        name={sortDir === "asc" ? "chevD" : "chevD"}
                        size={14}
                        className={sortDir === "asc" ? "rotate-180" : ""}
                      />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-ink-400"
                >
                  {labels.empty}
                </td>
              </tr>
            ) : (
              pageRows.map((row, i) => (
                <tr
                  key={getRowKey(row, start + i)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    "border-b border-ink-50 last:border-0",
                    onRowClick && "cursor-pointer hover:bg-sky-50/70",
                  )}
                >
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      className={cn(
                        "px-4 py-3 text-ink-800 whitespace-nowrap",
                        ALIGN[c.align ?? "left"],
                      )}
                    >
                      {c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {sorted.length > pageSize && (
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-ink-100">
          <span className="text-xs text-ink-500 tabnum">
            {labels.range(start + 1, Math.min(start + pageSize, sorted.length), sorted.length)}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={safePage === 0}
              onClick={() => setPage((p) => p - 1)}
              className="btn btn-ghost btn-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {labels.prev}
            </button>
            <button
              type="button"
              disabled={safePage >= pageCount - 1}
              onClick={() => setPage((p) => p + 1)}
              className="btn btn-ghost btn-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {labels.next}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
