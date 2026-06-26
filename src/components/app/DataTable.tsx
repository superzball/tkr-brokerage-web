// src/components/app/DataTable.tsx
// Generic, client-side sortable + paginated table. Columns declare an optional
// `sortValue` to become sortable and an optional `render` for custom cells.
// All labels are passed in (i18n stays in the calling screen).

"use client";

import { useMemo, useState } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Skeleton } from "./Skeleton";
import { cn } from "@/lib/cn";

export type Column<T> = {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  /** Return a comparable value to make this column sortable. */
  sortValue?: (row: T) => string | number;
  align?: "left" | "right" | "center";
  /** Render the cell in a tabular monospace face (IDs / policy / ticket nos).
   *  Only takes visual effect in the premium (admin) zone. */
  mono?: boolean;
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
  loading = false,
  error,
  emptyIcon = "box",
  emptyState,
}: {
  columns: Column<T>[];
  rows: T[];
  pageSize?: number;
  getRowKey: (row: T, index: number) => string;
  onRowClick?: (row: T) => void;
  labels: DataTableLabels;
  /** Render shimmering placeholder rows instead of data. */
  loading?: boolean;
  /** Show an error panel (with the empty cell layout) when set. */
  error?: string | null;
  /** Icon for the built-in empty state. */
  emptyIcon?: IconName;
  /** Custom empty body (icon + CTA). Falls back to `labels.empty`. */
  emptyState?: React.ReactNode;
}) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);
  // Page size + density are user-tunable in the premium zone (toolbar shown via
  // CSS only under data-theme="premium"). Defaults preserve friendly behaviour:
  // size = the pageSize prop, density "compact" only changes premium padding.
  const [size, setSize] = useState(pageSize);
  const [density, setDensity] = useState<"compact" | "comfortable">("compact");

  // Page-size choices for the premium toolbar — include the caller's pageSize.
  const sizeOptions = Array.from(new Set([pageSize, 25, 50, 100, 200])).sort(
    (a, b) => a - b,
  );

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

  const pageCount = Math.max(1, Math.ceil(sorted.length / size));
  const safePage = Math.min(page, pageCount - 1);
  const start = safePage * size;
  const pageRows = sorted.slice(start, start + size);

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

  const emptyBlock = emptyState ?? (
    <div className="flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-100 to-brand-100 text-brand-600 flex items-center justify-center ring-1 ring-brand-100 mb-3">
        <Icon name={emptyIcon} size={22} />
      </div>
      <p className="text-sm text-ink-400">{labels.empty}</p>
    </div>
  );

  const errorBlock = (
    <div className="flex flex-col items-center text-center" role="alert">
      <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center ring-1 ring-rose-100 mb-3">
        <Icon name="alertTri" size={22} />
      </div>
      <p className="text-sm text-ink-500 max-w-sm">{error}</p>
    </div>
  );

  return (
    <div className="card overflow-hidden">
      {/* Premium density toolbar — hidden in the friendly zone via CSS. */}
      <div className="qtable-toolbar hidden items-center justify-end gap-2 px-3 py-2 border-b border-ink-100">
        <button
          type="button"
          aria-label="Toggle row density"
          aria-pressed={density === "compact"}
          onClick={() =>
            setDensity((d) => (d === "compact" ? "comfortable" : "compact"))
          }
          className="inline-flex items-center justify-center w-8 h-8 rounded-md text-ink-500 hover:bg-ink-50 hover:text-ink-800"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            {density === "compact" ? (
              <>
                <line x1="2" y1="4" x2="14" y2="4" />
                <line x1="2" y1="7" x2="14" y2="7" />
                <line x1="2" y1="10" x2="14" y2="10" />
                <line x1="2" y1="13" x2="14" y2="13" />
              </>
            ) : (
              <>
                <line x1="2" y1="5" x2="14" y2="5" />
                <line x1="2" y1="8" x2="14" y2="8" />
                <line x1="2" y1="11" x2="14" y2="11" />
              </>
            )}
          </svg>
        </button>
        <select
          aria-label="Rows per page"
          value={size}
          onChange={(e) => {
            setSize(Number(e.target.value));
            setPage(0);
          }}
          className="field !w-auto !py-1.5 !px-2.5 text-xs tabnum"
        >
          {sizeOptions.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop / tablet: full table */}
      <div className="qtable-scroll hidden md:block overflow-x-auto">
        <table className={cn("qtable w-full text-sm", density === "comfortable" && "is-comfortable")}>
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
                    {c.sortValue &&
                      (sortKey === c.key ? (
                        <Icon
                          name="chevD"
                          size={14}
                          className={sortDir === "asc" ? "rotate-180" : ""}
                        />
                      ) : (
                        // faint caret hint on sortable, unsorted columns
                        // (premium zone only — hidden in friendly via .sort-hint)
                        <Icon name="chevD" size={14} className="opacity-25 sort-hint" />
                      ))}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: Math.min(size, 6) }).map((_, r) => (
                <tr key={r} className="border-b border-ink-50 last:border-0">
                  {columns.map((c) => (
                    <td key={c.key} className={cn("px-4 py-3.5", ALIGN[c.align ?? "left"])}>
                      <Skeleton className="h-4 w-[70%] max-w-[140px]" />
                    </td>
                  ))}
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12">
                  {errorBlock}
                </td>
              </tr>
            ) : pageRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-14">
                  {emptyBlock}
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
                        c.mono && "mono",
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

      {/* Mobile (<768px): each row as a stacked label/value card */}
      <div className="md:hidden">
        {loading ? (
          <div className="divide-y divide-ink-50">
            {Array.from({ length: 4 }).map((_, r) => (
              <div key={r} className="px-4 py-4 space-y-2">
                <Skeleton className="h-3.5 w-1/3" />
                <Skeleton className="h-3.5 w-2/3" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="px-4 py-12">{errorBlock}</div>
        ) : pageRows.length === 0 ? (
          <div className="px-4 py-12">{emptyBlock}</div>
        ) : (
          <ul className="divide-y divide-ink-50">
            {pageRows.map((row, i) => {
              const cells = columns.map((c) => (
                <div
                  key={c.key}
                  className="flex items-start justify-between gap-3 py-0.5"
                >
                  <span className="text-xs font-600 text-ink-500 shrink-0">
                    {c.header}
                  </span>
                  <span className={cn("text-sm text-ink-800 min-w-0 text-right", c.mono && "mono")}>
                    {c.render
                      ? c.render(row)
                      : String((row as Record<string, unknown>)[c.key] ?? "")}
                  </span>
                </div>
              ));
              return (
                <li key={getRowKey(row, start + i)}>
                  {onRowClick ? (
                    <button
                      type="button"
                      onClick={() => onRowClick(row)}
                      className="w-full text-left px-4 py-3 space-y-1 hover:bg-sky-50/70"
                    >
                      {cells}
                    </button>
                  ) : (
                    <div className="px-4 py-3 space-y-1">{cells}</div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {!loading && !error && sorted.length > size && (
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-ink-100">
          <span className="text-xs text-ink-500 tabnum">
            {labels.range(start + 1, Math.min(start + size, sorted.length), sorted.length)}
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
