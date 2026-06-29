// src/components/app/admin/PartnersClient.tsx
// Admin CMS — manage partner insurers shown in the trust section + comparison
// pages. Mock: in-memory add/delete with toasts.

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { InsurerPartner } from "@/types/portal";
import { insurerShortName } from "@/lib/mock/seed";
import { EmptyState } from "@/components/app/EmptyState";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { TextField } from "@/components/ui/Field";
import { useToast } from "@/components/app/toast";

export function PartnersClient({ initial }: { initial: InsurerPartner[] }) {
  const t = useTranslations("admin.partners");
  const { toast } = useToast();
  const [partners, setPartners] = useState<InsurerPartner[]>(initial);
  const [name, setName] = useState("");

  function add(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setPartners((prev) => [...prev, { id: `ip_${Date.now()}`, name: trimmed, group: 3 }]);
    setName("");
    toast(t("created"), "success");
  }

  function remove(id: string) {
    setPartners((prev) => prev.filter((p) => p.id !== id));
    toast(t("deleted"), "info");
  }

  return (
    <>
      <form onSubmit={add} className="card p-4 flex flex-col sm:flex-row gap-2 mb-5">
        <TextField
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("namePlaceholder")}
          className="flex-1"
        />
        <Button variant="primary" size="md" type="submit">
          <Icon name="plus" size={14} /> {t("add")}
        </Button>
      </form>

      <p className="text-sm text-ink-500 mb-4">{t("count", { n: partners.length })}</p>

      {partners.length === 0 ? (
        <EmptyState icon="building" title={t("empty")} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {partners.map((p) => (
            <div key={p.id} className="card p-4 flex items-center gap-3">
              <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-100 to-sky-200 text-brand-700 inline-flex items-center justify-center font-display font-700 shrink-0">
                {insurerShortName(p.name).charAt(0)}
              </span>
              <span className="font-600 text-ink-900 truncate flex-1">{p.name}</span>
              <button
                type="button"
                onClick={() => remove(p.id)}
                aria-label={t("delete")}
                className="w-8 h-8 rounded-lg text-ink-400 hover:bg-rose-50 hover:text-rose-500 flex items-center justify-center shrink-0"
              >
                <Icon name="x" size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
