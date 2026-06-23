// src/lib/mock/local-clients.ts
// Mock client-side persistence for clients created by converting a lead.
// Real backend would POST a client; here we stash in localStorage so the
// converted client shows up on /app/clients across navigation. Client-only.

import type { Client } from "@/types/portal";

export const LOCAL_CLIENTS_KEY = "tkr_local_clients";

export function readLocalClients(): Client[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_CLIENTS_KEY);
    return raw ? (JSON.parse(raw) as Client[]) : [];
  } catch {
    return [];
  }
}

export function addLocalClient(client: Client): void {
  if (typeof window === "undefined") return;
  const next = [client, ...readLocalClients().filter((c) => c.id !== client.id)];
  window.localStorage.setItem(LOCAL_CLIENTS_KEY, JSON.stringify(next));
}
