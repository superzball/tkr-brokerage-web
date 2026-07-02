// src/lib/mock/local-worker-flow.ts
// Mock client-side persistence for the worker purchase-flow UI toggles
// (WORKER_FLOW_UI). The admin Settings panel writes a partial patch here; the
// worker flow merges it on top of the seed `workerFlowUI` defaults. A real
// backend would PUT to a settings table — swap-ready. Client-only.

import type { WorkerFlowUI } from "@/types";

export const LOCAL_WORKER_FLOW_KEY = "tkr_worker_flow_ui";

/** Read the stored override patch (empty when nothing was edited). */
export function readWorkerFlowOverrides(): Partial<WorkerFlowUI> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(LOCAL_WORKER_FLOW_KEY);
    return raw ? (JSON.parse(raw) as Partial<WorkerFlowUI>) : {};
  } catch {
    return {};
  }
}

/** Merge a patch into the stored overrides and persist. */
export function saveWorkerFlowOverride(patch: Partial<WorkerFlowUI>): void {
  if (typeof window === "undefined") return;
  const next = { ...readWorkerFlowOverrides(), ...patch };
  window.localStorage.setItem(LOCAL_WORKER_FLOW_KEY, JSON.stringify(next));
}
