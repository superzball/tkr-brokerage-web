// src/components/app/admin/AdminForbidden.tsx
// 403 shown when a staff user hits an admin route outside their staffRole.

import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/app/EmptyState";

export async function AdminForbidden() {
  const t = await getTranslations("admin.forbidden");
  return (
    <EmptyState
      icon="lock"
      title={t("title")}
      body={t("body")}
      action={
        <Button href="/admin" variant="primary" size="sm">
          {t("back")}
        </Button>
      }
    />
  );
}
