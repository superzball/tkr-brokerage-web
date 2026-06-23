"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Tabs } from "@/components/app/Tabs";
import { Modal } from "@/components/app/Modal";
import { Input } from "@/components/app/form";
import { useToast } from "@/components/app/toast";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { LocaleSwitcher } from "@/components/ui/LocaleSwitcher";
import { cn } from "@/lib/cn";

type Tab = "company" | "team" | "notifications" | "language";

type Member = { id: string; name: string; email: string; role: string };

export function SettingsClient({
  company,
  email,
  phone,
}: {
  company: string;
  email: string;
  phone: string;
}) {
  const t = useTranslations("business");
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>("company");
  const [invite, setInvite] = useState(false);
  const [notif, setNotif] = useState({
    policy: true,
    claim: true,
    billing: true,
    marketing: false,
  });

  const members: Member[] = [
    { id: "m1", name: "คุณสมชาย เจริญทรัพย์", email, role: t("settings.team.roleOwner") },
    { id: "m2", name: "คุณวิภา ทองดี", email: "hr@tkr.demo", role: t("settings.team.roleAdmin") },
    { id: "m3", name: "คุณอนุชา ศรีสุข", email: "ops@tkr.demo", role: t("settings.team.roleViewer") },
  ];

  return (
    <div className="space-y-5">
      <Tabs<Tab>
        tabs={[
          { key: "company", label: t("settings.tabs.company") },
          { key: "team", label: t("settings.tabs.team") },
          { key: "notifications", label: t("settings.tabs.notifications") },
          { key: "language", label: t("settings.tabs.language") },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === "company" && (
        <section className="card p-6 max-w-2xl">
          <h2 className="font-700 text-ink-900 mb-5">{t("settings.company.title")}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label={t("settings.company.name")} defaultValue={company} />
            <Input label={t("settings.company.taxId")} defaultValue="0105551234567" />
            <Input label={t("settings.company.email")} defaultValue={email} type="email" />
            <Input label={t("settings.company.phone")} defaultValue={phone} />
            <div className="sm:col-span-2">
              <Input
                label={t("settings.company.address")}
                defaultValue="123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110"
              />
            </div>
          </div>
          <div className="mt-5">
            <Button
              variant="primary"
              size="md"
              onClick={() => toast(t("settings.saved"), "success")}
            >
              {t("common.save")}
            </Button>
          </div>
        </section>
      )}

      {tab === "team" && (
        <section className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-700 text-ink-900">{t("settings.team.title")}</h2>
            <Button variant="primary" size="sm" onClick={() => setInvite(true)}>
              <Icon name="plus" size={16} /> {t("settings.team.invite")}
            </Button>
          </div>
          <ul className="divide-y divide-ink-50">
            {members.map((m) => (
              <li key={m.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-600 text-ink-900">{m.name}</p>
                  <p className="text-xs text-ink-500">{m.email}</p>
                </div>
                <span className="chip bg-sky-100 text-brand-700">{m.role}</span>
              </li>
            ))}
          </ul>

          <Modal
            open={invite}
            onClose={() => setInvite(false)}
            title={t("settings.team.invite")}
            footer={
              <>
                <Button variant="ghost" size="md" onClick={() => setInvite(false)}>
                  {t("common.cancel")}
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    toast(t("settings.team.invited"), "success");
                    setInvite(false);
                  }}
                >
                  {t("settings.team.invite")}
                </Button>
              </>
            }
          >
            <div className="space-y-4">
              <Input label={t("settings.team.name")} />
              <Input label={t("settings.team.email")} type="email" />
            </div>
          </Modal>
        </section>
      )}

      {tab === "notifications" && (
        <section className="card p-6 max-w-xl">
          <h2 className="font-700 text-ink-900 mb-4">
            {t("settings.notifications.title")}
          </h2>
          <ul className="divide-y divide-ink-50">
            {(["policy", "claim", "billing", "marketing"] as const).map((k) => (
              <li key={k} className="flex items-center justify-between py-3.5">
                <span className="text-sm text-ink-800">
                  {t(`settings.notifications.${k}`)}
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={notif[k]}
                  onClick={() => setNotif((n) => ({ ...n, [k]: !n[k] }))}
                  className={cn(
                    "relative h-6 w-11 rounded-full transition-colors",
                    notif[k] ? "bg-brand-500" : "bg-ink-200",
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                      notif[k] && "translate-x-5",
                    )}
                  />
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-5">
            <Button
              variant="primary"
              size="md"
              onClick={() => toast(t("settings.saved"), "success")}
            >
              {t("common.save")}
            </Button>
          </div>
        </section>
      )}

      {tab === "language" && (
        <section className="card p-6 max-w-xl">
          <h2 className="font-700 text-ink-900">{t("settings.language.title")}</h2>
          <p className="mt-1.5 mb-4 text-sm text-ink-500">
            {t("settings.language.desc")}
          </p>
          <LocaleSwitcher />
        </section>
      )}
    </div>
  );
}
