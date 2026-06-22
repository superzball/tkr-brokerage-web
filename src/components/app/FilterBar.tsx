// src/components/app/FilterBar.tsx
// Search box + optional inline filter controls (passed as children), sitting
// above a DataTable. Controlled search value.

"use client";

import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

export function FilterBar({
  search,
  onSearch,
  placeholder,
  children,
  className,
}: {
  search: string;
  onSearch: (value: string) => void;
  placeholder?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <div className="relative flex-1 min-w-[200px]">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400">
          <Icon name="search" size={18} />
        </span>
        <input
          type="search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={placeholder}
          className="field pl-10"
        />
      </div>
      {children}
    </div>
  );
}
