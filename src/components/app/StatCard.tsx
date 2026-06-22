// src/components/app/StatCard.tsx
// Dashboard KPI tile: icon, label, big value, optional trend delta.

import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

export function StatCard({
  icon,
  label,
  value,
  delta,
  deltaTone = "up",
}: {
  icon: IconName;
  label: string;
  value: string | number;
  delta?: string;
  deltaTone?: "up" | "down" | "flat";
}) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-500 text-ink-500">{label}</span>
        <span className="w-9 h-9 rounded-xl bg-sky-100 text-brand-600 flex items-center justify-center">
          <Icon name={icon} size={18} />
        </span>
      </div>
      <div className="mt-3 text-3xl font-700 text-ink-900 tabnum">{value}</div>
      {delta && (
        <div
          className={cn(
            "mt-1 text-xs font-600",
            deltaTone === "up" && "text-emerald-600",
            deltaTone === "down" && "text-rose-600",
            deltaTone === "flat" && "text-ink-400",
          )}
        >
          {delta}
        </div>
      )}
    </div>
  );
}
