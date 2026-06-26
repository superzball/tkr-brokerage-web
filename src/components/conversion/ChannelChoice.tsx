// src/components/conversion/ChannelChoice.tsx
// TKR's edge over pure-D2C: at every quote/checkout the customer chooses to
// "ซื้อเอง" (self-serve) OR "ให้ตัวแทนช่วย" (assign/contact an agent). The agent
// path is never removed. Self-serve calls onSelf() to continue the flow; the
// agent path captures a callback request (mock) and shows a success state.

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { FieldLabel, TextField } from "@/components/ui/Field";
import { cn } from "@/lib/cn";
import type { SalesChannel } from "@/types/portal";

export function ChannelChoice({
  onSelf,
  defaultChannel = null,
  className,
}: {
  /** Continue the self-serve flow (e.g. reveal payment). */
  onSelf: () => void;
  defaultChannel?: SalesChannel | null;
  className?: string;
}) {
  const t = useTranslations("conversion.channel");
  const [channel, setChannel] = useState<SalesChannel | null>(defaultChannel);
  const [requested, setRequested] = useState(false);

  if (requested) {
    return (
      <div className={cn("card p-6 text-center", className)}>
        <span className="mx-auto w-14 h-14 rounded-full bg-mint-50 text-mint-500 flex items-center justify-center mb-3">
          <Icon name="checkCircle" size={30} />
        </span>
        <p className="font-600 text-ink-900">{t("requested")}</p>
        <Button
          variant="ghost"
          size="sm"
          className="mt-4"
          onClick={() => {
            setRequested(false);
            setChannel("self");
            onSelf();
          }}
        >
          {t("keepSelf")}
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("", className)}>
      <h3 className="font-display font-700 text-xl text-ink-900">{t("heading")}</h3>
      <p className="text-ink-600 mt-1 text-sm">{t("sub")}</p>

      <div className="mt-4 grid sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setChannel("self")}
          className={cn("seg !items-start text-left", channel === "self" && "is-on")}
        >
          <div className="flex items-start gap-3">
            <span className="w-10 h-10 rounded-xl bg-sky-100 text-brand-600 inline-flex items-center justify-center shrink-0">
              <Icon name="user" />
            </span>
            <div>
              <p className="font-600 text-ink-900">{t("selfTitle")}</p>
              <p className="text-sm text-ink-500 mt-0.5">{t("selfDesc")}</p>
            </div>
          </div>
        </button>
        <button
          type="button"
          onClick={() => setChannel("agent")}
          className={cn("seg !items-start text-left", channel === "agent" && "is-on")}
        >
          <div className="flex items-start gap-3">
            <span className="w-10 h-10 rounded-xl bg-gold-100 text-gold-600 inline-flex items-center justify-center shrink-0">
              <Icon name="headset" />
            </span>
            <div>
              <p className="font-600 text-ink-900">{t("agentTitle")}</p>
              <p className="text-sm text-ink-500 mt-0.5">{t("agentDesc")}</p>
            </div>
          </div>
        </button>
      </div>

      {channel === "self" && (
        <Button variant="primary" size="md" className="mt-5" onClick={onSelf}>
          {t("continue")} <Icon name="arrowRight" />
        </Button>
      )}

      {channel === "agent" && (
        <form
          className="mt-5 card p-5 space-y-3.5 max-w-md"
          onSubmit={(e) => {
            e.preventDefault();
            setRequested(true);
          }}
        >
          <div>
            <FieldLabel>{t("formName")}</FieldLabel>
            <TextField required placeholder={t("formName")} />
          </div>
          <div>
            <FieldLabel>{t("formPhone")}</FieldLabel>
            <TextField required type="tel" inputMode="tel" placeholder="08x-xxx-xxxx" />
          </div>
          <div>
            <FieldLabel>{t("formNote")}</FieldLabel>
            <TextField placeholder={t("formNote")} />
          </div>
          <Button variant="primary" size="md" className="w-full" type="submit">
            <Icon name="headset" /> {t("request")}
          </Button>
        </form>
      )}
    </div>
  );
}
