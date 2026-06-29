// src/components/app/admin/LoyaltyRedemptionsClient.tsx
// Admin — list customer reward redemptions and their status (Phase 20). Mock:
// status changes are in-memory with a toast. Rows are pre-resolved server-side
// (customer name + reward key) so this stays a thin presentational client.

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Redemption } from "@/types/portal";
import { EmptyState } from "@/components/app/EmptyState";
import { StatusBadge, type BadgeTone } from "@/components/app/StatusBadge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/app/toast";

export type RedemptionRow = {
  id: string;
  customerName: string;
  rewardKey: string;   // i18n key under loyalty.rw
  pointsSpent: number;
  code?: string;
  status: Redemption["status"];
  date: string;
};

const TONE: Record<Redemption["status"], BadgeTone> = {
  issued: "info",
  used: "success",
  expired: "neutral",
};

export function LoyaltyRedemptionsClient({ initial }: { initial: RedemptionRow[] }) {
  const t = useTranslations("loyalty.admin.redeem");
  const ts = useTranslations("loyalty.admin.status");
  const tr = useTranslations("loyalty.rw");
  const { toast } = useToast();
  const [rows, setRows] = useState<RedemptionRow[]>(initial);

  function markUsed(id: string) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: "used" } : r)));
    toast(t("marked"), "success");
  }

  if (rows.length === 0) return <EmptyState icon="gift" title={t("empty")} />;

  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-sm whitespace-nowrap">
        <thead>
          <tr className="border-b border-ink-100 text-left text-xs text-ink-500">
            <th className="px-4 py-3 font-600">{t("customer")}</th>
            <th className="px-4 py-3 font-600">{t("reward")}</th>
            <th className="px-4 py-3 font-600 text-right">{t("points")}</th>
            <th className="px-4 py-3 font-600">{t("code")}</th>
            <th className="px-4 py-3 font-600">{t("date")}</th>
            <th className="px-4 py-3 font-600">{t("status")}</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-ink-50 last:border-0">
              <td className="px-4 py-3 font-600 text-ink-900">{r.customerName}</td>
              <td className="px-4 py-3 text-ink-700">{tr(r.rewardKey as "rwCoffee")}</td>
              <td className="px-4 py-3 text-right tabnum text-ink-700">{r.pointsSpent.toLocaleString()}</td>
              <td className="px-4 py-3">
                {r.code ? <code className="text-brand-700 font-600">{r.code}</code> : <span className="text-ink-300">—</span>}
              </td>
              <td className="px-4 py-3 text-ink-500">{r.date}</td>
              <td className="px-4 py-3"><StatusBadge tone={TONE[r.status]}>{ts(r.status)}</StatusBadge></td>
              <td className="px-4 py-3 text-right">
                {r.status === "issued" && (
                  <Button variant="ghost" size="sm" onClick={() => markUsed(r.id)}>{t("markUsed")}</Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
