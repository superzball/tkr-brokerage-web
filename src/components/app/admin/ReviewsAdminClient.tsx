// src/components/app/admin/ReviewsAdminClient.tsx
// Admin CMS — manage customer reviews shown on the public site. Sample data is
// labelled as placeholder (only real, consented reviews should go live). Mock.

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Review } from "@/types/portal";
import { EmptyState } from "@/components/app/EmptyState";
import { Icon } from "@/components/ui/Icon";
import { Chip } from "@/components/ui/Chip";
import { useToast } from "@/components/app/toast";

export function ReviewsAdminClient({ initial }: { initial: Review[] }) {
  const t = useTranslations("admin.reviews");
  const tp = useTranslations("admin.product");
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>(initial);

  function remove(id: string) {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    toast(t("deleted"), "info");
  }

  return (
    <>
      <div className="mb-4 rounded-xl bg-gold-50 border border-gold-100 px-4 py-2.5 flex items-center gap-2 text-xs text-gold-700">
        <Icon name="info" size={14} />
        {t("placeholderBanner")}
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
                  <span className="font-600 text-ink-900">{r.authorLabel}</span>
                  <Chip className="bg-sky-100 text-ink-600 text-xs">{tp(r.product)}</Chip>
                  <Chip className="bg-ink-50 text-ink-500 text-xs">
                    {r.channel === "survey" ? t("channelSurvey") : t("channelSocial")}
                  </Chip>
                  <span className="text-xs text-ink-400 tabnum ml-auto">{r.date}</span>
                </div>
                <p className="mt-2 text-sm text-ink-600">“{r.text}”</p>
              </div>
              <button
                type="button"
                onClick={() => remove(r.id)}
                aria-label={t("delete")}
                className="w-8 h-8 rounded-lg text-ink-400 hover:bg-rose-50 hover:text-rose-500 flex items-center justify-center shrink-0"
              >
                <Icon name="x" size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
