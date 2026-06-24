// src/components/app/admin/PaymentsClient.tsx
// Payments list + record-payment (with slip). A confirmed payment links to a
// ticket, CREDITS the customer's internal wallet (append-only ledger) and
// advances the ticket's payment status. Over-payment guard: a payment can never
// push paidAmount past the ticket total.

"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type {
  PolicyTicket,
  CrmPayment,
  CreditTransaction,
  PaymentMethod,
} from "@/types/portal";
import { DataTable, type Column } from "@/components/app/DataTable";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Modal } from "@/components/app/Modal";
import { Input, Select, FileUpload } from "@/components/app/form";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/app/toast";
import { useBaht } from "@/lib/format";
import {
  mergeTickets,
  mergePayments,
  customerBalance,
  patchTicket,
  addLedgerTx,
  addPayment,
  mockId,
} from "@/lib/mock/local-crm";
import { addAuditEntry } from "@/lib/mock/local-admin";

const METHODS: PaymentMethod[] = [
  "bank_transfer",
  "direct_transfer",
  "k_shop",
  "cash",
  "credit_card",
  "other",
];
const todayIso = () => new Date().toISOString().slice(0, 10);

export function PaymentsClient({
  payments: seedPayments,
  tickets: seedTickets,
  seedLedger,
  customers,
}: {
  payments: CrmPayment[];
  tickets: PolicyTicket[];
  seedLedger: CreditTransaction[];
  customers: { id: string; name: string }[];
}) {
  const t = useTranslations("admin.payments");
  const tc = useTranslations("admin.crm");
  const ts = useTranslations("admin.status");
  const tcommon = useTranslations("business.common");
  const { toast } = useToast();
  const baht = useBaht();

  const [payments, setPayments] = useState<CrmPayment[]>(seedPayments);
  const [tickets, setTickets] = useState<PolicyTicket[]>(seedTickets);
  useEffect(() => {
    setPayments(mergePayments(seedPayments));
    setTickets(mergeTickets(seedTickets));
  }, [seedPayments, seedTickets]);

  const [open, setOpen] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [amount, setAmount] = useState(0);
  const [method, setMethod] = useState<PaymentMethod>("bank_transfer");
  const [ref, setRef] = useState("");

  // only tickets that still owe money can take a payment
  const payable = useMemo(
    () => tickets.filter((x) => x.totalPrice - x.paidAmount > 0),
    [tickets],
  );
  const selected = tickets.find((x) => x.id === ticketId) ?? null;
  const remaining = selected ? selected.totalPrice - selected.paidAmount : 0;

  function custName(id: string) {
    return customers.find((c) => c.id === id)?.name ?? id;
  }
  function ticketNo(id: string) {
    return tickets.find((x) => x.id === id)?.ticketNumber ?? id;
  }

  function openModal() {
    const first = payable[0];
    setTicketId(first?.id ?? "");
    setAmount(first ? first.totalPrice - first.paidAmount : 0);
    setMethod("bank_transfer");
    setRef("");
    setOpen(true);
  }

  function submit() {
    if (!selected) {
      toast(t("record.noTicket"), "error");
      return;
    }
    if (amount <= 0) {
      toast(t("record.invalid"), "error");
      return;
    }
    if (amount > remaining) {
      toast(t("record.overpayGuard", { remaining: baht(remaining) }), "error");
      return;
    }
    const newPaid = selected.paidAmount + amount;
    const paymentStatus = newPaid >= selected.totalPrice ? "paid" : "partial";
    patchTicket(selected.id, { paidAmount: newPaid, paymentStatus });
    const prev = customerBalance(seedLedger, selected.customerId);
    addLedgerTx({
      id: mockId("ct"),
      customerId: selected.customerId,
      ticketId: selected.id,
      type: "credit",
      amount,
      balanceAfter: prev + amount,
      description: `${tc("creditDesc")} #${selected.ticketNumber}`,
      createdAt: todayIso(),
    });
    addPayment({
      id: mockId("cp"),
      paymentDate: todayIso(),
      customerId: selected.customerId,
      ticketId: selected.id,
      amount,
      method,
      referenceNumber: ref || undefined,
      status: "confirmed",
    });
    addAuditEntry({
      id: mockId("au"),
      actor: "คุณกานต์ ผู้ดูแลระบบ",
      action: t("auditPay", { amount: baht(amount) }),
      target: selected.ticketNumber,
      time: new Date().toISOString(),
    });
    setPayments(mergePayments(seedPayments));
    setTickets(mergeTickets(seedTickets));
    setOpen(false);
    toast(t("record.done", { amount: baht(amount) }), "success");
  }

  const columns: Column<CrmPayment>[] = [
    { key: "paymentDate", header: t("col.date"), sortValue: (p) => p.paymentDate },
    { key: "customer", header: t("col.customer"), render: (p) => custName(p.customerId) },
    { key: "ticket", header: t("col.ticket"), render: (p) => <span className="tabnum">{ticketNo(p.ticketId)}</span> },
    { key: "amount", header: t("col.amount"), align: "right", sortValue: (p) => p.amount, render: (p) => <span className="tabnum">{baht(p.amount)}</span> },
    { key: "method", header: t("col.method"), render: (p) => tc(`method.${p.method}`) },
    { key: "ref", header: t("col.ref"), render: (p) => <span className="tabnum">{p.referenceNumber ?? "—"}</span> },
    { key: "status", header: t("col.status"), render: (p) => <StatusBadge tone={p.status === "confirmed" ? "success" : "warning"}>{ts(p.status)}</StatusBadge> },
  ];

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button variant="primary" size="sm" onClick={openModal}>{t("newCta")}</Button>
      </div>

      <DataTable
        columns={columns}
        rows={payments}
        pageSize={15}
        getRowKey={(p) => p.id}
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
        title={t("record.title")}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>{tcommon("cancel")}</Button>
            <Button variant="primary" size="sm" onClick={submit}>{t("record.submit")}</Button>
          </>
        }
      >
        <div className="space-y-3">
          <Select
            label={t("record.ticket")}
            value={ticketId}
            onChange={(e) => {
              const id = e.target.value;
              setTicketId(id);
              const tk = tickets.find((x) => x.id === id);
              setAmount(tk ? tk.totalPrice - tk.paidAmount : 0);
            }}
          >
            <option value="">{t("record.selectTicket")}</option>
            {payable.map((x) => (
              <option key={x.id} value={x.id}>
                {x.ticketNumber} · {custName(x.customerId)}
              </option>
            ))}
          </Select>
          {selected && (
            <div className="rounded-xl bg-sky-50 p-3 flex items-center justify-between">
              <span className="text-sm text-ink-600">{t("record.remaining")}</span>
              <span className="tabnum font-700 text-ink-900">{baht(remaining)}</span>
            </div>
          )}
          <Input type="number" min={0} max={remaining} label={t("record.amount")} value={amount} onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))} />
          <Select label={t("record.method")} value={method} onChange={(e) => setMethod(e.target.value as PaymentMethod)}>
            {METHODS.map((m) => <option key={m} value={m}>{tc(`method.${m}`)}</option>)}
          </Select>
          <Input label={t("record.ref")} value={ref} onChange={(e) => setRef(e.target.value)} />
          <FileUpload label={t("record.slip")} multiple={false} buttonLabel={t("record.slipBtn")} accept="image/*,application/pdf" />
          <p className="text-xs text-ink-400">{t("record.creditNote")}</p>
        </div>
      </Modal>
    </>
  );
}
