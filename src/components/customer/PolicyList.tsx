"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { useBaht } from "@/lib/format";
import { cn } from "@/lib/cn";
import { CUSTOMER_POLICIES, POLICY_STATUS_STYLE } from "@/config/customer";
import type { CustomerPolicy } from "@/types";

type Filter = "all" | "active" | "expiring";
const FILTERS: Filter[] = ["all", "active", "expiring"];

export function PolicyList() {
  const t = useTranslations("customer");
  const [filter, setFilter] = useState<Filter>("all");

  const list =
    filter === "all"
      ? CUSTOMER_POLICIES
      : CUSTOMER_POLICIES.filter((p) => p.status === filter);

  return (
    <div className="lg:col-span-2 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-600 text-lg text-ink-900">{t("policiesTitle")}</h2>
        <div className="flex gap-1.5 text-xs">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "chip",
                filter === f
                  ? "bg-brand-500 text-white"
                  : "bg-sky-100 text-ink-500",
              )}
            >
              {t(`filter.${f}`)}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        {list.map((p) => (
          <PolicyCard key={p.id} policy={p} />
        ))}
      </div>
    </div>
  );
}

function PolicyCard({ policy }: { policy: CustomerPolicy }) {
  const t = useTranslations("customer");
  const baht = useBaht();
  const style = POLICY_STATUS_STYLE[policy.status];
  const renewable = policy.status === "expiring" || policy.status === "expired";

  return (
    <div className="card card-hover p-5 relative overflow-hidden">
      <div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ background: style.bar }}
      />
      <div className="flex items-start justify-between gap-4 pl-2">
        <div className="flex items-start gap-3.5">
          <span className="w-12 h-12 rounded-xl bg-sky-100 text-brand-600 inline-flex items-center justify-center shrink-0">
            <Icon name={policy.icon} />
          </span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-600 text-ink-900">
                {t(`policies.${policy.id}.type`)}
              </p>
              <Chip className={cn("text-xs", style.chip)}>
                {t(`status.${policy.status}`)}
              </Chip>
            </div>
            <p className="text-sm text-ink-500 mt-0.5">
              {t(`policies.${policy.id}.co`)} ·{" "}
              {t(`policies.${policy.id}.extra`)}
            </p>
            <p className="text-xs text-ink-400 mt-1.5 tabnum">
              {t("policyCard.policyNo")} {policy.no}
            </p>
          </div>
        </div>
        <div className="text-right shrink-0 hidden sm:block">
          <p className="text-xs text-ink-400">
            {policy.status === "expired"
              ? t("policyCard.expiredOn")
              : t("policyCard.coverUntil")}
          </p>
          <p className="font-600 text-ink-900 text-sm">
            {t(`policies.${policy.id}.expiry`)}
          </p>
          <p className="text-xs text-ink-400 mt-2">{t("policyCard.perYear")}</p>
          <p className="font-600 text-brand-700 tabnum">{baht(policy.premium)}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-4 pl-2">
        {renewable && (
          <button className="btn btn-primary btn-sm">
            <Icon name="refresh" /> {t("policyCard.renew")}
          </button>
        )}
        <button className="btn btn-ghost btn-sm">
          <Icon name="download" /> {t("policyCard.download")}
        </button>
        <button className="btn btn-ghost btn-sm">
          <Icon name="file" /> {t("policyCard.claim")}
        </button>
      </div>
    </div>
  );
}
