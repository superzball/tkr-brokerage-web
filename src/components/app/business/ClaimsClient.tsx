"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useBaht } from "@/lib/format";
import { DataTable, type Column } from "@/components/app/DataTable";
import { FilterBar } from "@/components/app/FilterBar";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Stepper } from "@/components/app/Stepper";
import { Modal } from "@/components/app/Modal";
import { Input, Select, DatePicker, FileUpload } from "@/components/app/form";
import { useToast } from "@/components/app/toast";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import type { Claim, ClaimStatus } from "@/types/portal";
import { claimTone, CLAIM_TIMELINE } from "./status";

type PolicyLite = { id: string; policyNo: string };
type WorkerLite = { id: string; name: string; policyId?: string };

export function ClaimsClient({
  claims,
  policies,
  workers,
}: {
  claims: Claim[];
  policies: PolicyLite[];
  workers: WorkerLite[];
}) {
  const t = useTranslations("business");
  const baht = useBaht();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [tracking, setTracking] = useState<Claim | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);

  const policyNo = useMemo(
    () => Object.fromEntries(policies.map((p) => [p.id, p.policyNo])),
    [policies],
  );

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return claims;
    return claims.filter(
      (c) =>
        c.claimNo.toLowerCase().includes(q) ||
        c.claimant.toLowerCase().includes(q),
    );
  }, [claims, search]);

  const columns: Column<Claim>[] = [
    {
      key: "claimNo",
      header: t("claims.col.claimNo"),
      sortValue: (c) => c.claimNo,
      render: (c) => <span className="font-600 text-ink-900">{c.claimNo}</span>,
    },
    {
      key: "policy",
      header: t("claims.col.policy"),
      render: (c) => policyNo[c.policyId] ?? "—",
    },
    { key: "claimant", header: t("claims.col.claimant") },
    {
      key: "amount",
      header: t("claims.col.amount"),
      align: "right",
      sortValue: (c) => c.amount,
      render: (c) => <span className="tabnum">{baht(c.amount)}</span>,
    },
    {
      key: "submitted",
      header: t("claims.col.submitted"),
      align: "right",
      sortValue: (c) => c.submittedDate,
      render: (c) => <span className="tabnum">{c.submittedDate}</span>,
    },
    {
      key: "status",
      header: t("claims.col.status"),
      sortValue: (c) => c.status,
      render: (c) => (
        <StatusBadge tone={claimTone[c.status]}>
          {t(`claimStatus.${c.status}`)}
        </StatusBadge>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <FilterBar
        search={search}
        onSearch={setSearch}
        placeholder={t("claims.searchPlaceholder")}
      >
        <Button variant="primary" size="md" onClick={() => setWizardOpen(true)}>
          <Icon name="plus" /> {t("claims.new")}
        </Button>
      </FilterBar>

      <DataTable
        columns={columns}
        rows={rows}
        getRowKey={(c) => c.id}
        onRowClick={(c) => setTracking(c)}
        labels={{
          empty: t("claims.empty"),
          prev: t("common.prev"),
          next: t("common.next"),
          range: (from, to, total) => t("common.range", { from, to, total }),
        }}
      />

      {tracking && (
        <ClaimTracker claim={tracking} onClose={() => setTracking(null)} />
      )}

      <NewClaimWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        policies={policies}
        workers={workers}
        onSubmit={() => {
          toast(t("claims.wizard.submitted"), "success");
          setWizardOpen(false);
        }}
      />
    </div>
  );
}

// ── Status tracker (timeline) ───────────────────────────────────────────
function ClaimTracker({ claim, onClose }: { claim: Claim; onClose: () => void }) {
  const t = useTranslations("business");
  const rejected = claim.status === "rejected";
  const steps: ClaimStatus[] = rejected
    ? ["submitted", "reviewing", "rejected"]
    : CLAIM_TIMELINE;
  const currentIdx = steps.indexOf(claim.status);

  return (
    <Modal open onClose={onClose} title={t("claims.tracker.title")}>
      <div className="mb-5">
        <p className="font-600 text-ink-900">{claim.claimNo}</p>
        <p className="text-sm text-ink-500">{claim.incident}</p>
      </div>
      <ol className="space-y-0">
        {steps.map((s, i) => {
          const done = i < currentIdx;
          const on = i === currentIdx;
          const danger = s === "rejected";
          return (
            <li key={s} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white",
                    danger && on
                      ? "bg-rose-500"
                      : done
                        ? "bg-emerald-500"
                        : on
                          ? "bg-brand-500"
                          : "bg-white border-2 border-ink-100 text-ink-400",
                  )}
                >
                  {done ? (
                    <Icon name="check" size={16} />
                  ) : danger && on ? (
                    <Icon name="x" size={16} />
                  ) : (
                    <span className="text-sm font-600">{i + 1}</span>
                  )}
                </span>
                {i < steps.length - 1 && (
                  <span
                    className={cn(
                      "w-0.5 flex-1 my-1 min-h-[18px]",
                      done ? "bg-emerald-400" : "bg-ink-100",
                    )}
                  />
                )}
              </div>
              <span
                className={cn(
                  "pt-1 pb-3 text-sm",
                  on
                    ? "font-600 text-ink-900"
                    : done
                      ? "font-500 text-emerald-600"
                      : "font-500 text-ink-400",
                )}
              >
                {t(`claimStatus.${s}`)}
              </span>
            </li>
          );
        })}
      </ol>
    </Modal>
  );
}

