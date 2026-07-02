"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { workerInsuranceFaq } from "@/config/insurance";
import { LinkifiedText } from "@/components/worker/WorkerFaq";

type QA = { q: string; a: string };

/** Home FAQ — asymmetric: a sticky heading panel beside the accordion column
 *  (breaks the centered label+heading+stack pattern). Friendly-zone styling.
 *  Items are the worker-insurance FAQ (`workerInsuranceFaq` config) — the same
 *  single source shown on the worker landings, in /help, and in-flow. */
export function Faq() {
  const t = useTranslations("homeFaq");
  const tw = useTranslations("worker.faq");
  const items: QA[] = workerInsuranceFaq.map((f) => ({
    q: tw(`items.${f.id}.q`),
    a: tw(`items.${f.id}.a`),
  }));
  const [open, setOpen] = useState(0);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-24">
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* left: sticky heading panel */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 reveal">
          <Chip className="bg-brand-50 text-brand-700 mb-4">
            <Icon name="help" size={15} /> {t("title")}
          </Chip>
          <h2 className="font-display font-700 text-4xl sm:text-5xl text-ink-900 tracking-tight leading-[1.05]">
            {t("title")}
          </h2>
          <span className="kw-swash mt-5" aria-hidden="true" />
          <p className="mt-5 text-lg text-ink-500 max-w-sm">{t("sub")}</p>
          <div
            className="mt-8 hidden lg:flex w-20 h-20 rounded-3xl bg-brand-50 text-brand-600 items-center justify-center shadow-card"
            aria-hidden="true"
          >
            <Icon name="help" size={34} />
          </div>
        </div>

        {/* right: accordion */}
        <div className="lg:col-span-7 space-y-3 reveal">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                className={cn(
                  "card overflow-hidden transition-all",
                  isOpen ? "border-brand-200 shadow-pop" : "",
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
                      "shrink-0 w-7 h-7 rounded-full inline-flex items-center justify-center transition-all duration-300",
                      isOpen ? "bg-brand-600 text-white rotate-45" : "bg-sky-100 text-brand-600",
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
      </div>
    </section>
  );
}
