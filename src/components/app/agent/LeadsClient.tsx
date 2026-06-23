"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useBaht } from "@/lib/format";
import { DataTable, type Column } from "@/components/app/DataTable";
import { StatusBadge, type BadgeTone } from "@/components/app/StatusBadge";
import { Tabs } from "@/components/app/Tabs";
import { Modal } from "@/components/app/Modal";
import { useToast } from "@/components/app/toast";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import type { Lead, LeadStage } from "@/types/portal";

const STAGES: LeadStage[] = ["new", "contacted", "quoted", "won", "lost"];
const STAGE_TONE: Record<LeadStage, BadgeTone> = {
  new: "info",
  contacted: "warning",
  quoted: "info",
  won: "success",
  lost: "danger",
};

export function LeadsClient({ leads }: { leads: Lead[] }) {
  const t = useTranslations("agent");
  const tc = useTranslations("business");
  const baht = useBaht();
  const { toast } = useToast();
  const [view, setView] = useState<"board" | "list">("board");
  const [open, setOpen] = useState<Lead | null>(null);

  const columns: Column<Lead>[] = [
    {
      key: "name",
      header: t("leads.col.name"),
      sortValue: (l) => l.name,
      render: (l) => <span className="font-600 text-ink-900">{l.name}</span>,
    },
    { key: "contact", header: t("leads.col.contact"), render: (l) => <span className="tabnum">{l.contact}</span> },
    {
      key: "interest",
      header: t("leads.col.interest"),
      render: (l) => tc(`type.${l.interest}`),
    },
    {
      key: "value",
      header: t("leads.col.value"),
      align: "right",
      sortValue: (l) => l.value,
      render: (l) => <span className="tabnum">{baht(l.value)}</span>,
    },
    {
      key: "stage",
      header: t("leads.col.stage"),
      sortValue: (l) => l.stage,
      render: (l) => (
        <StatusBadge tone={STAGE_TONE[l.stage]}>
          {t(`leads.stage.${l.stage}`)}
        </StatusBadge>
      ),
    },
    {
      key: "created",
      header: t("leads.col.created"),
      align: "right",
      sortValue: (l) => l.createdDate,
      render: (l) => <span className="tabnum">{l.createdDate}</span>,
    },
  ];

  return (
    <div className="space-y-4">
      <Tabs<"board" | "list">
        tabs={[
          { key: "board", label: t("leads.viewBoard") },
          { key: "list", label: t("leads.viewList") },
        ]}
        value={view}
        onChange={setView}
      />

      {view === "board" ? (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {STAGES.map((stage) => {
            const items = leads.filter((l) => l.stage === stage);
            return (
              <div key={stage} className="w-64 shrink-0">
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="font-600 text-ink-900 text-sm">
                    {t(`leads.stage.${stage}`)}
                  </span>
                  <span className="chip bg-ink-50 text-ink-500 text-xs">
                    {items.length}
                  </span>
                </div>
                <div className="space-y-2.5">
                  {items.map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => setOpen(l)}
                      className="w-full text-left card p-3.5 hover:border-brand-200 hover:shadow-card-lg transition-all"
                    >
                      <p className="font-600 text-ink-900 text-sm truncate">
                        {l.name}
                      </p>
                      <p className="text-xs text-ink-500 mt-0.5">
                        {tc(`type.${l.interest}`)}
                      </p>
                      <p className="text-sm font-600 text-brand-700 tabnum mt-2">
                        {baht(l.value)}
                      </p>
                    </button>
                  ))}
                  {items.length === 0 && (
                    <p className="text-xs text-ink-300 text-center py-4">
                      {t("leads.empty")}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={leads}
          getRowKey={(l) => l.id}
          onRowClick={(l) => setOpen(l)}
          labels={{
            empty: t("leads.empty"),
            prev: tc("common.prev"),
            next: tc("common.next"),
            range: (from, to, total) => tc("common.range", { from, to, total }),
          }}
        />
      )}

      <Modal
        open={open != null}
        onClose={() => setOpen(null)}
        title={t("leads.detailTitle")}
        footer={
          open && open.stage !== "lost" ? (
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                toast(t("leads.converted"), "success");
                setOpen(null);
              }}
            >
              <Icon name="users" /> {t("leads.convert")}
            </Button>
          ) : (
            <Button variant="ghost" size="md" onClick={() => setOpen(null)}>
              {tc("common.close")}
            </Button>
          )
        }
      >
        {open && (
          <div className="space-y-4">
            <p className="font-700 text-lg text-ink-900">{open.name}</p>
            <dl className="space-y-3 text-sm">
              {[
                [t("leads.contact"), open.contact],
                [t("leads.interest"), tc(`type.${open.interest}`)],
                [t("leads.value"), baht(open.value)],
                [t("leads.created"), open.createdDate],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <dt className="text-ink-500">{k}</dt>
                  <dd className="font-600 text-ink-900 text-right">{v}</dd>
                </div>
              ))}
              <div className={cn("flex justify-between gap-4 pt-1")}>
                <dt className="text-ink-500">{t("leads.stageLabel")}</dt>
                <dd>
                  <StatusBadge tone={STAGE_TONE[open.stage]}>
                    {t(`leads.stage.${open.stage}`)}
                  </StatusBadge>
                </dd>
              </div>
            </dl>
          </div>
        )}
      </Modal>
    </div>
  );
}
