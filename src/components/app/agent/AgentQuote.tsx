"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Select } from "@/components/app/form";
import { Tabs } from "@/components/app/Tabs";
import { useToast } from "@/components/app/toast";
import { Icon } from "@/components/ui/Icon";
import { WorkerFlow } from "@/components/worker/WorkerFlow";
import { PersonalLinesBuy } from "@/components/app/individual/PersonalLinesBuy";
import { addLocalSale } from "@/lib/mock/local-sales";
import type { InsuranceType } from "@/types/portal";

type Line = "worker" | "personal";

export function AgentQuote({
  clients,
  initialClientId,
}: {
  clients: { id: string; name: string }[];
  initialClientId?: string;
}) {
  const t = useTranslations("agent");
  const { toast } = useToast();
  const [clientId, setClientId] = useState(initialClientId ?? "");
  const [line, setLine] = useState<Line>("worker");
  const idRef = useRef(0);

  const client = clients.find((c) => c.id === clientId);

  function recordSale(product: InsuranceType, premium: number) {
    addLocalSale({
      id: `sale-${idRef.current++}-${premium}`,
      date: new Date().toISOString().slice(0, 10),
      clientName: client?.name ?? "—",
      product,
      premium,
      commission: Math.round(premium * (product === "worker" ? 0.12 : 0.1)),
      status: "issued",
    });
    toast(t("quote.recorded"), "success");
  }

  return (
    <div className="space-y-5">
      <div className="card p-6 max-w-md">
        <Select
          label={t("quote.selectClient")}
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
        >
          <option value="">{t("quote.selectClientPlaceholder")}</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>

      {client && (
        <div className="flex items-center gap-2.5 rounded-xl bg-sky-100 p-3.5 text-sm text-brand-700">
          <Icon name="user" size={18} />
          {t("quote.forClient", { name: client.name })}
        </div>
      )}

      <Tabs<Line>
        tabs={[
          { key: "worker", label: t("quote.lineWorker") },
          { key: "personal", label: t("quote.linePersonal") },
        ]}
        value={line}
        onChange={setLine}
      />

      {line === "worker" ? (
        <div className="-mx-4 sm:-mx-6 lg:-mx-8">
          <WorkerFlow
            authed
            onComplete={({ total }) => recordSale("worker", total)}
          />
        </div>
      ) : (
        <PersonalLinesBuy
          onSale={(l, premium) => recordSale(l as InsuranceType, premium)}
        />
      )}
    </div>
  );
}
