// src/components/auth/LoginForm.tsx
// Phase-7 placeholder login. Functional so route protection is demonstrable:
// email+password (the demo accounts) plus one-tap demo sign-in per role.
// The full two-method + social + onboarding flow lands in Phase 8.

"use client";

import { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/app/form";
import { signInWithPassword, signInAsRole } from "@/lib/auth/actions";
import type { Locale, Role } from "@/types/portal";

const DEMO_ROLES: Role[] = ["business", "individual", "agent"];

export function LoginForm() {
  const t = useTranslations("app.login");
  const locale = useLocale() as Locale;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(false);
    startTransition(async () => {
      const res = await signInWithPassword(locale, email, password);
      if (res && !res.ok) setError(true);
    });
  }

  return (
    <Card className="w-full max-w-md p-7">
      <h1 className="text-2xl font-700 text-ink-900 font-display">{t("title")}</h1>
      <p className="mt-1 text-sm text-ink-500">{t("subtitle")}</p>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <Input
          type="email"
          label={t("email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="business@tkr.demo"
          autoComplete="email"
          required
        />
        <Input
          type="password"
          label={t("password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="demo1234"
          autoComplete="current-password"
          error={error ? t("error") : undefined}
          required
        />
        <Button type="submit" variant="primary" className="w-full" disabled={pending}>
          {t("submit")}
        </Button>
      </form>

      <div className="mt-6 pt-5 border-t border-ink-100">
        <p className="text-xs font-700 uppercase tracking-wide text-ink-400 mb-3">
          {t("demoTitle")}
        </p>
        <div className="grid gap-2">
          {DEMO_ROLES.map((role) => (
            <button
              key={role}
              type="button"
              disabled={pending}
              onClick={() => startTransition(() => signInAsRole(locale, role))}
              className="btn btn-ghost btn-sm justify-between disabled:opacity-50"
            >
              <span>{t(role)}</span>
              <span className="text-ink-400 text-xs">{role}@tkr.demo</span>
            </button>
          ))}
        </div>
        <p className="mt-4 text-xs text-ink-400">{t("note")}</p>
      </div>
    </Card>
  );
}
