// src/components/conversion/Reviews.tsx
// Social proof — testimonial cards from the mock review store. Sample data is
// clearly labelled as placeholder (project rule: never present mock reviews as
// real). `limit` renders a strip (home/landing); omit it for the full list.

import { useTranslations } from "next-intl";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/cn";
import type { Review } from "@/types/portal";

const REACTION_ICON: Record<Review["reaction"], IconName> = {
  heart: "heart",
  like: "star",
  celebrate: "sparkle",
};
const REACTION_TONE: Record<Review["reaction"], string> = {
  heart: "text-rose-500",
  like: "text-gold-500",
  celebrate: "text-brand-500",
};

export function Reviews({
  reviews,
  limit,
  showNote = true,
  heading = true,
  className,
}: {
  reviews: Review[];
  limit?: number;
  showNote?: boolean;
  heading?: boolean;
  className?: string;
}) {
  const t = useTranslations("conversion.reviews");
  const tp = useTranslations("admin.product");
  const list = limit ? reviews.slice(0, limit) : reviews;

  return (
    <section className={cn("max-w-7xl mx-auto px-4 sm:px-6 py-16", className)}>
      {heading && (
        <div className="text-center max-w-2xl mx-auto reveal mb-10">
          <Chip className="bg-brand-50 text-brand-600 mb-3">{t("title")}</Chip>
          <h2 className="font-display font-700 text-3xl sm:text-4xl text-ink-900 tracking-tight">
            {t("title")}
          </h2>
          <p className="mt-3 text-ink-600">{t("sub")}</p>
        </div>
      )}

      {showNote && (
        <div className="mb-6 mx-auto max-w-2xl rounded-xl bg-gold-50 border border-gold-100 px-4 py-2.5 flex items-center gap-2 text-xs text-gold-700">
          <Icon name="info" size={14} />
          {t("placeholderNote")}
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {list.map((r) => (
          <figure key={r.id} className="card card-hover p-6 reveal">
            <div className="flex items-center justify-between">
              <span className={cn("inline-flex", REACTION_TONE[r.reaction])}>
                <Icon name={REACTION_ICON[r.reaction]} size={22} />
              </span>
              <Chip className="bg-sky-100 text-ink-600 text-xs">{tp(r.product)}</Chip>
            </div>
            <blockquote className="mt-4 text-ink-700 leading-relaxed">“{r.text}”</blockquote>
            <figcaption className="mt-4 flex items-center justify-between text-sm">
              <span className="font-600 text-ink-900">{r.authorLabel}</span>
              <span className="text-ink-400 tabnum">{r.date}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
