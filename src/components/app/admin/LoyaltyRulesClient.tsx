// src/components/app/admin/LoyaltyRulesClient.tsx
// Admin — edit the points awarded per earn activity (Phase 20). Mock: state is
// in-memory; Save shows a toast. The unit/cadence flags are shown read-only.

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { EarnRule } from "@/types/portal";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Chip } from "@/components/ui/Chip";
import { useToast } from "@/components/app/toast";

export function LoyaltyRulesClient({ initial }: { initial: EarnRule[] }) {
  const t = useTranslations("loyalty.admin.rules");
  const te = useTranslations("loyalty.earn");
  const { toast } = useToast();
  const [rules, setRules] = useState<EarnRule[]>(initial);

  function setPoints(source: string, points: number) {
    setRules((prev) => prev.map((r) => (r.source === source ? { ...r, points: Math.max(0, points) } : r)));
  }

  const unitLabel = (r: EarnRule) =>
    r.unit === "per_100_thb" ? t("perThb")
    : r.unit === "per_channel" ? t("perChannel")
    : r.unit === "per_action" ? t("perAction")
    : t("fixed");

  return (
    <>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-100 text-left text-xs text-ink-500">
              <th className="px-4 py-3 font-600">{t("source")}</th>
              <th className="px-4 py-3 font-600 w-32">{t("points")}</th>
              <th className="px-4 py-3 font-600">{t("unit")}</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((r) => (
              <tr key={r.source} className="border-b border-ink-50 last:border-0">
                <td className="px-4 py-3">
                  <div className="font-600 text-ink-900">
                    {te(`earn${cap(r.source)}` as "earnPurchase")}
                  </div>
                  <div className="mt-1 flex gap-1.5">
                    {r.oncePerCustomer && <Chip className="bg-ink-50 text-ink-500 text-[10px]">{t("once")}</Chip>}
                    {r.annual && <Chip className="bg-ink-50 text-ink-500 text-[10px]">{t("annual")}</Chip>}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    min={0}
                    value={r.points}
                    onChange={(e) => setPoints(r.source, Number(e.target.value))}
                    className="field w-24 tabnum"
                  />
                </td>
                <td className="px-4 py-3 text-ink-500">{unitLabel(r)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <Button variant="primary" size="md" onClick={() => toast(t("saved"), "success")}>
          <Icon name="check" size={16} /> {t("save")}
        </Button>
      </div>
    </>
  );
}

// earn source → message key suffix: profile_complete → ProfileComplete; we map to the curated keys.
const LABEL: Record<string, string> = {
  purchase: "Purchase", profile_complete: "Profile", social_link: "Social",
  renewal: "Renewal", no_claim: "NoClaim", referral: "Referral",
  review: "Review", survey: "Survey", birthday: "Birthday", mission: "Mission",
};
function cap(source: string): string {
  return LABEL[source] ?? "Mission";
}
