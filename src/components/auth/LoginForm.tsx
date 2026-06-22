// src/components/auth/LoginForm.tsx
// Two sign-in methods on one screen: Phone + OTP (primary/default) and
// Email + password. Plus the 4 social buttons and one-tap demo accounts.

"use client";

import { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/app/form";
import { Tabs } from "@/components/app/Tabs";
import { PhoneField } from "./PhoneField";
import { SocialButtons } from "./SocialButtons";
import { signInWithPassword, signInAsRole, requestOtp } from "@/lib/auth/actions";
import { isCompleteThaiPhone } from "@/lib/phone";
import { users } from "@/lib/mock/seed";
import type { Locale, Role } from "@/types/portal";

const DEMO_ROLES: Role[] = ["business", "individual", "agent"];
/** Demo phone numbers (from the seed) — tap to fill the phone field. */
const DEMO_PHONES = users
  .filter((u) => u.phone)
  .map((u) => ({ phone: u.phone as string, role: u.role }));

export function LoginForm() {
  const t = useTranslations("auth.login");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [tab, setTab] = useState<"phone" | "email">("phone");
  const [pending, startTransition] = useTransition();

  // phone
  const [phone, setPhone] = useState("");
  // email
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!isCompleteThaiPhone(phone)) return;
    startTransition(async () => {
      await requestOtp(phone);
      router.push(
        `/verify-otp?phone=${encodeURIComponent(phone)}&purpose=login`,
      );
    });
  }

  function submitEmail(e: React.FormEvent) {
    e.preventDefault();
    setError(false);
    startTransition(async () => {
      const res = await signInWithPassword(locale, email, password);
      if (res && !res.ok) setError(true);
    });
  }

  return (
    <div className="w-full max-w-md">
      <div className="card p-7">
        <h1 className="text-2xl font-700 text-ink-900 font-display">
          {t("title")}
        </h1>
        <p className="mt-1 text-sm text-ink-500">{t("subtitle")}</p>

        <Tabs
          className="mt-5 w-full"
          value={tab}
          onChange={setTab}
          tabs={[
            { key: "phone", label: t("tabPhone") },
            { key: "email", label: t("tabEmail") },
          ]}
        />

        {tab === "phone" ? (
          <form onSubmit={sendOtp} className="mt-5 space-y-4">
            <PhoneField
              label={t("phoneLabel")}
              hint={t("phoneHint")}
              value={phone}
              onChange={setPhone}
            />
            <div>
              <p className="text-xs text-ink-400 mb-1.5">{t("demoPhones")}</p>
              <div className="flex flex-wrap gap-1.5">
                {DEMO_PHONES.map(({ phone: p, role }) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPhone(p)}
                    className="chip bg-sky-100 text-brand-700 text-xs hover:bg-sky-200"
                  >
                    {p}
                    <span className="text-brand-400">· {role}</span>
                  </button>
                ))}
              </div>
            </div>
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={pending || !isCompleteThaiPhone(phone)}
            >
              {t("sendOtp")}
            </Button>
          </form>
        ) : (
          <form onSubmit={submitEmail} className="mt-5 space-y-4">
            <Input
              type="email"
              label={t("emailLabel")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="business@tkr.demo"
              autoComplete="email"
              required
            />
            <Input
              type="password"
              label={t("passwordLabel")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="demo1234"
              autoComplete="current-password"
              error={error ? t("error") : undefined}
              required
            />
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-ink-600">
                <input type="checkbox" className="rounded border-ink-300" />
                {t("remember")}
              </label>
              <Link
                href="/forgot-password"
                className="font-600 text-brand-600 hover:underline"
              >
                {t("forgot")}
              </Link>
            </div>
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={pending}
            >
              {t("submit")}
            </Button>
          </form>
        )}

        <div className="my-5 flex items-center gap-3 text-xs text-ink-400">
          <span className="h-px flex-1 bg-ink-100" />
          {t("or")}
          <span className="h-px flex-1 bg-ink-100" />
        </div>

        <SocialButtons />

        <p className="mt-6 text-center text-sm text-ink-500">
          {t("noAccount")}{" "}
          <Link href="/signup" className="font-600 text-brand-600 hover:underline">
            {t("signupLink")}
          </Link>
        </p>
      </div>

      {/* Demo accounts — one-tap sign-in for review */}
      <div className="card p-4 mt-4">
        <p className="text-xs font-700 uppercase tracking-wide text-ink-400 mb-2">
          {t("demoTitle")}
        </p>
        <div className="grid grid-cols-3 gap-2">
          {DEMO_ROLES.map((role) => (
            <button
              key={role}
              type="button"
              disabled={pending}
              onClick={() => startTransition(() => signInAsRole(locale, role))}
              className="btn btn-ghost btn-sm disabled:opacity-50"
            >
              {role}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
