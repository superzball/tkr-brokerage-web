// src/lib/csv.ts
// Tiny CSV builder + a mocked "async export" job. A real backend would queue a
// server-side export and hand back a signed download URL; here we build the CSV
// in-browser but model the start → preparing → ready → download lifecycle so the
// UX matches a real async report. Client-only (uses Blob / URL).

export type CsvRow = (string | number)[];

/** RFC-4180-ish: quote cells containing comma / quote / newline. */
function cell(v: string | number): string {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(headers: string[], rows: CsvRow[]): string {
  const lines = [headers, ...rows].map((r) => r.map(cell).join(","));
  // BOM so Excel opens Thai (UTF-8) correctly.
  return "﻿" + lines.join("\r\n");
}

/** Trigger a browser download of a CSV string. */
export function downloadCsv(filename: string, csv: string): void {
  if (typeof window === "undefined") return;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export type ExportStatus = "idle" | "preparing" | "ready";
