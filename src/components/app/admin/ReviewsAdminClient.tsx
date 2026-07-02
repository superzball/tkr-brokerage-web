// src/components/app/admin/ReviewsAdminClient.tsx
// Admin CMS — manage the real customer reviews shown on the public site.
// Quotes are genuine, anonymized survey answers (never invent or edit wording).
// `featured` = shown on the home testimonials strip; compliance-flagged items
// (r6/r7 — เคลม/ราคา wording) must stay unfeatured until cleared. Mock state.

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Review } from "@/types/portal";
import { EmptyState } from "@/components/app/EmptyState";
import { Icon } from "@/components/ui/Icon";
import { Chip } from "@/components/ui/Chip";
import { useToast } from "@/components/app/toast";
import { cn } from "@/lib/cn";

export function ReviewsAdminClient({ initial }: { initial: Review[] }) {
  const t = useTranslations("admin.reviews");
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>(initial);

  function remove(id: string) {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    toast(t("deleted"), "info");
  }

  function toggleFeatured(id: string) {
    const target = reviews.find((r) => r.id === id);
    if (!target) return;
    if (!target.featured && target.complianceNote) {
      toast(t("complianceBlocked"), "error");
      return;
    }
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, featured: !r.featured } : r)));
    toast(target.featured ? t("featuredOff") : t("featuredOn"), "success");
  }

  return (
    <>
      <div className="mb-4 rounded-xl bg-gold-50 border border-gold-100 px-4 py-2.5 flex items-center gap-2 text-xs text-gold-700">
        <Icon name="info" size={14} />
        {t("complianceBanner")}
      </div>

      <p className="text-sm text-ink-500 mb-4">{t("count", { n: reviews.length })}</p>

      {reviews.length === 0 ? (
        <EmptyState icon="star" title={t("empty")} />
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="card p-5 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-600 text-ink-900">{r.author}</span>
                  {r.tag && <Chip className="bg-sky-100 text-ink-600 text-xs">{r.tag}</Chip>}
                  {r.channel && <Chip className="bg-ink-50 text-ink-500 text-xs">{r.channel}</Chip>}
                  {r.featured && (
                    <Chip className="bg-peach-100 text-peach-600 text-xs">{t("featured")}</Chip>
                  )}
                  {r.complianceNote && (
                    <Chip className="bg-gold-50 text-gold-700 text-xs">{t("complianceFlag")}</Chip>
                  )}
                  <span className="text-xs text-ink-400 tabnum ml-auto">{r.date}</span>
                </div>
                <p className="mt-2 text-sm text-ink-600">“{r.quote}”</p>
                {r.complianceNote && (
                  <p className="mt-2 text-xs text-gold-700 flex items-start gap-1.5">
                    <Icon name="info" size={13} className="mt-0.5 shrink-0" />
                    {r.complianceNote}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => toggleFeatured(r.id)}
                  aria-label={r.featured ? t("featuredOff") : t("featuredOn")}
                  aria-pressed={r.featured ?? false}
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    r.featured
                      ? "text-peach-500 hover:bg-peach-50"
                      : "text-ink-300 hover:bg-ink-50 hover:text-ink-500",
                  )}
                >
                  <Icon name="star" size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => remove(r.id)}
                  aria-label={t("delete")}
                  className="w-8 h-8 rounded-lg text-ink-400 hover:bg-rose-50 hover:text-rose-500 flex items-center justify-center"
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
