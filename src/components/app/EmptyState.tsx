// src/components/app/EmptyState.tsx
// Generic empty / "nothing here yet" panel. Used for empty lists and as the
// Phase-7 placeholder body for screens that fill in during later phases.

import { Icon, type IconName } from "@/components/ui/Icon";

export function EmptyState({
  icon = "box",
  title,
  body,
  action,
}: {
  icon?: IconName;
  title: string;
  body?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="card p-10 flex flex-col items-center text-center">
      <div className="relative mb-4">
        <span className="absolute inset-0 rounded-2xl bg-brand-200/40 blur-lg" aria-hidden="true" />
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-100 to-brand-100 text-brand-600 flex items-center justify-center ring-1 ring-brand-100">
          <Icon name={icon} size={28} />
        </div>
      </div>
      <h3 className="text-lg font-600 text-ink-900">{title}</h3>
      {body && <p className="mt-1.5 text-sm text-ink-500 max-w-sm">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
