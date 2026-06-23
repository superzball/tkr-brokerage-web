"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { DataTable, type Column } from "@/components/app/DataTable";
import { FilterBar } from "@/components/app/FilterBar";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Select } from "@/components/app/form";
import { useToast } from "@/components/app/toast";
import { Icon } from "@/components/ui/Icon";
import type { DocItem } from "@/types/portal";

const KINDS: DocItem["kind"][] = ["policy", "certificate", "receipt", "kyc"];

export function DocumentsClient({ documents }: { documents: DocItem[] }) {
  const t = useTranslations("business");
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [kind, setKind] = useState<"all" | DocItem["kind"]>("all");

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return documents.filter((d) => {
      if (kind !== "all" && d.kind !== kind) return false;
      if (!q) return true;
      return d.name.toLowerCase().includes(q);
    });
  }, [documents, search, kind]);

  const columns: Column<DocItem>[] = [
    {
      key: "name",
      header: t("documents.col.name"),
      sortValue: (d) => d.name,
      render: (d) => (
        <span className="inline-flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-sky-100 text-brand-600 flex items-center justify-center shrink-0">
            <Icon name="doc" size={16} />
          </span>
          <span className="font-600 text-ink-900">{d.name}</span>
        </span>
      ),
    },
    {
      key: "kind",
      header: t("documents.col.kind"),
      sortValue: (d) => d.kind,
      render: (d) => (
        <StatusBadge tone="neutral">{t(`documents.kind.${d.kind}`)}</StatusBadge>
      ),
    },
    {
      key: "date",
      header: t("documents.col.date"),
      align: "right",
      sortValue: (d) => d.date,
      render: (d) => <span className="tabnum">{d.date}</span>,
    },
    {
      key: "size",
      header: t("documents.col.size"),
      align: "right",
      sortValue: (d) => d.sizeKb,
      render: (d) => <span className="tabnum text-ink-500">{d.sizeKb} KB</span>,
    },
    {
      key: "actions",
      header: t("common.actions"),
      align: "right",
      render: () => (
        <button
          type="button"
          onClick={() => toast(t("documents.downloaded"), "success")}
          className="btn btn-ghost btn-sm"
        >
          <Icon name="download" size={16} /> {t("documents.download")}
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <FilterBar
        search={search}
        onSearch={setSearch}
        placeholder={t("documents.searchPlaceholder")}
      >
        <Select
          value={kind}
          onChange={(e) => setKind(e.target.value as typeof kind)}
          className="w-auto"
        >
          <option value="all">{t("common.all")}</option>
          {KINDS.map((k) => (
            <option key={k} value={k}>
              {t(`documents.kind.${k}`)}
            </option>
          ))}
        </Select>
      </FilterBar>

      <DataTable
        columns={columns}
        rows={rows}
        getRowKey={(d) => d.id}
        labels={{
          empty: t("documents.empty"),
          prev: t("common.prev"),
          next: t("common.next"),
          range: (from, to, total) => t("common.range", { from, to, total }),
        }}
      />
    </div>
  );
}
