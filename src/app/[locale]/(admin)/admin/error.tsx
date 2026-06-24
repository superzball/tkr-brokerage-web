"use client";

import { useTranslations } from "next-intl";
import { EmptyState } from "@/components/app/EmptyState";
import { Button } from "@/components/ui/Button";

/** Shared error boundary for every admin screen. */
export default function AdminError({ reset }: { error: Error; reset: () => void }) {
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
