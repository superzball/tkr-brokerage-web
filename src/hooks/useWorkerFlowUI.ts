// src/hooks/useWorkerFlowUI.ts
// Client hook bridging the seed worker-flow UI defaults with the admin's
// localStorage overrides (WORKER_FLOW_UI). Mirrors useNavVisibility: SSR and
// the hydration render use seed defaults only (server/client markup agree),
// then the client snapshot (defaults + overrides) takes over after hydration.

"use client";

import { useSyncExternalStore } from "react";
import { getWorkerFlowUI } from "@/lib/mock/seed";
import {
  LOCAL_WORKER_FLOW_KEY,
  readWorkerFlowOverrides,
} from "@/lib/mock/local-worker-flow";
import type { WorkerFlowUI } from "@/types";

// Server / hydration snapshot: seed defaults, stable reference.
const SERVER_SNAPSHOT: WorkerFlowUI = { ...getWorkerFlowUI() };

// Client snapshot cached by the raw override string, so getSnapshot returns a
// stable reference until localStorage actually changes.
let clientCache: { raw: string; snap: WorkerFlowUI } | null = null;

function getClientSnapshot(): WorkerFlowUI {
  const raw = window.localStorage.getItem(LOCAL_WORKER_FLOW_KEY) ?? "";
  if (clientCache && clientCache.raw === raw) return clientCache.snap;
  const snap: WorkerFlowUI = {
    ...getWorkerFlowUI(),
    ...readWorkerFlowOverrides(),
  };
  clientCache = { raw, snap };
  return snap;
}

function subscribe(cb: () => void): () => void {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}

/** Resolved worker purchase-flow UI toggles (seed defaults + admin overrides). */
export function useWorkerFlowUI(): WorkerFlowUI {
  return useSyncExternalStore(subscribe, getClientSnapshot, () => SERVER_SNAPSHOT);
}
