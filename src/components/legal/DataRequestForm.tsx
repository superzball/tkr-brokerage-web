// src/components/legal/DataRequestForm.tsx
// PDPA data-subject request form (Phase 21). Mock: a submission raises a ticket
// to the admin legal queue (a real backend would POST it). Shows a success card
// with a reference number; no real data is sent.

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useToast } from "@/components/app/toast";
import { cn } from "@/lib/cn";

const KINDS = ["access", "export", "correct", "delete"] as const;
type Kind = (typeof KINDS)[number];

export function DataRequestForm() {
  const t = useTranslations("legal.dataRequest");
  const { toast } = useToast();
  const [kind, setKind] = useState<Kind>("access");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [note, setNote] = useState("");
  const [doneRef, setDoneRef] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) return;
    // Mock reference; index by request count would come from the backend.
    const ref = `DSR-2026-${String(1000 + Math.floor(Math.random() * 9000))}`;
    setDoneRef(ref);
    toast(t("successToast"), "success");
  }

  if (doneRef) {
    return (
      <div className="card p-7 text-center">
        <span className="mx-auto w-12 h-12 rounded-2xl bg-mint-50 text-mint-600 flex items-center justify-center">
          <Icon name="checkCircle" size={24} />
        </span>
        <h2 className="mt-4 font-700 text-ink-900">{t("successTitle")}</h2>
        <p className="mt-1.5 text-sm text-ink-500 max-w-md mx-auto">{t("successDesc")}</p>
        <p className="mt-3 inline-block rounded-lg bg-ink-50 px-3 py-1.5 font-600 text-ink-800 tabnum">
          {doneRef}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card p-6 space-y-4">
      <div>
        <label className="field-label">{t("kindLabel")}</label>
        <div className="mt-1.5 flex flex-wrap gap-2">
          {KINDS.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setKind(k)}
              aria-pressed={kind === k}
              className={cn(
                "chip transition-colors",
                kind === k
                  ? "bg-brand-500 text-white"
                  : "bg-white border border-ink-100 text-ink-600 hover:border-brand-200",
              )}
            >
              {t(`kinds.${k}`)}
            </button>
          ))}
        </div>
        <p className="mt-1.5 text-xs text-ink-500">{t(`kindHint.${kind}`)}</p>
      </div>

      <div>
        <label className="field-label">{t("nameLabel")}</label>
        <input
          className="field"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="field-label">{t("contactLabel")}</label>
        <input
          className="field"
          placeholder={t("contactPh")}
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="field-label">{t("noteLabel")}</label>
        <textarea
          className="field min-h-24"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <p className="text-xs text-ink-400">{t("identityNote")}</p>

      <Button type="submit" variant="primary" className="w-full" disabled={!name.trim() || !contact.trim()}>
        {t("submit")}
      </Button>
    </form>
  );
}
