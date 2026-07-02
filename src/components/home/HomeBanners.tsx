// src/components/home/HomeBanners.tsx
// Home promo/campaign carousel (CMS-driven, below the hero). The TKR campaign
// artwork carries its own headline/subtext/CTA, so each slide is IMAGE-ONLY:
// the whole image is one link (accessible name = imageAlt/title) with no text
// overlay. `imageMobile` (1:1) serves narrow screens via <picture>; the wide
// 1600x500 serves sm+. Trust styling: soft shadow, ~0.875rem radius, smooth
// horizontal slide — no playful motion. Swipe on mobile; arrows + dots on
// desktop. Auto-advances with pause-on-hover/focus and a manual play/pause
// toggle; respects reduced-motion (no autoplay, instant transitions). Renders
// nothing when no slide is live (no gap). Server passes the seed actives;
// after mount we re-read admin localStorage edits (lib/mock/local-banners).

"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import type { HomeBanner } from "@/types/portal";
import { activeHomeBanners, LOCAL_BANNERS_KEY } from "@/lib/mock/local-banners";
import { AppLink } from "@/components/ui/AppLink";
import { Icon } from "@/components/ui/Icon";

const ADVANCE_MS = 6000;
const SWIPE_THRESHOLD = 40; // px

// Admin banner edits live in localStorage; subscribing via useSyncExternalStore
// keeps the server HTML on the seed actives (server snapshot = null) and swaps
// in the edited list right after hydration — plus live cross-tab updates.
const subscribeToStorage = (onChange: () => void) => {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
};

export function HomeBanners({ banners }: { banners: HomeBanner[] }) {
  const t = useTranslations("home.banners");
  const [rawIndex, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const touchX = useRef<number | null>(null);

  const localRaw = useSyncExternalStore(
    subscribeToStorage,
    () => window.localStorage.getItem(LOCAL_BANNERS_KEY),
    () => null,
  );
  const slides = useMemo(() => {
    if (!localRaw) return banners;
    try {
      const today = new Date().toISOString().slice(0, 10);
      return activeHomeBanners(JSON.parse(localRaw) as HomeBanner[], today);
    } catch {
      return banners;
    }
  }, [localRaw, banners]);

  const count = slides.length;
  const multi = count > 1;
  // clamp instead of resetting so a shrinking admin list can't strand the index
  const index = Math.min(rawIndex, Math.max(0, count - 1));

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
          {slides.map((b, i) => (
            <div
              key={b.id}
              role="group"
              aria-roledescription="slide"
              aria-label={t("slideOf", { current: i + 1, total: count })}
              aria-hidden={i !== index}
              className="relative shrink-0 basis-full"
            >
              {/* the whole image is the link — text/CTA are baked into the
                  artwork, so nothing is overlaid; the img alt names the link.
                  Slide area: 1:1 on mobile (matches imageMobile), 16:5 on sm+
                  (matches the 1600x500 wide art) — object-cover, no distortion. */}
              <AppLink
                href={b.href}
                className="block aspect-square sm:aspect-[16/5]"
                tabIndex={i === index ? undefined : -1}
              >
                <picture>
                  {b.imageMobile && (
                    <source media="(min-width: 640px)" srcSet={b.image} />
                  )}
                  <img
                    src={b.imageMobile ?? b.image}
                    alt={b.imageAlt ?? b.title}
                    loading={i === 0 ? "eager" : "lazy"}
                    draggable={false}
                    className="h-full w-full object-cover"
                  />
                </picture>
              </AppLink>
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
            {slides.map((b, i) => (
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
