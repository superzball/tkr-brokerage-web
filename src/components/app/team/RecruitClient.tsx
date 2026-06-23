"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/app/form";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

const INVITE_URL = "tkr.co.th/team/thanakorn-p";

export function RecruitClient() {
  const t = useTranslations("team");
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState("");
  const [license, setLicense] = useState("");
  const [added, setAdded] = useState<string | null>(null);

  function copy() {
    if (navigator.clipboard) navigator.clipboard.writeText(INVITE_URL).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !license.trim()) return; // license is REQUIRED
    setAdded(name.trim());
    setName("");
    setLicense("");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2 items-start">
      {/* invite link */}
      <section className="card p-6">
        <h2 className="font-700 text-ink-900 flex items-center gap-2">
          <span className="text-brand-600"><Icon name="link" /></span>
          {t("recruit.inviteTitle")}
        </h2>
        <p className="mt-1 text-sm text-ink-500">{t("recruit.inviteDesc")}</p>
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-sky-100 p-2 pl-3.5">
          <span className="text-sm text-ink-600 truncate flex-1">{INVITE_URL}</span>
          <button onClick={copy} className="btn btn-primary btn-sm shrink-0">
            <Icon name={copied ? "check" : "copy"} />{" "}
            {copied ? t("recruit.copied") : t("recruit.copy")}
          </button>
        </div>
        <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
          <Icon name="shieldCheck" size={16} className="shrink-0 mt-0.5" />
          {t("compliance.noFees")}
        </div>
      </section>

      {/* add sub-agent (license required) */}
      <section className="card p-6">
        <h2 className="font-700 text-ink-900 mb-4">{t("recruit.formTitle")}</h2>
        {added ? (
          <div className="rounded-xl border border-gold-200 bg-gold-50 p-5">
            <p className="font-600 text-gold-700 flex items-center gap-2">
              <Icon name="clock" size={18} />
              {t("recruit.gateTitle")}
            </p>
            <p className="mt-2 text-sm text-ink-700">
              {t("recruit.gateDesc", { name: added })}
            </p>
            <Button
              variant="ghost"
              size="md"
              className="mt-4"
              onClick={() => setAdded(null)}
            >
              <Icon name="plus" size={16} /> {t("recruit.addAnother")}
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <Input
              label={t("recruit.name")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label={t("recruit.license")}
              hint={t("recruit.licenseHint")}
              value={license}
              onChange={(e) => setLicense(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              disabled={!name.trim() || !license.trim()}
            >
              {t("recruit.submit")} <Icon name="arrowRight" />
            </Button>
          </form>
        )}
      </section>
    </div>
  );
}
