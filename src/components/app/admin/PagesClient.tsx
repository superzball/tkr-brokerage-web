// src/components/app/admin/PagesClient.tsx
// Pages & FAQ manager: a table of editable public pages; clicking one opens an
// editor for hero/body copy plus an add/edit/delete FAQ list. Mock — state +
// toast on save.

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { CmsPage, Faq } from "@/types/portal";
import { DataTable, type Column } from "@/components/app/DataTable";
import { Modal } from "@/components/app/Modal";
import { Input, Field } from "@/components/app/form";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useToast } from "@/components/app/toast";

export function PagesClient({
  pages: initialPages,
  faqs: initialFaqs,
}: {
  pages: CmsPage[];
  faqs: Faq[];
}) {
  const t = useTranslations("admin.pages");
  const tcommon = useTranslations("business.common");
  const { toast } = useToast();

  const [pages, setPages] = useState<CmsPage[]>(initialPages);
  const [faqs, setFaqs] = useState<Faq[]>(initialFaqs);
  const [editing, setEditing] = useState<CmsPage | null>(null);
  const [hero, setHero] = useState("");
  const [body, setBody] = useState("");

  function open(p: CmsPage) {
    setEditing(p);
    setHero(p.hero);
    setBody(p.body);
  }

  const pageFaqs = editing ? faqs.filter((f) => f.pageId === editing.id) : [];

  function setFaq(id: string, patch: Partial<Faq>) {
    setFaqs((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  }
  function addFaq() {
    if (!editing) return;
    setFaqs((prev) => [...prev, { id: `faq_${Date.now()}`, pageId: editing.id, question: "", answer: "" }]);
    toast(t("faqAdded"), "success");
  }
  function deleteFaq(id: string) {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
    toast(t("faqDeleted"), "info");
  }

  function save() {
    if (!editing) return;
    const count = faqs.filter((f) => f.pageId === editing.id).length;
    setPages((prev) =>
      prev.map((p) =>
        p.id === editing.id
          ? { ...p, hero, body, faqCount: count, updatedAt: new Date().toISOString().slice(0, 10) }
          : p,
      ),
    );
    toast(t("saved"), "success");
    setEditing(null);
  }

  const columns: Column<CmsPage>[] = [
    { key: "title", header: t("col.page"), sortValue: (p) => p.title },
    { key: "path", header: t("col.path"), render: (p) => <span className="tabnum text-ink-500">{p.path}</span> },
    { key: "faqCount", header: t("col.faqs"), align: "right", sortValue: (p) => p.faqCount, render: (p) => <span className="tabnum">{p.faqCount}</span> },
    { key: "updatedAt", header: t("col.updated"), sortValue: (p) => p.updatedAt },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        rows={pages}
        getRowKey={(p) => p.id}
        onRowClick={open}
        labels={{
          empty: t("empty"),
          prev: tcommon("prev"),
          next: tcommon("next"),
          range: (from, to, total) => tcommon("range", { from, to, total }),
        }}
      />

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing ? `${t("editCopy")} · ${editing.title}` : ""}
        footer={
          <Button variant="primary" size="sm" onClick={save}>
            {t("save")}
          </Button>
        }
      >
        <div className="space-y-4">
          <Input label={t("hero")} value={hero} onChange={(e) => setHero(e.target.value)} />
          <Field label={t("body")}>
            <textarea
              className="field min-h-[90px]"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </Field>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-700 text-ink-900">{t("faqTitle")}</p>
              <Button variant="ghost" size="sm" onClick={addFaq}>
                <Icon name="plus" size={14} /> {t("addFaq")}
              </Button>
            </div>

            {pageFaqs.length === 0 ? (
              <p className="text-sm text-ink-400 py-3">{t("noFaq")}</p>
            ) : (
              <ul className="space-y-3">
                {pageFaqs.map((f) => (
                  <li key={f.id} className="rounded-xl border border-ink-100 p-3 space-y-2">
                    <div className="flex items-start gap-2">
                      <input
                        className="field flex-1"
                        placeholder={t("question")}
                        value={f.question}
                        onChange={(e) => setFaq(f.id, { question: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => deleteFaq(f.id)}
                        aria-label={t("faqDeleted")}
                        className="w-9 h-9 rounded-lg text-rose-500 hover:bg-rose-50 flex items-center justify-center shrink-0"
                      >
                        <Icon name="x" size={16} />
                      </button>
                    </div>
                    <textarea
                      className="field min-h-[60px]"
                      placeholder={t("answer")}
                      value={f.answer}
                      onChange={(e) => setFaq(f.id, { answer: e.target.value })}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
