// src/components/app/public/StaffVerifyClient.tsx
// PUBLIC (no auth) underwriter (Thip) hand-off form, reached via a signed token
// link. The token is validated (mock) against the ticket's publicToken; an
// invalid/expired token shows a blocked state. On submit the ticket's thip
// fields + thipUpdatedAt are patched (localStorage, mock) and an audit entry is
// written. Read-only ticket summary; no internal credit/pricing shown.

"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icon";
import type { PolicyTicket } from "@/types/portal";
import { Input, FileUpload } from "@/components/app/form";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/app/StatusBadge";
import { policyTicketTone } from "@/components/app/admin/badges";
import { readNewTickets, readPatches, patchTicket, mockId } from "@/lib/mock/local-crm";
import { addAuditEntry } from "@/lib/mock/local-admin";

const NOTE_MAX = 2000;

export function StaffVerifyClient({
  ticketNumber,
  token,
  seedTicket,
}: {
  ticketNumber: string;
  token: string;
  seedTicket: PolicyTicket | null;
}) {
  const t = useTranslations("public.staffVerify");
  const ts = useTranslations("admin.status");
  const tc = useTranslations("admin.crm");

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

  const tokenValid = useMemo(
    () => !!ticket && token === ticket.publicToken,
    [ticket, token],
  );

  const [staffName, setStaffName] = useState("");
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  function submit() {
    if (!ticket) return;
    if (!staffName.trim()) {
      setError(t("nameRequired"));
      return;
    }
    const now = new Date().toISOString();
    patchTicket(ticket.id, {
      thipStaffName: staffName.trim(),
      thipNote: note.trim() || undefined,
      thipFile: "thip-result.zip",
      thipUpdatedAt: now,
      status: ticket.status === "sent_to_thip" ? "thip_processing" : ticket.status,
    });
    addAuditEntry({
      id: mockId("au"),
      actor: `${staffName.trim()} (${t("auditActor")})`,
      action: t("audit"),
      target: ticket.ticketNumber,
      time: now,
    });
    setDone(true);
  }

  if (!resolved) {
    return <div className="card p-8 text-center text-ink-400">{t("loading")}</div>;
  }

  if (!ticket || !tokenValid) {
    return (
      <div className="card p-8 text-center">
        <Icon name="lock" size={32} className="text-rose-500 mx-auto mb-3" />
        <h1 className="text-lg font-700 text-ink-900">{t("invalidTitle")}</h1>
        <p className="mt-1 text-sm text-ink-500">{t("invalidDesc")}</p>
        <p className="mt-2 text-xs text-ink-400 tabnum">{ticketNumber}</p>
      </div>
    );
  }

  if (done) {
    return (
      <div className="card p-8 text-center">
        <Icon name="checkCircle" size={36} className="text-mint-500 mx-auto mb-3" />
        <h1 className="text-lg font-700 text-ink-900">{t("doneTitle")}</h1>
        <p className="mt-1 text-sm text-ink-500">{t("doneDesc", { ticket: ticket.ticketNumber })}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="card p-6">
        <p className="text-xs font-600 text-ink-400 uppercase tracking-wide">{t("heading")}</p>
        <h1 className="text-2xl font-700 text-ink-900 font-display tabnum">{ticket.ticketNumber}</h1>
        <div className="mt-3">
          <StatusBadge tone={policyTicketTone[ticket.status]}>{ts(ticket.status)}</StatusBadge>
        </div>
        <dl className="mt-4 text-sm space-y-2">
          <Row label={t("product")} value={tc(`product.${ticket.product}`)} />
          <Row label={t("duration")} value={tc(`duration.${ticket.duration}`)} />
          <Row label={t("coverageStart")} value={ticket.coverageStart} />
          <Row label={t("headcount")} value={String(ticket.headcount)} />
        </dl>
      </div>

      <div className="card p-6 space-y-3">
        <h2 className="font-700 text-ink-900">{t("formTitle")}</h2>
        <Input
          label={t("staffName")}
          value={staffName}
          onChange={(e) => { setStaffName(e.target.value); setError(""); }}
          error={error || undefined}
          required
        />
        <div>
          <label className="field-label">{t("note")}</label>
          <textarea
            className="field min-h-[120px]"
            maxLength={NOTE_MAX}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <p className="mt-1 text-xs text-ink-400 tabnum text-right">{note.length} / {NOTE_MAX}</p>
        </div>
        <FileUpload
          label={t("zipUpload")}
          hint={t("zipHint")}
          buttonLabel={t("zipBtn")}
          multiple={false}
          accept=".zip,application/zip"
        />
        <Button variant="primary" size="md" className="w-full" onClick={submit}>
          <Icon name="check" size={16} /> {t("submit")}
        </Button>
      </div>
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
