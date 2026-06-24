// src/components/app/Tabs.tsx
// Controlled segmented tab control, reusing the home page's .ins-tab styling.

"use client";

import { cn } from "@/lib/cn";

export type TabDef<T extends string> = { key: T; label: string, childClassName?: string };

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
  function onKeyDown(e: React.KeyboardEvent) {
    const dirs: Record<string, number> = {
      ArrowRight: 1,
      ArrowDown: 1,
      ArrowLeft: -1,
      ArrowUp: -1,
    };
    const step = dirs[e.key];
    if (!step) return;
    e.preventDefault();
    const i = tabs.findIndex((x) => x.key === value);
    const next = tabs[(i + step + tabs.length) % tabs.length];
    if (next) onChange(next.key);
  }

  return (
    <div
      role="tablist"
      onKeyDown={onKeyDown}
      className={cn("inline-flex gap-1 p-1 rounded-xl bg-ink-50", className)}
    >
      {tabs.map((t) => (
        <button
          key={t.key}
          role="tab"
          aria-selected={value === t.key}
          tabIndex={value === t.key ? 0 : -1}
          onClick={() => onChange(t.key)}
          className={cn("ins-tab", value === t.key && "is-active", t.childClassName)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
