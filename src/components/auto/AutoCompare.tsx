"use client";

import { useMemo, useState } from "react";
import { useTranslations, useFormatter } from "next-intl";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { FieldLabel, SelectField } from "@/components/ui/Field";
import { useBaht } from "@/lib/format";
import { cn } from "@/lib/cn";
import { AUTO_PLANS } from "@/config/insurance";
import type { AutoPlan, AutoRepairType, AutoSort } from "@/types";

function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <span className="flex">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < full ? "text-gold-400" : "text-ink-200"}>
          <Icon name="star" size={14} />
        </span>
      ))}
    </span>
  );
}

export function AutoCompare() {
  const t = useTranslations("auto");
  const format = useFormatter();
  const baht = useBaht();
  const [sort, setSort] = useState<AutoSort>("price");
  const [repair, setRepair] = useState<Record<AutoRepairType, boolean>>({
    garage: true,
    dealer: true,
  });

  const list = useMemo(() => {
    const filtered = AUTO_PLANS.filter((p) => repair[p.type]);
    const sorted = [...filtered];
    if (sort === "price") sorted.sort((a, b) => a.price - b.price);
    if (sort === "coverage") sorted.sort((a, b) => b.sum - a.sum);
    if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating);
    return sorted;
  }, [sort, repair]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid lg:grid-cols-[230px_1fr] gap-7 items-start">
      {/* filters */}
      <aside className="card p-5 lg:sticky lg:top-[84px]">
        <h3 className="font-600 text-ink-900 flex items-center gap-2 mb-4">
          <span className="text-brand-600">
            <Icon name="filter" />
          </span>{" "}
          {t("filters.title")}
        </h3>
        <div className="space-y-5 text-sm">
          <div>
            <FieldLabel>{t("filters.sortBy")}</FieldLabel>
            <SelectField
              value={sort}
              onChange={(e) => setSort(e.target.value as AutoSort)}
            >
              <option value="price">{t("filters.sortPrice")}</option>
              <option value="coverage">{t("filters.sortCoverage")}</option>
              <option value="rating">{t("filters.sortRating")}</option>
            </SelectField>
          </div>
          <div>
            <p className="field-label mb-2.5">{t("filters.repairTypeLabel")}</p>
            {(["garage", "dealer"] as const).map((rt) => (
              <label
                key={rt}
                className="flex items-center gap-2.5 mb-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-brand-500"
                  checked={repair[rt]}
                  onChange={(e) =>
                    setRepair((r) => ({ ...r, [rt]: e.target.checked }))
                  }
                />{" "}
                {t(`filters.${rt}`)}
              </label>
            ))}
          </div>
          <div>
            <p className="field-label mb-2.5">{t("filters.coverageLabel")}</p>
            {(["cov1", "cov2", "cov3"] as const).map((c, i) => (
              <label
                key={c}
                className="flex items-center gap-2.5 mb-2 cursor-pointer last:mb-0"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-brand-500"
                  defaultChecked={i === 0}
                />{" "}
                {t(`filters.${c}`)}
              </label>
            ))}
          </div>
        </div>
      </aside>

      {/* results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-ink-600">
            {t.rich("results.summary", {
              count: list.length,
              car: t("results.car"),
              strong: (c) => (
                <span className="font-700 text-ink-900">{c}</span>
              ),
              em: (c) => <span className="font-600 text-ink-900">{c}</span>,
            })}
          </p>
        </div>
        <div className="space-y-4">
          {list.map((p) => (
            <PlanCard key={p.id} plan={p} baht={baht} reviews={format.number(p.reviews)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PlanCard({
  plan,
  baht,
  reviews,
}: {
  plan: AutoPlan;
  baht: (n: number) => string;
  reviews: string;
}) {
  const t = useTranslations("auto");
  const co = t(`plans.${plan.id}.co`);
  const features = t.raw(`plans.${plan.id}.features`) as string[];
  const logo = co.charAt(0);

  return (
    <div
      className={cn(
        "card card-hover p-5 sm:p-6 relative",
        plan.best && "ring-2 ring-brand-400",
      )}
    >
      {plan.best && (
        <Chip className="bg-brand-500 text-white absolute -top-3 left-6 text-xs">
          {t("plan.best")}
        </Chip>
      )}
      {plan.value && (
        <Chip className="bg-emerald-500 text-white absolute -top-3 left-6 text-xs">
          {t("plan.cheapest")}
        </Chip>
      )}
      <div className="grid lg:grid-cols-[1.3fr_1.4fr_auto] gap-5 items-center">
        <div className="flex items-center gap-3.5">
          <span className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-100 to-sky-200 text-brand-700 inline-flex items-center justify-center font-display font-700 text-xl shrink-0">
            {logo}
          </span>
          <div>
            <p className="font-600 text-ink-900">{co}</p>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-ink-500">
              <Stars rating={plan.rating} />
              <span className="font-600 text-ink-700">{plan.rating}</span>
              <span>({reviews})</span>
            </div>
            <Chip className="bg-sky-100 text-ink-600 text-xs mt-2">
              {t(`repair.${plan.type}`)}
            </Chip>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-ink-400 text-xs">{t("plan.sum")}</p>
            <p className="font-600 text-ink-900 tabnum">{baht(plan.sum)}</p>
          </div>
          <div>
            <p className="text-ink-400 text-xs">{t("plan.deductible")}</p>
            <p className="font-600 text-ink-900">
              {plan.deduct === null ? (
                <span className="text-emerald-600">{t("plan.noDeduct")}</span>
              ) : (
                baht(plan.deduct)
              )}
            </p>
          </div>
          <div className="col-span-2">
            <ul className="flex flex-wrap gap-1.5 mt-1">
              {features.map((f) => (
                <li
                  key={f}
                  className="chip bg-sky-50 text-ink-600 text-[0.7rem] !py-0.5 !px-2"
                >
                  <span className="text-emerald-500">
                    <Icon name="check" size={12} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="text-right lg:border-l lg:border-ink-100 lg:pl-6">
          <p className="text-xs text-ink-400">{t("plan.perYear")}</p>
          <p className="font-display font-700 text-3xl text-brand-700 tabnum">
            {baht(plan.price)}
          </p>
          <button className="btn btn-primary btn-md mt-3 w-full lg:w-auto">
            {t("plan.choose")}
          </button>
        </div>
      </div>
    </div>
  );
}
