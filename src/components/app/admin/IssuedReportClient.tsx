// src/components/app/admin/IssuedReportClient.tsx
// Issued Policies report: filter by ticket / customer / issue-date range, a
// per-ticket grouped table with selectable page size (25/50/100/200), and a
// MOCKED async CSV export (start → preparing → ready → download). Locally-issued
// policies from an Issue-Policy run are merged on top of the seed.

"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icon";
import type { IssuedPolicy, PolicyTicket } from "@/types/portal";
import { Input, Select } from "@/components/app/form";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/app/EmptyState";
import { mergeIssued } from "@/lib/mock/local-crm";
import { toCsv, downloadCsv, type ExportStatus } from "@/lib/csv";

type Customer = { id: string; name: string };
const PAGE_SIZES = [25, 50, 100, 200];

export function IssuedReportClient({
  seedIssued,
  tickets,
  customers,
  initialTicket,
}: {
  seedIssued: IssuedPolicy[];
  tickets: PolicyTicket[];
  customers: Customer[];
  initialTicket: string;
}) {
  const t = useTranslations("admin.issued");
  const tc = useTranslations("admin.crm");
  const tcommon = useTranslations("business.common");

  const [rows, setRows] = useState<IssuedPolicy[]>(seedIssued);
  useEffect(() => setRows(mergeIssued(seedIssued)), [seedIssued]);

  const [ticketQ, setTicketQ] = useState(initialTicket);
  const [customerId, setCustomerId] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(0);

  const ticketNo = (id: string) => tickets.find((tk) => tk.id === id)?.ticketNumber ?? id;
  const custName = (id: string) => customers.find((c) => c.id === id)?.name ?? id;

  const filtered = useMemo(() => {
    const q = ticketQ.trim().toLowerCase();
    return rows
      .filter((r) => {
        if (q && !ticketNo(r.ticketId).toLowerCase().includes(q) && !r.policyNumber.toLowerCase().includes(q)) return false;
        if (customerId !== "all" && r.customerId !== customerId) return false;
        if (from && r.startDate < from) return false;
        if (to && r.startDate > to) return false;
        return true;
      })
      .sort((a, b) => {
        const ta = ticketNo(a.ticketId);
        const tb = ticketNo(b.ticketId);
        return ta < tb ? 1 : ta > tb ? -1 : a.policyNumber < b.policyNumber ? -1 : 1;
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, ticketQ, customerId, from, to]);

  const groupCount = useMemo(
    () => new Set(filtered.map((r) => r.ticketId)).size,
    [filtered],
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const start = safePage * pageSize;
  const pageRows = filtered.slice(start, start + pageSize);

  useEffect(() => setPage(0), [ticketQ, customerId, from, to, pageSize]);

  // ---- mocked async CSV export ----
  const [exportStatus, setExportStatus] = useState<ExportStatus>("idle");
  const [exportUrl, setExportUrl] = useState<string>("");

  function startExport() {
    setExportStatus("preparing");
    setExportUrl("");
    // model a server-side report job: prepare, then surface a download
    setTimeout(() => {
      const csv = toCsv(
        [t("col.policyNo"), t("col.insured"), t("col.ticket"), t("col.customer"), t("col.product"), t("col.start"), t("col.expiry"), t("col.issuedAt")],
        filtered.map((r) => [
          r.policyNumber, r.insuredIdNumber, ticketNo(r.ticketId), custName(r.customerId),
          tc(`product.${r.product}`), r.startDate, r.expiryDate, r.issuedAt,
        ]),
      );
      setExportUrl(csv);
      setExportStatus("ready");
    }, 1200);
  }
  function doDownload() {
    downloadCsv(`issued-policies-${new Date().toISOString().slice(0, 10)}.csv`, exportUrl);
    setExportStatus("idle");
  }

  return (
    <div className="space-y-4">
      {/* filters */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[180px]">
          <Input label={t("filterTicket")} value={ticketQ} onChange={(e) => setTicketQ(e.target.value)} placeholder={t("filterTicketPlaceholder")} />
        </div>
        <div className="w-52">
          <Select label={t("filterCustomer")} value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
            <option value="all">{t("allCustomers")}</option>
            {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
        </div>
        <div className="w-40">
          <Input type="date" label={t("filterFrom")} value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div className="w-40">
          <Input type="date" label={t("filterTo")} value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
      </div>

      {/* summary + export */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-500">
          {t("summary", { policies: filtered.length, tickets: groupCount })}
        </p>
        <div className="flex items-center gap-2">
          {exportStatus === "idle" && (
            <Button variant="ghost" size="sm" onClick={startExport} disabled={filtered.length === 0}>
              <Icon name="download" size={16} /> {t("export")}
            </Button>
          )}
          {exportStatus === "preparing" && (
            <span className="inline-flex items-center gap-2 text-sm text-ink-500">
              <Icon name="refresh" size={16} className="animate-spin" /> {t("exportPreparing")}
            </span>
          )}
          {exportStatus === "ready" && (
            <Button variant="primary" size="sm" onClick={doDownload}>
              <Icon name="download" size={16} /> {t("exportReady")}
            </Button>
          )}
        </div>
      </div>

      {/* grouped table */}
      {filtered.length === 0 ? (
        <EmptyState title={t("empty")} />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-100 bg-sky-50/60 text-ink-600">
                  <th className="px-4 py-3 text-left font-600">{t("col.policyNo")}</th>
                  <th className="px-4 py-3 text-left font-600">{t("col.insured")}</th>
                  <th className="px-4 py-3 text-left font-600">{t("col.product")}</th>
                  <th className="px-4 py-3 text-left font-600">{t("col.start")}</th>
                  <th className="px-4 py-3 text-left font-600">{t("col.expiry")}</th>
                  <th className="px-4 py-3 text-left font-600">{t("col.issuedAt")}</th>
                  <th className="px-4 py-3 text-right font-600">{t("col.pdf")}</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((r, i) => {
                  const prev = pageRows[i - 1];
                  const newGroup = !prev || prev.ticketId !== r.ticketId;
                  return (
                    <FragmentRow
                      key={r.id}
                      row={r}
                      showGroup={newGroup}
                      ticketLabel={ticketNo(r.ticketId)}
                      custLabel={custName(r.customerId)}
                      productLabel={tc(`product.${r.product}`)}
                      groupLabel={t("ticketGroup")}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-ink-100">
            <div className="flex items-center gap-2">
              <span className="text-xs text-ink-500">{t("perPage")}</span>
              <select
                className="field h-8 py-0 w-auto text-xs"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                {PAGE_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <span className="text-xs text-ink-500 tabnum ml-2">
                {tcommon("range", { from: start + 1, to: Math.min(start + pageSize, filtered.length), total: filtered.length })}
              </span>
            </div>
            <div className="flex gap-2">
              <button type="button" disabled={safePage === 0} onClick={() => setPage((p) => p - 1)} className="btn btn-ghost btn-sm disabled:opacity-40 disabled:cursor-not-allowed">{tcommon("prev")}</button>
              <button type="button" disabled={safePage >= pageCount - 1} onClick={() => setPage((p) => p + 1)} className="btn btn-ghost btn-sm disabled:opacity-40 disabled:cursor-not-allowed">{tcommon("next")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FragmentRow({
  row, showGroup, ticketLabel, custLabel, productLabel, groupLabel,
}: {
  row: IssuedPolicy;
  showGroup: boolean;
  ticketLabel: string;
  custLabel: string;
  productLabel: string;
  groupLabel: string;
}) {
  return (
    <>
      {showGroup && (
        <tr className="bg-sky-50/40 border-b border-ink-100">
          <td colSpan={7} className="px-4 py-2">
            <span className="text-xs font-700 text-brand-700 tabnum">{groupLabel} {ticketLabel}</span>
            <span className="text-xs text-ink-500"> · {custLabel}</span>
          </td>
        </tr>
      )}
      <tr className="border-b border-ink-50 last:border-0">
        <td className="px-4 py-2.5 tabnum font-600 text-ink-900">{row.policyNumber}</td>
        <td className="px-4 py-2.5 tabnum">{row.insuredIdNumber}</td>
        <td className="px-4 py-2.5">{productLabel}</td>
        <td className="px-4 py-2.5 tabnum">{row.startDate}</td>
        <td className="px-4 py-2.5 tabnum">{row.expiryDate}</td>
        <td className="px-4 py-2.5 tabnum">{row.issuedAt}</td>
        <td className="px-4 py-2.5 text-right">
          <a href={row.pdfUrl} onClick={(e) => e.preventDefault()} className="inline-flex items-center gap-1 text-brand-600 font-600 hover:underline">
            <Icon name="download" size={14} /> PDF
          </a>
        </td>
      </tr>
    </>
  );
}
