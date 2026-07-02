// src/components/app/admin/NavigationClient.tsx
// Admin CMS — public top-nav visibility (NAV_VISIBILITY). Toggle any menu entry
// (top item, featured card, or mega link) on/off without a deploy, with optional
// start/end scheduling and a per-route "unavailable" gate. Mirrors the banners/
// coupons pattern: seed defaults + localStorage overrides, toast + audit on save.

"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { NavClosedBehavior, NavSetting } from "@/types/portal";
import type { NavEntryMeta } from "@/lib/nav-visibility";
import {
  buildNavSettingsMap,
  isEntryVisible,
  todayISO,
} from "@/lib/nav-visibility";
import { readNavOverrides, saveNavOverride } from "@/lib/mock/local-nav";
import { addAuditEntry } from "@/lib/mock/local-admin";
import { useSession } from "@/lib/auth/SessionProvider";
import { StatusBadge } from "@/components/app/StatusBadge";
import { DatePicker, Select } from "@/components/app/form";
import { Icon } from "@/components/ui/Icon";
import { useToast } from "@/components/app/toast";
import { cn } from "@/lib/cn";

type T = (key: string) => string;

function Toggle({ on, onToggle, label }: { on: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onToggle}
      className={cn(
        "relative w-12 h-7 rounded-full transition-colors shrink-0",
        on ? "bg-brand-500" : "bg-ink-200",
      )}
    >
      <span
        className={cn(
          "absolute top-1 w-5 h-5 rounded-full bg-white transition-transform",
          on ? "translate-x-6" : "translate-x-1",
        )}
      />
    </button>
  );
}