// ── New-claim wizard ────────────────────────────────────────────────────
function NewClaimWizard({
  open,
  onClose,
  policies,
  workers,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  policies: PolicyLite[];
  workers: WorkerLite[];
  onSubmit: () => void;
}) {
  const t = useTranslations("business");
  const baht = useBaht();
  const [step, setStep] = useState(0);
  const [policyId, setPolicyId] = useState("");
  const [workerId, setWorkerId] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");

  const stepLabels = [
    t("claims.wizard.steps.who"),
    t("claims.wizard.steps.details"),
    t("claims.wizard.steps.evidence"),
    t("claims.wizard.steps.review"),
  ];
  const policyWorkers = workers.filter((w) => w.policyId === policyId);
  const policyNo = policies.find((p) => p.id === policyId)?.policyNo;
  const workerName = workers.find((w) => w.id === workerId)?.name;

  const canNext =
    step === 0 ? Boolean(policyId && workerId) : step === 1 ? Boolean(date && amount) : true;

  function reset() {
    setStep(0);
    setPolicyId("");
    setWorkerId("");
    setDate("");
    setAmount("");
    setDesc("");
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      title={t("claims.wizard.title")}
      className="max-w-2xl"
      footer={
        <>
          {step > 0 && (
            <Button variant="ghost" size="md" onClick={() => setStep((s) => s - 1)}>
              {t("common.back")}
            </Button>
          )}
          {step < 3 ? (
            <Button
              variant="primary"
              size="md"
              onClick={() => canNext && setStep((s) => s + 1)}
              className={canNext ? "" : "opacity-40 pointer-events-none"}
            >
              {t("common.next")}
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                onSubmit();
                reset();
              }}
            >
              {t("claims.wizard.submit")}
            </Button>
          )}
        </>
      }
    >
      <div className="mb-6">
        <Stepper steps={stepLabels} current={step} />
      </div>

      {step === 0 && (
        <div className="space-y-4">
          <Select
            label={t("claims.wizard.policy")}
            value={policyId}
            onChange={(e) => {
              setPolicyId(e.target.value);
              setWorkerId("");
            }}
          >
            <option value="">{t("claims.wizard.selectPolicy")}</option>
            {policies.map((p) => (
              <option key={p.id} value={p.id}>
                {p.policyNo}
              </option>
            ))}
          </Select>
          <Select
            label={t("claims.wizard.worker")}
            value={workerId}
            onChange={(e) => setWorkerId(e.target.value)}
            disabled={!policyId}
          >
            <option value="">{t("claims.wizard.selectWorker")}</option>
            {policyWorkers.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </Select>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <DatePicker
            label={t("claims.wizard.incidentDate")}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <Input
            type="number"
            label={t("claims.wizard.amount")}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <div>
            <label className="field-label">{t("claims.wizard.description")}</label>
            <textarea
              className="field"
              rows={3}
              value={desc}
              placeholder={t("claims.wizard.descriptionPlaceholder")}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <FileUpload
          label={t("claims.wizard.uploadLabel")}
          hint={t("claims.wizard.uploadHint")}
          accept=".pdf,.jpg,.jpeg,.png"
          buttonLabel={t("claims.wizard.uploadButton")}
        />
      )}

      {step === 3 && (
        <div>
          <h3 className="font-600 text-ink-900 mb-3">
            {t("claims.wizard.reviewTitle")}
          </h3>
          <dl className="space-y-2.5 text-sm">
            {[
              [t("claims.wizard.policy"), policyNo],
              [t("claims.wizard.worker"), workerName],
              [t("claims.wizard.incidentDate"), date],
              [t("claims.wizard.amount"), amount ? baht(Number(amount)) : "—"],
              [t("claims.wizard.description"), desc || "—"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4">
                <dt className="text-ink-500">{k}</dt>
                <dd className="font-600 text-ink-900 text-right">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </Modal>
  );
}
