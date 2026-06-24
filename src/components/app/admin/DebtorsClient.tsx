// src/components/app/admin/DebtorsClient.tsx
// Debtors / AR aging. Buckets every unpaid (or partial) ticket by dueDate vs a
// fixed "today", with countdown labels, per-customer aggregate outstanding, and
// a drill row per unpaid ticket (total / paid / remaining / status). Computed
// from the MERGED tickets so a recorded payment drops a ticket out of AR.

"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { PolicyTicket } from "@/types/portal";
import { DataTable, type Column } from "@/components/app/DataTable";
import { StatusBadge } from "@/components/app/StatusBadge";
import { EmptyState } from "@/components/app/EmptyState";
import { useBaht } from "@/lib/format";
import { mergeTickets } from "@/lib/mock/local-crm";
import { ticketPaymentTone, bucketTone } from "./badges";

type Bucket = "not_due" | "due_today" | "overdue_1_3" | "overdue_gt_3";
const BUCKETS: Bucket[] = ["not_due", "due_today", "overdue_1_3", "overdue_gt_3"];

function dayDiff(due: string | undefined, today: number): number | null {
  if (!due) return null;
  return Math.floor((today - new Date(due).getTime()) / 86400000);
}
function bucketOf(due: string | undefined, today: number): Bucket {
  const d = dayDiff(due, today);
  if (d === null || d < 0) return "not_due";
  if (d === 0) return "due_today";
  if (d <= 3) return "overdue_1_3";
  return "overdue_gt_3";
}

export function DebtorsClient({
  tickets: seed,
  today,
  customers,
}: {
  tickets: PolicyTicket[];
  today: string; // ISO date, fixed reference "today"
  customers: { id: string; name: string }[];
}) {
  const t = useTranslations("admin.debtors");
  const ts = useTranslations("admin.status");
  const tcommon = useTranslations("business.common");
  const baht = useBaht();
  const todayMs = new Date(today).getTime();

  const [tickets, setTickets] = useState<PolicyTicket[]>(seed);
  useEffect(() => setTickets(mergeTickets(seed)), [seed]);

  function custName(id: string) {
    return customers.find((c) => c.id === id)?.name ?? id;
  }

  const open = useMemo(
    () =>
      tickets
        .filter((x) => x.paymentStatus !== "paid" && x.paymentStatus !== "refunded")
        .map((x) => ({
          ticket: x,
          remaining: x.totalPrice - x.paidAmount,
          bucket: bucketOf(x.dueDate, todayMs),
          days: dayDiff(x.dueDate, todayMs),
        })),
    [tickets, todayMs],
  );

  const byBucket = (b: Bucket) => open.filter((r) => r.bucket === b);
  const sum = (rows: { remaining: number }[]) => rows.reduce((s, r) => s + r.remaining, 0);

  const byCustomer = useMemo(() => {
    const map = new Map<string, number>();
    open.forEach((r) => map.set(r.ticket.customerId, (map.get(r.ticket.customerId) ?? 0) + r.remaining));
    return [...map.entries()].map(([id, outstanding]) => ({ id, name: custName(id), outstanding }))
      .sort((a, b) => b.outstanding - a.outstanding);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function countdown(days: number | null): string {
    if (days === null) return "—";
    if (days < 0) return t("dueIn", { days: -days });
    if (days === 0) return t("dueToday");
    return t("overdueBy", { days });
  }

  const columns: Column<(typeof open)[number]>[] = [
    { key: "ticket", header: t("col.ticket"), sortValue: (r) => r.ticket.ticketNumber, render: (r) => <span className="tabnum">{r.ticket.ticketNumber}</span> },
    { key: "customer", header: t("col.customer"), render: (r) => custName(r.ticket.customerId) },
    { key: "total", header: t("col.total"), align: "right", sortValue: (r) => r.ticket.totalPrice, render: (r) => <span className="tabnum">{baht(r.ticket.totalPrice)}</span> },
    { key: "paid", header: t("col.paid"), align: "right", render: (r) => <span className="tabnum">{baht(r.ticket.paidAmount)}</span> },
    { key: "remaining", header: t("col.remaining"), align: "right", sortValue: (r) => r.remaining, render: (r) => <span className="tabnum font-600 text-rose-600">{baht(r.remaining)}</span> },
    { key: "due", header: t("col.due"), sortValue: (r) => r.ticket.dueDate ?? "", render: (r) => <span className="text-xs">{r.ticket.dueDate ?? "—"} · {countdown(r.days)}</span> },
    { key: "bucket", header: t("col.bucket"), render: (r) => <StatusBadge tone={bucketTone[r.bucket]}>{t(`bucket.${r.bucket}`)}</StatusBadge> },
    { key: "status", header: t("col.status"), render: (r) => <StatusBadge tone={ticketPaymentTone[r.ticket.paymentStatus]}>{ts(r.ticket.paymentStatus)}</StatusBadge> },
  ];

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {BUCKETS.map((b) => {
          const rows = byBucket(b);
          return (
            <div key={b} className="card p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-500 text-ink-500">{t(`bucket.${b}`)}</span>
                <StatusBadge tone={bucketTone[b]}>{rows.length}</StatusBadge>
              </div>
              <div className="mt-3 text-2xl font-700 text-ink-900 tabnum">{baht(sum(rows))}</div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* per-customer aggregate */}
        <section className="card p-5 lg:col-span-1">
          <h2 className="font-700 text-ink-900 mb-3">{t("perCustomer")}</h2>
          {byCustomer.length === 0 ? (
            <p className="text-sm text-ink-400">{t("empty")}</p>
          ) : (
            <ul className="space-y-2.5">
              {byCustomer.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-3">
                  <span className="text-sm text-ink-700 truncate">{c.name}</span>
                  <span className="tabnum font-700 text-rose-600 shrink-0">{baht(c.outstanding)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* unpaid ticket drill */}
        <section className="card p-5 lg:col-span-2">
          <h2 className="font-700 text-ink-900 mb-3">{t("openTickets")}</h2>
          {open.length === 0 ? (
            <EmptyState icon="checkCircle" title={t("allClear")} />
          ) : (
            <DataTable
              columns={columns}
              rows={open}
              pageSize={10}
              getRowKey={(r) => r.ticket.id}
              labels={{
                empty: t("empty"),
                prev: tcommon("prev"),
                next: tcommon("next"),
                range: (from, to, total) => tcommon("range", { from, to, total }),
              }}
            />
          )}
        </section>
      </div>
    </>
  );
}
