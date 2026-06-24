// src/components/app/public/TicketCheckClient.tsx
// PUBLIC (no auth) ticket-status page. Shows ticket no + status + created date;
// a 6-digit customerCode gate (rate-limited, max 5 tries) reveals the detail and
// issued-policy PDF downloads. The internal credit wallet is NEVER shown here.
// The status link is modelled as a time-limited signed token (mock).

"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icon";
import type { PolicyTicket, IssuedPolicy } from "@/types/portal";
import { Input } from "@/components/app/form";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/app/StatusBadge";
import { policyTicketTone } from "@/components/app/admin/badges";
import { readNewTickets, readPatches, mergeIssued } from "@/lib/mock/local-crm";

const MAX_TRIES = 5;
const CONTACT_PHONE = "02-114-7777";

export function TicketCheckClient({
  ticketNumber,
  seedTicket,
  seedIssued,
}: {
  ticketNumber: string;
  seedTicket: PolicyTicket | null;
  seedIssued: IssuedPolicy[];
}) {
  const t = useTranslations("public.ticketCheck");
  const ts = useTranslations("admin.status");
  const tc = useTranslations("admin.crm");

  // resolve seed ticket (with patches) or a locally-created one, after mount
  const [ticket, setTicket] = useState<PolicyTicket | null>(seedTicket);
  const [resolved, setResolved] = useState(false);
  useEffect(() => {
    if (seedTicket) {
      const patch = readPatches()[seedTicket.id];
      setTicket(patch ? { ...seedTicket, ...patch } : seedTicket);
    } else {
      setTicket(readNewTickets().find((x) => x.ticketNumber === ticketNumber) ?? null);
    }
    setResolved(true);
  }, [seedTicket, ticketNumber]);

  const [code, setCode] = useState("");
  const [tries, setTries] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState("");

  const locked = tries >= MAX_TRIES;

  const issued = useMemo(
    () => (ticket ? mergeIssued(seedIssued).filter((p) => p.ticketId === ticket.id) : []),
    [ticket, seedIssued],
  );

  // mock time-limited token: status link "valid until" a near-future date
  const validUntil = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  }, []);

  function submit() {
    if (!ticket || locked) return;
    if (code.trim() === ticket.customerCode) {
      setUnlocked(true);
      setError("");
    } else {
      setTries((n) => n + 1);
      setError(t("wrong", { left: Math.max(0, MAX_TRIES - tries - 1) }));
    }
  }

  if (!resolved) {
    return <div className="card p-8 text-center text-ink-400">{t("loading")}</div>;
  }

  if (!ticket) {
    return (
      <div className="card p-8 text-center">
        <Icon name="alertTri" size={32} className="text-gold-500 mx-auto mb-3" />
        <h1 className="text-lg font-700 text-ink-900">{t("notFound")}</h1>
        <p className="mt-1 text-sm text-ink-500 tabnum">{ticketNumber}</p>
        <p className="mt-4 text-sm text-ink-600">{t("contactFallback", { phone: CONTACT_PHONE })}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* always-visible header (no auth required) */}
      <div className="card p-6">
        <p className="text-xs font-600 text-ink-400 uppercase tracking-wide">{t("ticketNo")}</p>
        <h1 className="text-2xl font-700 text-ink-900 font-display tabnum">{ticket.ticketNumber}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <StatusBadge tone={policyTicketTone[ticket.status]}>{ts(ticket.status)}</StatusBadge>
          <span className="text-sm text-ink-500">{t("created")}: <span className="tabnum">{ticket.createdAt}</span></span>
        </div>
        <p className="mt-3 text-xs text-ink-400">
          <Icon name="clock" size={12} className="inline -mt-0.5" /> {t("tokenNote", { date: validUntil })}
        </p>
      </div>

      {/* gate */}
      {!unlocked ? (
        <div className="card p-6">
          <h2 className="font-700 text-ink-900">{t("gateTitle")}</h2>
          <p className="mt-1 text-sm text-ink-500">{t("gateDesc")}</p>
          {locked ? (
            <div className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">
              {t("locked")}
              <div className="mt-2 text-ink-600">{t("contactFallback", { phone: CONTACT_PHONE })}</div>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              <Input
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder="••••••"
                className="tracking-[0.5em] text-center text-lg font-700"
                error={error || undefined}
              />
              <Button variant="primary" size="md" className="w-full" onClick={submit} disabled={code.length !== 6}>
                <Icon name="lock" size={16} /> {t("reveal")}
              </Button>
              <p className="text-xs text-ink-400 text-center">{t("contactFallback", { phone: CONTACT_PHONE })}</p>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="card p-6">
            <h2 className="font-700 text-ink-900 mb-3">{t("detailTitle")}</h2>
            <dl className="text-sm space-y-2">
              <Row label={t("product")} value={tc(`product.${ticket.product}`)} />
              <Row label={t("duration")} value={tc(`duration.${ticket.duration}`)} />
              <Row label={t("coverageStart")} value={ticket.coverageStart} />
              <Row label={t("headcount")} value={String(ticket.headcount)} />
              <Row label={t("status")} value={ts(ticket.status)} />
            </dl>
          </div>

          <div className="card p-6">
            <h2 className="font-700 text-ink-900 mb-3">{t("downloads")}</h2>
            {issued.length === 0 ? (
              <p className="text-sm text-ink-400">{t("noDownloads")}</p>
            ) : (
              <ul className="divide-y divide-ink-50">
                {issued.map((p) => (
                  <li key={p.id} className="flex items-center justify-between py-2.5">
                    <div>
                      <div className="font-600 text-ink-900 tabnum">{p.policyNumber}</div>
                      <div className="text-xs text-ink-400 tabnum">{p.startDate} – {p.expiryDate}</div>
                    </div>
                    <a href={p.pdfUrl} onClick={(e) => e.preventDefault()} className="btn btn-ghost btn-sm">
                      <Icon name="download" size={14} /> PDF
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-ink-500 shrink-0">{label}</span>
      <span className="font-600 text-right">{value}</span>
    </div>
  );
}
