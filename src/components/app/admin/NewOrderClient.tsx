// src/components/app/admin/NewOrderClient.tsx
// On-behalf assisted sale (Phase 14 centrepiece): staff helps a customer buy by
// phone / walk-in / LINE, then issues an order. Issuing writes BOTH an Order and
// an AuditEntry to the mock local store (swap-ready for a real orders table +
// audit service); the Orders and Audit Log screens pick them up immediately.

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type {
  AuditEntry,
  InsuranceType,
  Order,
  OrderChannel,
  ProductPlan,
} from "@/types/portal";
import { useSession } from "@/lib/auth/SessionProvider";
import { useToast } from "@/components/app/toast";
import { Stepper } from "@/components/app/Stepper";
import { Input, Select } from "@/components/app/form";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Icon } from "@/components/ui/Icon";
import { useBaht } from "@/lib/format";
import { addLocalOrder, addAuditEntry } from "@/lib/mock/local-admin";

const CHANNELS: OrderChannel[] = ["phone", "walk_in", "line", "online"];

export function NewOrderClient({
  plans,
  customers,
}: {
  plans: ProductPlan[];
  customers: string[];
}) {
  const t = useTranslations("admin.newOrder");
  const tc = useTranslations("admin.channel");
  const ty = useTranslations("business.type");
  const user = useSession();
  const { toast } = useToast();
  const baht = useBaht();

  const steps = [t("step.customer"), t("step.product"), t("step.review"), t("step.done")];
  const [step, setStep] = useState(0);

  const [customerType, setCustomerType] = useState<"business" | "individual">("business");
  const [customerName, setCustomerName] = useState("");
  const [channel, setChannel] = useState<OrderChannel>("phone");
  const [planId, setPlanId] = useState("");
  const [premium, setPremium] = useState<number>(0);
  const [issued, setIssued] = useState<{ order: Order; audit: AuditEntry } | null>(null);

  const plan = plans.find((p) => p.id === planId);
  const product: InsuranceType | undefined = plan?.product;

  function selectPlan(id: string) {
    setPlanId(id);
    const p = plans.find((x) => x.id === id);
    if (p) setPremium(p.basePremium);
  }

  const canCustomer = customerName.trim().length > 0;
  const canProduct = Boolean(plan) && premium > 0;

  function issue() {
    if (!plan || !product || !canCustomer) {
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
    setStep(3);
  }

  function reset() {
    setCustomerName("");
    setPlanId("");
    setPremium(0);
    setChannel("phone");
    setCustomerType("business");
    setIssued(null);
    setStep(0);
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Stepper steps={steps} current={step} />
      </div>

      {/* Step 1 — customer */}
      {step === 0 && (
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
            <Button variant="primary" size="md" onClick={() => setStep(1)} disabled={!canCustomer}>
              {t("next")}
            </Button>
          </div>
        </div>
      )}

      {/* Step 2 — product / plan */}
      {step === 1 && (
        <div className="card p-6 space-y-4">
          <Select
            label={t("planLabel")}
            value={planId}
            onChange={(e) => selectPlan(e.target.value)}
          >
            <option value="" disabled>
              —
            </option>
            {plans
              .filter((p) => p.active)
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {ty(p.product)} · {p.planName} · {p.insurer}
                </option>
              ))}
          </Select>

          <Input
            label={t("premiumLabel")}
            type="number"
            value={premium || ""}
            onChange={(e) => setPremium(Number(e.target.value))}
          />

          <div className="flex justify-between">
            <Button variant="ghost" size="md" onClick={() => setStep(0)}>
              {t("back")}
            </Button>
            <Button variant="primary" size="md" onClick={() => setStep(2)} disabled={!canProduct}>
              {t("next")}
            </Button>
          </div>
        </div>
      )}

      {/* Step 3 — review */}
      {step === 2 && plan && product && (
        <div className="card p-6">
          <h2 className="font-700 text-ink-900 mb-4">{t("reviewTitle")}</h2>
          <dl className="divide-y divide-ink-50 text-sm">
            <Row label={t("customerType")} value={customerType === "business" ? t("typeBusiness") : t("typeIndividual")} />
            <Row label={t("customerName")} value={customerName} />
            <Row label={t("channelLabel")} value={tc(channel)} />
            <Row label={t("productLabel")} value={`${ty(product)} · ${plan.planName}`} />
            <Row label={t("premiumLabel")} value={baht(premium)} />
          </dl>
          <div className="mt-5 flex justify-between">
            <Button variant="ghost" size="md" onClick={() => setStep(1)}>
              {t("back")}
            </Button>
            <Button variant="primary" size="md" onClick={issue}>
              {t("issue")}
            </Button>
          </div>
        </div>
      )}

      {/* Step 4 — done (order + audit entry written) */}
      {step === 3 && issued && (
        <div className="card p-6 text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
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
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <dt className="text-ink-500">{label}</dt>
      <dd className="font-600 text-ink-900">{value}</dd>
    </div>
  );
}
