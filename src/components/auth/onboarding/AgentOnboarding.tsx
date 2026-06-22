// src/components/auth/onboarding/AgentOnboarding.tsx
// Light agent signup wizard: agent profile + (mock) license no → done.

"use client";

import { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Stepper } from "@/components/app/Stepper";
import { Input } from "@/components/app/form";
import { signInAsRole } from "@/lib/auth/actions";
import type { Locale } from "@/types/portal";

export function AgentOnboarding() {
  const t = useTranslations("auth.onboarding");
  const ta = useTranslations("auth.onboarding.agent");
  const locale = useLocale() as Locale;
  const [step, setStep] = useState(0);
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [license, setLicense] = useState("");
  const [phone, setPhone] = useState("");

  const steps = [ta("steps.profile"), ta("steps.done")];

  return (
    <div className="w-full max-w-lg">
      <h1 className="text-2xl font-700 text-ink-900 font-display mb-5">
        {ta("title")}
      </h1>
      <div className="mb-6">
        <Stepper steps={steps} current={step} />
      </div>

      <div className="card p-6">
        {step === 0 ? (
          <div className="space-y-4">
            <Input label={ta("name")} value={name} onChange={(e) => setName(e.target.value)} />
            <Input label={ta("license")} value={license} onChange={(e) => setLicense(e.target.value)} placeholder="บ.1234/2569" />
            <Input label={ta("phone")} value={phone} onChange={(e) => setPhone(e.target.value)} />
            <Button variant="primary" className="w-full" onClick={() => setStep(1)}>
              {t("finish")}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center py-6">
            <span className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Icon name="checkCircle" size={28} />
            </span>
            <h2 className="text-lg font-700 text-ink-900">{ta("doneTitle")}</h2>
            <p className="mt-1 text-sm text-ink-500">{ta("doneBody")}</p>
            <Button
              variant="primary"
              className="w-full mt-5"
              disabled={pending}
              onClick={() => startTransition(() => signInAsRole(locale, "agent"))}
            >
              {t("goDashboard")} <Icon name="arrowRight" size={16} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
