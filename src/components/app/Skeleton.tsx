// src/components/app/Skeleton.tsx
// Loading placeholders. <Skeleton/> is a single shimmering bar; <SkeletonTable/>
// and <SkeletonCards/> compose it for the common list/dashboard loading states.

import { cn } from "@/lib/cn";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "sheen rounded-lg bg-ink-100/60",
        className ?? "h-4 w-full",
      )}
    />
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="card p-4">
      <Skeleton className="h-5 w-40 mb-4" />
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </div>
  );
}

export function SkeletonCards({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card p-5">
          <Skeleton className="h-4 w-24 mb-3" />
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  );
}
