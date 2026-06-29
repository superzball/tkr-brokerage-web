"use client";

// Reusable FAQ accordion for the About pages (friendly-zone styling, mirrors
// the home FAQ). Items are passed in from a server component so copy stays in
// the i18n catalog / CMS.
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

export type QA = { q: string; a: string };

export function AboutFaq({ items }: { items: QA[] }) {
  const [open, setOpen] = useState(0);

  if (items.length === 0) return null;

  return (
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
                <p className="px-5 pb-5 text-ink-600 leading-relaxed">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
