// src/components/help/HelpFaq.tsx
"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icon";
import { EmptyState } from "@/components/app/EmptyState";
import { LinkifiedText } from "@/components/worker/WorkerFaq";
import { workerInsuranceFaq } from "@/config/insurance";
import { cn } from "@/lib/cn";

type Faq = { category: string; q: string; a: string };
const CATS = ["all", "worker", "buy", "claims", "payment", "refund", "network"];

/** Help-center FAQ. `search` toggles the search box + category filter (full FAQ
 *  page); without it, renders a simple accordion of the first `limit` items
 *  (the hub teaser). Content: the worker items come from `workerInsuranceFaq`
 *  (the single source also shown on home/landings/in-flow, copy in
 *  `worker.faq.items`); everything else from the `help.faqs` messages. */
export function HelpFaq({
  search = true,
  limit,
}: {
  search?: boolean;
  limit?: number;
}) {
  const t = useTranslations("help");
  const tw = useTranslations("worker.faq");
  const all = useMemo<Faq[]>(
    () => [
      ...workerInsuranceFaq.map((f) => ({
        category: "worker",
        q: tw(`items.${f.id}.q`),
        a: tw(`items.${f.id}.a`),
      })),
      ...(t.raw("faqs") as Faq[]),
    ],
    [t, tw],
  );
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [open, setOpen] = useState(0);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let items = all;
    if (cat !== "all") items = items.filter((f) => f.category === cat);
    if (needle)
      items = items.filter(
        (f) =>
          f.q.toLowerCase().includes(needle) || f.a.toLowerCase().includes(needle),
      );
    return limit ? items.slice(0, limit) : items;
  }, [all, q, cat, limit]);

  return (
    <div>
      {search && (
        <div className="flex flex-col gap-4 mb-6">
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400">
              <Icon name="search" size={18} />
            </span>
            <input
              type="search"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setOpen(-1);
              }}
              placeholder={t("searchPlaceholder")}
              className="field pl-10"
              aria-label={t("searchPlaceholder")}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {CATS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setCat(c);
                  setOpen(0);
                }}
                aria-pressed={cat === c}
                className={cn(
                  "chip transition-colors",
                  cat === c
                    ? "bg-brand-500 text-white"
                    : "bg-white border border-ink-100 text-ink-600 hover:border-brand-200 hover:text-brand-700",
                )}
              >
                {t(`categories.${c}`)}
              </button>
            ))}
          </div>
        </div>
      )}

      {list.length === 0 ? (
        <EmptyState icon="search" title={t("noResults")} />
      ) : (
        <div className="space-y-3">
          {list.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                className={cn("card overflow-hidden transition-colors", isOpen && "border-brand-200")}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 text-left px-5 py-4"
                >
                  <span className="font-600 text-ink-900">{item.q}</span>
                  <span
                    className={cn(
                      "shrink-0 w-7 h-7 rounded-full bg-sky-100 text-brand-600 inline-flex items-center justify-center transition-transform duration-300",
                      isOpen && "rotate-45",
                    )}
                  >
                    <Icon name="plus" size={16} strokeWidth={2.4} />
                  </span>
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-300 ease-out motion-reduce:transition-none",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-ink-600 leading-relaxed">
                      <LinkifiedText text={item.a} />
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
