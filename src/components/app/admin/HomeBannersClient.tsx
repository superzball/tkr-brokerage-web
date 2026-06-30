// src/components/app/admin/HomeBannersClient.tsx
// Admin CMS — manage the home-page promo carousel (homeBanners). Mock: state is
// in-memory; add/toggle/delete with toasts. Mirrors CouponsClient. A slide only
// appears on the live site when active=true AND today is within start/end.

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { HomeBanner } from "@/types/portal";
import { EmptyState } from "@/components/app/EmptyState";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Chip } from "@/components/ui/Chip";
import { useToast } from "@/components/app/toast";

/** True when active AND today within [startDate, endDate] (ISO compare). */
function isLive(b: HomeBanner): boolean {
  const today = new Date().toISOString().slice(0, 10);
  return b.active && b.startDate <= today && today <= b.endDate;
}

export function HomeBannersClient({ initial }: { initial: HomeBanner[] }) {
  const t = useTranslations("admin.banners");
  const { toast } = useToast();
  const [banners, setBanners] = useState<HomeBanner[]>(initial);

  function toggle(id: string) {
    let nowActive = false;
    setBanners((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        nowActive = !b.active;
        return { ...b, active: nowActive };
      }),
    );
    toast(nowActive ? t("activated") : t("deactivated"), "info");
  }

  function remove(id: string) {
    setBanners((prev) => prev.filter((b) => b.id !== id));
    toast(t("deleted"), "info");
  }

  function add() {
    const n = banners.length + 1;
    setBanners((prev) => [
      ...prev,
      {
        id: `hb_${Date.now()}`,
        title: t("sampleTitle", { n }),
        subtitle: "—",
        gradient: "linear-gradient(120deg,#0b2240 0%,#143a6b 48%,#1f66ee 100%)",
        ctaLabel: t("sampleCta"),
        ctaHref: "/promotions",
        startDate: "2026-01-01",
        endDate: "2026-12-31",
        active: false,
        sortOrder: n,
      },
    ]);
    toast(t("created"), "success");
  }

  return (
    <>
      <div className="mb-4 rounded-xl bg-gold-50 border border-gold-100 px-4 py-2.5 flex items-center gap-2 text-xs text-gold-700">
        <Icon name="info" size={14} />
        {t("placeholderBanner")}
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-ink-500">{t("count", { n: banners.length })}</p>
        <Button variant="primary" size="sm" onClick={add}>
          <Icon name="plus" size={14} /> {t("add")}
        </Button>
      </div>

      {banners.length === 0 ? (
        <EmptyState icon="image" title={t("empty")} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {banners.map((b) => {
            const live = isLive(b);
            return (
              <div key={b.id} className="card p-0 overflow-hidden flex flex-col">
                {/* preview strip — same background the carousel renders */}
                <div
                  className="relative h-24 flex items-end"
                  style={{ background: b.image ? undefined : b.gradient }}
                >
                  {b.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={b.image}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(90deg,rgba(8,20,40,.6),transparent 80%)",
                    }}
                  />
                  <p className="relative px-4 pb-2.5 text-sm font-600 text-white line-clamp-2">
                    {b.title}
                  </p>
                  <span className="absolute top-2.5 left-2.5 inline-flex items-center justify-center w-6 h-6 rounded-md bg-white/85 text-xs font-700 text-ink-600">
                    {b.sortOrder}
                  </span>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <StatusBadge tone={live ? "success" : "neutral"}>
                      {live ? t("live") : b.active ? t("scheduled") : t("inactive")}
                    </StatusBadge>
                  </div>
                  {b.subtitle && (
                    <p className="mt-2 text-sm text-ink-600 line-clamp-2">
                      {b.subtitle}
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <Chip className="bg-brand-50 text-brand-600">
                      <Icon name="link" size={12} /> {b.ctaLabel}
                    </Chip>
                    <Chip className="bg-sky-100 text-ink-600">{b.ctaHref}</Chip>
                  </div>
                  <p className="mt-2 text-xs text-ink-400">
                    {t("window")}: {b.startDate} → {b.endDate}
                  </p>
                  <div className="mt-4 pt-3 border-t border-ink-50 flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => toggle(b.id)}>
                      <Icon name={b.active ? "eye" : "refresh"} size={14} />{" "}
                      {t("toggle")}
                    </Button>
                    <button
                      type="button"
                      onClick={() => remove(b.id)}
                      aria-label={t("delete")}
                      className="ml-auto w-8 h-8 rounded-lg text-ink-400 hover:bg-rose-50 hover:text-rose-500 flex items-center justify-center"
                    >
                      <Icon name="x" size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
