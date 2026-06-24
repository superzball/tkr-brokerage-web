// src/components/app/admin/SeoClient.tsx
// SEO & Redirects: per-page meta editor, a redirects manager (add/delete), and
// a sitemap auto-generate toggle. Mock — state + toast.

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { CmsPage, Redirect } from "@/types/portal";
import { DataTable, type Column } from "@/components/app/DataTable";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Modal } from "@/components/app/Modal";
import { Tabs } from "@/components/app/Tabs";
import { Input, Select, Field } from "@/components/app/form";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useToast } from "@/components/app/toast";
import { cn } from "@/lib/cn";

type Meta = { metaTitle: string; metaDescription: string };

export function SeoClient({
  pages,
  redirects: initialRedirects,
}: {
  pages: CmsPage[];
  redirects: Redirect[];
}) {
  const t = useTranslations("admin.seo");
  const tcommon = useTranslations("business.common");
  const { toast } = useToast();

  const [tab, setTab] = useState<"meta" | "redirects">("meta");
  const [meta, setMeta] = useState<Record<string, Meta>>(() =>
    Object.fromEntries(
      pages.map((p) => [p.id, { metaTitle: `${p.title} | TKR`, metaDescription: p.body.slice(0, 120) }]),
    ),
  );
  const [redirects, setRedirects] = useState<Redirect[]>(initialRedirects);
  const [sitemap, setSitemap] = useState(true);

  // add-redirect modal
  const [adding, setAdding] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [code, setCode] = useState<301 | 302>(301);

  function setPageMeta(id: string, patch: Partial<Meta>) {
    setMeta((prev) => ({ ...prev, [id]: { ...prev[id]!, ...patch } }));
  }
  function addRedirect() {
    if (!from.trim() || !to.trim()) return;
    setRedirects((prev) => [
      { id: `rd_${Date.now()}`, from: from.trim(), to: to.trim(), code },
      ...prev,
    ]);
    setFrom("");
    setTo("");
    setCode(301);
    setAdding(false);
    toast(t("redirectAdded"), "success");
  }
  function deleteRedirect(id: string) {
    setRedirects((prev) => prev.filter((r) => r.id !== id));
    toast(t("redirectDeleted"), "info");
  }

  const redirectCols: Column<Redirect>[] = [
    { key: "from", header: t("rCol.from"), render: (r) => <span className="tabnum">{r.from}</span> },
    { key: "to", header: t("rCol.to"), render: (r) => <span className="tabnum">{r.to}</span> },
    { key: "code", header: t("rCol.code"), render: (r) => <StatusBadge tone="info">{r.code}</StatusBadge> },
    {
      key: "x",
      header: "",
      align: "right",
      render: (r) => (
        <button
          type="button"
          onClick={() => deleteRedirect(r.id)}
          aria-label={t("redirectDeleted")}
          className="w-8 h-8 rounded-lg text-rose-500 hover:bg-rose-50 inline-flex items-center justify-center"
        >
          <Icon name="x" size={15} />
        </button>
      ),
    },
  ];

  return (
    <>
      {/* sitemap toggle */}
      <div className="card p-4 mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="font-600 text-ink-900">{t("sitemap")}</p>
          <p className="text-sm text-ink-500">{t("sitemapDesc")}</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={sitemap}
          aria-label={t("sitemap")}
          onClick={() => {
            setSitemap((v) => !v);
            toast(t("saved"), "success");
          }}
          className={cn(
            "relative w-12 h-7 rounded-full transition-colors shrink-0",
            sitemap ? "bg-brand-500" : "bg-ink-200",
          )}
        >
          <span
            className={cn(
              "absolute top-1 w-5 h-5 rounded-full bg-white transition-transform",
              sitemap ? "translate-x-6" : "translate-x-1",
            )}
          />
        </button>
      </div>

      <Tabs<"meta" | "redirects">
        tabs={[
          { key: "meta", label: t("metaTab") },
          { key: "redirects", label: t("redirectTab") },
        ]}
        value={tab}
        onChange={setTab}
        className="mb-4"
      />

      {tab === "meta" ? (
        <div className="space-y-3">
          {pages.map((p) => (
            <div key={p.id} className="card p-4 space-y-2.5">
              <p className="tabnum text-sm font-600 text-brand-700">{p.path}</p>
              <Input
                label={t("col.metaTitle")}
                value={meta[p.id]?.metaTitle ?? ""}
                onChange={(e) => setPageMeta(p.id, { metaTitle: e.target.value })}
              />
              <Field label={t("col.metaDescription")}>
                <textarea
                  className="field min-h-[60px]"
                  value={meta[p.id]?.metaDescription ?? ""}
                  onChange={(e) => setPageMeta(p.id, { metaDescription: e.target.value })}
                />
              </Field>
            </div>
          ))}
          <div className="flex justify-end">
            <Button variant="primary" size="sm" onClick={() => toast(t("saved"), "success")}>
              {t("save")}
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-end mb-3">
            <Button variant="primary" size="sm" onClick={() => setAdding(true)}>
              <Icon name="plus" size={14} /> {t("addRedirect")}
            </Button>
          </div>
          <DataTable
            columns={redirectCols}
            rows={redirects}
            getRowKey={(r) => r.id}
            labels={{
              empty: t("empty"),
              prev: tcommon("prev"),
              next: tcommon("next"),
              range: (f, to2, total) => tcommon("range", { from: f, to: to2, total }),
            }}
          />
        </>
      )}

      <Modal
        open={adding}
        onClose={() => setAdding(false)}
        title={t("addRedirect")}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setAdding(false)}>
              {tcommon("cancel")}
            </Button>
            <Button variant="primary" size="sm" onClick={addRedirect}>
              {t("addRedirect")}
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <Input label={t("from")} value={from} placeholder="/old-path" onChange={(e) => setFrom(e.target.value)} />
          <Input label={t("to")} value={to} placeholder="/new-path" onChange={(e) => setTo(e.target.value)} />
          <Select label={t("code")} value={code} onChange={(e) => setCode(Number(e.target.value) as 301 | 302)}>
            <option value={301}>301</option>
            <option value={302}>302</option>
          </Select>
        </div>
      </Modal>
    </>
  );
}
