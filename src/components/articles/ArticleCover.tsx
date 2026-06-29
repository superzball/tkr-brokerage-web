// src/components/articles/ArticleCover.tsx
// Decorative keyed-gradient cover for articles (the mock CMS has no real images).
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import type { ArticleCover as Tone } from "@/types/portal";

// Trust palette: editorial variety stays within the brand→navy blue family,
// with gold reserved as the single sparing warm accent. No mint/peach fills.
const GRAD: Record<Tone, string> = {
  brand: "from-brand-600 to-ink-900",
  mint: "from-sky-400 to-brand-600",
  gold: "from-gold-300 to-gold-500",
  peach: "from-brand-400 to-brand-700",
  sky: "from-sky-300 to-brand-500",
};

export function ArticleCover({
  tone = "brand",
  className,
}: {
  tone?: Tone;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-br flex items-center justify-center",
        GRAD[tone],
        className,
      )}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-grid opacity-20" />
      <span className="text-white/80">
        <Icon name="doc" size={40} strokeWidth={1.5} />
      </span>
    </div>
  );
}
