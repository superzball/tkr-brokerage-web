"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

type QA = { q: string; a: string };

/** Home FAQ with a smooth (grid-rows) accordion. Friendly-zone styling. */
export function Faq() {
  const t = useTranslations("homeFaq");
  const items = t.raw("items") as QA[];
  const [open, setOpen] = useState(0);

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
      <div className="text-center mb-10 reveal">
        <Chip className="bg-gold-100 text-gold-600 mb-4">
          <Icon name="help" size={15} /> {t("title")}
        </Chip>
        <h2 className="font-display font-700 text-4xl sm:text-5xl text-ink-900 tracking-tight leading-[1.08]">
          {t("title")}
        </h2>
        <p className="mt-4 text-lg text-ink-500">{t("sub")}</p>
      </div>

      <div className="space-y-3">
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <div
              key={item.q}
              className={cn(
                "card overflow-hidden transition-colors",
                isOpen ? "border-brand-200" : "",
              )}
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
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
