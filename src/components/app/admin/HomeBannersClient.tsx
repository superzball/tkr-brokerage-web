// src/components/app/admin/HomeBannersClient.tsx
// Admin CMS — manage the home-page promo carousel (homeBanners). CRUD + active
// toggle + display window + sort order. Mirrors the navigation panel's
// persistence: seed defaults + full-list localStorage writes (lib/mock/
// local-banners), which the home carousel re-reads after mount — so edits here
// show on the live home page without a deploy. Campaign text is baked into the
// artwork; `title`/`imageAlt` only name the slide for assistive tech.

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { HomeBanner } from "@/types/portal";
import {
  isBannerLive,
  readLocalHomeBanners,
  saveLocalHomeBanners,
} from "@/lib/mock/local-banners";
import { EmptyState } from "@/components/app/EmptyState";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Chip } from "@/components/ui/Chip";
import { DatePicker, Input } from "@/components/app/form";
import { useToast } from "@/components/app/toast";

export function HomeBannersClient({ initial }: { initial: HomeBanner[] }) {
  const t = useTranslations("admin.banners");
  const { toast } = useToast();
  const [banners, setBanners] = useState<HomeBanner[]>(
    () => readLocalHomeBanners() ?? initial,
  );
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const today = new Date().toISOString().slice(0, 10);

  function persist(next: HomeBanner[]) {
    setBanners(next);
    saveLocalHomeBanners(next);
  }

  function patch(id: string, changes: Partial<HomeBanner>) {
    persist(banners.map((b) => (b.id === id ? { ...b, ...changes } : b)));
  }

  function toggle(id: string) {
    const nowActive = !banners.find((b) => b.id === id)?.active;
    patch(id, { active: nowActive });
    toast(nowActive ? t("activated") : t("deactivated"), "info");
  }

  function remove(id: string) {
    persist(banners.filter((b) => b.id !== id));
    toast(t("deleted"), "info");
  }

  function add() {
    const n = banners.length + 1;
    const id = `hb_${Date.now()}`;
    persist([
      ...banners,
      {
        id,
        title: t("sampleTitle", { n }),
        image: "/banners/wide-web.jpg",
        imageMobile: "/banners/square-web.jpg",
        href: "#",
        startDate: today,
        endDate: "2026-12-31",
        active: false,
        sortOrder: Math.max(0, ...banners.map((b) => b.sortOrder)) + 1,
      },
    ]);
    setExpanded((prev) => new Set(prev).add(id));
    toast(t("created"), "success");
  }

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const ordered = [...banners].sort((a, b) => a.sortOrder - b.sortOrder);

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
          {ordered.map((b) => {
            const live = isBannerLive(b, today);
            const open = expanded.has(b.id);
            return (
              <div key={b.id} className="card p-0 overflow-hidden flex flex-col">
                {/* preview — the wide artwork exactly as the carousel shows it
                    (text is baked in, so no overlay) */}
                <div className="relative aspect-[16/5] bg-sky-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={b.image}
                    alt={b.imageAlt ?? b.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
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
                  <p className="mt-2 text-sm font-600 text-ink-900 line-clamp-2">
                    {b.title}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <Chip className="bg-sky-100 text-ink-600">
                      <Icon name="link" size={12} /> {b.href}
                    </Chip>
                  </div>
                  <p className="mt-2 text-xs text-ink-400">
                    {t("window")}: {b.startDate} → {b.endDate}
                  </p>

                  {open && (
                    <div className="mt-4 grid gap-3 rounded-xl bg-sky-50/60 p-3">
                      <Input
                        label={t("fTitle")}
                        value={b.title}
                        onChange={(e) => patch(b.id, { title: e.target.value })}
                      />
                      <Input
                        label={t("fImageAlt")}
                        value={b.imageAlt ?? ""}
                        onChange={(e) =>
                          patch(b.id, { imageAlt: e.target.value || undefined })
                        }
                      />
                      <Input
                        label={t("fImage")}
                        value={b.image}
                        onChange={(e) => patch(b.id, { image: e.target.value })}
                      />
                      <Input
                        label={t("fImageMobile")}
                        value={b.imageMobile ?? ""}
                        onChange={(e) =>
                          patch(b.id, { imageMobile: e.target.value || undefined })
                        }
                      />
                      <Input
                        label={t("fHref")}
                        value={b.href}
                        onChange={(e) => patch(b.id, { href: e.target.value })}
                      />
                      <div className="grid gap-3 sm:grid-cols-3">
                        <DatePicker
                          label={t("fStart")}
                          value={b.startDate}
                          onChange={(e) => patch(b.id, { startDate: e.target.value })}
                        />
                        <DatePicker
                          label={t("fEnd")}
                          value={b.endDate}
                          onChange={(e) => patch(b.id, { endDate: e.target.value })}
                        />
                        <Input
                          label={t("fSort")}
                          type="number"
                          value={b.sortOrder}
                          onChange={(e) =>
                            patch(b.id, { sortOrder: Number(e.target.value) || 0 })
                          }
                        />
                      </div>
                    </div>
                  )}

                  <div className="mt-4 pt-3 border-t border-ink-50 flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => toggle(b.id)}>
                      <Icon name={b.active ? "eye" : "refresh"} size={14} />{" "}
                      {t("toggle")}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpand(b.id)}
                      aria-expanded={open}
                    >
                      <Icon name="edit" size={14} /> {t("edit")}
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
