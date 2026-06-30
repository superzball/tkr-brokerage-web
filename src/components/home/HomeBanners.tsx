// src/components/home/HomeBanners.tsx
// Home promo/campaign carousel (CMS-driven, below the hero). Trust styling:
// clean, soft shadow, ~0.875rem radius, smooth horizontal slide — no playful
// motion. Swipe on mobile; arrows + dots on desktop. Auto-advances with
// pause-on-hover/focus and a manual play/pause toggle; respects reduced-motion
// (no autoplay, instant transitions). Renders nothing when given no banners.

"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { HomeBanner } from "@/types/portal";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

const ADVANCE_MS = 6000;
const SWIPE_THRESHOLD = 40; // px

export function HomeBanners({ banners }: { banners: HomeBanner[] }) {
  const t = useTranslations("home.banners");
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const touchX = useRef<number | null>(null);

  const count = banners.length;
  const multi = count > 1;

  // Respect the OS "reduce motion" setting: no autoplay, no slide animation.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Auto-advance, paused on hover/focus, when reduced-motion, or single slide.
  useEffect(() => {
    if (!multi || paused || reduced) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % count),
      ADVANCE_MS,
    );
    return () => window.clearInterval(id);
  }, [multi, paused, reduced, count]);

  if (count === 0) return null;

  const go = (i: number) => setIndex(((i % count) + count) % count);
  const prev = () => go(index - 1);
  const next = () => go(index + 1);

  function onTouchStart(e: React.TouchEvent) {
    touchX.current = e.touches[0]?.clientX ?? null;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchX.current === null) return;
    const dx = (e.changedTouches[0]?.clientX ?? touchX.current) - touchX.current;
    if (dx <= -SWIPE_THRESHOLD) next();
    else if (dx >= SWIPE_THRESHOLD) prev();
    touchX.current = null;
  }

  return (
    // pt clears the hero's overlapping QuoteBar (mirrors ProductGrid's top gap).
    <section
      aria-roledescription="carousel"
      aria-label={t("region")}
      className="max-w-6xl mx-auto px-4 sm:px-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        className="group relative overflow-hidden rounded-[0.875rem] shadow-card ring-1 ring-ink-100/70"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* slide track */}
        <div
          className="flex"
          style={{
            transform: `translateX(-${index * 100}%)`,
            transition: reduced ? "none" : "transform .6s cubic-bezier(.22,1,.36,1)",
          }}
        >
          {banners.map((b, i) => (
            <div
              key={b.id}
              role="group"
              aria-roledescription="slide"
              aria-label={t("slideOf", { current: i + 1, total: count })}
              aria-hidden={i !== index}
              className="relative shrink-0 basis-full"
              style={{ background: b.image ? undefined : b.gradient }}
            >
              {b.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={b.image}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
              {/* legibility scrim for image/gradient backgrounds */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(90deg,rgba(8,20,40,.62) 0%,rgba(8,20,40,.28) 55%,transparent 100%)",
                }}
                aria-hidden="true"
              />
              <div className="relative flex min-h-[14rem] sm:min-h-[16rem] lg:min-h-[18rem] flex-col justify-center gap-3 px-6 py-8 sm:px-10 lg:px-14 max-w-2xl">
                <h2 className="font-display font-700 text-2xl sm:text-3xl lg:text-[2.1rem] leading-tight text-white tracking-tight">
                  {b.title}
                </h2>
                {b.subtitle && (
                  <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-xl">
                    {b.subtitle}
                  </p>
                )}
                <div className="mt-2">
                  <Button
                    href={b.ctaHref}
                    variant="gold"
                    size="md"
                    tabIndex={i === index ? undefined : -1}
                  >
                    {b.ctaLabel} <Icon name="arrowRight" size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* arrows — desktop, revealed on hover/focus */}
        {multi && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label={t("prev")}
              className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink-700 shadow-card ring-1 ring-ink-100 opacity-0 transition group-hover:opacity-100 focus-visible:opacity-100 hover:bg-white"
            >
              <Icon name="chevL" size={18} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label={t("next")}
              className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink-700 shadow-card ring-1 ring-ink-100 opacity-0 transition group-hover:opacity-100 focus-visible:opacity-100 hover:bg-white"
            >
              <Icon name="chevR" size={18} />
            </button>
          </>
        )}

        {/* dots + play/pause */}
        {multi && (
          <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2">
            {banners.map((b, i) => (
              <button
                key={b.id}
                type="button"
                onClick={() => go(i)}
                aria-label={t("goToSlide", { n: i + 1 })}
                aria-current={i === index}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-6 bg-white" : "w-2 bg-white/55 hover:bg-white/80"
                }`}
              />
            ))}
            {!reduced && (
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                aria-label={paused ? t("play") : t("pause")}
                className="ml-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/80 text-ink-700 hover:bg-white"
              >
                <Icon name={paused ? "play" : "pause"} size={12} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* live region — announces the active slide for screen readers */}
      <p className="sr-only" aria-live="polite">
        {t("slideOf", { current: index + 1, total: count })}
      </p>
    </section>
  );
}
