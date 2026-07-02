// src/hooks/useNavVisibility.ts
// Client hooks bridging the seed nav-visibility defaults with the admin's
// localStorage overrides (NAV_VISIBILITY). Uses useSyncExternalStore so SSR and
// the hydration render use seed defaults only (server/client markup agree), then
// the client snapshot (defaults + overrides + today) takes over after hydration.

"use client";

import { useMemo, useSyncExternalStore } from "react";
import { FOOTER_COLUMNS, publicNav } from "@/config/nav";
import { getNavSettings } from "@/lib/mock/seed";
import { LOCAL_NAV_KEY, readNavOverrides } from "@/lib/mock/local-nav";
import {
  blockedRoutes,
  buildNavSettingsMap,
  filterFooter,
  filterPublicNav,
  isEntryVisible,
  isRouteBlocked,
  todayISO,
  type NavSettingsMap,
} from "@/lib/nav-visibility";
import type { FooterColumn } from "@/types";
import type { TopNavItem } from "@/types/portal";

type Snapshot = { map: NavSettingsMap; today: string };

// Server / hydration snapshot: seed defaults only, no date filtering. A stable
// reference so useSyncExternalStore never loops.
const SERVER_SNAPSHOT: Snapshot = {
  map: buildNavSettingsMap(getNavSettings()),
  today: "0000-00-00",
};

// Client snapshot cached by the raw override string, so getSnapshot returns a
// stable reference until localStorage actually changes.
let clientCache: { raw: string; snap: Snapshot } | null = null;

function getClientSnapshot(): Snapshot {
  const raw = window.localStorage.getItem(LOCAL_NAV_KEY) ?? "";
  if (clientCache && clientCache.raw === raw) return clientCache.snap;
  const snap: Snapshot = {
    map: buildNavSettingsMap(getNavSettings(), readNavOverrides()),
    today: todayISO(),
  };
  clientCache = { raw, snap };
  return snap;
}

function subscribe(cb: () => void): () => void {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}

function useNavSnapshot(): Snapshot {
  return useSyncExternalStore(subscribe, getClientSnapshot, () => SERVER_SNAPSHOT);
}

/** The public nav tree with hidden/expired items (and empty columns) removed. */
export function useVisiblePublicNav(): TopNavItem[] {
  const { map, today } = useNavSnapshot();
  return useMemo(() => filterPublicNav(publicNav, map, today), [map, today]);
}

/** Footer columns/links with hidden ones (and emptied columns) removed — shares
 *  the same settings as the navbar, so the two surfaces stay in sync. */
export function useVisibleFooterColumns(): FooterColumn[] {
  const { map, today } = useNavSnapshot();
  return useMemo(() => filterFooter(FOOTER_COLUMNS, map, today), [map, today]);
}

/** A predicate `(settingsKey) => boolean` for gating individual entries such as
 *  the right-side actions (see `actionSettingKey`). */
export function useNavEntryVisible(): (key: string) => boolean {
  const { map, today } = useNavSnapshot();
  return useMemo(
    () => (key: string) => isEntryVisible(map[key], today),
    [map, today],
  );
}

/** Whether the current (locale-stripped) pathname is a `blockRoute`-gated page. */
export function useRouteBlocked(pathname: string): boolean {
  const { map, today } = useNavSnapshot();
  return useMemo(
    () => isRouteBlocked(pathname, blockedRoutes(map, today)),
    [pathname, map, today],
  );
}
