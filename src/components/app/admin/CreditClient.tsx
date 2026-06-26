// src/components/app/admin/CreditClient.tsx
// Credit Wallet dashboard — INTERNAL ONLY (admin/finance). Never rendered in any
// customer portal. Shows the low/negative/outstanding cards, a per-customer
// append-only ledger with running balanceAfter, a reconciliation check (Σcredits
// − Σdebits must equal the last running balance), and a manual add-transaction.

"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icon";
import type {
  CreditTransaction,
  CustomerCreditProfile,
  CreditType,
} from "@/types/portal";
import { StatCard } from "@/components/app/StatCard";
import { DataTable, type Column } from "@/components/app/DataTable";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Modal } from "@/components/app/Modal";
import { Input, Select } from "@/components/app/form";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/app/toast";
import { useBaht } from "@/lib/format";
import { mergeLedger, addLedgerTx, mockId } from "@/lib/mock/local-crm";

const todayIso = () => new Date().toISOString().slice(0, 10);

export function CreditClient({
  seedLedger,
  profiles,
  customers,
}: {
  seedLedger: CreditTransaction[];
  profiles: CustomerCreditProfile[];
  customers: { id: string; name: string }[];
}) {
  const t = useTranslations("admin.credit");
  const tcommon = useTranslations("business.common");
  const { toast } = useToast();
  const baht = useBaht();

  const [ledger, setLedger] = useState<CreditTransaction[]>(seedLedger);
  useEffect(() => setLedger(mergeLedger(seedLedger)), [seedLedger]);

  const [open, setOpen] = useState(false);
  const [customerId, setCustomerId] = useState(customers[0]?.id ?? "");
  const [type, setType] = useState<CreditType>("credit");
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");

  function profileOf(id: string) {
    return profiles.find((p) => p.customerId === id);
  }
  const rowsFor = (id: string) => ledger.filter((c) => c.customerId === id);
  const balanceOf = (id: string) => {
    const r = rowsFor(id);
    const last = r[r.length - 1];
    return last ? last.balanceAfter : 0;
  };
  // reconciliation: Σcredits − Σdebits should equal the last running balance
  const reconciled = (id: string) => {
    const r = rowsFor(id);
    const net = r.reduce((s, c) => s + (c.type === "credit" ? c.amount : -c.amount), 0);
    return net === balanceOf(id);
  };

  // dashboard cards computed live from the merged ledger balances
  const cards = useMemo(() => {
    const balances = customers.map((c) => balanceOf(c.id));
    return {
      lowCredit: balances.filter((b) => b > -1000 && b < 0).length,
      negativeCredit: balances.filter((b) => b < 0).length,
      totalOutstanding: balances.reduce((s, b) => s + Math.min(0, b), 0),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ledger, customers]);

  function add() {
    if (!customerId || amount <= 0) {
      toast(t("add.invalid"), "error");
      return;
    }
    const prev = balanceOf(customerId);
    addLedgerTx({
      id: mockId("ct"),
      customerId,
      type,
      amount,
      balanceAfter: type === "credit" ? prev + amount : prev - amount,
      description: description || t("add.manual"),
      createdAt: todayIso(),
    });
    setLedger(mergeLedger(seedLedger));
    setOpen(false);
    setAmount(0);
    setDescription("");
    toast(t("add.added"), "success");
  }

  const columns: Column<CreditTransaction>[] = [
    { key: "createdAt", header: t("col.date"), mono: true, sortValue: (c) => c.createdAt },
    { key: "description", header: t("col.description") },
    { key: "debit", header: t("col.debit"), align: "right", render: (c) => (c.type === "debit" ? <span className="tabnum text-rose-600">−{baht(c.amount)}</span> : <span className="text-ink-300">—</span>) },
    { key: "credit", header: t("col.credit"), align: "right", render: (c) => (c.type === "credit" ? <span className="tabnum text-mint-600">+{baht(c.amount)}</span> : <span className="text-ink-300">—</span>) },
    { key: "balance", header: t("col.balance"), align: "right", render: (c) => <span className={`tabnum font-600 ${c.balanceAfter < 0 ? "text-rose-600" : "text-ink-900"}`}>{baht(c.balanceAfter)}</span> },
  ];

  return (
    <>
      <div className="mb-4 rounded-xl border border-gold-200 bg-gold-50 px-4 py-2.5 flex items-center gap-2 text-sm text-gold-700">
        <Icon name="lock" size={16} /> {t("internalOnly")}
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <StatCard icon="alert" label={t("card.lowCredit")} value={cards.lowCredit} />
        <StatCard icon="alertTri" label={t("card.negativeCredit")} value={cards.negativeCredit} />
        <StatCard icon="coins" label={t("card.totalOutstanding")} value={baht(cards.totalOutstanding)} />
      </div>

      <div className="flex justify-end mb-4">
        <Button variant="primary" size="sm" onClick={() => setOpen(true)}>{t("addCta")}</Button>
      </div>

      <div className="space-y-6">
        {customers.map((c) => {
          const prof = profileOf(c.id);
          const bal = balanceOf(c.id);
          const ok = reconciled(c.id);
          return (
            <section key={c.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <h2 className="font-700 text-ink-900">{c.name}</h2>
                  <p className="text-xs text-ink-400 mt-0.5">
                    {t("creditLimit")}: {prof?.creditLimit ? baht(prof.creditLimit) : "—"} · {t("allowedOverdue")}: {prof?.allowedOverdueDays ?? "—"} {t("days")}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`tabnum text-xl font-700 ${bal < 0 ? "text-rose-600" : "text-ink-900"}`}>{baht(bal)}</div>
                  <StatusBadge tone={ok ? "success" : "danger"} className="mt-1 text-xs">
                    {ok ? t("reconciled") : t("mismatch")}
                  </StatusBadge>
                </div>
              </div>
              <DataTable
                columns={columns}
                rows={rowsFor(c.id)}
                pageSize={10}
                getRowKey={(r) => r.id}
                labels={{
                  empty: t("empty"),
                  prev: tcommon("prev"),
                  next: tcommon("next"),
                  range: (from, to, total) => tcommon("range", { from, to, total }),
                }}
              />
            </section>
          );
        })}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={t("add.title")}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>{tcommon("cancel")}</Button>
            <Button variant="primary" size="sm" onClick={add}>{t("add.submit")}</Button>
          </>
        }
      >
        <div className="space-y-3">
          <Select label={t("add.customer")} value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
            {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
          <Select label={t("add.type")} value={type} onChange={(e) => setType(e.target.value as CreditType)}>
            <option value="credit">{t("add.typeCredit")}</option>
            <option value="debit">{t("add.typeDebit")}</option>
          </Select>
          <Input type="number" min={0} label={t("add.amount")} value={amount} onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))} />
          <Input label={t("add.description")} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
      </Modal>
    </>
  );
}
