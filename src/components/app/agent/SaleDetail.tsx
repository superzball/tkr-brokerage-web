"use client";

import { useTranslations } from "next-intl";
import { useBaht } from "@/lib/format";
import { Modal } from "@/components/app/Modal";
import { StatusBadge, type BadgeTone } from "@/components/app/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useToast } from "@/components/app/toast";
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

export function SaleDetail({ sale, onClose }: { sale: AgentSale | null; onClose: () => void }) {
  const t = useTranslations("agent");
  const tc = useTranslations("business");
  const baht = useBaht();
  const { toast } = useToast();

  if (!sale) return null;
  const policyNo = salePolicyNo(sale);
  const period = salePeriod(sale);

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

  return (
    <Modal
      open
      onClose={onClose}
      title={t("sales.detail.title")}
      className="max-w-2xl"
      footer={
        <>
          <Button variant="ghost" size="md" onClick={() => dl("receipt")}>
            <Icon name="download" size={16} /> {t("sales.detail.downloadReceipt")}
          </Button>
          <Button variant="primary" size="md" onClick={() => dl("policy")}>
            <Icon name="download" size={16} /> {t("sales.detail.downloadPolicy")}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* common header */}
        <dl className="space-y-3 text-sm">
          <Row label={t("sales.detail.policyNo")} value={<span className="tabnum">{policyNo}</span>} />
          <Row label={t("sales.detail.client")} value={sale.clientName} />
          <Row label={t("sales.detail.product")} value={tc(`type.${sale.product}`)} />
          <Row label={t("sales.detail.period")} value={<span className="tabnum">{period.start} → {period.end}</span>} />
          <Row label={t("sales.detail.premium")} value={<span className="tabnum">{baht(sale.premium)}</span>} />
          <Row label={t("sales.detail.commission")} value={<span className="tabnum">{baht(sale.commission)}</span>} />
          <div className="flex justify-between gap-4 items-center">
            <dt className="text-ink-500">{t("sales.detail.status")}</dt>
            <dd>
              <StatusBadge tone={STATUS_TONE[sale.status]}>{t(`sales.status.${sale.status}`)}</StatusBadge>
            </dd>
          </div>
        </dl>

        <div className="h-px bg-ink-100" />

        {/* product-specific */}
        {sale.product === "worker" && <WorkerSection sale={sale} />}
        {sale.product === "auto" && <AutoSection sale={sale} />}
        {sale.product === "travel" && <TravelSection sale={sale} />}
        {sale.product === "health" && <HealthSection sale={sale} />}
        {sale.product === "fire" && <FireSection sale={sale} />}
      </div>
    </Modal>
  );
}

