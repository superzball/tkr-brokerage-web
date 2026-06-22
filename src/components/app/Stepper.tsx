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
                <span className="w-8 h-8 rounded-full bg-emerald-500 text-white inline-flex items-center justify-center shrink-0">
                  <Icon name="check" />
                </span>
              ) : (
                <span
                  className={cn(
                    "w-8 h-8 rounded-full inline-flex items-center justify-center font-600 text-sm shrink-0",
                    on
                      ? "bg-brand-500 text-white"
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
                      ? "font-500 text-emerald-600"
                      : "font-500 text-ink-400",
                )}
              >
                {label}
              </span>
            </li>
            {i < steps.length - 1 && (
              <li
                className={cn(
                  "h-0.5 w-6 sm:w-14 rounded-full shrink-0",
                  i < current ? "bg-emerald-400" : "bg-ink-100",
                )}
              />
            )}
          </Fragment>
        );
      })}
    </ol>
  );
}
