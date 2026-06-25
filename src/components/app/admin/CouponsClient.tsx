// src/components/app/admin/CouponsClient.tsx
// Admin CMS — manage discount coupons shown on /promotions and applied at
// checkout. Mock: state is in-memory; add/toggle/delete with toasts.

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Coupon } from "@/types/portal";
import { EmptyState } from "@/components/app/EmptyState";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Chip } from "@/components/ui/Chip";
import { useToast } from "@/components/app/toast";
import { useBaht } from "@/lib/format";

export function CouponsClient({ initial }: { initial: Coupon[] }) {
  const t = useTranslations("admin.coupons");
  const tp = useTranslations("admin.product");
  const baht = useBaht();
  const { toast } = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>(initial);

  function toggle(id: string) {
    let nowActive = false;
    setCoupons((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        nowActive = !c.active;
        return { ...c, active: nowActive };
      }),
    );
    toast(nowActive ? t("activated") : t("deactivated"), "info");
  }

  function remove(id: string) {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    toast(t("deleted"), "info");
  }

  function add() {
    const n = coupons.length + 1;
    setCoupons((prev) => [
      {
        id: `cpn_${Date.now()}`,
        code: `NEWCODE${n}`,
        description: "—",
        discountType: "fixed",
        value: 100,
        products: ["all"],
        expiry: "2026-12-31",
        active: false,
      },
      ...prev,
    ]);
    toast(t("created"), "success");
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-ink-500">{t("count", { n: coupons.length })}</p>
        <Button variant="primary" size="sm" onClick={add}>
          <Icon name="plus" size={14} /> {t("add")}
        </Button>
      </div>

      {coupons.length === 0 ? (
        <EmptyState icon="gift" title={t("empty")} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coupons.map((c) => {
            const products = c.products.includes("all")
              ? t("allProducts")
              : c.products.map((p) => tp(p as "worker")).join(", ");
            const discount =
              c.discountType === "percent" ? `${c.value}%` : baht(c.value);
            return (
              <div key={c.id} className="card p-5 flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <code className="font-700 text-brand-700 tracking-wide">{c.code}</code>
                  <StatusBadge tone={c.active ? "success" : "neutral"}>
                    {c.active ? t("active") : t("inactive")}
                  </StatusBadge>
                </div>
                <p className="mt-2 text-sm text-ink-600">{c.description}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <Chip className="bg-brand-50 text-brand-600">{t("discount")}: −{discount}</Chip>
                  <Chip className="bg-sky-100 text-ink-600">{products}</Chip>
                </div>
                <p className="mt-2 text-xs text-ink-400">{t("expiry")}: {c.expiry}</p>
                <div className="mt-4 pt-3 border-t border-ink-50 flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => toggle(c.id)}>
                    <Icon name={c.active ? "eye" : "refresh"} size={14} /> {t("toggle")}
                  </Button>
                  <button
                    type="button"
                    onClick={() => remove(c.id)}
                    aria-label={t("delete")}
                    className="ml-auto w-8 h-8 rounded-lg text-ink-400 hover:bg-rose-50 hover:text-rose-500 flex items-center justify-center"
                  >
                    <Icon name="x" size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