function WorkerSection({ sale }: { sale: AgentSale }) {
  const t = useTranslations("agent");
  const total = saleWorkerCount(sale);
  const workers = saleWorkers(sale, 50);
  const hidden = total - workers.length;
  return (
    <div>
      <h3 className="font-700 text-ink-900 mb-3 flex items-center gap-2">
        {t("sales.detail.workersTitle")}
        <span className="chip bg-sky-100 text-brand-700 text-xs">
          {t("sales.detail.workersCount", { n: total })}
        </span>
      </h3>
      <div className="rounded-xl border border-ink-100 overflow-hidden">
        <div className="max-h-72 overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-sky-50/60 text-ink-600 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-left font-600">{t("sales.detail.col.name")}</th>
                <th className="px-3 py-2 text-left font-600">{t("sales.detail.col.nationality")}</th>
                <th className="px-3 py-2 text-left font-600">{t("sales.detail.col.passport")}</th>
                <th className="px-3 py-2 text-left font-600">{t("sales.detail.col.job")}</th>
              </tr>
            </thead>
            <tbody>
              {workers.map((w, i) => (
                <tr key={i} className="border-t border-ink-50">
                  <td className="px-3 py-2 font-500 text-ink-900">{w.name}</td>
                  <td className="px-3 py-2">{w.nationality}</td>
                  <td className="px-3 py-2 tabnum">{w.passport}</td>
                  <td className="px-3 py-2">{w.job}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {hidden > 0 && (
          <p className="px-3 py-2 text-xs text-ink-400 border-t border-ink-50 text-center">
            {t("sales.detail.moreN", { n: hidden })}
          </p>
        )}
      </div>
    </div>
  );
}

function AutoSection({ sale }: { sale: AgentSale }) {
  const t = useTranslations("agent");
  const baht = useBaht();
  const v = saleVehicle(sale);
  return (
    <div>
      <h3 className="font-700 text-ink-900 mb-3">{t("sales.detail.vehicle.title")}</h3>
      <dl className="space-y-3 text-sm">
        <Row label={t("sales.detail.vehicle.brand")} value={v.brand} />
        <Row label={t("sales.detail.vehicle.model")} value={v.model} />
        <Row label={t("sales.detail.vehicle.year")} value={<span className="tabnum">{v.year}</span>} />
        <Row label={t("sales.detail.vehicle.plate")} value={<span className="tabnum">{v.plate}</span>} />
        <Row label={t("sales.detail.vehicle.repair")} value={t(`sales.detail.vehicle.${v.repair}` as "sales.detail.vehicle.garage")} />
        <Row label={t("sales.detail.vehicle.sum")} value={<span className="tabnum">{baht(v.sumInsured)}</span>} />
        <Row
          label={t("sales.detail.vehicle.deductible")}
          value={v.deductible === 0
            ? <span className="text-emerald-600">{t("sales.detail.vehicle.noDeductible")}</span>
            : <span className="tabnum">{baht(v.deductible)}</span>}
        />
      </dl>
    </div>
  );
}

function TravelSection({ sale }: { sale: AgentSale }) {
  const t = useTranslations("agent");
  const baht = useBaht();
  const v = saleTravel(sale);
  return (
    <div>
      <h3 className="font-700 text-ink-900 mb-3">{t("sales.detail.travel.title")}</h3>
      <dl className="space-y-3 text-sm">
        <Row label={t("sales.detail.travel.destination")} value={v.destination} />
        <Row label={t("sales.detail.travel.days")} value={<span className="tabnum">{v.days}</span>} />
        <Row label={t("sales.detail.travel.travellers")} value={<span className="tabnum">{v.travellers}</span>} />
        <Row label={t("sales.detail.travel.sum")} value={<span className="tabnum">{baht(v.sumInsured)}</span>} />
      </dl>
    </div>
  );
}

function HealthSection({ sale }: { sale: AgentSale }) {
  const t = useTranslations("agent");
  const baht = useBaht();
  const v = saleHealth(sale);
  return (
    <div>
      <h3 className="font-700 text-ink-900 mb-3">{t("sales.detail.health.title")}</h3>
      <dl className="space-y-3 text-sm">
        <Row label={t("sales.detail.health.insured")} value={v.insured} />
        <Row label={t("sales.detail.health.age")} value={<span className="tabnum">{v.age}</span>} />
        <Row label={t("sales.detail.health.plan")} value={t(`sales.detail.health.${v.plan}` as "sales.detail.health.basic")} />
        <Row label={t("sales.detail.health.sum")} value={<span className="tabnum">{baht(v.sumInsured)}</span>} />
      </dl>
    </div>
  );
}

function FireSection({ sale }: { sale: AgentSale }) {
  const t = useTranslations("agent");
  const baht = useBaht();
  const v = saleFire(sale);
  return (
    <div>
      <h3 className="font-700 text-ink-900 mb-3">{t("sales.detail.fire.title")}</h3>
      <dl className="space-y-3 text-sm">
        <Row label={t("sales.detail.fire.property")} value={t(`sales.detail.fire.${v.property}` as "sales.detail.fire.house")} />
        <Row label={t("sales.detail.fire.address")} value={v.address} />
        <Row label={t("sales.detail.fire.sum")} value={<span className="tabnum">{baht(v.sumInsured)}</span>} />
      </dl>
    </div>
  );
}
