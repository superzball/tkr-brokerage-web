"use client";

import { useTranslations } from "next-intl";
import { EmptyState } from "@/components/app/EmptyState";
import { Button } from "@/components/ui/Button";

/** Shared error boundary for every app screen. */
export default function AppError({ reset }: { error: Error; reset: () => void }) {
  const t = useTranslations("business");
  return (
    <EmptyState
      icon="alertTri"
      title={t("common.errorTitle")}
      body={t("common.errorBody")}
      action={
        <Button variant="primary" size="md" onClick={reset}>
          {t("common.retry")}
        </Button>
      }
    />
  );
}
