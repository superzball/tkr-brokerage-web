// src/components/auth/OtpForm.tsx
// Shared 6-digit OTP screen (phone login, phone signup, step-up). Resend timer
// + "change number". Mock code is 123456. Login verifies against a demo user;
// signup just advances to onboarding.

"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { verifyOtp, verifySignupOtp, requestOtp } from "@/lib/auth/actions";
import type { Locale, Role } from "@/types/portal";
import { cn } from "@/lib/cn";

const RESEND_SECONDS = 30;

export function OtpForm({
  phone,
  purpose,
  role,
  next,
}: {
  phone: string;
  purpose: "login" | "signup";
  role?: Role;
  /** Post-login redirect target (carried from the login link, e.g. checkout). */
  next?: string;
}) {
  const t = useTranslations("auth.otp");
  const locale = useLocale() as Locale;
  const [pending, startTransition] = useTransition();
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState(false);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [seconds]);

  const code = digits.join("");

  function setDigit(i: number, v: string) {
    const d = v.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[i] = d;
      return next;
    });
    if (d && i < 5) refs.current[i + 1]?.focus();
  }

  function onKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  }

  function onPaste(e: React.ClipboardEvent) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(6).fill("");
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setDigits(next);
    refs.current[Math.min(pasted.length, 5)]?.focus();
  }

  function verify(e: React.FormEvent) {
    e.preventDefault();
    if (code.length !== 6) return;
    setError(false);
    startTransition(async () => {
      const res =
        purpose === "signup" && role
          ? await verifySignupOtp(locale, role, code)
          : await verifyOtp(locale, phone, code, next);
      if (res && !res.ok) setError(true);
    });
  }

  function resend() {
    startTransition(async () => {
      await requestOtp(phone);
      setSeconds(RESEND_SECONDS);
      setDigits(Array(6).fill(""));
      setError(false);
    });
  }

  const changeHref = purpose === "signup" ? "/signup" : "/login";

  return (
    <div className="card p-7 w-full max-w-md">
      <h1 className="text-2xl font-700 text-ink-900 font-display">
        {t("title")}
      </h1>
      <p className="mt-1 text-sm text-ink-500">
        {t("subtitle", { phone: `+66 ${phone}` })}
      </p>

      <form onSubmit={verify} className="mt-6">
        <div className="flex justify-between gap-2" onPaste={onPaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              value={d}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => onKeyDown(i, e)}
              inputMode="numeric"
              maxLength={1}
              autoFocus={i === 0}
              className={cn(
                "field text-center text-xl font-700 tabnum w-full px-0",
                error && "border-rose-400",
              )}
            />
          ))}
        </div>
        {error && <p className="mt-2 text-xs text-rose-600">{t("error")}</p>}
        <p className="mt-2 text-xs text-ink-400">{t("hint")}</p>

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-5"
          disabled={pending || code.length !== 6}
        >
          {t("verify")}
        </Button>
      </form>

      <div className="mt-5 flex items-center justify-between text-sm">
        {seconds > 0 ? (
          <span className="text-ink-400 tabnum">
            {t("resendIn", { seconds })}
          </span>
        ) : (
          <button
            type="button"
            onClick={resend}
            disabled={pending}
            className="font-600 text-brand-600 hover:underline disabled:opacity-50"
          >
            {t("resend")}
          </button>
        )}
        <Link
          href={changeHref}
          className="inline-flex items-center gap-1 text-ink-500 hover:text-ink-800"
        >
          <Icon name="arrowRight" size={14} className="rotate-180" />
          {t("changeNumber")}
        </Link>
      </div>
    </div>
  );
}
