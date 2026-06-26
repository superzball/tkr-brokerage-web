// src/components/app/admin/NewOrderClient.tsx
// On-behalf assisted sale (Phase 14 centrepiece): staff helps a customer buy by
// phone / walk-in / LINE, then issues an order. Mirrors the agent on-behalf flow
// (AgentQuote): capture the customer, then drive the SAME product flows —
// WorkerFlow (multi-worker entry / bulk upload) and PersonalLinesBuy. Completing
// the flow writes BOTH an Order and an AuditEntry to the mock local store
// (swap-ready for a real orders table + audit service); the Orders and Audit Log
// screens pick them up immediately.

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type {
  AuditEntry,
  InsuranceType,
  Order,
  OrderChannel,
} from "@/types/portal";
import { useSession } from "@/lib/auth/SessionProvider";
import { useToast } from "@/components/app/toast";
import { Tabs } from "@/components/app/Tabs";
import { Input, Select } from "@/components/app/form";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Icon } from "@/components/ui/Icon";
import { WorkerFlow } from "@/components/worker/WorkerFlow";
import { PersonalLinesBuy } from "@/components/app/individual/PersonalLinesBuy";
import { addLocalOrder, addAuditEntry } from "@/lib/mock/local-admin";

const CHANNELS: OrderChannel[] = ["phone", "walk_in", "line", "online"];

type Line = "worker" | "personal";

export function NewOrderClient({ customers }: { customers: string[] }) {
  const t = useTranslations("admin.newOrder");
  const tc = useTranslations("admin.channel");
  const user = useSession();
  const { toast } = useToast();

  const [customerType, setCustomerType] = useState<"business" | "individual">("business");
  const [customerName, setCustomerName] = useState("");
  const [channel, setChannel] = useState<OrderChannel>("phone");
  const [confirmed, setConfirmed] = useState(false);
  const [line, setLine] = useState<Line>("worker");
  const [issued, setIssued] = useState<{ order: Order; audit: AuditEntry } | null>(null);

  const canCustomer = customerName.trim().length > 0;

  // Worker insurance is a business line; personal lines suit individuals. Default
  // the tab to match the customer type, but the staff can override either way.
  function confirmCustomer() {
    if (!canCustomer) {
      toast(t("missing"), "error");
      return;
    }
    setLine(customerType === "business" ? "worker" : "personal");
    setConfirmed(true);
  }

  // Called once the product flow completes — writes the Order + AuditEntry.
  function recordOrder(product: InsuranceType, premium: number) {
    if (!canCustomer) {
      toast(t("missing"), "error");
      return;
    }
    const now = new Date();
    const orderNo = `ORD-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const order: Order = {
      id: `lo_${now.getTime()}`,
      orderNo,
      customerName: customerName.trim(),
      customerType,
      product,
      premium,
      status: "issued",
      channel,
      createdBy: user.id,
      createdDate: now.toISOString().slice(0, 10),
    };
    const audit: AuditEntry = {
      id: `la_${now.getTime()}`,
      actor: user.name,
      action: t("auditAction"),
      target: orderNo,
      time: now.toISOString(),
    };
    addLocalOrder(order);
    addAuditEntry(audit);
    setIssued({ order, audit });
  }

  function reset() {
    setCustomerName("");
    setChannel("phone");
    setCustomerType("business");
    setConfirmed(false);
    setLine("worker");
    setIssued(null);
  }

  // ---- done: order + audit entry written ----
  if (issued) {
    return (
      <div className="max-w-2xl">
        <div className="card p-6 text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-mint-50 text-mint-600 flex items-center justify-center mb-4">
            <Icon name="checkCircle" size={28} />
          </div>
          <h2 className="text-lg font-700 text-ink-900">{t("successTitle")}</h2>
          <p className="mt-1.5 text-sm text-ink-500">
            {t("successBody", { orderNo: issued.order.orderNo })}
          </p>

          {/* the audit entry that was just written */}
          <div className="mt-5 text-left rounded-xl border border-ink-100 p-4">
            <div className="flex items-center gap-2 mb-2 text-xs font-700 uppercase tracking-wide text-ink-400">
              <Icon name="clock" size={14} /> {t("auditLogged")}
              <StatusBadge tone="success" className="ml-auto text-[11px]">
                {issued.audit.target}
              </StatusBadge>
            </div>
            <p className="text-sm text-ink-800">
              <span className="font-600">{issued.audit.actor}</span> · {issued.audit.action}
            </p>
          </div>

          <div className="mt-6 flex justify-center gap-3">
            <Button href="/admin/sales/orders" variant="primary" size="md">
              {t("viewOrders")}
            </Button>
            <Button variant="ghost" size="md" onClick={reset}>
              {t("another")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ---- step 1: capture the customer ----
  if (!confirmed) {
    return (
      <div className="max-w-2xl">
        <div className="card p-6 space-y-4">
          <Select
            label={t("customerType")}
            value={customerType}
            onChange={(e) => setCustomerType(e.target.value as "business" | "individual")}
          >
            <option value="business">{t("typeBusiness")}</option>
            <option value="individual">{t("typeIndividual")}</option>
          </Select>

          <Input
            label={t("customerName")}
            list="admin-customers"
            placeholder={t("customerPlaceholder")}
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
          <datalist id="admin-customers">
            {customers.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>

          <Select
            label={t("channelLabel")}
            value={channel}
            onChange={(e) => setChannel(e.target.value as OrderChannel)}
          >
            {CHANNELS.map((c) => (
              <option key={c} value={c}>
                {tc(c)}
              </option>
            ))}
          </Select>

          <div className="flex justify-end">
            <Button variant="primary" size="md" onClick={confirmCustomer} disabled={!canCustomer}>
              {t("next")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ---- step 2: pick the product line and run the buying flow on behalf ----
  return (
    <div className="space-y-5">
      {/* who we're selling to (editable) */}
      <div className="flex items-center justify-between gap-2.5 rounded-xl bg-sky-100 p-3.5 text-sm text-brand-700">
        <span className="flex items-center gap-2.5">
          <Icon name="user" size={18} />
          {t("forCustomer", { name: customerName })}
          <span className="text-brand-700/70">
            · {customerType === "business" ? t("typeBusiness") : t("typeIndividual")} · {tc(channel)}
          </span>
        </span>
        <button
          type="button"
          onClick={() => setConfirmed(false)}
          className="shrink-0 font-600 hover:underline"
        >
          {t("editCustomer")}
        </button>
      </div>

      <Tabs<Line>
        tabs={[
          { key: "worker", label: t("lineWorker") },
          { key: "personal", label: t("linePersonal") },
        ]}
        value={line}
        onChange={setLine}
      />

      {line === "worker" ? (
        <div className="-mx-4 sm:-mx-6 lg:-mx-8">
          <WorkerFlow authed onComplete={({ total }) => recordOrder("worker", total)} />
        </div>
      ) : (
        <PersonalLinesBuy onSale={(l, premium) => recordOrder(l as InsuranceType, premium)} />
      )}
    </div>
  );
}
