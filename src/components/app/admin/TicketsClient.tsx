// src/components/app/admin/TicketsClient.tsx
// Policy Tickets (CRM): platform list of MOU/MOTI24 fulfillment tickets, a
// status + search filter, and a create-ticket modal. Creating a ticket DEBITS
// the customer's internal credit wallet (an append-only ledger entry) — the
// wallet itself is never shown to customers. Row click → full ticket detail.

"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import type {
  PolicyTicket,
  CreditTransaction,
  CrmProduct,
  Duration,
  TicketStatus,
  TicketPriority,
} from "@/types/portal";
import { DataTable, type Column } from "@/components/app/DataTable";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Modal } from "@/components/app/Modal";
import { Input, Select } from "@/components/app/form";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/app/toast";
import { useBaht } from "@/lib/format";
import { ticketTotal } from "@/lib/mock/seed";
import {
  mergeTickets,
  customerBalance,
  addNewTicket,
  addLedgerTx,
  mockId,
} from "@/lib/mock/local-crm";
import { addAuditEntry } from "@/lib/mock/local-admin";
import { policyTicketTone, ticketPaymentTone, ticketPriorityTone } from "./badges";

const PRODUCTS: CrmProduct[] = ["MOU", "MOTI24"];
const DURATIONS: Duration[] = ["3_months", "6_months", "1_year", "15_months"];
const STATUSES: TicketStatus[] = [
  "draft",
  "pending_send",
  "sent_to_thip",
  "thip_processing",
  "completed",
  "rejected",
];
const PRIORITIES: TicketPriority[] = ["low", "normal", "high", "urgent"];

type Customer = { id: string; name: string };

const todayIso = () => new Date().toISOString().slice(0, 10);
const ticketNo = () =>
  `TKR-${todayIso().replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 8999)}`;
const code6 = () => String(Math.floor(100000 + Math.random() * 899999));

