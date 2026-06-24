"use client";

import { useTranslations } from "next-intl";
import { useBaht } from "@/lib/format";
import { StatusBadge, type BadgeTone } from "@/components/app/StatusBadge";
import { Select } from "@/components/app/form";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import type { Lead, LeadStage } from "@/types/portal";
import type { LeadSort } from "@/lib/mock/seed";

type TeamMember = { id: string; name: string };
const STAGES: LeadStage[] = ["new", "contacted", "quoted", "won", "lost"];
const STAGE_TONE: Record<LeadStage, BadgeTone> = {
  new: "info", contacted: "warning", quoted: "info", won: "success", lost: "danger",
};

export function LeadsListView({
  rows,
  total,
  page,
  pageSize,
  sort,
  team,
  selected,
  assigneeName,
  onSort,
  onPage,
  onToggle,
  onTogglePage,
  onOpen,
  onBulkAssign,
  onBulkStage,
  onClearSel,
}: {
  rows: Lead[];
  total: number;
  page: number;
  pageSize: number;
  sort: LeadSort;
  team: TeamMember[];
  selected: Set<string>;
  assigneeName: (l: Lead) => string;
  onSort: (s: LeadSort) => void;
  onPage: (p: number) => void;
  onToggle: (id: string) => void;
  onTogglePage: (ids: string[], checked: boolean) => void;
  onOpen: (l: Lead) => void;
  onBulkAssign: (member: string | undefined) => void;
  onBulkStage: (stage: LeadStage) => void;
  onClearSel: () => void;
}) {
  const t = useTranslations("agent");
  const tc = useTranslations("business");
  const ta = useTranslations("app");
  const baht = useBaht();

  const pageIds = rows.map((r) => r.id);
  const allChecked = rows.length > 0 && pageIds.every((id) => selected.has(id));
  const from = total === 0 ? 0 : page * pageSize + 1;
  const to = Math.min((page + 1) * pageSize, total);
  const lastPage = Math.max(0, Math.ceil(total / pageSize) - 1);

  const SORTS: LeadSort[] = ["recent", "value", "name"];

  return (
    <div className="space-y-3">
      {/* sort + bulk toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {selected.size > 0 ? (
          <div className="flex flex-wrap items-center gap-2 flex-1">
            <span className="text-sm font-600 text-ink-900">
              {t("leads.selectedN", { n: selected.size })}
            </span>
            <Select
              className="w-auto"
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) onBulkAssign(e.target.value === "self" ? undefined : e.target.value);
                e.currentTarget.value = "";
              }}
            >
              <option value="">{t("leads.bulkAssign")}</option>
              <option value="self">{t("leads.assignSelf")}</option>
              {team.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </Select>
            <Select
              className="w-auto"
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) onBulkStage(e.target.value as LeadStage);
                e.currentTarget.value = "";
              }}
            >
              <option value="">{t("leads.bulkStage")}</option>
              {STAGES.map((s) => (
                <option key={s} value={s}>{t(`leads.stage.${s}`)}</option>
              ))}
            </Select>
            <button onClick={onClearSel} className="btn btn-ghost btn-sm">
              {t("leads.clearSel")}
            </button>
          </div>
        ) : (
          <div className="flex-1" />
        )}
        <label className="flex items-center gap-2 text-sm text-ink-500">
          {t("leads.sortLabel")}
          <Select className="w-auto" value={sort} onChange={(e) => onSort(e.target.value as LeadSort)}>
            {SORTS.map((s) => (
              <option key={s} value={s}>
                {t(`leads.sort${s.charAt(0).toUpperCase()}${s.slice(1)}` as "leads.sortRecent")}
              </option>
            ))}
          </Select>
        </label>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-100 bg-sky-50/60 text-ink-600">
                <th className="px-3 py-3 w-10">
                  <input
                    type="checkbox"
                    aria-label={ta("selectPage")}
                    className="w-4 h-4 accent-brand-500"
                    checked={allChecked}
                    onChange={(e) => onTogglePage(pageIds, e.target.checked)}
                  />
                </th>
                <th className="px-4 py-3 text-left font-600">{t("leads.col.name")}</th>
                <th className="px-4 py-3 text-left font-600">{t("leads.col.contact")}</th>
                <th className="px-4 py-3 text-left font-600">{t("leads.col.interest")}</th>
                <th className="px-4 py-3 text-left font-600">{t("leads.assignee")}</th>
                <th className="px-4 py-3 text-right font-600">{t("leads.col.value")}</th>
                <th className="px-4 py-3 text-left font-600">{t("leads.col.stage")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-ink-400">
                    {t("leads.empty")}
                  </td>
                </tr>
              ) : (
                rows.map((l) => (
                  <tr
                    key={l.id}
                    className={cn(
                      "border-b border-ink-50 last:border-0 hover:bg-sky-50/70",
                      selected.has(l.id) && "bg-sky-50",
                    )}
                  >
                    <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-brand-500"
                        checked={selected.has(l.id)}
                        onChange={() => onToggle(l.id)}
                      />
                    </td>
                    <td className="px-4 py-3 cursor-pointer" onClick={() => onOpen(l)}>
                      <span className="font-600 text-ink-900">{l.name}</span>
                    </td>
                    <td className="px-4 py-3 tabnum cursor-pointer" onClick={() => onOpen(l)}>{l.contact}</td>
                    <td className="px-4 py-3 cursor-pointer" onClick={() => onOpen(l)}>{tc(`type.${l.interest}`)}</td>
                    <td className="px-4 py-3 cursor-pointer" onClick={() => onOpen(l)}>{assigneeName(l)}</td>
                    <td className="px-4 py-3 text-right tabnum cursor-pointer" onClick={() => onOpen(l)}>{baht(l.value)}</td>
                    <td className="px-4 py-3 cursor-pointer" onClick={() => onOpen(l)}>
                      <StatusBadge tone={STAGE_TONE[l.stage]}>{t(`leads.stage.${l.stage}`)}</StatusBadge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* pagination */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-ink-100">
          <span className="text-xs text-ink-500 tabnum">
            {t("leads.showing", { shown: total === 0 ? "0" : `${from}–${to}`, total })}
          </span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" disabled={page <= 0} onClick={() => onPage(page - 1)}>
              <Icon name="chevR" size={14} className="rotate-180" /> {tc("common.prev")}
            </Button>
            <Button variant="ghost" size="sm" disabled={page >= lastPage} onClick={() => onPage(page + 1)}>
              {tc("common.next")} <Icon name="chevR" size={14} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
