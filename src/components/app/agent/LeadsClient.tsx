"use client";

import { useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useBaht } from "@/lib/format";
import {
  getLeads,
  queryLeads,
  leadStageSummary,
  type LeadSort,
} from "@/lib/mock/seed";
import { addLocalClient } from "@/lib/mock/local-clients";
import { StatCard } from "@/components/app/StatCard";
import { Tabs } from "@/components/app/Tabs";
import { Modal } from "@/components/app/Modal";
import { FilterBar } from "@/components/app/FilterBar";
import { Input, Select } from "@/components/app/form";
import { useToast } from "@/components/app/toast";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import type { Lead, LeadStage, InsuranceType, Client } from "@/types/portal";
import { LeadsListView } from "./LeadsListView";

type TeamMember = { id: string; name: string };

const STAGES: LeadStage[] = ["new", "contacted", "quoted", "won", "lost"];
const INTERESTS: InsuranceType[] = ["worker", "auto", "travel", "health", "fire"];
const BOARD_CAP = 50; // cards rendered per column; rest reachable via the list
const PAGE_SIZE = 25;

const STAGE_BAR: Record<LeadStage, string> = {
  new: "border-l-brand-400", contacted: "border-l-gold-400", quoted: "border-l-sky-400",
  won: "border-l-emerald-400", lost: "border-l-rose-300",
};
const STAGE_DOT: Record<LeadStage, string> = {
  new: "bg-brand-500", contacted: "bg-gold-400", quoted: "bg-sky-400",
  won: "bg-emerald-500", lost: "bg-rose-400",
};

