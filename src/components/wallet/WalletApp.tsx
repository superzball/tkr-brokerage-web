"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Icon, type IconName } from "@/components/ui/Icon";
import { LocaleSwitcher } from "@/components/ui/LocaleSwitcher";
import {
  WALLET_CARD,
  WALLET_COVERAGE,
  WALLET_HELP_ACTIONS,
  WALLET_TABS,
  type WalletTabKey,
} from "@/config/wallet";

/** Inline-coloured icon (ports the original `ic(name,size,color)` helper —
 *  lucide strokes use currentColor, so colour comes from the wrapper). */
function CIcon({
  name,
  size = 22,
  color,
}: {
  name: IconName;
  size?: number;
  color?: string;
}) {
  return (
    <span style={{ width: size, height: size, display: "inline-flex", color }}>
      <Icon name={name} size={size} />
    </span>
  );
}

/**
 * Worker Wallet — the mobile app shown inside <IOSFrame>. Native React 19 port
 * of wallet.jsx. The old standalone `T = {th,my,lo}` dict is gone: all strings
 * come from the next-intl `wallet.app` namespace (so the in-card language
 * follows the page locale), and the in-app language buttons are now the shared
 * <LocaleSwitcher compact />.
 */
export function WalletApp() {
  const t = useTranslations("wallet.app");
  const [tab, setTab] = useState<WalletTabKey>("card");

  const QR = (
    <div
      style={{
        width: 150,
        height: 150,
        borderRadius: 14,
        background: "#0b2240",
        backgroundImage: "radial-gradient(#fff 30%, transparent 31%)",
        backgroundSize: "11px 11px",
      }}
    />
  );

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#f1f6fd",
        fontFamily: "Anuphan, sans-serif",
      }}
    >
      {/* header w/ language switch */}
      <div
        style={{
          padding: "4px 18px 14px",
          background: "linear-gradient(135deg,#0f52c7,#0b2240)",
          color: "#fff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                width: 30,
                height: 30,
                borderRadius: 9,
                background: "rgba(255,255,255,.16)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CIcon name="shield" size={18} color="#fff" />
            </span>
            <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: "-0.01em" }}>
              TKR Wallet
            </span>
          </div>
          <LocaleSwitcher compact />
        </div>
      </div>

      {/* scroll body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px 90px" }}>
        {tab === "card" && (
          <>
            <p style={{ fontSize: 13, color: "#64789a", fontWeight: 500, margin: "2px 0 10px" }}>
              {t("greeting")}
            </p>
            {/* policy card */}
            <div
              style={{
                borderRadius: 22,
                padding: 20,
                color: "#fff",
                position: "relative",
                overflow: "hidden",
                background: "linear-gradient(135deg,#1f66ee,#0b2240)",
                boxShadow: "0 18px 40px -16px rgba(11,34,64,.6)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -40,
                  right: -30,
                  width: 160,
                  height: 160,
                  borderRadius: "50%",
                  background: "radial-gradient(circle,rgba(242,183,54,.35),transparent 70%)",
                }}
              />
              <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ fontSize: 11, opacity: 0.75, margin: 0 }}>{t("name")}</p>
                  <p style={{ fontSize: 19, fontWeight: 700, margin: "2px 0 0" }}>{t("cardName")}</p>
                  <p style={{ fontSize: 12, opacity: 0.8, margin: "2px 0 0" }}>
                    {t("nat")}: {t("natValue")}
                  </p>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "5px 10px",
                    borderRadius: 999,
                    background: "rgba(52,211,153,.25)",
                    color: "#6ee7b7",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#34d399" }} />
                  {t("active")}
                </span>
              </div>
              <div style={{ position: "relative", marginTop: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <p style={{ fontSize: 10, opacity: 0.7, margin: 0 }}>{t("policyNo")}</p>
                  <p style={{ fontSize: 13, fontWeight: 600, margin: "1px 0 0", letterSpacing: "0.02em" }}>
                    {WALLET_CARD.policyNo}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: 10, opacity: 0.7, margin: 0 }}>{t("valid")}</p>
                  <p style={{ fontSize: 13, fontWeight: 600, margin: "1px 0 0" }}>{WALLET_CARD.validUntil}</p>
                </div>
              </div>
            </div>

            {/* coverage */}
            <p style={{ fontSize: 13, fontWeight: 700, color: "#0b2240", margin: "20px 0 10px" }}>
              {t("coverage")}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {WALLET_COVERAGE.map((c) => (
                <div
                  key={c.key}
                  style={{
                    background: "#fff",
                    borderRadius: 16,
                    padding: "14px 10px",
                    textAlign: "center",
                    border: "1px solid #e7eef9",
                  }}
                >
                  <span
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 11,
                      background: c.color + "1a",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 8,
                    }}
                  >
                    <CIcon name={c.icon} size={20} color={c.color} />
                  </span>
                  <p style={{ fontSize: 11, color: "#64789a", margin: 0, lineHeight: 1.25 }}>{t(c.key)}</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#0b2240", margin: "3px 0 0" }}>{c.amount}</p>
                </div>
              ))}
            </div>

            {/* QR verify */}
            <div
              style={{
                marginTop: 18,
                background: "#fff",
                borderRadius: 20,
                padding: 20,
                textAlign: "center",
                border: "1px solid #e7eef9",
              }}
            >
              <div style={{ display: "inline-block", padding: 12, background: "#fff", borderRadius: 16, boxShadow: "0 4px 14px rgba(11,34,64,.08)" }}>
                {QR}
              </div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 12, fontSize: 12, fontWeight: 600, color: "#059669" }}>
                <CIcon name="shieldCheck" size={16} color="#059669" /> {t("verified")}
              </div>
              <p style={{ fontSize: 12, color: "#64789a", margin: "8px 0 0", lineHeight: 1.4 }}>{t("scan")}</p>
            </div>
          </>
        )}

        {tab === "help" && (
          <div style={{ paddingTop: 6 }}>
            {/* SOS */}
            <button
              style={{
                width: "100%",
                border: "none",
                cursor: "pointer",
                borderRadius: 20,
                padding: 20,
                color: "#fff",
                textAlign: "left",
                background: "linear-gradient(135deg,#ef4444,#b91c1c)",
                boxShadow: "0 14px 30px -12px rgba(239,68,68,.7)",
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <span style={{ width: 50, height: 50, borderRadius: 15, background: "rgba(255,255,255,.2)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                <CIcon name="phone" size={26} color="#fff" />
              </span>
              <span>
                <span style={{ display: "block", fontWeight: 700, fontSize: 16 }}>{t("emergency")}</span>
                <span style={{ fontSize: 13, opacity: 0.85 }}>{t("emergencySub")}</span>
              </span>
            </button>
            {WALLET_HELP_ACTIONS.map((a) => (
              <button
                key={a.key}
                style={{
                  width: "100%",
                  border: "1px solid #e7eef9",
                  cursor: "pointer",
                  borderRadius: 18,
                  padding: 16,
                  background: "#fff",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  marginTop: 12,
                }}
              >
                <span style={{ width: 46, height: 46, borderRadius: 13, background: a.color + "14", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  <CIcon name={a.icon} size={22} color={a.color} />
                </span>
                <span style={{ fontWeight: 600, fontSize: 15, color: "#0b2240" }}>{t(a.key)}</span>
                <span style={{ marginLeft: "auto" }}>
                  <CIcon name="chevR" size={18} color="#aecbff" />
                </span>
              </button>
            ))}
            <div style={{ marginTop: 16, background: "#eaf2fe", borderRadius: 16, padding: 14, display: "flex", gap: 10 }}>
              <CIcon name="info" size={18} color="#0f52c7" />
              <p style={{ fontSize: 12, color: "#1d4c87", margin: 0, lineHeight: 1.5 }}>{t("offlineInfo")}</p>
            </div>
          </div>
        )}
      </div>

      {/* bottom tab bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background: "rgba(255,255,255,.92)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid #e7eef9",
          padding: "10px 0 26px",
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        {WALLET_TABS.map((tb) => (
          <button
            key={tb.key}
            onClick={() => setTab(tb.key)}
            style={{
              border: "none",
              background: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              color: tab === tb.key ? "#0f52c7" : "#9db4d0",
            }}
          >
            <CIcon name={tb.icon} size={24} />
            <span style={{ fontSize: 11, fontWeight: 600 }}>{t(tb.labelKey)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
