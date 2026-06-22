// src/components/auth/ResetPasswordForm.tsx
// Set a new password (mock). Validates match, then shows success + login link.

"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/app/form";
import { Icon } from "@/components/ui/Icon";
import { resetPassword } from "@/lib/auth/actions";

export function ResetPasswordForm() {
  const t = useTranslations("auth.reset");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [mismatch, setMismatch] = useState(false);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setMismatch(true);
      return;
    }
    setMismatch(false);
    startTransition(async () => {
      await resetPassword(password);
      setDone(true);
    });
  }

  return (
    <div className="card p-7 w-full max-w-md">
      <h1 className="text-2xl font-700 text-ink-900 font-display">{t("title")}</h1>
      <p className="mt-1 text-sm text-ink-500">{t("subtitle")}</p>

      {done ? (
        <>
          <div className="mt-6 rounded-xl bg-emerald-50 text-emerald-700 p-4 flex items-start gap-2.5 text-sm">
            <Icon name="checkCircle" size={18} className="mt-0.5 shrink-0" />
            <span>{t("success")}</span>
          </div>
          <Button href="/login" variant="primary" className="w-full mt-5">
            {t("backToLogin")}
          </Button>
        </>
      ) : (
        <form onSubmit={submit} className="mt-6 space-y-4">
          <Input
            type="password"
            label={t("passwordLabel")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            label={t("confirmLabel")}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            error={mismatch ? t("mismatch") : undefined}
            required
          />
          <Button type="submit" variant="primary" className="w-full" disabled={pending}>
            {t("submit")}
          </Button>
        </form>
      )}
    </div>
  );
}
