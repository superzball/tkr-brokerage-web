// src/components/conversion/CompareTable.tsx
// Reusable multi-insurer comparison — generalizes the auto comparison so any
// personal line can show side-by-side plans, sorted by price/coverage/rating,
// with partner-insurer logos. Pass plans from comparePlansFor(product, base).

"use client";

import { useMemo, useState } from "react";
import { useTranslations, useFormatter } from "next-intl";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { AppLink } from "@/components/ui/AppLink";
import { FieldLabel, SelectField } from "@/components/ui/Field";
import { useBaht } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { ComparePlan } from "@/config/conversion";

type Sort = "price" | "coverage" | "rating";

function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <span className="flex">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < full ? "text-gold-400" : "text-ink-200"}>
          <Icon name="star" size={13} />
        </span>
      ))}
    </span>
  );
}

export function CompareTable({
  plans,
  onChoose,
  chooseHref,
}: {
  plans: ComparePlan[];
  /** When set (e.g. agent on-behalf), choosing records the price. */
  onChoose?: (price: number) => void;
  /** Public pages: choosing routes here (the privacy-first quote / signup). */
  chooseHref?: string;
}) {
  const t = useTranslations("conversion.compare");
  const baht = useBaht();
  const format = useFormatter();
  const [sort, setSort] = useState<Sort>("price");

  const list = useMemo(() => {
    const s = [...plans];
    if (sort === "price") s.sort((a, b) => a.price - b.price);
    if (sort === "coverage") s.sort((a, b) => b.sum - a.sum);
    if (sort === "rating") s.sort((a, b) => b.rating - a.rating);
    return s;
  }, [plans, sort]);

  return (
    <div className="grid lg:grid-cols-[220px_1fr] gap-7 items-start">
      <aside className="card p-5 lg:sticky lg:top-[84px]">
        <h3 className="font-600 text-ink-900 flex items-center gap-2 mb-4">
          <span className="text-brand-600"><Icon name="filter" /></span>
          {t("title")}
        </h3>
        <FieldLabel>{t("sortBy")}</FieldLabel>
        <SelectField value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
          <option value="price">{t("price")}</option>
          <option value="coverage">{t("coverage")}</option>
          <option value="rating">{t("rating")}</option>
        </SelectField>
      </aside>

      <div>
        <p className="text-sm text-ink-600 mb-4">
          {t("results", { count: list.length })}
        </p>
        {list.length === 0 ? (
          <p className="text-sm text-ink-400">{t("empty")}</p>
        ) : (
          <div className="space-y-4">
            {list.map((p) => (
              <div
                key={p.id}
                className={cn("card card-hover p-5 sm:p-6 relative", p.best && "ring-2 ring-brand-400")}
              >
                {p.best && (
                  <Chip className="bg-brand-500 text-white absolute -top-3 left-6 text-xs">
                    {t("best")}
                  </Chip>
                )}
                {p.value && !p.best && (
                  <Chip className="bg-emerald-500 text-white absolute -top-3 left-6 text-xs">
                    {t("value")}
                  </Chip>
                )}
                <div className="grid lg:grid-cols-[1.4fr_1.3fr_auto] gap-5 items-center">
                  <div className="flex items-center gap-3.5">
                    <span className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-100 to-sky-200 text-brand-700 inline-flex items-center justify-center font-display font-700 text-xl shrink-0">
                      {p.insurer.charAt(0)}
                    </span>
                    <div>
                      <p className="font-600 text-ink-900">{p.insurer}</p>
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-ink-500">
                        <Stars rating={p.rating} />
                        <span className="font-600 text-ink-700">{p.rating}</span>
                        <span>({format.number(p.reviews)})</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-ink-400 text-xs">{t("sum")}</p>
                      <p className="font-600 text-ink-900 tabnum">{baht(p.sum)}</p>
                    </div>
                    <div>
                      <p className="text-ink-400 text-xs">{t("deductible")}</p>
                      <p className="font-600 text-ink-900">
                        {p.deduct === null ? (
                          <span className="text-emerald-600">{t("noDeduct")}</span>
                        ) : (
                          baht(p.deduct)
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-right lg:border-l lg:border-ink-100 lg:pl-6">
                    <p className="text-xs text-ink-400">{t("perYear")}</p>
                    <p className="font-display font-700 text-3xl text-brand-700 tabnum">
                      {baht(p.price)}
                    </p>
                    {chooseHref && !onChoose ? (
                      <AppLink href={chooseHref} className="btn btn-primary btn-md mt-3 w-full lg:w-auto">
                        {t("choose")}
                      </AppLink>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onChoose?.(p.price)}
                        className="btn btn-primary btn-md mt-3 w-full lg:w-auto"
                      >
                        {t("choose")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