export function TicketsClient({
  tickets: seed,
  seedLedger,
  customers,
}: {
  tickets: PolicyTicket[];
  seedLedger: CreditTransaction[];
  customers: Customer[];
}) {
  const t = useTranslations("admin.policyTickets");
  const tc = useTranslations("admin.crm");
  const ts = useTranslations("admin.status");
  const tcommon = useTranslations("business.common");
  const { toast } = useToast();
  const baht = useBaht();
  const router = useRouter();

  // localStorage is client-only — merge local creations after mount.
  const [rows, setRows] = useState<PolicyTicket[]>(seed);
  useEffect(() => setRows(mergeTickets(seed)), [seed]);

  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  // create-ticket draft
  const [customerId, setCustomerId] = useState(customers[0]?.id ?? "");
  const [product, setProduct] = useState<CrmProduct>("MOU");
  const [duration, setDuration] = useState<Duration>("1_year");
  const [headcount, setHeadcount] = useState(10);
  const [discount, setDiscount] = useState(0);
  const [coverageStart, setCoverageStart] = useState(todayIso());
  const [priority, setPriority] = useState<TicketPriority>("normal");

  const liveTotal = ticketTotal(product, duration, discount, headcount);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!needle) return true;
      return (
        r.ticketNumber.toLowerCase().includes(needle) ||
        (customers.find((c) => c.id === r.customerId)?.name ?? r.customerId)
          .toLowerCase()
          .includes(needle)
      );
    });
  }, [rows, statusFilter, q, customers]);

  function custName(id: string) {
    return customers.find((c) => c.id === id)?.name ?? id;
  }

  function create() {
    if (!customerId || headcount < 1) {
      toast(t("create.invalid"), "error");
      return;
    }
    const id = mockId("tk");
    const number = ticketNo();
    const total = ticketTotal(product, duration, discount, headcount);
    const ticket: PolicyTicket = {
      id,
      ticketNumber: number,
      status: "draft",
      customerId,
      product,
      duration,
      coverageStart,
      headcount,
      discountPerPerson: discount,
      totalPrice: total,
      paymentStatus: "pending",
      paidAmount: 0,
      priority,
      dueDate: coverageStart,
      publicToken: `tok_${id}`,
      customerCode: code6(),
      createdBy: "u_admin",
      createdAt: todayIso(),
    };
    // DEBIT the wallet: append-only ledger entry, balanceAfter = prev − total
    const prev = customerBalance(seedLedger, customerId);
    addLedgerTx({
      id: mockId("ct"),
      customerId,
      ticketId: id,
      type: "debit",
      amount: total,
      balanceAfter: prev - total,
      description: `${tc("debitDesc")} #${number} (${tc(`product.${product}`)} ${tc(`duration.${duration}`)} ${headcount})`,
      createdAt: todayIso(),
    });
    addNewTicket(ticket);
    addAuditEntry({
      id: mockId("au"),
      actor: "คุณกานต์ ผู้ดูแลระบบ",
      action: t("auditCreate"),
      target: number,
      time: new Date().toISOString(),
    });
    setRows(mergeTickets(seed));
    setOpen(false);
    toast(t("create.created", { amount: baht(total) }), "success");
    router.push(`/admin/ops/tickets/${id}`);
  }

  const columns: Column<PolicyTicket>[] = [
    { key: "ticketNumber", header: t("col.ticketNo"), mono: true, sortValue: (r) => r.ticketNumber, render: (r) => <span className="font-600">{r.ticketNumber}</span> },
    { key: "customer", header: t("col.customer"), sortValue: (r) => custName(r.customerId), render: (r) => custName(r.customerId) },
    { key: "product", header: t("col.product"), render: (r) => tc(`product.${r.product}`) },
    { key: "duration", header: t("col.duration"), render: (r) => tc(`duration.${r.duration}`) },
    { key: "coverageStart", header: t("col.coverageStart"), sortValue: (r) => r.coverageStart },
    { key: "headcount", header: t("col.headcount"), align: "right", sortValue: (r) => r.headcount, render: (r) => <span className="tabnum">{r.headcount}</span> },
    { key: "total", header: t("col.total"), align: "right", sortValue: (r) => r.totalPrice, render: (r) => <span className="tabnum">{baht(r.totalPrice)}</span> },
    { key: "status", header: t("col.status"), sortValue: (r) => r.status, render: (r) => <StatusBadge tone={policyTicketTone[r.status]}>{ts(r.status)}</StatusBadge> },
    { key: "payment", header: t("col.payment"), render: (r) => <StatusBadge tone={ticketPaymentTone[r.paymentStatus]}>{ts(r.paymentStatus)}</StatusBadge> },
    { key: "priority", header: t("col.priority"), render: (r) => <StatusBadge tone={ticketPriorityTone[r.priority]}>{ts(r.priority)}</StatusBadge> },
  ];

  return (
    <>
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <div className="w-44">
          <Select label={t("filterStatus")} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as TicketStatus | "all")}>
            <option value="all">{t("filterAll")}</option>
            {STATUSES.map((s) => <option key={s} value={s}>{ts(s)}</option>)}
          </Select>
        </div>
        <div className="flex-1 min-w-[180px]">
          <Input label={t("search")} value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("searchPlaceholder")} />
        </div>
        <Button variant="primary" size="sm" onClick={() => setOpen(true)}>{t("newCta")}</Button>
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        pageSize={15}
        getRowKey={(r) => r.id}
        onRowClick={(r) => router.push(`/admin/ops/tickets/${r.id}`)}
        labels={{
          empty: t("empty"),
          prev: tcommon("prev"),
          next: tcommon("next"),
          range: (from, to, total) => tcommon("range", { from, to, total }),
        }}
      />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={t("create.title")}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>{tcommon("cancel")}</Button>
            <Button variant="primary" size="sm" onClick={create}>{t("create.submit")}</Button>
          </>
        }
      >
        <div className="space-y-3">
          <Select label={t("create.customer")} value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
            {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
          <div className="grid grid-cols-2 gap-3">
            <Select label={t("create.product")} value={product} onChange={(e) => setProduct(e.target.value as CrmProduct)}>
              {PRODUCTS.map((p) => <option key={p} value={p}>{tc(`product.${p}`)}</option>)}
            </Select>
            <Select label={t("create.duration")} value={duration} onChange={(e) => setDuration(e.target.value as Duration)}>
              {DURATIONS.map((d) => <option key={d} value={d}>{tc(`duration.${d}`)}</option>)}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input type="number" min={1} label={t("create.headcount")} value={headcount} onChange={(e) => setHeadcount(Math.max(0, Number(e.target.value)))} />
            <Input type="number" min={0} label={t("create.discount")} value={discount} onChange={(e) => setDiscount(Math.max(0, Number(e.target.value)))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input type="date" label={t("create.coverageStart")} value={coverageStart} onChange={(e) => setCoverageStart(e.target.value)} />
            <Select label={t("create.priority")} value={priority} onChange={(e) => setPriority(e.target.value as TicketPriority)}>
              {PRIORITIES.map((p) => <option key={p} value={p}>{ts(p)}</option>)}
            </Select>
          </div>
          <div className="rounded-xl bg-sky-50 p-3 flex items-center justify-between">
            <span className="text-sm text-ink-600">{t("create.liveTotal")}</span>
            <span className="tabnum text-xl font-700 text-ink-900">{baht(liveTotal)}</span>
          </div>
          <p className="text-xs text-ink-400">{t("create.debitNote")}</p>
        </div>
      </Modal>
    </>
  );
}
