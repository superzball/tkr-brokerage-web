// src/components/app/admin/ArticlesClient.tsx
// News/Articles manager: DataTable list + a create/edit modal with full SEO
// fields, per-locale (th/en/my/lo) translation tabs, and draft/scheduled/
// published status. Mock — edits live in component state + toast on save.

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Article, ArticleStatus, Locale } from "@/types/portal";
import { routing } from "@/i18n/routing";
import { DataTable, type Column } from "@/components/app/DataTable";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Modal } from "@/components/app/Modal";
import { Tabs } from "@/components/app/Tabs";
import { Input, Select, Field } from "@/components/app/form";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/app/toast";
import { articleTone } from "./badges";

const STATUSES: ArticleStatus[] = ["draft", "scheduled", "published"];
const LOCALES = routing.locales as readonly Locale[];

type Draft = {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  status: ArticleStatus;
  publishedAt: string;
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  bodies: Record<Locale, string>;
};

function toDraft(a?: Article): Draft {
  const bodies = Object.fromEntries(
    LOCALES.map((l) => [l, a?.locales.includes(l) ? "•" : ""]),
  ) as Record<Locale, string>;
  return {
    id: a?.id ?? "",
    title: a?.title ?? "",
    slug: a?.slug ?? "",
    category: a?.category ?? "",
    author: a?.author ?? "ทีม TKR",
    status: a?.status ?? "draft",
    publishedAt: a?.publishedAt ?? "",
    metaTitle: a?.seo.metaTitle ?? "",
    metaDescription: a?.seo.metaDescription ?? "",
    ogImage: a?.seo.ogImage ?? "",
    bodies,
  };
}

