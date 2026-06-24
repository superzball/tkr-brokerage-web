// src/components/app/admin/AgentsClient.tsx
// Agents list with a performance modal + license verify action. Verifying flips
// licenseStatus → verified (unlocks override), writes audit, toast. Mock.

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { DownlineMember } from "@/types/portal";
import { DataTable, type Column } from "@/components/app/DataTable";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Modal } from "@/components/app/Modal";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useToast } from "@/components/app/toast";
import { useSession } from "@/lib/auth/SessionProvider";
import { useBaht } from "@/lib/format";
import { addAuditEntry } from "@/lib/mock/local-admin";
import { licenseTone } from "@/components/app/team/license";

export function AgentsClient({
  initial,
  overrides,
}: {
  initial: DownlineMember[];
  overrides: Record<string, number>;
}) {
  const t = useTranslations("admin.agents");
  const ta = useTranslations("admin.agentsActions");
  const tl = useTranslations("team.common");
  const tcommon = useTranslations("business.common");
  const { toast } = useToast();
  const me = useSession();
  const baht = useBaht();

  const [members, setMembers] = useState<DownlineMember[]>(initial);
  const [active, setActive] = useState<DownlineMember | null>(null);

  function verify(m: DownlineMember) {
    setMembers((prev) => prev.map((x) => (x.id === m.id ? { ...x, licenseStatus: "verified" } : x)));
    addAuditEntry({ id: `la_${Date.now()}`, actor: me.name, action: ta("auditVerify"), target: m.licenseNo ?? m.name, time: new Date().toISOString() });
    toast(ta("verifyDone"), "success");
    setActive((a) => (a && a.id === m.id ? { ...a, licenseStatus: "verified" } : a));
  }

  const columns: Column<DownlineMember>[] = [
    { key: "name", header: t("col.name"), sortValue: (m) => m.name },
    { key: "rank", header: t("col.rank"), sortValue: (m) => m.rank },
    { key: "license", header: t("col.license"), render: (m) => <StatusBadge tone={licenseTone[m.licenseStatus]}>{tl(m.licenseStatus)}</StatusBadge> },
    { key: "teamSize", header: t("col.teamSize"), align: "right", sortValue: (m) => m.directs, render: (m) => <span className="tabnum">{m.directs}</span> },
    { key: "teamGwp", header: t("col.teamGwp"), align: "right", sortValue: (m) => m.personalGwp, render: (m) => <span className="tabnum">{baht(m.personalGwp)}</span> },
    { key: "override", header: t("col.override"), align: "right", sortValue: (m) => overrides[m.name] ?? 0, render: (m) => <span className="tabnum">{baht(overrides[m.name] ?? 0)}</span> },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        rows={members}
        pageSize={15}
        getRowKey={(m) => m.id}
        onRowClick={(m) => setActive(m)}
        labels={{
          empty: t("empty"),
          prev: tcommon("prev"),
          next: tcommon("next"),
          range: (from, to, total) => tcommon("range", { from, to, total }),
        }}
      />

      <Modal open={active !== null} onClose={() => setActive(null)} title={active ? `${ta("modalTitle")} · ${active.name}` : ""}>
        {active && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="chip bg-sky-100 text-brand-700 text-xs">{active.rank}</span>
              <StatusBadge tone={licenseTone[active.licenseStatus]} className="text-xs">{tl(active.licenseStatus)}</StatusBadge>
              <span className="text-xs text-ink-400 tabnum ml-auto">{active.licenseNo ?? "—"}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Stat label={ta("directs")} value={String(active.directs)} />
              <Stat label={ta("teamSize")} value={String(active.directs)} />
              <Stat label={ta("personalGwp")} value={baht(active.personalGwp)} />
              <Stat label={ta("override")} value={baht(overrides[active.name] ?? 0)} />
            </div>
            {active.licenseStatus !== "verified" && (
              <Button variant="primary" size="sm" onClick={() => verify(active)}>
                <Icon name="check" size={14} /> {t("verify")}
              </Button>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-ink-100 p-3">
      <p className="text-xs text-ink-500">{label}</p>
      <p className="mt-1 text-lg font-700 text-ink-900 tabnum">{value}</p>
    </div>
  );
}
