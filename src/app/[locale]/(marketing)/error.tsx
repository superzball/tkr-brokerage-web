"use client";

import { useTranslations } from "next-intl";
import { EmptyState } from "@/components/app/EmptyState";
import { Button } from "@/components/ui/Button";

/** Error boundary for the public marketing site. */
export default function MarketingError({ reset }: { error: Error; reset: () => void }) {
  const t = useTranslations("business");
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
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
    </div>
  );
}