export function NavigationClient({
  entries,
  actions = [],
  footer = [],
  seed,
}: {
  entries: NavEntryMeta[];
  actions?: NavEntryMeta[];
  footer?: NavEntryMeta[];
  seed: NavSetting[];
}) {
  const t = useTranslations("admin.navigation");
  const tn = useTranslations("topnav") as unknown as T;
  const tf = useTranslations("footer") as unknown as T;
  const { toast } = useToast();
  const user = useSession();
  const today = todayISO();

  // Resolve a row label from its declared namespace (topnav by default; footer
  // links/columns carry labelNs='footer').
  const labelOf = (entry: NavEntryMeta): string => {
    const key = entry.labelKey ?? entry.key;
    return entry.labelNs === "footer" ? tf(key) : tn(key);
  };

  // Resolved settings, keyed by entry key: seed defaults + any stored overrides.
  const [settings, setSettings] = useState<Record<string, NavSetting>>(() =>
    buildNavSettingsMap(seed, readNavOverrides()),
  );
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  // Group a flat entry list under its header rows (top items / footer columns),
  // in order. Rows before the first header (none, in practice) are ignored.
  const group = (list: NavEntryMeta[], isHeader: (e: NavEntryMeta) => boolean) => {
    const out: { top: NavEntryMeta; children: NavEntryMeta[] }[] = [];
    for (const e of list) {
      if (isHeader(e)) out.push({ top: e, children: [] });
      else out[out.length - 1]?.children.push(e);
    }
    return out;
  };
  const groups = useMemo(() => group(entries, (e) => e.kind === "top"), [entries]);
  const footerGroups = useMemo(
    () => group(footer, (e) => e.kind === "footerCol"),
    [footer],
  );

  function settingFor(key: string): NavSetting {
    return settings[key] ?? { key, isOpen: true };
  }

  function patch(entry: NavEntryMeta, next: Partial<NavSetting>) {
    const merged: NavSetting = { ...settingFor(entry.key), ...next };
    setSettings((prev) => ({ ...prev, [entry.key]: merged }));
    saveNavOverride(entry.key, next);
    return merged;
  }

  function audit(action: string, target: string) {
    addAuditEntry({
      id: `nav_${Date.now()}`,
      actor: user.name,
      action,
      target,
      time: new Date().toISOString(),
    });
  }

  function toggleOpen(entry: NavEntryMeta) {
    const next = !settingFor(entry.key).isOpen;
    patch(entry, { isOpen: next });
    audit(next ? t("auditShown") : t("auditHidden"), entry.key);
    toast(next ? t("shown") : t("hidden"), "info");
  }

  function setDate(entry: NavEntryMeta, field: "startDate" | "endDate", value: string) {
    patch(entry, { [field]: value || undefined });
    audit(t("auditScheduled"), entry.key);
  }

  function setBehavior(entry: NavEntryMeta, value: NavClosedBehavior) {
    patch(entry, { closedBehavior: value });
    audit(t("auditBehavior"), entry.key);
  }

  function toggleExpand(key: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function statusOf(key: string): { tone: "success" | "neutral" | "warning"; label: string } {
    const s = settingFor(key);
    if (!s.isOpen) return { tone: "neutral", label: t("stHidden") };
    if (!isEntryVisible(s, today)) return { tone: "warning", label: t("stScheduled") };
    return { tone: "success", label: t("stOpen") };
  }

  function Row({ entry }: { entry: NavEntryMeta }) {
    const s = settingFor(entry.key);
    const st = statusOf(entry.key);
    const isChild =
      entry.kind === "link" ||
      entry.kind === "featured" ||
      entry.kind === "footerLink";
    const label = labelOf(entry);
    const open = expanded.has(entry.key);
    return (
      <div className={cn("py-2", isChild && "pl-4 border-l-2 border-ink-50 ml-1")}>
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-600 text-ink-900 truncate">{label}</span>
              {entry.kind === "featured" && (
                <span className="text-[0.62rem] font-700 uppercase tracking-wide text-brand-600">
                  {t("kindFeatured")}
                </span>
              )}
            </div>
            {entry.href && <p className="text-xs text-ink-400 truncate">{entry.href}</p>}
          </div>
          <StatusBadge tone={st.tone}>{st.label}</StatusBadge>
          <button
            type="button"
            onClick={() => toggleExpand(entry.key)}
            aria-label={t("schedule")}
            aria-expanded={open}
            className="w-8 h-8 rounded-lg text-ink-400 hover:bg-sky-100 flex items-center justify-center shrink-0"
          >
            <Icon name="calendar" size={16} />
          </button>
          <Toggle on={s.isOpen} onToggle={() => toggleOpen(entry)} label={label} />
        </div>

        {open && (
          <div className="mt-3 grid gap-3 sm:grid-cols-3 rounded-xl bg-sky-50/60 p-3">
            <DatePicker
              label={t("startDate")}
              value={s.startDate ?? ""}
              onChange={(e) => setDate(entry, "startDate", e.target.value)}
            />
            <DatePicker
              label={t("endDate")}
              value={s.endDate ?? ""}
              onChange={(e) => setDate(entry, "endDate", e.target.value)}
            />
            {entry.href && (
              <Select
                label={t("closedBehavior")}
                value={s.closedBehavior ?? "hide"}
                onChange={(e) => setBehavior(entry, e.target.value as NavClosedBehavior)}
              >
                <option value="hide">{t("behaviorHide")}</option>
                <option value="blockRoute">{t("behaviorBlock")}</option>
              </Select>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 rounded-xl bg-gold-50 border border-gold-100 px-4 py-2.5 flex items-center gap-2 text-xs text-gold-700">
        <Icon name="info" size={14} />
        {t("hint")}
      </div>

      <div className="space-y-4">
        {groups.map(({ top, children }) => (
          <section key={top.key} className="card p-5">
            <Row entry={top} />
            {children.length > 0 && (
              <div className="mt-1 divide-y divide-ink-50">
                {children.map((c, i) => (
                  <Row key={`${c.key}-${i}`} entry={c} />
                ))}
              </div>
            )}
          </section>
        ))}
      </div>

      {actions.length > 0 && (
        <div className="mt-8 space-y-4">
          <h2 className="text-sm font-700 uppercase tracking-wide text-ink-500">
            {t("sectionActions")}
          </h2>
          <section className="card p-5 divide-y divide-ink-50">
            {actions.map((a, i) => (
              <Row key={`${a.key}-${i}`} entry={a} />
            ))}
          </section>
        </div>
      )}

      {footerGroups.length > 0 && (
        <div className="mt-8 space-y-4">
          <h2 className="text-sm font-700 uppercase tracking-wide text-ink-500">
            {t("sectionFooter")}
          </h2>
          {footerGroups.map(({ top, children }) => (
            <section key={top.key} className="card p-5">
              <Row entry={top} />
              {children.length > 0 && (
                <div className="mt-1 divide-y divide-ink-50">
                  {children.map((c, i) => (
                    <Row key={`${c.key}-${i}`} entry={c} />
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      )}
    </>
  );
}
