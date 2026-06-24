// src/components/app/admin/ApprovalsClient.tsx
// KYC / agent-license approval queue. Approving an agent flips their
// licenseStatus → verified (the gate that unlocks team override income); each
// decision writes an audit entry + toast. Mock — state only.

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { DownlineMember, LicenseStatus } from "@/types/portal";
import { StatusBadge } from "@/components/app/StatusBadge";
import { EmptyState } from "@/components/app/EmptyState";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useToast } from "@/components/app/toast";
import { useSession } from "@/lib/auth/SessionProvider";
import { addAuditEntry } from "@/lib/mock/local-admin";
import { licenseTone } from "@/components/app/team/license";
import { cn } from "@/lib/cn";

export function ApprovalsClient({ initial }: { initial: DownlineMember[] }) {
  const t = useTranslations("admin.approvals");
  const tl = useTranslations("team.common");
  const { toast } = useToast();
  const user = useSession();

  const [members, setMembers] = useState<DownlineMember[]>(initial);
  const [pendingOnly, setPendingOnly] = useState(true);

  function audit(action: string, target: string) {
    addAuditEntry({
      id: `la_${Date.now()}`,
      actor: user.name,
      action,
      target,
      time: new Date().toISOString(),
    });
  }

  function setStatus(m: DownlineMember, status: LicenseStatus, msg: string, auditAction: string) {
    setMembers((prev) => prev.map((x) => (x.id === m.id ? { ...x, licenseStatus: status } : x)));
    audit(auditAction, m.licenseNo ?? m.name);
    toast(msg, status === "verified" ? "success" : "info");
  }

  const rows = pendingOnly ? members.filter((m) => m.licenseStatus !== "verified") : members;

  return (
    <>
      <div className="flex items-center justify-end mb-3">
        <label className="flex items-center gap-2 text-sm text-ink-600 cursor-pointer">
          <input
            type="checkbox"
            checked={pendingOnly}
            onChange={(e) => setPendingOnly(e.target.checked)}
            className="w-4 h-4 accent-brand-500"
          />
          {t("pendingOnly")}
        </label>
      </div>

      {rows.length === 0 ? (
        <EmptyState icon="checkCircle" title={t("empty")} />
      ) : (
        <ul className="space-y-2.5">
          {rows.map((m) => {
            const isPending = m.licenseStatus !== "verified";
            return (
              <li key={m.id} className="card p-4 flex flex-wrap items-center gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-700 text-ink-900">{m.name}</span>
                    <span className="chip bg-sky-100 text-brand-700 text-xs">{m.rank}</span>
                    <span className="chip bg-ink-50 text-ink-500 text-xs">
                      {tl("gen", { n: m.generation })}
                    </span>
                  </div>
                  <p className={cn("mt-0.5 text-xs tabnum", m.licenseNo ? "text-ink-500" : "text-rose-500")}>
                    {m.licenseNo ?? t("noLicense")} · {m.joinedDate}
                  </p>
                </div>

                <StatusBadge tone={licenseTone[m.licenseStatus]} className="text-xs">
                  {tl(m.licenseStatus)}
                </StatusBadge>

                {isPending && (
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setStatus(m, "verified", t("verified"), t("auditApprove"))}
                    >
                      <Icon name="check" size={14} /> {t("verify")}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-rose-600"
                      onClick={() => setStatus(m, "expired", t("rejected"), t("auditReject"))}
                    >
                      {t("reject")}
                    </Button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
