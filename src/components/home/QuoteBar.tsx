"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { FieldLabel, TextField, SelectField } from "@/components/ui/Field";
import { QUOTE_TABS } from "@/config/insurance";
import type { QuoteFieldConfig, QuoteTabConfig } from "@/types";
import { cn } from "@/lib/cn";
import { TrustBadge } from "@/components/conversion/TrustBadge";

export function QuoteBar() {
  const t = useTranslations("home.quote");
  const [activeId, setActiveId] = useState(QUOTE_TABS[0]!.id);
  const active = QUOTE_TABS.find((tab) => tab.id === activeId) as QuoteTabConfig;

  return (
    <div className="card card-lg p-2.5 sm:p-3">
      {/* tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-2.5 sm:mb-3">
        {QUOTE_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveId(tab.id)}
            className={cn("ins-tab", tab.id === activeId && "is-active")}
          >
            {t(`tabs.${tab.id}`)}
          </button>
        ))}
      </div>

      {/* fields + submit */}
      <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-2.5 sm:gap-3 items-end">
        {active.fields.map((field) => (
          <QuoteField key={field.key} field={field} />
        ))}
        <Button
          href={active.href}
          variant="primary"
          size="md"
          className="h-[46px] px-6 w-full sm:w-auto"
        >
          {t(`cta.${active.id}`)}
        </Button>
      </div>

      {/* Privacy-first: see a price without entering any personal data. */}
      <div className="mt-2.5 px-1">
        <TrustBadge />
      </div>
    </div>
  );
}

function QuoteField({ field }: { field: QuoteFieldConfig }) {
  const t = useTranslations("home.quote");
  const label = t(`fields.${field.key}.label`);

  if (field.type === "select") {
    // Only select fields carry `.options`; the cast narrows to those valid keys.
    type OptionsKey =
      `fields.${"workerNat" | "autoYear" | "paBudget" | "fireProp"}.options`;
    const options = t.raw(
      `fields.${field.key}.options` as OptionsKey,
    ) as string[];
    return (
      <div>
        <FieldLabel>{label}</FieldLabel>
        <SelectField>
          {options.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </SelectField>
      </div>
    );
  }

  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <TextField type={field.type} placeholder={t(`fields.${field.key}.placeholder`)} />
    </div>
  );
}
