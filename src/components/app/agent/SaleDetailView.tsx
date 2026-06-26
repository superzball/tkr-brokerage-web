"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useBaht } from "@/lib/format";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import { Modal } from "@/components/app/Modal";
import { StatusBadge, type BadgeTone } from "@/components/app/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useToast } from "@/components/app/toast";
import { cn } from "@/lib/cn";
import { IOSFrame } from "@/components/device/IOSFrame";
import { WalletApp } from "@/components/wallet/WalletApp";
import {
  readLocalSales,
  readCancelledSaleIds,
  cancelLocalSale,
} from "@/lib/mock/local-sales";
import {
  salePolicyNo,
  salePeriod,
  saleWorkers,
  saleWorkerCount,
  saleVehicle,
  saleTravel,
  saleHealth,
  saleFire,
} from "@/lib/mock/sale-detail";
import type { AgentSale, SaleStatus } from "@/types/portal";

const STATUS_TONE: Record<SaleStatus, BadgeTone> = {
  issued: "success", pending: "warning", cancelled: "danger",
};

function downloadText(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-ink-500">{label}</dt>
      <dd className="font-600 text-ink-900 text-right">{value}</dd>
    </div>
  );
}

export function SaleDetailView({
  id,
  seedSale,
}: {
  id: string;
  seedSale: AgentSale | null;
}) {
  const t = useTranslations("agent");
  const tc = useTranslations("business");
  const baht = useBaht();
  const { toast } = useToast();
  const [sale, setSale] = useState<AgentSale | null>(seedSale);
  const [resolved, setResolved] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);

  useEffect(() => {
    const cancelled = new Set(readCancelledSaleIds());
    let s = seedSale ?? readLocalSales().find((x) => x.id === id) ?? null;
    if (s && cancelled.has(s.id)) s = { ...s, status: "cancelled" };
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSale(s);
    setResolved(true);
  }, [id, seedSale]);

  if (!sale) {
    if (!resolved) return null; // resolving from localStorage on mount
    return (
      <>
        <PageHeader title={t("sales.title")} />
        <EmptyState
          icon="alertTri"
          title={t("sales.detail.notFound")}
          action={
            <Button href="/app/sales" variant="ghost" size="md">
              {t("sales.detail.back")}
            </Button>
          }
        />
      </>
    );
  }

  const policyNo = salePolicyNo(sale);
  const period = salePeriod(sale);
  const manageable = sale.status === "issued";

  function dl(kind: "policy" | "receipt") {
    if (!sale) return;
    const lines = [
      `TKR Insurance — ${kind === "policy" ? "POLICY" : "RECEIPT"}`,
      `Policy No: ${policyNo}`,
      `Client: ${sale.clientName}`,
      `Product: ${sale.product}`,
      `Premium: THB ${sale.premium.toLocaleString()}`,
      `Period: ${period.start} → ${period.end}`,
      `Status: ${sale.status}`,
    ];
    downloadText(`${policyNo}-${kind}.txt`, lines.join("\n"));
    toast(t("sales.detail.downloaded"), "success");
  }

  type Step = { key: "issued" | "active" | "renewal" | "cancelled"; state: "done" | "current" | "future" | "danger"; meta?: string };
  const steps: Step[] =
    sale.status === "cancelled"
      ? [{ key: "issued", state: "done", meta: sale.date }, { key: "cancelled", state: "danger" }]
      : sale.status === "pending"
        ? [{ key: "issued", state: "current" }]
        : [
            { key: "issued", state: "done", meta: sale.date },
            { key: "active", state: "current" },
            { key: "renewal", state: "future", meta: period.end },
          ];

  return (
    <>
      <Link
        href="/app/sales"
        className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-brand-600 mb-4"
      >
        <Icon name="chevR" size={16} className="rotate-180" />
        {t("sales.detail.back")}
      </Link>

      <PageHeader
        title={policyNo}
        description={tc(`type.${sale.product}`)}
        actions={<StatusBadge tone={STATUS_TONE[sale.status]}>{t(`sales.status.${sale.status}`)}</StatusBadge>}
      />

      {/* action toolbar */}
      <div className="flex flex-wrap gap-2.5 mb-6">
        <Button variant="primary" size="md" onClick={() => dl("policy")}>
          <Icon name="download" size={16} /> {t("sales.detail.downloadPolicy")}
        </Button>
        <Button variant="ghost" size="md" onClick={() => dl("receipt")}>
          <Icon name="download" size={16} /> {t("sales.detail.downloadReceipt")}
        </Button>
        {sale.product === "worker" && (
          <Button variant="ghost" size="md" onClick={() => setWalletOpen(true)}>
            <Icon name="wallet" size={16} /> {t("sales.detail.viewWallet")}
          </Button>
        )}
        {manageable && (
          <>
            <Link href="/app/quote" className="btn btn-ghost btn-md">
              <Icon name="refresh" size={16} /> {t("sales.detail.renew")}
            </Link>
            <Button
              variant="ghost"
              size="md"
              className="text-rose-600"
              onClick={() => {
                cancelLocalSale(sale.id);
                setSale((s) => (s ? { ...s, status: "cancelled" } : s));
                toast(t("sales.detail.cancelled"), "success");
              }}
            >
              <Icon name="x" size={16} /> {t("sales.detail.cancel")}
            </Button>
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3 items-start">
        {/* left: facts + timeline */}
        <div className="space-y-6 lg:col-span-1">
          <section className="card p-6">
            <h2 className="font-700 text-ink-900 mb-4">{t("sales.detail.coverageTitle")}</h2>
            <dl className="space-y-3 text-sm">
              <Row label={t("sales.detail.client")} value={sale.clientName} />
              <Row label={t("sales.detail.product")} value={tc(`type.${sale.product}`)} />
              <Row label={t("sales.detail.period")} value={<span className="tabnum">{period.start} → {period.end}</span>} />
              <Row label={t("sales.detail.premium")} value={<span className="tabnum">{baht(sale.premium)}</span>} />
              <Row label={t("sales.detail.commission")} value={<span className="tabnum">{baht(sale.commission)}</span>} />
            </dl>
          </section>

          <section className="card p-6">
            <h2 className="font-700 text-ink-900 mb-4">{t("sales.detail.timeline.title")}</h2>
            <ol>
              {steps.map((s, i) => (
                <li key={s.key} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span
                      className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center text-white shrink-0",
                        s.state === "done" ? "bg-gradient-to-br from-mint-400 to-mint-600 shadow-[0_6px_14px_-6px_rgba(10,138,94,0.6)]"
                          : s.state === "current" ? "bg-gradient-to-br from-brand-500 to-brand-600 ring-4 ring-brand-100 shadow-[0_8px_18px_-8px_rgba(31,102,238,0.7)]"
                          : s.state === "danger" ? "bg-rose-500"
                          : "bg-white border-2 border-ink-100 text-ink-400",
                      )}
                    >
                      {s.state === "done" ? <Icon name="check" size={14} strokeWidth={2.6} />
                        : s.state === "danger" ? <Icon name="x" size={14} />
                        : <span className="text-xs font-700">{i + 1}</span>}
                    </span>
                    {i < steps.length - 1 && (
                      <span className={cn("w-0.5 flex-1 my-1 min-h-[14px]", s.state === "done" ? "bg-mint-400" : "bg-ink-100")} />
                    )}
                  </div>
                  <div className="pb-3">
                    <p className={cn("text-sm", s.state === "future" ? "text-ink-400 font-500" : "text-ink-900 font-600")}>
                      {t(`sales.detail.timeline.${s.key}`)}
                    </p>
                    {s.meta && <p className="text-xs text-ink-400 tabnum">{s.meta}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* right: product detail */}
        <div className="lg:col-span-2">
          {sale.product === "worker" && <WorkerSection sale={sale} />}
          {sale.product === "auto" && <AutoSection sale={sale} />}
          {sale.product === "travel" && <TravelSection sale={sale} />}
          {sale.product === "health" && <HealthSection sale={sale} />}
          {sale.product === "fire" && <FireSection sale={sale} />}
        </div>
      </div>

      {walletOpen && (
        <Modal open onClose={() => setWalletOpen(false)} title={t("sales.detail.walletTitle")} className="max-w-md">
          <div className="flex justify-center">
            <IOSFrame>
              <WalletApp />
            </IOSFrame>
          </div>
        </Modal>
      )}
    </>
  );
}

function WorkerSection({ sale }: { sale: AgentSale }) {
  const t = useTranslations("agent");
  const total = saleWorkerCount(sale);
  const workers = saleWorkers(sale, 500); // full roster — the page scrolls
  return (
    <section className="card p-6">
      <h2 className="font-700 text-ink-900 mb-4 flex items-center gap-2">
        {t("sales.detail.workersTitle")}
        <span className="chip bg-sky-100 text-brand-700 text-xs">
          {t("sales.detail.workersCount", { n: total })}
        </span>
      </h2>
      <div className="rounded-xl border border-ink-100 overflow-hidden">
        <div className="max-h-[600px] overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-sky-50/60 text-ink-600 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-left font-600 w-10">#</th>
                <th className="px-3 py-2 text-left font-600">{t("sales.detail.col.name")}</th>
                <th className="px-3 py-2 text-left font-600">{t("sales.detail.col.nationality")}</th>
                <th className="px-3 py-2 text-left font-600">{t("sales.detail.col.passport")}</th>
                <th className="px-3 py-2 text-left font-600">{t("sales.detail.col.job")}</th>
              </tr>
            </thead>
            <tbody>
              {workers.map((w, i) => (
                <tr key={i} className="border-t border-ink-50">
                  <td className="px-3 py-2 text-ink-400 tabnum">{i + 1}</td>
                  <td className="px-3 py-2 font-500 text-ink-900">{w.name}</td>
                  <td className="px-3 py-2">{w.nationality}</td>
                  <td className="px-3 py-2 tabnum">{w.passport}</td>
                  <td className="px-3 py-2">{w.job}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function AutoSection({ sale }: { sale: AgentSale }) {
  const t = useTranslations("agent");
  const baht = useBaht();
  const v = saleVehicle(sale);
  return (
    <section className="card p-6">
      <h2 className="font-700 text-ink-900 mb-4">{t("sales.detail.vehicle.title")}</h2>
      <dl className="space-y-3 text-sm max-w-md">
        <Row label={t("sales.detail.vehicle.brand")} value={v.brand} />
        <Row label={t("sales.detail.vehicle.model")} value={v.model} />
        <Row label={t("sales.detail.vehicle.year")} value={<span className="tabnum">{v.year}</span>} />
        <Row label={t("sales.detail.vehicle.plate")} value={<span className="tabnum">{v.plate}</span>} />
        <Row label={t("sales.detail.vehicle.repair")} value={t(`sales.detail.vehicle.${v.repair}` as "sales.detail.vehicle.garage")} />
        <Row label={t("sales.detail.vehicle.sum")} value={<span className="tabnum">{baht(v.sumInsured)}</span>} />
        <Row
          label={t("sales.detail.vehicle.deductible")}
          value={v.deductible === 0
            ? <span className="text-mint-600">{t("sales.detail.vehicle.noDeductible")}</span>
            : <span className="tabnum">{baht(v.deductible)}</span>}
        />
      </dl>
    </section>
  );
}

function TravelSection({ sale }: { sale: AgentSale }) {
  const t = useTranslations("agent");
  const baht = useBaht();
  const v = saleTravel(sale);
  return (
    <section className="card p-6">
      <h2 className="font-700 text-ink-900 mb-4">{t("sales.detail.travel.title")}</h2>
      <dl className="space-y-3 text-sm max-w-md">
        <Row label={t("sales.detail.travel.destination")} value={v.destination} />
        <Row label={t("sales.detail.travel.days")} value={<span className="tabnum">{v.days}</span>} />
        <Row label={t("sales.detail.travel.travellers")} value={<span className="tabnum">{v.travellers}</span>} />
        <Row label={t("sales.detail.travel.sum")} value={<span className="tabnum">{baht(v.sumInsured)}</span>} />
      </dl>
    </section>
  );
}

function HealthSection({ sale }: { sale: AgentSale }) {
  const t = useTranslations("agent");
  const baht = useBaht();
  const v = saleHealth(sale);
  return (
    <section className="card p-6">
      <h2 className="font-700 text-ink-900 mb-4">{t("sales.detail.health.title")}</h2>
      <dl className="space-y-3 text-sm max-w-md">
        <Row label={t("sales.detail.health.insured")} value={v.insured} />
        <Row label={t("sales.detail.health.age")} value={<span className="tabnum">{v.age}</span>} />
        <Row label={t("sales.detail.health.plan")} value={t(`sales.detail.health.${v.plan}` as "sales.detail.health.basic")} />
        <Row label={t("sales.detail.health.sum")} value={<span className="tabnum">{baht(v.sumInsured)}</span>} />
      </dl>
    </section>
  );
}

function FireSection({ sale }: { sale: AgentSale }) {
  const t = useTranslations("agent");
  const baht = useBaht();
  const v = saleFire(sale);
  return (
    <section className="card p-6">
      <h2 className="font-700 text-ink-900 mb-4">{t("sales.detail.fire.title")}</h2>
      <dl className="space-y-3 text-sm max-w-md">
        <Row label={t("sales.detail.fire.property")} value={t(`sales.detail.fire.${v.property}` as "sales.detail.fire.house")} />
        <Row label={t("sales.detail.fire.address")} value={v.address} />
        <Row label={t("sales.detail.fire.sum")} value={<span className="tabnum">{baht(v.sumInsured)}</span>} />
      </dl>
    </section>
  );
}