export function LeadsClient({ team }: { team: TeamMember[] }) {
  const t = useTranslations("agent");
  const tc = useTranslations("business");
  const baht = useBaht();
  const router = useRouter();
  const { toast } = useToast();

  // Working store (mock). A real backend would make queryLeads/mutations remote.
  const [leads, setLeads] = useState<Lead[]>(() => getLeads());
  const [view, setView] = useState<"board" | "list">("board");
  const [q, setQ] = useState("");
  const [stageFilter, setStageFilter] = useState<LeadStage | "all">("all");
  const [assignee, setAssignee] = useState<"all" | "self" | string>("all");
  const [sort, setSort] = useState<LeadSort>("recent");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const idRef = useRef(0);

  const assignedTo = assignee === "all" ? undefined : assignee;
  const assigneeName = (l: Lead) =>
    l.assignedTo ? team.find((m) => m.id === l.assignedTo)?.name ?? t("leads.assignSelf") : t("leads.assignSelf");

  // aggregates (server-style summary, not a loop over rendered rows)
  const summary = useMemo(
    () => leadStageSummary(leads, { q, assignedTo }),
    [leads, q, assignedTo],
  );
  const stats = useMemo(() => {
    const openStages: LeadStage[] = ["new", "contacted", "quoted"];
    return {
      open: openStages.reduce((s, st) => s + summary[st].value, 0),
      won: summary.won.value,
      total: STAGES.reduce((s, st) => s + summary[st].count, 0),
    };
  }, [summary]);

  // list page (filter + sort + paginate)
  const { rows: pageRows, total } = useMemo(
    () =>
      queryLeads(leads, {
        page,
        pageSize: PAGE_SIZE,
        q,
        stage: stageFilter === "all" ? undefined : stageFilter,
        assignedTo,
        sort,
      }),
    [leads, page, q, stageFilter, assignedTo, sort],
  );

  const current = open ? leads.find((l) => l.id === open) ?? null : null;

  // ── mutations ──
  function resetPage() { setPage(0); }
  function setStage(id: string, stage: LeadStage, notify = true) {
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, stage } : l)));
    if (notify) toast(t("leads.stageChanged"), "success");
  }
  function assign(id: string, memberId: string | undefined) {
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, assignedTo: memberId } : l)));
    toast(t("leads.assigned"), "success");
  }
  function bulkAssign(memberId: string | undefined) {
    setLeads((ls) => ls.map((l) => (selected.has(l.id) ? { ...l, assignedTo: memberId } : l)));
    setSelected(new Set());
    toast(t("leads.bulkApplied"), "success");
  }
  function bulkStage(stage: LeadStage) {
    setLeads((ls) => ls.map((l) => (selected.has(l.id) ? { ...l, stage } : l)));
    setSelected(new Set());
    toast(t("leads.bulkApplied"), "success");
  }
  function convert(l: Lead) {
    const client: Client = {
      id: `cl-${l.id}`,
      name: l.name,
      type: l.interest === "worker" ? "business" : "individual",
      policies: 1,
      premiumYtd: l.value,
      since: new Date().toISOString().slice(0, 10),
    };
    addLocalClient(client);
    setStage(l.id, "won", false);
    toast(t("leads.converted"), "success");
    setOpen(null);
    router.push("/app/clients");
  }
  const toggleSel = (id: string) =>
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const togglePage = (ids: string[], checked: boolean) =>
    setSelected((s) => {
      const next = new Set(s);
      ids.forEach((id) => (checked ? next.add(id) : next.delete(id)));
      return next;
    });

  return (
    <div className="space-y-5">
      {/* pipeline stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon="coins" label={t("leads.stats.open")} value={baht(stats.open)} />
        <StatCard icon="trophy" label={t("leads.stats.won")} value={baht(stats.won)} />
        <StatCard icon="target" label={t("leads.stats.total")} value={stats.total} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs<"board" | "list">
          tabs={[
            { key: "board", label: t("leads.viewBoard") },
            { key: "list", label: t("leads.viewList") },
          ]}
          value={view}
          onChange={setView}
        />
        <Button variant="primary" size="md" onClick={() => setCreating(true)}>
          <Icon name="plus" /> {t("leads.newLead")}
        </Button>
      </div>

      {/* shared filters */}
      <FilterBar
        search={q}
        onSearch={(v) => { setQ(v); resetPage(); }}
        placeholder={t("leads.searchPlaceholder")}
      >
        <Select
          className="w-auto"
          value={assignee}
          onChange={(e) => { setAssignee(e.target.value); resetPage(); }}
        >
          <option value="all">{t("leads.allAssignees")}</option>
          <option value="self">{t("leads.selfAssignee")}</option>
          {team.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </Select>
        {view === "list" && (
          <Select
            className="w-auto"
            value={stageFilter}
            onChange={(e) => { setStageFilter(e.target.value as LeadStage | "all"); resetPage(); }}
          >
            <option value="all">{t("leads.allStages")}</option>
            {STAGES.map((s) => (
              <option key={s} value={s}>{t(`leads.stage.${s}`)}</option>
            ))}
          </Select>
        )}
      </FilterBar>

      {view === "board" ? (
        <>
          <p className="text-xs text-ink-400 flex items-center gap-1.5">
            <Icon name="info" size={14} /> {t("leads.dragHint")}
          </p>
          <BoardView
            leads={leads}
            q={q}
            assignedTo={assignedTo}
            summary={summary}
            assigneeName={assigneeName}
            onOpen={(l) => setOpen(l.id)}
            onStage={setStage}
            onMore={(stage) => { setStageFilter(stage); setView("list"); resetPage(); }}
          />
        </>
      ) : (
        <LeadsListView
          rows={pageRows}
          total={total}
          page={page}
          pageSize={PAGE_SIZE}
          sort={sort}
          team={team}
          selected={selected}
          assigneeName={assigneeName}
          onSort={(s) => { setSort(s); resetPage(); }}
          onPage={setPage}
          onToggle={toggleSel}
          onTogglePage={togglePage}
          onOpen={(l) => setOpen(l.id)}
          onBulkAssign={bulkAssign}
          onBulkStage={bulkStage}
          onClearSel={() => setSelected(new Set())}
        />
      )}

      {/* detail */}
      <Modal
        open={current != null}
        onClose={() => setOpen(null)}
        title={t("leads.detailTitle")}
        footer={
          current && current.stage !== "lost" ? (
            <Button variant="primary" size="md" onClick={() => convert(current)}>
              <Icon name="users" /> {t("leads.convert")}
            </Button>
          ) : (
            <Button variant="ghost" size="md" onClick={() => setOpen(null)}>
              {tc("common.close")}
            </Button>
          )
        }
      >
        {current && (
          <div className="space-y-4">
            <p className="font-700 text-lg text-ink-900">{current.name}</p>
            <dl className="space-y-3 text-sm">
              {[
                [t("leads.contact"), current.contact],
                [t("leads.interest"), tc(`type.${current.interest}`)],
                [t("leads.value"), baht(current.value)],
                [t("leads.created"), current.createdDate],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <dt className="text-ink-500">{k}</dt>
                  <dd className="font-600 text-ink-900 text-right">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="grid gap-3 sm:grid-cols-2">
              <Select
                label={t("leads.stageLabel")}
                value={current.stage}
                onChange={(e) => setStage(current.id, e.target.value as LeadStage)}
              >
                {STAGES.map((s) => (
                  <option key={s} value={s}>{t(`leads.stage.${s}`)}</option>
                ))}
              </Select>
              <Select
                label={t("leads.assignTo")}
                value={current.assignedTo ?? ""}
                onChange={(e) => assign(current.id, e.target.value || undefined)}
              >
                <option value="">{t("leads.assignSelf")}</option>
                {team.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </Select>
            </div>
          </div>
        )}
      </Modal>

      {/* create */}
      <CreateLeadModal
        open={creating}
        team={team}
        onClose={() => setCreating(false)}
        onCreate={(data) => {
          const id = `lead-${idRef.current++}-${data.name.length}`;
          const today = new Date().toISOString().slice(0, 10);
          setLeads((ls) => [{ id, createdDate: today, ...data }, ...ls]);
          setCreating(false);
          toast(t("leads.added"), "success");
        }}
      />
    </div>
  );
}

// ── Board (capped per column + "+N more" → list) ──
function BoardView({
  leads, q, assignedTo, summary, assigneeName, onOpen, onStage, onMore,
}: {
  leads: Lead[];
  q: string;
  assignedTo: string | undefined;
  summary: Record<LeadStage, { count: number; value: number }>;
  assigneeName: (l: Lead) => string;
  onOpen: (l: Lead) => void;
  onStage: (id: string, stage: LeadStage) => void;
  onMore: (stage: LeadStage) => void;
}) {
  const t = useTranslations("agent");
  const tc = useTranslations("business");
  const baht = useBaht();
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<LeadStage | null>(null);

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {STAGES.map((stage) => {
        const items = queryLeads(leads, { stage, q, assignedTo, sort: "recent", page: 0, pageSize: BOARD_CAP }).rows;
        const { count, value } = summary[stage];
        const hidden = count - items.length;
        return (
          <div
            key={stage}
            onDragOver={(e) => { e.preventDefault(); if (dragOver !== stage) setDragOver(stage); }}
            onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOver(null); }}
            onDrop={(e) => {
              e.preventDefault();
              const id = e.dataTransfer.getData("text/plain");
              const lead = leads.find((l) => l.id === id);
              if (lead && lead.stage !== stage) onStage(id, stage);
              setDragOver(null);
              setDraggingId(null);
            }}
            className={cn(
              "w-72 shrink-0 rounded-2xl p-2.5 transition-colors",
              dragOver === stage ? "bg-sky-100 ring-2 ring-brand-300" : "bg-ink-50/60",
            )}
          >
            <div className="flex items-center justify-between px-1.5 py-1.5">
              <span className="flex items-center gap-2 font-600 text-ink-900 text-sm">
                <span className={cn("w-2 h-2 rounded-full", STAGE_DOT[stage])} />
                {t(`leads.stage.${stage}`)}
                <span className="chip bg-white text-ink-500 text-xs">{count}</span>
              </span>
              <span className="text-xs text-ink-400 tabnum">{baht(value)}</span>
            </div>

            <div className="space-y-2.5 min-h-[60px]">
              {items.map((l) => (
                <article
                  key={l.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", l.id);
                    e.dataTransfer.effectAllowed = "move";
                    setDraggingId(l.id);
                  }}
                  onDragEnd={() => { setDraggingId(null); setDragOver(null); }}
                  onClick={() => onOpen(l)}
                  className={cn(
                    "card p-3.5 cursor-grab active:cursor-grabbing border-l-4 hover:shadow-card-lg transition-all",
                    STAGE_BAR[l.stage],
                    draggingId === l.id && "opacity-40",
                  )}
                >
                  <p className="font-600 text-ink-900 text-sm leading-snug">{l.name}</p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className="chip bg-sky-100 text-brand-700 text-[0.7rem]">{tc(`type.${l.interest}`)}</span>
                    <span className="text-sm font-600 text-brand-700 tabnum ml-auto">{baht(l.value)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[0.7rem] text-ink-400">
                    <span className="inline-flex items-center gap-1"><Icon name="user" size={12} /> {assigneeName(l)}</span>
                    <span className="tabnum">{l.createdDate}</span>
                  </div>
                </article>
              ))}
              {count === 0 && <p className="text-xs text-ink-300 text-center py-5">{t("leads.empty")}</p>}
              {hidden > 0 && (
                <button
                  onClick={() => onMore(stage)}
                  className="w-full chip bg-white text-brand-600 hover:bg-sky-50 justify-center"
                >
                  {t("leads.moreN", { n: hidden })} · {t("leads.viewInList")}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CreateLeadModal({
  open, team, onClose, onCreate,
}: {
  open: boolean;
  team: TeamMember[];
  onClose: () => void;
  onCreate: (data: Omit<Lead, "id" | "createdDate">) => void;
}) {
  const t = useTranslations("agent");
  const tc = useTranslations("business");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [interest, setInterest] = useState<InsuranceType>("worker");
  const [value, setValue] = useState("");
  const [stage, setStage] = useState<LeadStage>("new");
  const [assignedTo, setAssignedTo] = useState("");

  function reset() {
    setName(""); setContact(""); setInterest("worker"); setValue(""); setStage("new"); setAssignedTo("");
  }
  const valid = name.trim().length > 0;

  return (
    <Modal
      open={open}
      onClose={() => { reset(); onClose(); }}
      title={t("leads.create.title")}
      footer={
        <Button
          variant="primary"
          size="md"
          disabled={!valid}
          onClick={() => {
            onCreate({
              name: name.trim(),
              contact: contact.trim(),
              interest,
              stage,
              value: Number(value) || 0,
              assignedTo: assignedTo || undefined,
            });
            reset();
          }}
        >
          {t("leads.create.submit")}
        </Button>
      }
    >
      <div className="space-y-4">
        <Input label={t("leads.create.name")} value={name} onChange={(e) => setName(e.target.value)} required />
        <Input label={t("leads.create.contact")} value={contact} onChange={(e) => setContact(e.target.value)} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Select label={t("leads.create.interest")} value={interest} onChange={(e) => setInterest(e.target.value as InsuranceType)}>
            {INTERESTS.map((i) => (
              <option key={i} value={i}>{tc(`type.${i}`)}</option>
            ))}
          </Select>
          <Input type="number" label={t("leads.create.value")} value={value} onChange={(e) => setValue(e.target.value)} />
          <Select label={t("leads.stageLabel")} value={stage} onChange={(e) => setStage(e.target.value as LeadStage)}>
            {STAGES.map((s) => (
              <option key={s} value={s}>{t(`leads.stage.${s}`)}</option>
            ))}
          </Select>
          <Select label={t("leads.assignTo")} value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
            <option value="">{t("leads.assignSelf")}</option>
            {team.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </Select>
        </div>
      </div>
    </Modal>
  );
}
