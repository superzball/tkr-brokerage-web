// src/components/auth/SignupForm.tsx
// Two-step signup: (1) pick a role, (2) a phone-first details form (email
// alternative) + social. Phone signup verifies via the OTP screen; both paths
// end at the role's onboarding wizard.

"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/app/form";
import { Tabs } from "@/components/app/Tabs";
import { Icon } from "@/components/ui/Icon";
import { RoleCards } from "./RoleCards";
import { PhoneField } from "./PhoneField";
import { SocialButtons } from "./SocialButtons";
import { requestOtp } from "@/lib/auth/actions";
import { isCompleteThaiPhone } from "@/lib/phone";
import type { Role } from "@/types/portal";

export function SignupForm() {
  const t = useTranslations("auth.signup");
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [step, setStep] = useState<0 | 1>(0);
  const [role, setRole] = useState<Role | null>(null);
  const [method, setMethod] = useState<"phone" | "email">("phone");

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function pickRole(r: Role) {
    setRole(r);
    setStep(1);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!role) return;
    if (method === "phone") {
      if (!isCompleteThaiPhone(phone)) return;
      startTransition(async () => {
        await requestOtp(phone);
        router.push(
          `/verify-otp?phone=${encodeURIComponent(phone)}&purpose=signup&role=${role}`,
        );
      });
    } else {
      // Email signup needs no OTP in the mock — go straight to onboarding.
      startTransition(() => router.push(`/onboarding/${role}`));
    }
  }

  return (
    <div className="card p-7 w-full max-w-xl">
      <h1 className="text-2xl font-700 text-ink-900 font-display">
        {t("title")}
      </h1>
      <p className="mt-1 text-sm text-ink-500">
        {step === 0 ? t("step1") : t("step2")}
      </p>

      {step === 0 ? (
        <>
          <p className="mt-5 font-600 text-ink-800">{t("chooseRole")}</p>
          <RoleCards className="mt-3" onPick={pickRole} selected={role ?? undefined} />
          <p className="mt-6 text-center text-sm text-ink-500">
            {t("haveAccount")}{" "}
            <Link href="/login" className="font-600 text-brand-600 hover:underline">
              {t("loginLink")}
            </Link>
          </p>
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setStep(0)}
            className="mt-4 inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-800"
          >
            <Icon name="arrowRight" size={14} className="rotate-180" />
            {t("back")}
          </button>

          <Tabs
            className="mt-4 w-full"
            value={method}
            onChange={setMethod}
            tabs={[
              { key: "phone", label: t("tabPhone") },
              { key: "email", label: t("tabEmail") },
            ]}
          />

          <form onSubmit={submit} className="mt-5 space-y-4">
            <Input
              label={t("name")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {role === "business" && (
              <Input
                label={t("company")}
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
            )}
            {method === "phone" ? (
              <PhoneField
                label={t("phoneLabel")}
                value={phone}
                onChange={setPhone}
              />
            ) : (
              <>
                <Input
                  type="email"
                  label={t("emailLabel")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  label={t("passwordLabel")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </>
            )}
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={
                pending || (method === "phone" && !isCompleteThaiPhone(phone))
              }
            >
              {t("continue")}
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-ink-400">
            <span className="h-px flex-1 bg-ink-100" />
            {t("or")}
            <span className="h-px flex-1 bg-ink-100" />
          </div>

          {role && <SocialButtons role={role} />}
        </>
      )}
    </div>
  );
}
