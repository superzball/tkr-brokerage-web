// src/lib/nav-visibility.ts
// Pure (server- and client-safe) helpers for the public-nav on/off + scheduling
// feature (NAV_VISIBILITY). No React, no window — the client hook and the admin
// screen layer persistence on top of these. Keyed by each nav entry's `key`,
// which is unique across the `publicNav` tree (top items, featured card, links).

import { publicNav } from '@/config/nav';
import type {
  MegaColumn,
  NavClosedBehavior,
  NavSetting,
  TopNavItem,
} from '@/types/portal';

/** Resolved settings keyed by nav entry `key`. */
export type NavSettingsMap = Record<string, NavSetting>;

/** Today as ISO yyyy-mm-dd — ISO dates compare lexicographically. */
export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Is a single nav entry visible right now? Absent setting = open (default). */
export function isEntryVisible(
  setting: NavSetting | undefined,
  today: string,
): boolean {
  if (!setting) return true; // default open — nothing configured
  if (setting.isOpen === false) return false;
  if (setting.startDate && today < setting.startDate) return false;
  if (setting.endDate && today > setting.endDate) return false;
  return true;
}

/** Merge seed defaults with admin overrides into a lookup keyed by entry key. */
export function buildNavSettingsMap(
  seed: NavSetting[],
  overrides: Record<string, Partial<NavSetting>> = {},
): NavSettingsMap {
  const map: NavSettingsMap = {};
  for (const s of seed) map[s.key] = { ...s };
  for (const [key, patch] of Object.entries(overrides)) {
    map[key] = { key, isOpen: true, ...map[key], ...patch };
  }
  return map;
}

/**
 * Filter the public nav tree for rendering: drop hidden top-level items, hidden
 * mega links, and hidden featured cards. A mega column whose links all vanish is
 * removed (no empty heading); a mega item left with no columns and no featured
 * is dropped entirely (unless it also has its own `href`, in which case it
 * degrades to a plain link). Never mutates the input.
 */
export function filterPublicNav(
  items: TopNavItem[],
  map: NavSettingsMap,
  today: string,
): TopNavItem[] {
  const vis = (key: string) => isEntryVisible(map[key], today);
  const out: TopNavItem[] = [];

  for (const item of items) {
    if (!vis(item.key)) continue;

    // Simple link (no dropdown) — keep as-is.
    if (!item.columns && !item.featured) {
      out.push(item);
      continue;
    }

    const columns: MegaColumn[] = (item.columns ?? [])
      .map((c) => ({ ...c, links: c.links.filter((l) => vis(l.key)) }))
      .filter((c) => c.links.length > 0);
    const featured =
      item.featured && vis(item.featured.key) ? item.featured : undefined;

    if (columns.length === 0 && !featured) {
      // Whole mega menu emptied out. Degrade to a plain link if it has an own
      // href; otherwise drop the heading (no empty group / dead layout).
      if (item.href) {
        out.push({ ...item, columns: undefined, featured: undefined });
      }
      continue;
    }

    out.push({ ...item, columns, featured });
  }

  return out;
}

// ---- admin flattening ------------------------------------------------------

export type NavEntryKind = 'top' | 'featured' | 'link';

/** One editable nav entry surfaced to the admin Navigation panel. */
export interface NavEntryMeta {
  key: string;            // i18n key under `topnav` AND the settings key
  kind: NavEntryKind;
  parentKey?: string;     // owning top-level item (for featured/link)
  columnKey?: string;     // owning mega column heading (for links)
  href?: string;          // present → route can be gated (closedBehavior)
}

/** Flatten `publicNav` into an ordered, grouped list for the admin editor. */
export function flattenPublicNav(items: TopNavItem[] = publicNav): NavEntryMeta[] {
  const out: NavEntryMeta[] = [];
  for (const item of items) {
    out.push({ key: item.key, kind: 'top', href: item.href });
    if (item.featured) {
      out.push({
        key: item.featured.key,
        kind: 'featured',
        parentKey: item.key,
        href: item.featured.href,
      });
    }
    for (const col of item.columns ?? []) {
      for (const link of col.links) {
        out.push({
          key: link.key,
          kind: 'link',
          parentKey: item.key,
          columnKey: col.key,
          href: link.href,
        });
      }
    }
  }
  return out;
}

// ---- blockRoute resolution -------------------------------------------------

/** A currently-hidden entry whose page should also be gated. */
export interface BlockedRoute {
  key: string;
  href: string;
  behavior: NavClosedBehavior;
}

/**
 * Routes to gate: entries that are NOT visible right now AND whose
 * `closedBehavior === 'blockRoute'`. Returns the hrefs so a route guard can
 * cleanly show "unavailable" instead of a raw 404.
 */
export function blockedRoutes(
  map: NavSettingsMap,
  today: string,
  items: TopNavItem[] = publicNav,
): BlockedRoute[] {
  const out: BlockedRoute[] = [];
  for (const entry of flattenPublicNav(items)) {
    if (!entry.href) continue;
    const setting = map[entry.key];
    if (!setting || setting.closedBehavior !== 'blockRoute') continue;
    if (isEntryVisible(setting, today)) continue; // still open → never gate
    out.push({ key: entry.key, href: entry.href, behavior: 'blockRoute' });
  }
  return out;
}

/** True when `pathname` (locale-stripped) is under a blocked href. */
export function isRouteBlocked(pathname: string, blocked: BlockedRoute[]): boolean {
  return blocked.some(
    (b) => b.href !== '/' && (pathname === b.href || pathname.startsWith(`${b.href}/`)),
  );
}
