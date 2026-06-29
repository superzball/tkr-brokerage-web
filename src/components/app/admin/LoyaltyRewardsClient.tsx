// src/components/app/admin/LoyaltyRewardsClient.tsx
// Admin — manage the rewards catalog (Phase 20). Toggle visibility, delete, add.
// premium_discount rewards carry requiresLegalReview and stay hidden from
// customers until FEATURES_LOYALTY.pointsToPremiumDiscount is enabled — surfaced
// here with a clear "pending legal/OIC sign-off" badge + hint.

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Reward } from "@/types/portal";
import { FEATURES_LOYALTY } from "@/config/loyalty";
import { EmptyState } from "@/components/app/EmptyState";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Chip } from "@/components/ui/Chip";
import { useToast } from "@/components/app/toast";
import { useBaht } from "@/lib/format";

export function LoyaltyRewardsClient({ initial }: { initial: Reward[] }) {
  const t = useTranslations("loyalty.admin.rewards");
  const tr = useTranslations("loyalty.rw");
  const tt = useTranslations("loyalty.rwType");
  const ttier = useTranslations("loyalty.tier.name");
  const baht = useBaht();
  const { toast } = useToast();
  const [rewards, setRewards] = useState<Reward[]>(initial);

  const legalGated = (r: Reward) =>
    r.type === "premium_discount" && r.requiresLegalReview && !FEATURES_LOYALTY.pointsToPremiumDiscount;

  function toggle(id: string) {
    let nowActive = false;
    setRewards((prev) => prev.map((r) => {
      if (r.id !== id) return r;
      nowActive = !r.active;
      return { ...r, active: nowActive };
    }));
    toast(nowActive ? t("activated") : t("deactivated"), "info");
  }
  function remove(id: string) {
    setRewards((prev) => prev.filter((r) => r.id !== id));
    toast(t("deleted"), "info");
  }
  function add() {
    setRewards((prev) => [
      { id: `rw_${Date.now()}`, name: "rwGift", type: "gift", cost: 1000, active: false },
      ...prev,
    ]);
    toast(t("created"), "success");
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-ink-500">{t("count", { n: rewards.length })}</p>
        <Button variant="primary" size="sm" onClick={add}>
          <Icon name="plus" size={14} /> {t("add")}
        </Button>
      </div>

      {rewards.length === 0 ? (
        <EmptyState icon="gift" title="—" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rewards.map((r) => (
            <div key={r.id} className="card p-5 flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <span className="w-10 h-10 rounded-xl bg-gold-50 text-gold-600 flex items-center justify-center shrink-0">
                  <Icon name={r.type === "donation" ? "heart" : r.type === "premium_discount" ? "coins" : "gift"} size={20} />
                </span>
                <StatusBadge tone={r.active ? "success" : "neutral"}>
                  {r.active ? t("active") : t("inactive")}
                </StatusBadge>
              </div>
              <h3 className="mt-3 font-700 text-ink-900 leading-snug">{tr(r.name as "rwCoffee")}</h3>
              <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
                <Chip className="bg-sky-100 text-ink-600">{tt(r.type as "voucher")}</Chip>
                <Chip className="bg-brand-50 text-brand-600">{r.cost.toLocaleString()} · {t("cost")}</Chip>
                {r.value != null && <Chip className="bg-ink-50 text-ink-500">{t("value")}: {baht(r.value)}</Chip>}
                {r.minTier && <Chip className="bg-gold-50 text-gold-600">{ttier(r.minTier as "gold")}+</Chip>}
              </div>

              {legalGated(r) && (
                <div className="mt-3 rounded-lg border border-peach-200 bg-peach-50 p-2.5">
                  <p className="text-xs font-700 text-peach-700 flex items-center gap-1">
                    <Icon name="lock" size={12} /> {t("legalGated")}
                  </p>
                  <p className="mt-1 text-[11px] text-peach-700/80 leading-snug">{t("legalHint")}</p>
                </div>
              )}

              <div className="mt-auto pt-4 border-t border-ink-50 flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => toggle(r.id)}>
                  <Icon name={r.active ? "eye" : "refresh"} size={14} /> {t("toggle")}
                </Button>
                <button
                  type="button"
                  onClick={() => remove(r.id)}
                  aria-label={t("delete")}
                  className="ml-auto w-8 h-8 rounded-lg text-ink-400 hover:bg-rose-50 hover:text-rose-500 flex items-center justify-center"
                >
                  <Icon name="x" size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
