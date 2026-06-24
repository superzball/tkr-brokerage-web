// src/components/app/admin/TicketDetailView.tsx
// Full-page Policy Ticket detail: application / pricing (live total) / payment /
// underwriter (Thip) / task blocks, a status-flow control, and a record-payment
// action that CREDITS the customer's internal wallet (append-only ledger) with
// an over-payment guard. The wallet balance lives on the finance screens — this
// page only writes the credit; it never exposes the running balance.

"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/Icon";
import type {
  PolicyTicket,
  CreditTransaction,
  TicketStatus,
  PaymentMethod,
} from "@/types/portal";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Modal } from "@/components/app/Modal";
import { EmptyState } from "@/components/app/EmptyState";
import { Input, Select, FileUpload } from "@/components/app/form";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/app/toast";
import { useBaht } from "@/lib/format";
import { basePrice, ticketTotal } from "@/lib/mock/seed";
import {
  readNewTickets,
  readPatches,
  customerBalance,
  patchTicket,
  addLedgerTx,
  addPayment,
  mockId,
} from "@/lib/mock/local-crm";
import { addAuditEntry } from "@/lib/mock/local-admin";
import { policyTicketTone, ticketPaymentTone, ticketPriorityTone } from "./badges";

const STATUS_FLOW: TicketStatus[] = [
  "draft",
  "pending_send",
  "sent_to_thip",
  "thip_processing",
  "completed",
  "rejected",
];
const METHODS: PaymentMethod[] = [
  "bank_transfer",
  "direct_transfer",
  "k_shop",
  "cash",
  "credit_card",
  "other",
];

const todayIso = () => new Date().toISOString().slice(0, 10);

