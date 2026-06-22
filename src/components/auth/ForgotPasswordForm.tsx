// src/components/auth/ForgotPasswordForm.tsx
// Request a (mock) password-reset link. Always "succeeds".

"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/app/form";
import { Icon } from "@/components/ui/Icon";
import { requestPasswordReset } from "@/lib/auth/actions";

export function ForgotPasswordForm() {
  const t = useTranslations("auth.forgot");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await requestPasswordReset(email);
      setSent(true);
    });
  }

  return (
    <div className="card p-7 w-full max-w-md">
      <h1 className="text-2xl font-700 text-ink-900 font-display">{t("title")}</h1>
      <p className="mt-1 text-sm text-ink-500">{t("subtitle")}</p>

      {sent ? (
        <div className="mt-6 rounded-xl bg-emerald-50 text-emerald-700 p-4 flex items-start gap-2.5 text-sm">
          <Icon name="checkCircle" size={18} className="mt-0.5 shrink-0" />
          <span>{t("success")}</span>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-6 space-y-4">
          <Input
            type="email"
            label={t("emailLabel")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          <Button type="submit" variant="primary" className="w-full" disabled={pending}>
            {t("submit")}
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm">
        <Link href="/login" className="font-600 text-brand-600 hover:underline">
          {t("backToLogin")}
        </Link>
      </p>
    </div>
  );
}
