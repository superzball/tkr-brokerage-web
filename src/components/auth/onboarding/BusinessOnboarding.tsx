// src/components/auth/onboarding/BusinessOnboarding.tsx
// Business signup wizard: company info → KYC upload → review → done.
// "Done" creates the session (signInAsRole) and lands at /app/dashboard.

"use client";

import { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Stepper } from "@/components/app/Stepper";
import { Input, FileUpload } from "@/components/app/form";
import { StatusBadge } from "@/components/app/StatusBadge";
import { signInAsRole } from "@/lib/auth/actions";
import type { Locale } from "@/types/portal";

export function BusinessOnboarding() {
  const t = useTranslations("auth.onboarding");
  const tb = useTranslations("auth.onboarding.business");
  const locale = useLocale() as Locale;
  const [step, setStep] = useState(0);
  const [pending, startTransition] = useTransition();

  const [company, setCompany] = useState("");
  const [taxId, setTaxId] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const steps = [
    tb("steps.company"),
    tb("steps.kyc"),
    tb("steps.review"),
    tb("steps.done"),
  ];

  function finish() {
    startTransition(() => signInAsRole(locale, "business"));
  }

  return (
    <div className="w-full max-w-2xl">
      <h1 className="text-2xl font-700 text-ink-900 font-display mb-5">
        {tb("title")}
      </h1>
      <div className="mb-6">
        <Stepper steps={steps} current={step} />
      </div>

      <div className="card p-6">
        {step === 0 && (
          <div className="space-y-4">
            <Input label={tb("companyName")} value={company} onChange={(e) => setCompany(e.target.value)} />
            <Input label={tb("taxId")} value={taxId} onChange={(e) => setTaxId(e.target.value)} />
            <Input label={tb("address")} value={address} onChange={(e) => setAddress(e.target.value)} />
            <Input label={tb("phone")} value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="font-700 text-ink-900">{tb("kycTitle")}</h2>
              <p className="text-sm text-ink-500">{tb("kycSub")}</p>
            </div>
            <div className="space-y-2">
              <FileUpload label={tb("workPermit")} buttonLabel={tb("uploadBtn")} accept="image/*,application/pdf" />
              <StatusBadge tone="warning">{tb("statusPending")}</StatusBadge>
            </div>
            <div className="space-y-2">
              <FileUpload label={tb("companyDocs")} buttonLabel={tb("uploadBtn")} accept="image/*,application/pdf" />
              <StatusBadge tone="warning">{tb("statusPending")}</StatusBadge>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="font-700 text-ink-900 mb-4">{tb("reviewTitle")}</h2>
            <dl className="space-y-3 text-sm">
              {[
                [tb("companyName"), company],
                [tb("taxId"), taxId],
                [tb("address"), address],
                [tb("phone"), phone],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-b border-ink-50 pb-2">
                  <dt className="text-ink-500">{k}</dt>
                  <dd className="font-600 text-ink-900 text-right">{v || "—"}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col items-center text-center py-6">
            <span className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Icon name="checkCircle" size={28} />
            </span>
            <h2 className="text-lg font-700 text-ink-900">{tb("doneTitle")}</h2>
            <p className="mt-1 text-sm text-ink-500">{tb("doneBody")}</p>
          </div>
        )}

        <div className="mt-6 flex gap-2">
          {step > 0 && step < 3 && (
            <Button variant="ghost" onClick={() => setStep((s) => s - 1)} className="flex-1">
              {t("back")}
            </Button>
          )}
          {step < 2 && (
            <Button variant="primary" onClick={() => setStep((s) => s + 1)} className="flex-1">
              {t("next")}
            </Button>
          )}
          {step === 2 && (
            <Button variant="primary" onClick={() => setStep(3)} className="flex-1">
              {t("finish")}
            </Button>
          )}
          {step === 3 && (
            <Button variant="primary" onClick={finish} disabled={pending} className="flex-1">
              {t("goDashboard")} <Icon name="arrowRight" size={16} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
