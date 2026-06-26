// src/components/app/Stepper.tsx
// Reusable horizontal stepper, matching the numbered-circle + connector style
// used by the worker purchase flow. Used by the onboarding wizards.

import { Fragment } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

export function Stepper({
  steps,
  current,
}: {
  /** Ordered step labels. */
  steps: string[];
  /** Index of the active step (0-based). Lower indices render as done. */
  current: number;
}) {
  return (
    <ol className="flex items-center gap-1.5 sm:gap-3 overflow-x-auto no-scrollbar pb-1">
      {steps.map((label, i) => {
        const done = i < current;
        const on = i === current;
        return (
          <Fragment key={label}>
            <li className="flex items-center gap-2 shrink-0">
              {done ? (
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-mint-400 to-mint-600 text-white inline-flex items-center justify-center shrink-0 shadow-[0_6px_14px_-6px_rgba(10,138,94,0.6)]">
                  <Icon name="check" strokeWidth={2.6} />
                </span>
              ) : (
                <span
                  className={cn(
                    "w-8 h-8 rounded-full inline-flex items-center justify-center font-600 text-sm shrink-0 transition-all",
                    on
                      ? "bg-gradient-to-br from-brand-500 to-brand-600 text-white ring-4 ring-brand-100 shadow-[0_8px_18px_-8px_rgba(31,102,238,0.7)]"
                      : "bg-white border-2 border-ink-100 text-ink-400",
                  )}
                >
                  {i + 1}
                </span>
              )}
              <span
                className={cn(
                  "text-sm hidden sm:block",
                  on
                    ? "font-600 text-ink-900"
                    : done
                      ? "font-500 text-mint-600"
                      : "font-500 text-ink-400",
                )}
              >
                {label}
              </span>
            </li>
            {i < steps.length - 1 && (
              <li
                className={cn(
                  "h-0.5 w-6 sm:w-14 rounded-full shrink-0 transition-colors",
                  i < current ? "bg-mint-400" : "bg-ink-100",
                )}
              />
            )}
          </Fragment>
        );
      })}
    </ol>
  );
}
