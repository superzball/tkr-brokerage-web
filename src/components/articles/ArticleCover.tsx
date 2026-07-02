// src/components/articles/ArticleCover.tsx
// Article cover image (from /public/article-images), with the old brand
// gradient as the fallback when an article has no image.
import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

export function ArticleCover({
  src,
  alt = "",
  className,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
}: {
  src?: string;
  alt?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (!src) {
    return (
      <div
        className={cn(
          "relative overflow-hidden bg-gradient-to-br from-brand-600 to-ink-900 flex items-center justify-center",
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
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}