export function ArticlesClient({ initial }: { initial: Article[] }) {
  const t = useTranslations("admin.articles");
  const te = useTranslations("admin.articlesEditor");
  const ts = useTranslations("admin.status");
  const tcommon = useTranslations("business.common");
  const { toast } = useToast();

  const [list, setList] = useState<Article[]>(initial);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(toDraft());
  const [tab, setTab] = useState<"content" | "seo">("content");
  const [loc, setLoc] = useState<Locale>(routing.defaultLocale);

  function openEditor(a?: Article) {
    setDraft(toDraft(a));
    setTab("content");
    setLoc(routing.defaultLocale);
    setOpen(true);
  }

  function save() {
    if (!draft.title.trim()) {
      toast(t("empty"), "error");
      return;
    }
    const locales = LOCALES.filter((l) => draft.bodies[l].trim().length > 0);
    const article: Article = {
      id: draft.id || `art_${Date.now()}`,
      title: draft.title.trim(),
      slug: draft.slug.trim() || draft.title.trim().toLowerCase().replace(/\s+/g, "-"),
      status: draft.status,
      category: draft.category.trim(),
      author: draft.author.trim(),
      locales: locales.length ? locales : ["th"],
      publishedAt: draft.publishedAt || undefined,
      seo: {
        metaTitle: draft.metaTitle,
        metaDescription: draft.metaDescription,
        ogImage: draft.ogImage || undefined,
      },
    };
    setList((prev) => {
      const i = prev.findIndex((x) => x.id === article.id);
      if (i === -1) return [article, ...prev];
      const next = [...prev];
      next[i] = article;
      return next;
    });
    toast(te("saved"), "success");
    setOpen(false);
  }

  function remove() {
    setList((prev) => prev.filter((x) => x.id !== draft.id));
    toast(te("deleted"), "info");
    setOpen(false);
  }

  const columns: Column<Article>[] = [
    { key: "title", header: t("col.title"), sortValue: (a) => a.title },
    {
      key: "category",
      header: t("col.category"),
      sortValue: (a) => a.category,
      render: (a) => a.categoryLabel ?? a.category,
    },
    {
      key: "status",
      header: t("col.status"),
      sortValue: (a) => a.status,
      render: (a) => <StatusBadge tone={articleTone[a.status]}>{ts(a.status)}</StatusBadge>,
    },
    {
      key: "locales",
      header: t("col.locales"),
      render: (a) => (
        <span className="tabnum">{a.locales.map((l) => l.toUpperCase()).join(" · ")}</span>
      ),
    },
    { key: "author", header: t("col.author") },
    { key: "published", header: t("col.published"), mono: true, render: (a) => a.publishedAt ?? "—" },
  ];

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button variant="primary" size="sm" onClick={() => openEditor()}>
          {te("create")}
        </Button>
      </div>

      <DataTable
        columns={columns}
        rows={list}
        getRowKey={(a) => a.id}
        onRowClick={(a) => openEditor(a)}
        labels={{
          empty: t("empty"),
          prev: tcommon("prev"),
          next: tcommon("next"),
          range: (from, to, total) => tcommon("range", { from, to, total }),
        }}
      />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={draft.id ? te("edit") : te("create")}
        footer={
          <>
            {draft.id && (
              <Button variant="ghost" size="sm" onClick={remove} className="mr-auto text-rose-600">
                {te("delete")}
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              {te("cancel")}
            </Button>
            <Button variant="primary" size="sm" onClick={save}>
              {te("save")}
            </Button>
          </>
        }
      >
        <Tabs<"content" | "seo">
          tabs={[
            { key: "content", label: te("contentTab") },
            { key: "seo", label: te("seoTab") },
          ]}
          value={tab}
          onChange={setTab}
          className="mb-4"
        />

        {tab === "content" ? (
          <div className="space-y-3">
            <Input
              label={te("titleLabel")}
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label={te("slug")}
                value={draft.slug}
                onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
              />
              <Input
                label={te("category")}
                value={draft.category}
                onChange={(e) => setDraft({ ...draft, category: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Select
                label={te("statusLabel")}
                value={draft.status}
                onChange={(e) => setDraft({ ...draft, status: e.target.value as ArticleStatus })}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {ts(s)}
                  </option>
                ))}
              </Select>
              {draft.status !== "draft" && (
                <Input
                  type="date"
                  label={te("scheduleDate")}
                  value={draft.publishedAt}
                  onChange={(e) => setDraft({ ...draft, publishedAt: e.target.value })}
                />
              )}
            </div>

            {/* per-locale translation tabs */}
            <div className="pt-4 mt-1 border-t border-ink-100">
              <p className="field-label">{te("localeNote")}</p>
              <Tabs<Locale>
                tabs={LOCALES.map((l) => ({ key: l, label: l.toUpperCase() }))}
                value={loc}
                onChange={setLoc}
                className="mb-2"
              />
              <textarea
                className="field min-h-[120px]"
                placeholder={te("bodyLabel")}
                value={draft.bodies[loc]}
                onChange={(e) =>
                  setDraft({ ...draft, bodies: { ...draft.bodies, [loc]: e.target.value } })
                }
              />
              <p className="mt-1 text-xs">
                {draft.bodies[loc].trim() ? (
                  <span className="text-mint-600">● {te("translated")}</span>
                ) : (
                  <span className="text-ink-400">○ {te("untranslated")}</span>
                )}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-600 text-ink-700">{te("seoSection")}</p>
            <Input
              label={te("metaTitle")}
              value={draft.metaTitle}
              onChange={(e) => setDraft({ ...draft, metaTitle: e.target.value })}
            />
            <Field label={te("metaDescription")}>
              <textarea
                className="field min-h-[80px]"
                value={draft.metaDescription}
                onChange={(e) => setDraft({ ...draft, metaDescription: e.target.value })}
              />
            </Field>
            <Input
              label={te("ogImage")}
              value={draft.ogImage}
              placeholder="/og-default.png"
              onChange={(e) => setDraft({ ...draft, ogImage: e.target.value })}
            />
          </div>
        )}
      </Modal>
    </>
  );
}
