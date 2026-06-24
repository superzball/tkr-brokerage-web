"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useBaht } from "@/lib/format";
import { StatusBadge } from "@/components/app/StatusBadge";
import { useToast } from "@/components/app/toast";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import type { TeamNode } from "@/lib/mock/seed";
import { licenseTone } from "./license";

export function TeamTree({
  tree,
  rootName,
}: {
  tree: TeamNode[];
  rootName: string;
}) {
  const t = useTranslations("team");
  const tc = useTranslations("business");
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const allParentIds = (nodes: TeamNode[]): string[] =>
    nodes.flatMap((n) =>
      n.children.length ? [n.id, ...allParentIds(n.children)] : [],
    );

  const toggle = (id: string) =>
    setCollapsed((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="card p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3 mb-3">
        {/* root = the viewing agent */}
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-9 h-9 rounded-xl bg-brand-500 text-white flex items-center justify-center shrink-0">
            <Icon name="user" size={18} />
          </span>
          <div className="min-w-0">
            <p className="font-700 text-ink-900 truncate">{rootName}</p>
            <p className="text-xs text-ink-400">{t("tree.you")}</p>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={() => setCollapsed(new Set())} className="btn btn-ghost btn-sm">
            {t("tree.expandAll")}
          </button>
          <button
            onClick={() => setCollapsed(new Set(allParentIds(tree)))}
            className="btn btn-ghost btn-sm"
          >
            {t("tree.collapseAll")}
          </button>
        </div>
      </div>

      {tree.length === 0 ? (
        <p className="py-8 text-center text-sm text-ink-400">
          {tc("common.tableEmpty")}
        </p>
      ) : (
        <ul className="border-l-2 border-ink-100 ml-4">
          {tree.map((n) => (
            <TreeRow
              key={n.id}
              node={n}
              depth={0}
              collapsed={collapsed}
              onToggle={toggle}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function TreeRow({
  node,
  depth,
  collapsed,
  onToggle,
}: {
  node: TeamNode;
  depth: number;
  collapsed: Set<string>;
  onToggle: (id: string) => void;
}) {
  const t = useTranslations("team");
  const ta = useTranslations("app");
  const baht = useBaht();
  const { toast } = useToast();
  const hasChildren = node.children.length > 0;
  const isOpen = !collapsed.has(node.id);
  const pending = node.licenseStatus !== "verified";

  return (
    <li>
      <div
        className="flex flex-wrap items-center gap-2.5 py-2.5 pl-3 border-b border-ink-50"
        style={{ marginLeft: depth * 8 }}
      >
        {hasChildren ? (
          <button
            onClick={() => onToggle(node.id)}
            aria-label={ta("toggleRow")}
            className="w-6 h-6 rounded-md hover:bg-sky-100 text-ink-500 flex items-center justify-center shrink-0"
          >
            <Icon name="chevD" size={16} className={cn(!isOpen && "-rotate-90")} />
          </button>
        ) : (
          <span className="w-6 shrink-0 text-center text-ink-300">•</span>
        )}

        <span className="font-600 text-ink-900">{node.name}</span>
        <span className="chip bg-ink-50 text-ink-500 text-xs">
          {t("common.gen", { n: node.generation })}
        </span>
        <span className="chip bg-sky-100 text-brand-700 text-xs">{node.rank}</span>
        <StatusBadge tone={licenseTone[node.licenseStatus]} className="text-xs">
          {t(`common.${node.licenseStatus}`)}
        </StatusBadge>

        <span className="ml-auto text-sm tabnum text-ink-700">
          {baht(node.personalGwp)}
        </span>

        {pending && (
          <div className="basis-full pl-8 flex flex-wrap items-center gap-2 text-xs text-amber-700">
            <Icon name="alertTri" size={14} />
            {t("common.notEarning")}
            <button
              onClick={() => toast(t("common.verifySent"), "success")}
              className="chip bg-gold-100 text-gold-600 hover:bg-gold-200"
            >
              {t("common.verify")}
            </button>
          </div>
        )}
      </div>

      {hasChildren && isOpen && (
        <ul className="border-l-2 border-ink-100 ml-4">
          {node.children.map((c) => (
            <TreeRow
              key={c.id}
              node={c}
              depth={depth + 1}
              collapsed={collapsed}
              onToggle={onToggle}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
