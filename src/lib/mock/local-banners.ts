// src/lib/mock/local-banners.ts
// Mock client-side persistence for the home-banner CMS. The admin Banners panel
// writes the FULL banner list here (CRUD, not per-key patches); the home
// carousel re-reads it after mount so admin edits show up without a deploy.
// A real backend would PUT to a home_banners table — swap-ready. The pure
// helpers (isBannerLive / activeHomeBanners) are also used by seed.ts on the
// server, so they must stay window-free.

import type { HomeBanner } from "@/types/portal";

export const LOCAL_BANNERS_KEY = "tkr_home_banners";

/** True when active AND today within [startDate, endDate] (ISO dates compare
 *  lexicographically). Pass `today` so server/client agree on the clock. */
export function isBannerLive(b: HomeBanner, today: string): boolean {
  return b.active && b.startDate <= today && today <= b.endDate;
}

/** Slides the home carousel should render: live only, ascending sortOrder.
 *  Returns [] when nothing is live (home renders nothing — no gap). */
export function activeHomeBanners(list: HomeBanner[], today: string): HomeBanner[] {
  return list
    .filter((b) => isBannerLive(b, today))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

/** Read the admin-edited banner list, or null when no edits were saved yet
 *  (callers fall back to the seed). */
export function readLocalHomeBanners(): HomeBanner[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LOCAL_BANNERS_KEY);
    return raw ? (JSON.parse(raw) as HomeBanner[]) : null;
  } catch {
    return null;
  }
}

/** Persist the full banner list (admin CRUD writes through here). */
export function saveLocalHomeBanners(list: HomeBanner[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOCAL_BANNERS_KEY, JSON.stringify(list));
}
