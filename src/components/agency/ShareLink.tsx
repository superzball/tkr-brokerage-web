"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icon";

/**
 * Personal sales link + copy button. Mirrors the agency.js `copylink` handler:
 * on click, the label flips to "คัดลอกแล้ว" for 1.6s, then reverts.
 */
export function ShareLink() {
  const t = useTranslations("agency.share");
  const [copied, setCopied] = useState(false);

  function copy() {
    const url = t("url");
    if (navigator.clipboard) navigator.clipboard.writeText(url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="mt-4 flex items-center gap-2 rounded-xl bg-sky-100 p-2 pl-3.5">
      <span className="text-sm text-ink-600 truncate flex-1">{t("url")}</span>
      <button
        onClick={copy}
        className="btn btn-primary btn-sm shrink-0"
      >
        <Icon name={copied ? "check" : "copy"} />{" "}
        {copied ? t("copied") : t("copy")}
      </button>
    </div>
  );
}
