// src/components/conversion/Reviews.tsx
// Social proof — real customer quotes from post-service surveys, anonymized as
// "ลูกค้า TKR" (see lib/mock/seed.ts reviews[]). No star ratings — we don't
// collect them. `limit` caps a strip (landings); omit it for the full list.

import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icon";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/cn";
import type { Review } from "@/types/portal";

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
  const list = limit ? reviews.slice(0, limit) : reviews;

  return (
    <section className={cn("max-w-7xl mx-auto px-4 sm:px-6 py-16", className)}>
      {heading && (
        <div className="text-center max-w-2xl mx-auto reveal mb-10">
          <Chip className="bg-peach-100 text-peach-600 mb-4">{t("title")}</Chip>
          <h2 className="font-display font-700 text-4xl sm:text-5xl text-ink-900 tracking-tight leading-[1.08]">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-ink-500">{t("sub")}</p>
        </div>
      )}

      {showNote && (
        <div className="mb-6 mx-auto max-w-2xl rounded-xl bg-sky-50 border border-sky-100 px-4 py-2.5 flex items-center gap-2 text-xs text-ink-500">
          <Icon name="info" size={14} />
          {t("sourceNote")}
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {list.map((r) => (
          <figure key={r.id} className="card card-hover p-6 reveal flex flex-col">
            <div className="flex items-center justify-between gap-2">
              <span aria-hidden className="font-display font-700 text-4xl leading-none text-peach-300 select-none">
                “
              </span>
              {r.tag && <Chip className="bg-sky-100 text-ink-600 text-xs">{r.tag}</Chip>}
            </div>
            <blockquote className="mt-3 text-ink-700 leading-relaxed flex-1">“{r.quote}”</blockquote>
            <figcaption className="mt-4 flex items-center justify-between text-sm">
              <span className="font-600 text-ink-900">{r.author}</span>
              <span className="text-ink-400 tabnum">{r.date}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
