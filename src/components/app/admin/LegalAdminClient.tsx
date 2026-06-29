// src/components/app/admin/LegalAdminClient.tsx
// Admin legal & PDPA console (Phase 21, superadmin). Three tabs: policy versions
// (with effective dates), the consent audit (seed + consents captured this
// session, merged), and the data-subject-request queue. Publishing a version
// writes to the shared audit log so it also shows in /admin/audit.

"use client";

import { useMemo, useState, useEffect } from "react";
import { useFormatter, useTranslations } from "next-intl";
import type {
  LegalPolicy,
  ConsentRecord,
  DataSubjectRequest,
  LegalPolicyKind,
} from "@/types/portal";
import { Tabs } from "@/components/app/Tabs";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { AdminTable, type AdminCol, type AdminRow, type Badge } from "./AdminTable";
import { useToast } from "@/components/app/toast";
import { useSession } from "@/lib/auth/SessionProvider";
import { addAuditEntry } from "@/lib/mock/local-admin";
import { readLocalConsents } from "@/lib/legal/consent";
import type { BadgeTone } from "@/components/app/StatusBadge";

type Tab = "policies" | "consents" | "requests";

export function LegalAdminClient({
  policies,
  consents,
  requests,
}: {
  policies: LegalPolicy[];
  consents: ConsentRecord[];
  requests: DataSubjectRequest[];
}) {
  const t = useTranslations("admin.legal");
  const format = useFormatter();
  const me = useSession();
  const { toast } = useToast();

  const [tab, setTab] = useState<Tab>("policies");
  const [localConsents, setLocalConsents] = useState<ConsentRecord[]>([]);
  useEffect(() => setLocalConsents(readLocalConsents()), []);

  // ---- policies ----
  const policyCols: AdminCol[] = [
    { key: "kind", header: t("col.kind") },
    { key: "version", header: t("col.version"), kind: "mono" },
    { key: "effectiveDate", header: t("col.effective") },
    { key: "status", header: t("col.status"), kind: "badge" },
    { key: "summary", header: t("col.summary") },
  ];
  const policyRows: AdminRow[] = policies.map((p) => ({
    id: p.id,
    kind: t(`kind.${p.kind}`),
    version: p.version,
    effectiveDate: p.effectiveDate,
    status: {
      label: t(`policyStatus.${p.status}`),
      tone: p.status === "published" ? "success" : "neutral",
    } as Badge,
    summary: p.summary,
  }));

  function publishVersion(kind: LegalPolicyKind) {
    addAuditEntry({
      id: `la_${Date.now()}`,
      actor: me.name,
      action: t("auditPublish", { kind: t(`kind.${kind}`) }),
      target: `${kind} ${t("draftTag")}`,
      time: new Date().toISOString(),
    });
    toast(t("publishedToast"), "success");
  }

  // ---- consent audit (seed + this session, newest first) ----
  const consentCols: AdminCol[] = [
    { key: "time", header: t("col.time") },
    { key: "subject", header: t("col.subject"), kind: "mono" },
    { key: "type", header: t("col.type") },
    { key: "granted", header: t("col.granted"), kind: "badge" },
    { key: "version", header: t("col.version"), kind: "mono" },
    { key: "source", header: t("col.source") },
  ];
  const consentRows: AdminRow[] = useMemo(
    () =>
      [...localConsents, ...consents]
        .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))
        .map((c) => ({
          id: c.id,
          time: format.dateTime(new Date(c.timestamp), {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          }),
          subject: c.subjectId,
          type: t(`consentType.${c.type}`),
          granted: {
            label: c.granted ? t("granted") : t("withdrawn"),
            tone: c.granted ? "success" : "danger",
          } as Badge,
          version: c.policyVersion,
          source: t(`source.${c.source}`),
        })),
    [localConsents, consents, format, t],
  );

  // ---- data-subject requests ----
  const dsrTone: Record<DataSubjectRequest["status"], BadgeTone> = {
    new: "info",
    in_progress: "warning",
    resolved: "success",
    rejected: "danger",
  };
  const requestCols: AdminCol[] = [
    { key: "ref", header: t("col.ref"), kind: "mono" },
    { key: "subject", header: t("col.subject") },
    { key: "contact", header: t("col.contact") },
    { key: "kind", header: t("col.requestKind") },
    { key: "status", header: t("col.status"), kind: "badge" },
    { key: "createdAt", header: t("col.created") },
  ];
  const requestRows: AdminRow[] = requests.map((r) => ({
    id: r.id,
    ref: r.ref,
    subject: r.subject,
    contact: r.contact,
    kind: t(`requestKind.${r.kind}`),
    status: { label: t(`requestStatus.${r.status}`), tone: dsrTone[r.status] } as Badge,
    createdAt: r.createdAt,
  }));

  return (
    <>
      <Tabs
        className="mb-5"
        value={tab}
        onChange={setTab}
        tabs={[
          { key: "policies", label: t("tab.policies") },
          { key: "consents", label: t("tab.consents") },
          { key: "requests", label: t("tab.requests") },
        ]}
      />

      {tab === "policies" && (
        <>
          <div className="mb-4 flex flex-wrap gap-2">
            {(["privacy", "terms", "cookies"] as LegalPolicyKind[]).map((k) => (
              <Button key={k} variant="ghost" size="sm" onClick={() => publishVersion(k)}>
                <Icon name="plus" size={15} /> {t("publish", { kind: t(`kind.${k}`) })}
              </Button>
            ))}
          </div>
          <AdminTable columns={policyCols} rows={policyRows} empty={t("empty")} pageSize={10} />
        </>
      )}

      {tab === "consents" && (
        <AdminTable columns={consentCols} rows={consentRows} empty={t("empty")} pageSize={15} />
      )}

      {tab === "requests" && (
        <AdminTable columns={requestCols} rows={requestRows} empty={t("empty")} pageSize={10} />
      )}
    </>
  );
}
