// src/components/contact/ContactForm.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useToast } from "@/components/app/toast";
import { cn } from "@/lib/cn";

type Channel = "self" | "agent";

/** Contact form — mock submit (no backend) + success toast. The "agent callback"
 *  channel keeps the agent-assisted path. */
export function ContactForm() {
  const t = useTranslations("contact.form");
  const { toast } = useToast();
  const topics = t.raw("topicOptions") as string[];

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState(topics[0] ?? "");
  const [message, setMessage] = useState("");
  const [channel, setChannel] = useState<Channel>("self");
  const [sending, setSending] = useState(false);
  const [touched, setTouched] = useState(false);

  const valid = name.trim() && (phone.trim() || email.trim());

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!valid) {
      toast(t("required"), "error");
      return;
    }
    setSending(true);
    // mock submit — no backend
    setTimeout(() => {
      setSending(false);
      toast(t("success"), "success");
      setName("");
      setPhone("");
      setEmail("");
      setTopic(topics[0] ?? "");
      setMessage("");
      setChannel("self");
      setTouched(false);
    }, 700);
  }

  return (
    <form onSubmit={submit} className="card p-6 sm:p-7 space-y-4">
      <div>
        <h2 className="font-display font-700 text-xl text-ink-900">{t("title")}</h2>
        <p className="mt-1 text-sm text-ink-500">{t("sub")}</p>
      </div>

      <div>
        <label className="field-label" htmlFor="cf-name">{t("name")}</label>
        <input
          id="cf-name"
          className="field"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={touched && !name.trim() ? true : undefined}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="cf-phone">{t("phone")}</label>
          <input id="cf-phone" type="tel" className="field" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <label className="field-label" htmlFor="cf-email">{t("email")}</label>
          <input id="cf-email" type="email" className="field" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
      </div>

      <div>
        <label className="field-label" htmlFor="cf-topic">{t("topic")}</label>
        <select id="cf-topic" className="field" value={topic} onChange={(e) => setTopic(e.target.value)}>
          {topics.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="field-label" htmlFor="cf-msg">{t("message")}</label>
        <textarea id="cf-msg" className="field min-h-[110px]" value={message} onChange={(e) => setMessage(e.target.value)} />
      </div>

      {/* channel choice — keeps the agent-assisted path */}
      <div>
        <p className="field-label">{t("channelTitle")}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {([
            { key: "self", label: t("channelSelf"), note: "" },
            { key: "agent", label: t("channelAgent"), note: t("channelAgentNote") },
          ] as const).map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setChannel(c.key)}
              aria-pressed={channel === c.key}
              className={cn(
                "text-left rounded-xl border-2 p-3.5 transition-all",
                channel === c.key
                  ? "border-brand-500 bg-sky-50"
                  : "border-ink-100 hover:border-brand-200",
              )}
            >
              <span className="flex items-center gap-2 font-600 text-ink-900 text-sm">
                <Icon name={c.key === "agent" ? "headset" : "user"} size={16} />
                {c.label}
              </span>
              {c.note && <span className="block mt-1 text-xs text-ink-500">{c.note}</span>}
            </button>
          ))}
        </div>
      </div>

      <Button type="submit" variant="primary" size="lg" loading={sending} className="w-full">
        {t("submit")} <Icon name="arrowRight" />
      </Button>
    </form>
  );
}