export function TicketDetailView({
  id,
  seedTicket,
  seedLedger,
  customers,
}: {
  id: string;
  seedTicket: PolicyTicket | null;
  seedLedger: CreditTransaction[];
  customers: { id: string; name: string }[];
}) {
  const t = useTranslations("admin.ticketDetail");
  const tc = useTranslations("admin.crm");
  const ts = useTranslations("admin.status");
  const tcommon = useTranslations("business.common");
  const { toast } = useToast();
  const baht = useBaht();

  const [ticket, setTicket] = useState<PolicyTicket | null>(seedTicket);
  // resolve local patches / locally-created ticket after mount
  useEffect(() => {
    if (seedTicket) {
      const patch = readPatches()[seedTicket.id];
      setTicket(patch ? { ...seedTicket, ...patch } : seedTicket);
    } else {
      setTicket(readNewTickets().find((x) => x.id === id) ?? null);
    }
  }, [seedTicket, id]);

  const [payOpen, setPayOpen] = useState(false);
  const [amount, setAmount] = useState(0);
  const [method, setMethod] = useState<PaymentMethod>("bank_transfer");
  const [ref, setRef] = useState("");

  const remaining = ticket ? ticket.totalPrice - ticket.paidAmount : 0;
  const liveTotal = useMemo(
    () =>
      ticket
        ? ticketTotal(ticket.product, ticket.duration, ticket.discountPerPerson, ticket.headcount)
        : 0,
    [ticket],
  );

  if (!ticket) {
    return (
      <>
        <Link href="/admin/ops/tickets" className="inline-flex items-center gap-1 text-sm font-600 text-brand-600 hover:underline mb-4">
          <Icon name="chevR" size={16} className="rotate-180" /> {t("back")}
        </Link>
        <EmptyState title={t("notFound")} />
      </>
    );
  }

  function changeStatus(next: TicketStatus) {
    if (!ticket) return;
    patchTicket(ticket.id, { status: next });
    setTicket({ ...ticket, status: next });
    toast(t("statusUpdated"), "success");
  }

  function recordPayment() {
    if (!ticket) return;
    if (amount <= 0) {
      toast(t("pay.invalid"), "error");
      return;
    }
    // over-payment guard: paidAmount can never exceed totalPrice
    if (amount > remaining) {
      toast(t("pay.overpayGuard", { remaining: baht(remaining) }), "error");
      return;
    }
    const newPaid = ticket.paidAmount + amount;
    const paymentStatus = newPaid >= ticket.totalPrice ? "paid" : "partial";
    patchTicket(ticket.id, { paidAmount: newPaid, paymentStatus });

    // CREDIT the wallet back: append-only ledger entry, balanceAfter = prev + amount
    const prev = customerBalance(seedLedger, ticket.customerId);
    addLedgerTx({
      id: mockId("ct"),
      customerId: ticket.customerId,
      ticketId: ticket.id,
      type: "credit",
      amount,
      balanceAfter: prev + amount,
      description: `${tc("creditDesc")} #${ticket.ticketNumber}`,
      createdAt: todayIso(),
    });
    addPayment({
      id: mockId("cp"),
      paymentDate: todayIso(),
      customerId: ticket.customerId,
      ticketId: ticket.id,
      amount,
      method,
      referenceNumber: ref || undefined,
      status: "confirmed",
    });
    addAuditEntry({
      id: mockId("au"),
      actor: "คุณกานต์ ผู้ดูแลระบบ",
      action: t("auditPay", { amount: baht(amount) }),
      target: ticket.ticketNumber,
      time: new Date().toISOString(),
    });
    setTicket({ ...ticket, paidAmount: newPaid, paymentStatus });
    setPayOpen(false);
    setAmount(0);
    setRef("");
    toast(t("pay.credited", { amount: baht(amount) }), "success");
  }

  const net = Math.max(0, basePrice(ticket.product, ticket.duration) - ticket.discountPerPerson);
  const customerName = customers.find((c) => c.id === ticket.customerId)?.name ?? ticket.customerId;

  return (
    <>
      <Link href="/admin/ops/tickets" className="inline-flex items-center gap-1 text-sm font-600 text-brand-600 hover:underline mb-4">
        <Icon name="chevR" size={16} className="rotate-180" /> {t("back")}
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-700 text-ink-900 font-display tabnum">{ticket.ticketNumber}</h1>
          <p className="mt-1 text-sm text-ink-500">{customerName}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge tone={policyTicketTone[ticket.status]}>{ts(ticket.status)}</StatusBadge>
          <StatusBadge tone={ticketPaymentTone[ticket.paymentStatus]}>{ts(ticket.paymentStatus)}</StatusBadge>
          <StatusBadge tone={ticketPriorityTone[ticket.priority]}>{ts(ticket.priority)}</StatusBadge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* application */}
        <section className="card p-5">
          <h2 className="font-700 text-ink-900 mb-3">{t("application")}</h2>
          <dl className="text-sm space-y-2">
            <Row label={t("customer")} value={customerName} />
            <Row label={t("product")} value={tc(`product.${ticket.product}`)} />
            <Row label={t("duration")} value={tc(`duration.${ticket.duration}`)} />
            <Row label={t("coverageStart")} value={ticket.coverageStart} />
            <Row label={t("headcount")} value={String(ticket.headcount)} />
            <Row label={t("customerCode")} value={ticket.customerCode} mono />
            <Row label={t("publicToken")} value={ticket.publicToken} mono />
          </dl>
        </section>

        {/* pricing */}
        <section className="card p-5">
          <h2 className="font-700 text-ink-900 mb-3">{t("pricing")}</h2>
          <dl className="text-sm space-y-2">
            <Row label={t("basePrice")} value={baht(basePrice(ticket.product, ticket.duration))} />
            <Row label={t("discount")} value={baht(ticket.discountPerPerson)} />
            <Row label={t("perPerson")} value={baht(net)} />
            <Row label={t("headcount")} value={`× ${ticket.headcount}`} />
            <div className="flex justify-between pt-2 border-t border-ink-100">
              <span className="font-700 text-ink-900">{t("total")}</span>
              <span className="tabnum font-700 text-ink-900">{baht(liveTotal)}</span>
            </div>
          </dl>
        </section>

        {/* payment */}
        <section className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-700 text-ink-900">{t("payment")}</h2>
            <span className="text-[11px] font-600 text-gold-600 bg-gold-50 px-2 py-0.5 rounded-full">{t("internalBadge")}</span>
          </div>
          <dl className="text-sm space-y-2">
            <Row label={t("paymentStatus")} value={ts(ticket.paymentStatus)} />
            <Row label={t("paidAmount")} value={baht(ticket.paidAmount)} />
            <Row label={t("remaining")} value={baht(remaining)} />
          </dl>
          <Button
            variant="primary"
            size="sm"
            className="mt-4 w-full"
            disabled={remaining <= 0}
            onClick={() => { setAmount(remaining); setPayOpen(true); }}
          >
            {remaining <= 0 ? t("fullyPaid") : t("recordPayment")}
          </Button>
        </section>

        {/* underwriter (Thip) */}
        <section className="card p-5">
          <h2 className="font-700 text-ink-900 mb-3">{t("underwriter")}</h2>
          <dl className="text-sm space-y-2">
            <Row label={t("thipStaff")} value={ticket.thipStaffName || t("none")} />
            <Row label={t("thipNote")} value={ticket.thipNote || t("none")} />
            <Row label={t("thipFile")} value={ticket.thipFile || t("none")} />
          </dl>
        </section>

        {/* task */}
        <section className="card p-5 lg:col-span-2">
          <h2 className="font-700 text-ink-900 mb-3">{t("task")}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Select label={t("statusFlow")} value={ticket.status} onChange={(e) => changeStatus(e.target.value as TicketStatus)}>
                {STATUS_FLOW.map((s) => <option key={s} value={s}>{ts(s)}</option>)}
              </Select>
            </div>
            <Static label={t("priority")} value={ts(ticket.priority)} />
            <Static label={t("dueDate")} value={ticket.dueDate ?? "—"} />
            <Static label={t("createdAt")} value={`${ticket.createdAt} · ${ticket.createdBy}`} />
          </div>
        </section>
      </div>

      <Modal
        open={payOpen}
        onClose={() => setPayOpen(false)}
        title={t("pay.title")}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setPayOpen(false)}>{tcommon("cancel")}</Button>
            <Button variant="primary" size="sm" onClick={recordPayment}>{t("pay.submit")}</Button>
          </>
        }
      >
        <div className="space-y-3">
          <div className="rounded-xl bg-sky-50 p-3 flex items-center justify-between">
            <span className="text-sm text-ink-600">{t("remaining")}</span>
            <span className="tabnum font-700 text-ink-900">{baht(remaining)}</span>
          </div>
          <Input type="number" min={0} max={remaining} label={t("pay.amount")} value={amount} onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))} hint={t("pay.overpayHint", { remaining: baht(remaining) })} />
          <Select label={t("pay.method")} value={method} onChange={(e) => setMethod(e.target.value as PaymentMethod)}>
            {METHODS.map((m) => <option key={m} value={m}>{tc(`method.${m}`)}</option>)}
          </Select>
          <Input label={t("pay.ref")} value={ref} onChange={(e) => setRef(e.target.value)} />
          <FileUpload label={t("pay.slip")} multiple={false} buttonLabel={t("pay.slipBtn")} accept="image/*,application/pdf" />
          <p className="text-xs text-ink-400">{t("pay.creditNote")}</p>
        </div>
      </Modal>
    </>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-ink-500 shrink-0">{label}</span>
      <span className={mono ? "tabnum text-right" : "font-600 text-right"}>{value}</span>
    </div>
  );
}
function Static({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="field-label">{label}</div>
      <div className="text-sm font-600 text-ink-800 mt-1">{value}</div>
    </div>
  );
}
