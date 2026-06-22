// src/components/app/Tabs.tsx
// Controlled segmented tab control, reusing the home page's .ins-tab styling.

"use client";

import { cn } from "@/lib/cn";

export type TabDef<T extends string> = { key: T; label: string };

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: TabDef<T>[];
  value: T;
  onChange: (key: T) => void;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      className={cn("inline-flex gap-1 p-1 rounded-xl bg-ink-50", className)}
    >
      {tabs.map((t) => (
        <button
          key={t.key}
          role="tab"
          aria-selected={value === t.key}
          onClick={() => onChange(t.key)}
          className={cn("ins-tab", value === t.key && "is-active")}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
