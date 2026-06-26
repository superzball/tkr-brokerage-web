// src/components/help/StepGuide.tsx
// Vertical numbered step guide (how-to-buy / claims). Presentational; the
// friendly-zone step language mirrors the app wizards (brand-gradient markers).
import { Icon } from "@/components/ui/Icon";

export type Step = { title: string; desc: string };

export function StepGuide({ steps }: { steps: Step[] }) {
  return (
    <ol className="relative">
      {steps.map((s, i) => (
        <li key={s.title} className="flex gap-4 pb-8 last:pb-0">
          <div className="flex flex-col items-center">
            <span className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white font-700 inline-flex items-center justify-center shrink-0 shadow-[0_8px_18px_-8px_rgba(31,102,238,0.6)]">
              {i + 1}
            </span>
            {i < steps.length - 1 && (
              <span className="w-0.5 flex-1 my-1.5 min-h-[28px] bg-ink-100" />
            )}
          </div>
          <div className="pt-1.5 pb-2">
            <h3 className="font-600 text-ink-900 flex items-center gap-2">
              {s.title}
              {i === steps.length - 1 && (
                <span className="text-mint-600"><Icon name="checkCircle" size={16} /></span>
              )}
            </h3>
            <p className="mt-1 text-sm text-ink-600 leading-relaxed max-w-xl">{s.desc}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
