"use client";

import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Icon, type IconName } from "@/components/ui/Icon";
import {
  LINE_CHAT_BG,
  LINE_GREEN,
  LINE_POLICY_ROWS,
  LINE_RICH_MENU,
  LINE_SCRIPT,
} from "@/config/line";

/** Inline-coloured icon (ports the original `lineIc(name,size,color)` helper). */
function CIcon({ name, size = 20, color }: { name: IconName; size?: number; color?: string }) {
  return (
    <span style={{ width: size, height: size, display: "inline-flex", color }}>
      <Icon name={name} size={size} />
    </span>
  );
}

function Avatar() {
  return (
    <div
      style={{
        width: 30,
        height: 30,
        borderRadius: "50%",
        background: LINE_GREEN,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        color: "#fff",
        fontWeight: 700,
        fontSize: 12,
      }}
    >
      TKR
    </div>
  );
}

function Bubble({ children, me }: { children: ReactNode; me?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: me ? "flex-end" : "flex-start", marginBottom: 8, alignItems: "flex-end", gap: 6 }}>
      {!me && <Avatar />}
      <div
        style={{
          maxWidth: "74%",
          padding: "9px 13px",
          borderRadius: 16,
          fontSize: 13.5,
          lineHeight: 1.45,
          background: me ? LINE_GREEN : "#fff",
          color: me ? "#fff" : "#1a1a1a",
          borderBottomRightRadius: me ? 4 : 16,
          borderBottomLeftRadius: me ? 16 : 4,
          boxShadow: "0 1px 1px rgba(0,0,0,.08)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function FlexPolicy() {
  const t = useTranslations("line.policy");
  return (
    <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 8, gap: 6, alignItems: "flex-end" }}>
      <Avatar />
      <div style={{ width: 250, borderRadius: 16, overflow: "hidden", background: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,.12)", borderBottomLeftRadius: 4 }}>
        <div style={{ background: "linear-gradient(135deg,#1f66ee,#0b2240)", padding: "14px 16px", color: "#fff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11, opacity: 0.8 }}>{t("type")}</span>
            <span style={{ fontSize: 10, fontWeight: 700, background: "rgba(245,158,11,.25)", color: "#fcd34d", padding: "3px 8px", borderRadius: 999 }}>
              {t("badge")}
            </span>
          </div>
          <p style={{ margin: "6px 0 0", fontWeight: 700, fontSize: 16 }}>{t("car")}</p>
          <p style={{ margin: "2px 0 0", fontSize: 11, opacity: 0.85 }}>{t("plate")}</p>
        </div>
        <div style={{ padding: "12px 16px" }}>
          {LINE_POLICY_ROWS.map((k) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "4px 0", color: "#475569" }}>
              <span>{t(`rows.${k}.label`)}</span>
              <span style={{ fontWeight: 600, color: "#0b2240" }}>{t(`rows.${k}.value`)}</span>
            </div>
          ))}
          <button style={{ width: "100%", marginTop: 8, padding: "9px", borderRadius: 10, border: "1px solid #d6e4f5", background: "#f4f9ff", color: "#0f52c7", fontWeight: 600, fontSize: 12.5, cursor: "pointer" }}>
            {t("detailBtn")}
          </button>
        </div>
      </div>
    </div>
  );
}

function FlexRenew() {
  const t = useTranslations("line.renew");
  return (
    <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 8, gap: 6, alignItems: "flex-end" }}>
      <Avatar />
      <div style={{ width: 250, borderRadius: 16, overflow: "hidden", background: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,.12)", borderBottomLeftRadius: 4, padding: 16 }}>
        <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>{t("label")}</p>
        <p style={{ margin: "2px 0 0", fontWeight: 700, fontSize: 26, color: "#0f52c7" }}>
          {t("price")}{" "}
          <span style={{ fontSize: 13, color: "#94a3b8", textDecoration: "line-through", fontWeight: 500 }}>{t("original")}</span>
        </p>
        <button style={{ width: "100%", marginTop: 12, padding: "11px", borderRadius: 10, border: "none", background: LINE_GREEN, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
          {t("payBtn")}
        </button>
        <button style={{ width: "100%", marginTop: 8, padding: "9px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", color: "#475569", fontWeight: 600, fontSize: 12.5, cursor: "pointer" }}>
          {t("quoteBtn")}
        </button>
      </div>
    </div>
  );
}

/**
 * LINE Concierge — chat + rich menu shown inside <IOSFrame>. Native React 19
 * port of line.jsx. The `+` button toggles the rich-menu grid (the only
 * interaction; the conversation is fully scripted/static).
 */
export function LineApp() {
  const t = useTranslations("line");
  const [menuOpen, setMenuOpen] = useState(true);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: LINE_CHAT_BG, fontFamily: "Anuphan, sans-serif" }}>
      {/* LINE chat header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "6px 14px 10px", display: "flex", alignItems: "center", gap: 10 }}>
        <CIcon name="chevR" size={22} color="#1f66ee" />
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: LINE_GREEN, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13 }}>
          TKR
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "#0b2240" }}>{t("chat.accountName")}</p>
          <p style={{ margin: 0, fontSize: 11, color: LINE_GREEN, display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: LINE_GREEN }} />
            {t("chat.accountStatus")}
          </p>
        </div>
        <CIcon name="phone" size={20} color="#64748b" />
      </div>

      {/* messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 12px 8px" }}>
        {LINE_SCRIPT.map((m, i) => {
          if (m.kind === "sys") {
            return (
              <div key={i} style={{ textAlign: "center", margin: "4px 0 12px" }}>
                <span style={{ fontSize: 11, color: "#fff", background: "rgba(0,0,0,.18)", padding: "3px 12px", borderRadius: 999 }}>
                  {t(`chat.${m.textKey}`)}
                </span>
              </div>
            );
          }
          if (m.kind === "flexPolicy") return <FlexPolicy key={i} />;
          if (m.kind === "flexRenew") return <FlexRenew key={i} />;
          return (
            <Bubble key={i} me={m.kind === "me"}>
              {t(`chat.${m.textKey}`)}
            </Bubble>
          );
        })}
      </div>

      {/* rich menu toggle bar */}
      <div style={{ background: "#fff", borderTop: "1px solid #e5e7eb" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px" }}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            style={{ border: "none", background: "#f1f5f9", borderRadius: 999, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
          >
            <CIcon name={menuOpen ? "chevD" : "plus"} size={20} color="#64748b" />
          </button>
          <div style={{ flex: 1, background: "#f1f5f9", borderRadius: 999, padding: "9px 14px", fontSize: 13, color: "#94a3b8" }}>
            {t("chat.inputPlaceholder")}
          </div>
          <span style={{ flexShrink: 0 }}>
            <CIcon name="chat" size={22} color={LINE_GREEN} />
          </span>
        </div>
        {/* RICH MENU grid */}
        {menuOpen && (
          <div style={{ borderTop: "1px solid #eef2f7", background: "linear-gradient(180deg,#f4f9ff,#fff)", padding: 10, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {LINE_RICH_MENU.map((item) => (
              <button
                key={item.key}
                style={{ border: "1px solid #e7eef9", background: "#fff", borderRadius: 14, padding: "12px 6px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}
              >
                <span style={{ width: 38, height: 38, borderRadius: 11, background: "#eaf2fe", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <CIcon name={item.icon} size={20} color="#1f66ee" />
                </span>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#1d4c87", textAlign: "center", lineHeight: 1.2 }}>
                  {t(`richMenu.${item.key}`)}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
