// src/components/guest/ProgressiveProfile.tsx
// Post-purchase, OPTIONAL "complete your profile" card shown to a guest who just
// bought via phone-OTP checkout. Filling it promotes guest -> active. Fully
// dismissible — never blocks anything. (Requires a ToastProvider in the zone.)

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useToast } from "@/components/app/toast";
import { completeGuestProfile } from "@/lib/auth/actions";
import { recordEarn } from "@/lib/loyalty/local";

export function ProgressiveProfile({ className }: { className?: string }) {
  const t = useTranslations("guest.profile");
  const tl = useTranslations("loyalty");
  const { toast } = useToast();
  const [dismissed, setDismissed] = useState(false);
  const [done, setDone] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);

  if (dismissed) return null;

  if (done) {
    return (
      <div className={className}>
        <div className="card p-5 flex items-center gap-3 border-mint-200 bg-mint-50">
          <span className="text-mint-600"><Icon name="checkCircle" size={20} /></span>
          <p className="text-sm font-600 text-ink-900">{t("savedNote")}</p>
        </div>
      </div>
    );
  }

  async function save() {
    if (saving) return;
    setSaving(true);
    await completeGuestProfile({ name, email, address });
    // Loyalty earn hook (mock): completing the profile grants the one-time
    // profile-complete points and ties the guest→active conversion to rewards.
    const earned = recordEarn({
      source: "profile_complete",
      points: 100,
      description: tl("earn.earnProfile"),
      tag: "profile_complete",
    });
    setSaving(false);
    setDone(true);
    toast(earned ? tl("earn.earnedProfile") : t("saved"), "success");
  }

  return (
    <div className={className}>
      <div className="card p-6 text-left relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gold-50" aria-hidden="true" />
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label={t("dismiss")}
          className="absolute top-3 right-3 w-8 h-8 rounded-lg text-ink-400 hover:bg-ink-50 flex items-center justify-center"
        >
          <Icon name="x" size={16} />
        </button>

        <div className="relative">
          <span className="inline-flex items-center gap-2 chip bg-gold-50 text-gold-600 text-xs">
            <Icon name="user" size={13} /> {t("optional")}
          </span>
          <h3 className="mt-3 font-display font-700 text-xl text-ink-900">{t("title")}</h3>
          <p className="mt-1 text-sm text-ink-500">{t("desc")}</p>

          <div className="mt-4 space-y-3">
            <div>
              <label className="field-label" htmlFor="pp-name">{t("name")}</label>
              <input id="pp-name" className="field" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="field-label" htmlFor="pp-email">{t("email")}</label>
                <input id="pp-email" type="email" className="field" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="field-label" htmlFor="pp-address">{t("address")}</label>
                <input id="pp-address" className="field" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button variant="primary" size="md" onClick={save} loading={saving}>
              {t("save")}
            </Button>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="text-sm font-600 text-ink-500 hover:text-ink-800"
            >
              {t("skip")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
