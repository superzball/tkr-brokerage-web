// src/components/app/admin/SettingsAdminClient.tsx
// System settings: org name, default locale, feature flags (toggles),
// notification templates, integration keys. Mock — state + toast on save.

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";
import { Input, Select, Field } from "@/components/app/form";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/app/toast";
import { cn } from "@/lib/cn";

function Toggle({ on, onToggle, label }: { on: boolean; onToggle: () => void; label: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-ink-700">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={onToggle}
        className={cn("relative w-12 h-7 rounded-full transition-colors shrink-0", on ? "bg-brand-500" : "bg-ink-200")}
      >
        <span className={cn("absolute top-1 w-5 h-5 rounded-full bg-white transition-transform", on ? "translate-x-6" : "translate-x-1")} />
      </button>
    </div>
  );
}

export function SettingsAdminClient() {
  const t = useTranslations("admin.settings");
  const { toast } = useToast();

  const [orgName, setOrgName] = useState("TKR Insurance Platform");
  const [locale, setLocale] = useState(routing.defaultLocale);
  const [flags, setFlags] = useState({ wallet: true, line: true, team: true, maintenance: false });
  const [tpl, setTpl] = useState({
    otp: "รหัส OTP ของคุณคือ {code} (ใช้ได้ 5 นาที)",
    policy: "กรมธรรม์ {policyNo} ของคุณออกเรียบร้อยแล้ว",
    claim: "เคลม {claimNo} อัปเดตสถานะเป็น {status}",
  });
  const [lineToken, setLineToken] = useState("");
  const [paymentKey, setPaymentKey] = useState("");

  const flag = (k: keyof typeof flags) => () => setFlags((f) => ({ ...f, [k]: !f[k] }));

  return (
    <div className="space-y-6 max-w-3xl">
      {/* general */}
      <section className="card p-5 space-y-3">
        <h2 className="font-700 text-ink-900">{t("general")}</h2>
        <Input label={t("orgName")} value={orgName} onChange={(e) => setOrgName(e.target.value)} />
        <Select label={t("defaultLocale")} value={locale} onChange={(e) => setLocale(e.target.value as typeof locale)}>
          {routing.locales.map((l) => <option key={l} value={l}>{l.toUpperCase()}</option>)}
        </Select>
      </section>

      {/* feature flags */}
      <section className="card p-5">
        <h2 className="font-700 text-ink-900 mb-2">{t("features")}</h2>
        <div className="divide-y divide-ink-50">
          <Toggle on={flags.wallet} onToggle={flag("wallet")} label={t("flagWallet")} />
          <Toggle on={flags.line} onToggle={flag("line")} label={t("flagLine")} />
          <Toggle on={flags.team} onToggle={flag("team")} label={t("flagTeam")} />
          <Toggle on={flags.maintenance} onToggle={flag("maintenance")} label={t("flagMaintenance")} />
        </div>
      </section>

      {/* notification templates */}
      <section className="card p-5 space-y-3">
        <h2 className="font-700 text-ink-900">{t("notifications")}</h2>
        <Field label={t("tplOtp")}>
          <textarea className="field min-h-[56px]" value={tpl.otp} onChange={(e) => setTpl({ ...tpl, otp: e.target.value })} />
        </Field>
        <Field label={t("tplPolicy")}>
          <textarea className="field min-h-[56px]" value={tpl.policy} onChange={(e) => setTpl({ ...tpl, policy: e.target.value })} />
        </Field>
        <Field label={t("tplClaim")}>
          <textarea className="field min-h-[56px]" value={tpl.claim} onChange={(e) => setTpl({ ...tpl, claim: e.target.value })} />
        </Field>
      </section>

      {/* integrations */}
      <section className="card p-5 space-y-3">
        <h2 className="font-700 text-ink-900">{t("integrations")}</h2>
        <Input label={t("lineToken")} hint={t("placeholder")} value={lineToken} placeholder="xxxxxxxx••••••••" onChange={(e) => setLineToken(e.target.value)} />
        <Input label={t("paymentKey")} hint={t("placeholder")} value={paymentKey} placeholder="sk_live_••••••••" onChange={(e) => setPaymentKey(e.target.value)} />
      </section>

      <div className="flex justify-end">
        <Button variant="primary" size="md" onClick={() => toast(t("saved"), "success")}>
          {t("save")}
        </Button>
      </div>
    </div>
  );
}
