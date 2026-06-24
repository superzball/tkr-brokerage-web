// src/components/app/admin/AuditClient.tsx
// Audit log = seed entries + entries written this session (on-behalf sales,
// etc.) from localStorage, newest first.

"use client";

import { useEffect, useMemo, useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import type { AuditEntry } from "@/types/portal";
import { AdminTable, type AdminCol, type AdminRow } from "./AdminTable";
import { Icon } from "@/components/ui/Icon";
import { readLocalAudit } from "@/lib/mock/local-admin";

export function AuditClient({ seed }: { seed: AuditEntry[] }) {
  const t = useTranslations("admin.audit");
  const tf = useTranslations("admin.auditFilter");
  const format = useFormatter();

  const [local, setLocal] = useState<AuditEntry[]>([]);
  const [q, setQ] = useState("");
  useEffect(() => setLocal(readLocalAudit()), []);

  const cols: AdminCol[] = [
    { key: "time", header: t("col.time") },
    { key: "actor", header: t("col.actor") },
    { key: "action", header: t("col.action") },
    { key: "target", header: t("col.target"), kind: "mono" },
  ];

  const rows: AdminRow[] = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return [...local, ...seed]
      .filter(
        (a) =>
          !needle ||
          a.actor.toLowerCase().includes(needle) ||
          a.action.toLowerCase().includes(needle) ||
          a.target.toLowerCase().includes(needle),
      )
      .map((a) => ({
        id: a.id,
        time: format.dateTime(new Date(a.time), {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        }),
        actor: a.actor,
        action: a.action,
        target: a.target,
      }));
  }, [local, seed, q, format]);

  return (
    <>
      <div className="relative mb-4 max-w-sm">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400">
          <Icon name="search" size={16} />
        </span>
        <input
          className="field pl-9"
          placeholder={tf("search")}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <AdminTable columns={cols} rows={rows} empty={t("empty")} pageSize={15} />
    </>
  );
}
