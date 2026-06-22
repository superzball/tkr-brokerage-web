// src/components/app/PageHeader.tsx
// Title + optional description and right-aligned actions, sitting above the
// content area of every app screen.

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-700 text-ink-900 font-display">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-ink-500">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
