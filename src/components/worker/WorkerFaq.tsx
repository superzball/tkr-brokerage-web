"use client";

// Worker-insurance FAQ accordion (customer-supplied questions). Structure/ids
// live in `workerInsuranceFaq` (config); q/a copy in `worker.faq.items.<id>`
// messages. Trust styling mirrors HelpFaq/AboutFaq: card rows, chevron flip,
// smooth grid-rows collapse. URLs inside answers (the ทิพย hospital-network
// page) render as real links — we never inline the hospital list ourselves.
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { workerInsuranceFaq } from "@/config/insurance";

export type QA = { q: string; a: string };

const URL_RE = /(https?:\/\/[^\s]+)/g;

/** Splits a plain-text answer and renders bare URLs as safe external links.
 *  With a capturing split, URL matches land on odd indices. */
export function LinkifiedText({ text }: { text: string }) {
  return (
    <>
      {text.split(URL_RE).map((part, i) =>
        i % 2 === 1 ? (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-600 underline break-all hover:text-brand-700"
          >
            {part}
          </a>
        ) : (
          part
        ),
      )}
    </>
  );
}

export function WorkerFaq({
  subset = "all",
  extra = [],
  defaultOpen = 0,
  compact = false,
}: {
  /** "inFlow" renders only the compact pre-payment subset. */
  subset?: "all" | "inFlow";
  /** Extra already-localized items appended after the config-driven ones. */
  extra?: QA[];
  /** Index open on mount; -1 starts fully collapsed (compact contexts). */
  defaultOpen?: number;
  compact?: boolean;
}) {
  const t = useTranslations("worker.faq");
  const [open, setOpen] = useState(defaultOpen);

  const ids = workerInsuranceFaq.filter(
    (f) => subset === "all" || f.inFlow,
  );
  const items: QA[] = [
    ...ids.map((f) => ({ q: t(`items.${f.id}.q`), a: t(`items.${f.id}.a`) })),
    ...extra,
  ];

  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={item.q}
            className={cn(
              "card overflow-hidden transition-colors",
              isOpen && "border-brand-200",
            )}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className={cn(
                "w-full flex items-center justify-between gap-4 text-left",
                compact ? "px-4 py-3" : "px-5 py-4",
              )}
            >
              <span
                className={cn("font-600 text-ink-900", compact && "text-sm")}
              >
                {item.q}
              </span>
              <span
                className={cn(
                  "shrink-0 w-7 h-7 rounded-full bg-sky-100 text-brand-600 inline-flex items-center justify-center transition-transform duration-300",
                  isOpen && "rotate-180",
                )}
              >
                <Icon name="chevD" size={16} strokeWidth={2.4} />
              </span>
            </button>
            <div
              className={cn(
                "grid transition-all duration-300 ease-out motion-reduce:transition-none",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <p
                  className={cn(
                    "text-ink-600 leading-relaxed",
                    compact ? "px-4 pb-4 text-sm" : "px-5 pb-5",
                  )}
                >
                  <LinkifiedText text={item.a} />
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
