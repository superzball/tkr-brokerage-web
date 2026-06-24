// src/components/app/admin/SupportClient.tsx
// Support ticket desk: list + a detail modal with a mock reply and a status
// change (open/pending/resolved). State + toast. Mock.

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { SupportTicket, TicketStatus } from "@/types/portal";
import { DataTable, type Column } from "@/components/app/DataTable";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Modal } from "@/components/app/Modal";
import { Select, Field } from "@/components/app/form";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/app/toast";
import { ticketTone, priorityTone } from "./badges";

const STATUSES: TicketStatus[] = ["open", "pending", "resolved"];

export function SupportClient({ initial }: { initial: SupportTicket[] }) {
  const t = useTranslations("admin.tickets");
  const ta = useTranslations("admin.supportActions");
  const ts = useTranslations("admin.status");
  const tcommon = useTranslations("business.common");
  const { toast } = useToast();

  const [list, setList] = useState<SupportTicket[]>(initial);
  const [active, setActive] = useState<SupportTicket | null>(null);
  const [reply, setReply] = useState("");

  function setStatus(status: TicketStatus) {
    if (!active) return;
    setActive({ ...active, status });
    setList((prev) => prev.map((x) => (x.id === active.id ? { ...x, status } : x)));
    toast(ta("statusUpdated"), "success");
  }
  function send() {
    if (!reply.trim()) return;
    toast(ta("sent"), "success");
    setReply("");
    setActive(null);
  }

  const columns: Column<SupportTicket>[] = [
    { key: "ref", header: t("col.ref"), sortValue: (k) => k.ref, render: (k) => <span className="tabnum">{k.ref}</span> },
    { key: "customer", header: t("col.customer"), sortValue: (k) => k.customer },
    { key: "subject", header: t("col.subject") },
    { key: "priority", header: t("col.priority"), render: (k) => <StatusBadge tone={priorityTone[k.priority]}>{ts(k.priority)}</StatusBadge> },
    { key: "status", header: t("col.status"), sortValue: (k) => k.status, render: (k) => <StatusBadge tone={ticketTone[k.status]}>{ts(k.status)}</StatusBadge> },
    { key: "updated", header: t("col.updated"), render: (k) => k.updatedAt },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        rows={list}
        getRowKey={(k) => k.id}
        onRowClick={(k) => { setActive(k); setReply(""); }}
        labels={{
          empty: t("empty"),
          prev: tcommon("prev"),
          next: tcommon("next"),
          range: (from, to, total) => tcommon("range", { from, to, total }),
        }}
      />

      <Modal
        open={active !== null}
        onClose={() => setActive(null)}
        title={active ? `${ta("modalTitle")} · ${active.ref}` : ""}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setActive(null)}>{tcommon("close")}</Button>
            <Button variant="primary" size="sm" onClick={send}>{ta("send")}</Button>
          </>
        }
      >
        {active && (
          <div className="space-y-4">
            <div className="rounded-xl border border-ink-100 p-3 text-sm space-y-1.5">
              <div className="flex justify-between gap-3"><span className="text-ink-500">{ta("customer")}</span><span className="font-600">{active.customer}</span></div>
              <div className="flex justify-between gap-3"><span className="text-ink-500">{ta("subject")}</span><span className="font-600 text-right">{active.subject}</span></div>
              <div className="flex justify-between gap-3 items-center"><span className="text-ink-500">{ta("priority")}</span><StatusBadge tone={priorityTone[active.priority]}>{ts(active.priority)}</StatusBadge></div>
            </div>

            <Select label={ta("setStatus")} value={active.status} onChange={(e) => setStatus(e.target.value as TicketStatus)}>
              {STATUSES.map((s) => <option key={s} value={s}>{ts(s)}</option>)}
            </Select>

            <Field label={ta("reply")}>
              <textarea
                className="field min-h-[90px]"
                placeholder={ta("replyPlaceholder")}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
              />
            </Field>
          </div>
        )}
      </Modal>
    </>
  );
}
