// src/lib/nav-visibility.ts
// Pure (server- and client-safe) helpers for the public-nav on/off + scheduling
// feature (NAV_VISIBILITY). No React, no window — the client hook and the admin
// screen layer persistence on top of these. Keyed by each nav entry's `key`,
// which is unique across the `publicNav` tree (top items, featured card, links).

import {
  FOOTER_COLUMNS,
  publicNav,
  publicNavActions,
  TOGGLEABLE_ACTIONS,
  type ToggleableAction,
} from '@/config/nav';
import type { FooterColumn } from '@/types';
import type {
  MegaColumn,
  NavClosedBehavior,
  NavSetting,
  TopNavItem,
} from '@/types/portal';

/** Resolved settings keyed by nav entry `key`. */
export type NavSettingsMap = Record<string, NavSetting>;

// Settings-key builders. Nav entries (top items, featured, mega links) are keyed
// by their raw `key`, so a footer link that reuses a nav key (worker, auto, …)
// shares the SAME flag and the two surfaces can never disagree. Actions and
// footer *columns* get a namespace so they never collide with a nav/link key.
export const actionSettingKey = (name: string) => `action:${name}`;
export const footerColSettingKey = (key: string) => `footerCol:${key}`;

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

/**
 * Filter footer columns for rendering, sharing the SAME settings map (and helper)
 * as the navbar so a link hidden in one surface is hidden in the other. Drops
 * hidden links; a column whose links all vanish — or whose own `footerCol:` flag
 * is off — is removed so no empty heading is left dangling. Never mutates input.
 */
export function filterFooter(
  columns: FooterColumn[],
  map: NavSettingsMap,
  today: string,
): FooterColumn[] {
  const vis = (key: string) => isEntryVisible(map[key], today);
  return columns
    .map((c) => ({ ...c, links: c.links.filter((l) => vis(l.key)) }))
    .filter((c) => vis(footerColSettingKey(c.key)) && c.links.length > 0);
}

/** Is a right-side action (renew / agent / quoteCta) visible right now? */
export function isActionVisible(
  name: string,
  map: NavSettingsMap,
  today: string,
): boolean {
  return isEntryVisible(map[actionSettingKey(name)], today);
}

// ---- admin flattening ------------------------------------------------------

export type NavEntryKind =
  | 'top'
  | 'featured'
  | 'link'
  | 'action'
  | 'footerCol'
  | 'footerLink';

/** One editable nav entry surfaced to the admin Navigation panel. */
export interface NavEntryMeta {
  key: string;            // the settings key (unique per surface entry)
  kind: NavEntryKind;
  parentKey?: string;     // owning top-level item / footer column (for children)
  columnKey?: string;     // owning mega/footer column heading (for links)
  href?: string;          // present → route can be gated (closedBehavior)
  labelNs?: 'topnav' | 'footer'; // i18n namespace for the label (default topnav)
  labelKey?: string;      // i18n key within labelNs (defaults to `key`)
}

/** Flatten `publicNav` into an ordered, grouped list for the admin editor. */
export function flattenPublicNav(items: TopNavItem[] = publicNav): NavEntryMeta[] {
  const out: NavEntryMeta[] = [];
  for (const item of items) {
    out.push({ key: item.key, kind: 'top', href: item.href, labelKey: item.key });
    if (item.featured) {
      out.push({
        key: item.featured.key,
        kind: 'featured',
        parentKey: item.key,
        href: item.featured.href,
        labelKey: item.featured.key,
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
          labelKey: link.key,
        });
      }
    }
  }
  return out;
}

/** Toggleable right-side actions, flattened for the admin editor. */
const ACTION_LABEL_KEY: Record<ToggleableAction, string> = {
  renew: 'renew',
  agent: 'agentLogin',
  quoteCta: 'getQuote',
};
export function flattenActions(): NavEntryMeta[] {
  return TOGGLEABLE_ACTIONS.map((name) => ({
    key: actionSettingKey(name),
    kind: 'action' as const,
    href: publicNavActions[name].href,
    labelNs: 'topnav' as const,
    labelKey: ACTION_LABEL_KEY[name],
  }));
}

/** Flatten footer columns + links into a grouped list for the admin editor. */
export function flattenFooter(
  columns: FooterColumn[] = FOOTER_COLUMNS,
): NavEntryMeta[] {
  const out: NavEntryMeta[] = [];
  for (const col of columns) {
    out.push({
      key: footerColSettingKey(col.key),
      kind: 'footerCol',
      labelNs: 'footer',
      labelKey: `col.${col.key}`,
    });
    for (const link of col.links) {
      out.push({
        key: link.key,
        kind: 'footerLink',
        parentKey: footerColSettingKey(col.key),
        columnKey: col.key,
        href: link.href,
        labelNs: 'footer',
        labelKey: `link.${link.key}`,
      });
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
  const all = [
    ...flattenPublicNav(items),
    ...flattenActions(),
    ...flattenFooter(),
  ];
  for (const entry of all) {
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
