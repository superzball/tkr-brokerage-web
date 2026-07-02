"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useBaht } from "@/lib/format";
import { Tabs } from "@/components/app/Tabs";
import { Input, Select, DatePicker } from "@/components/app/form";
import { useToast } from "@/components/app/toast";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { AutoCompare } from "@/components/auto/AutoCompare";

type Line = "auto" | "travel" | "pa" | "fire";
type Coverage = "basic" | "standard" | "premium";

const BASE: Record<Exclude<Line, "auto">, number> = {
  travel: 1850,
  pa: 22000,
  fire: 8500,
};
const MULT: Record<Coverage, number> = { basic: 0.8, standard: 1, premium: 1.4 };

export function PersonalLinesBuy({
  onSale,
}: {
  /** Fires when the buyer proceeds (used by the agent on-behalf flow). */
  onSale?: (line: Line, premium: number) => void;
} = {}) {
  const t = useTranslations("individual");
  const [line, setLine] = useState<Line>("auto");

  return (
    <div className="space-y-5">
      <Tabs<Line>
        tabs={(["auto", "travel", "pa", "fire"] as Line[]).map((k) => ({
          key: k,
          label: t(`buy.tabs.${k}`),
        }))}
        value={line}
        onChange={setLine}
      />

      {line === "auto" ? (
        <div className="-mx-4 sm:-mx-6 lg:-mx-8">
          <AutoCompare onChoose={onSale ? (price) => onSale("auto", price) : undefined} />
        </div>
      ) : (
        <GenericQuote line={line} onSale={onSale} />
      )}
    </div>
  );
}

function GenericQuote({
  line,
  onSale,
}: {
  line: Exclude<Line, "auto">;
  onSale?: (line: Line, premium: number) => void;
}) {
  const t = useTranslations("individual");
  const baht = useBaht();
  const { toast } = useToast();
  const [coverage, setCoverage] = useState<Coverage>("standard");
  const [quote, setQuote] = useState<number | null>(null);

  const premium = Math.round(BASE[line] * MULT[coverage]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px] items-start">
      <section className="card p-6">
        <h2 className="font-700 text-ink-900 mb-5">
          {t("buy.quote.heading", { type: t(`buy.tabs.${line}`) })}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {line === "travel" && (
            <>
              <Input label={t("buy.quote.destination")} />
              <Input type="number" label={t("buy.quote.days")} defaultValue={7} />
            </>
          )}
          {line === "pa" && (
            <Input type="number" label={t("buy.quote.age")} defaultValue={30} />
          )}
          {line === "fire" && (
            <>
              <Select label={t("buy.quote.propertyType")}>
                <option>{t("buy.quote.propertyHouse")}</option>
                <option>{t("buy.quote.propertyCondo")}</option>
                <option>{t("buy.quote.propertyShop")}</option>
              </Select>
              <Input
                type="number"
                label={t("buy.quote.sumInsured")}
                defaultValue={3000000}
              />
            </>
          )}
          <Select
            label={t("buy.quote.coverage")}
            value={coverage}
            onChange={(e) => {
              setCoverage(e.target.value as Coverage);
              setQuote(null);
            }}
          >
            <option value="basic">{t("buy.quote.coverageBasic")}</option>
            <option value="standard">{t("buy.quote.coverageStandard")}</option>
            <option value="premium">{t("buy.quote.coveragePremium")}</option>
          </Select>
          <DatePicker label={t("buy.quote.startDate")} />
        </div>
        <div className="mt-5">
          <Button variant="primary" size="md" onClick={() => setQuote(premium)}>
            <Icon name="search" /> {t("buy.quote.getQuote")}
          </Button>
        </div>
      </section>

      <aside className="card p-6 lg:sticky lg:top-[84px]">
        {quote == null ? (
          <p className="text-sm text-ink-400 text-center py-6">
            {t("buy.quote.note")}
          </p>
        ) : (
          <>
            <p className="text-sm text-ink-500">{t("buy.quote.resultTitle")}</p>
            <p className="mt-1 font-display font-700 text-3xl text-brand-700 tabnum">
              {baht(quote)}
              <span className="text-base font-500 text-ink-400">
                {" "}
                {t("buy.quote.perYear")}
              </span>
            </p>
            <Button
              variant="primary"
              size="md"
              className="w-full mt-5"
              onClick={() => {
                if (onSale && quote != null) onSale(line, quote);
                else toast(t("buy.quote.proceeded"), "success");
              }}
            >
              {t("buy.quote.proceed")} <Icon name="arrowRight" />
            </Button>
            <p className="mt-4 text-xs text-ink-400 flex items-start gap-2">
              <Icon name="info" size={14} /> {t("buy.quote.note")}
            </p>
          </>
        )}
      </aside>
    </div>
  );
}
