// src/lib/mock/local-nav.ts
// Mock client-side persistence for public-nav visibility overrides
// (NAV_VISIBILITY). The admin Navigation panel writes a per-key patch here; the
// public Navbar merges these on top of the seed `navSettings` defaults. A real
// backend would PUT to a nav_settings table — swap-ready. Client-only.

import type { NavSetting } from "@/types/portal";

export const LOCAL_NAV_KEY = "tkr_nav_settings";

/** Read the override map: entry key → partial setting patch. */
export function readNavOverrides(): Record<string, Partial<NavSetting>> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(LOCAL_NAV_KEY);
    return raw ? (JSON.parse(raw) as Record<string, Partial<NavSetting>>) : {};
  } catch {
    return {};
  }
}

/** Merge a patch for one nav entry (keyed by its `key`) and persist. */
export function saveNavOverride(key: string, patch: Partial<NavSetting>): void {
  if (typeof window === "undefined") return;
  const all = readNavOverrides();
  all[key] = { ...all[key], ...patch };
  window.localStorage.setItem(LOCAL_NAV_KEY, JSON.stringify(all));
}
