// src/components/app/Forbidden.tsx
// 403 panel shown when a role hits a route outside its sidebar (the IA guard).

import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "./EmptyState";

export async function Forbidden() {
  const t = await getTranslations("app.forbidden");
  return (
    <EmptyState
      icon="lock"
      title={t("title")}
      body={t("body")}
      action={
        <Button href="/app/dashboard" variant="primary" size="sm">
          {t("back")}
        </Button>
      }
    />
  );
}
