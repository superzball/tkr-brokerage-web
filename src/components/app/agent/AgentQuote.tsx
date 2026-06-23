"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Select } from "@/components/app/form";
import { Icon } from "@/components/ui/Icon";
import { PersonalLinesBuy } from "@/components/app/individual/PersonalLinesBuy";

export function AgentQuote({ clients }: { clients: { id: string; name: string }[] }) {
  const t = useTranslations("agent");
  const [clientId, setClientId] = useState("");
  const client = clients.find((c) => c.id === clientId);

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

      <PersonalLinesBuy />
    </div>
  );
}
