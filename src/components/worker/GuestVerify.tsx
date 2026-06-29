// src/components/worker/GuestVerify.tsx
// Guest checkout: verify a phone via OTP BEFORE payment so anonymous buyers
// aren't forced to register up front. Two phases — phone entry → 6-digit OTP.
// Mock: the only accepted code is 123456 (mirrors auth.otp). On success it calls
// onVerified(phone); the parent then unlocks the pay button. A real backend would
// POST to an SMS/OTP service and return a verification token.

"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ConsentFields } from "@/components/legal/ConsentFields";
import { startGuestSession } from "@/lib/auth/actions";
import { cn } from "@/lib/cn";
import { recordConsents } from "@/lib/legal/consent";
import { currentPolicyVersion } from "@/lib/mock/seed";

const RESEND_SECONDS = 30;

export function GuestVerify({
  onVerified,
  onLogin,
}: {
  /** Called after the OTP verifies + a silent session starts. `isGuest` is
   *  false when the phone resumed an existing full account. */
  onVerified: (phone: string, isGuest: boolean) => void;
  /** Optional escape hatch for returning users who'd rather sign in. */
  onLogin?: () => void;
}) {
  const tc = useTranslations("checkout.verify");
  const to = useTranslations("auth.otp");
  const [phase, setPhase] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [phoneErr, setPhoneErr] = useState(false);
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [otpErr, setOtpErr] = useState(false);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const [verifying, setVerifying] = useState(false);
  // PDPA consent (required before sending the OTP) + optional marketing opt-in.
  const [pdpa, setPdpa] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [consentErr, setConsentErr] = useState(false);
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (phase !== "otp" || seconds <= 0) return;
    const id = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [phase, seconds]);

  const cleanPhone = phone.replace(/[\s-]/g, "");
  const code = digits.join("");

  function sendOtp() {
    if (!/^0\d{8,9}$/.test(cleanPhone)) {
      setPhoneErr(true);
      return;
    }
    if (!pdpa) {
      setConsentErr(true);
      return;
    }
    setPhoneErr(false);
    setDigits(Array(6).fill(""));
    setOtpErr(false);
    setSeconds(RESEND_SECONDS);
    setPhase("otp");
  }

  function setDigit(i: number, v: string) {
    const d = v.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[i] = d;
      return next;
    });
    if (d && i < 5) refs.current[i + 1]?.focus();
  }

  function onKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  }

  function onPaste(e: React.ClipboardEvent) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(6).fill("");
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setDigits(next);
    refs.current[Math.min(pasted.length, 5)]?.focus();
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    if (code.length !== 6 || verifying) return;
    setVerifying(true);
    // OTP success silently starts a session (guest or resumed account).
    const res = await startGuestSession(cleanPhone, code);
    setVerifying(false);
    if (res.ok) {
      // Capture the PDPA + marketing consents against the phone identity.
      recordConsents([
        { subjectId: cleanPhone, type: "pdpa_service", granted: true, policyVersion: currentPolicyVersion("privacy"), source: "guest_checkout" },
        { subjectId: cleanPhone, type: "marketing", granted: marketing, policyVersion: currentPolicyVersion("privacy"), source: "guest_checkout" },
      ]);
      onVerified(cleanPhone, res.guest);
    } else setOtpErr(true);
  }

  function resend() {
    setSeconds(RESEND_SECONDS);
    setDigits(Array(6).fill(""));
    setOtpErr(false);
  }

  return (
    <div className="mt-6 rounded-2xl border border-brand-100 bg-sky-50/70 p-5 text-left">
      {phase === "phone" ? (
        <>
          <p className="font-600 text-ink-900 flex items-center gap-2">
            <span className="text-brand-600">
              <Icon name="phone" size={18} />
            </span>
            {tc("title")}
          </p>
          <p className="mt-1 text-sm text-ink-600">{tc("desc")}</p>

          <div className="mt-4">
            <label className="field-label">{tc("phoneLabel")}</label>
            <input
              type="tel"
              inputMode="tel"
              autoFocus
              className={cn("field", phoneErr && "border-rose-400")}
              placeholder={tc("phonePh")}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendOtp()}
            />
            {phoneErr && <p className="mt-1 text-xs text-rose-600">{tc("phoneError")}</p>}
          </div>

          <div className="mt-4">
            <ConsentFields
              pdpa={pdpa}
              marketing={marketing}
              onPdpa={(v) => {
                setPdpa(v);
                if (v) setConsentErr(false);
              }}
              onMarketing={setMarketing}
              error={consentErr}
            />
          </div>

          <Button variant="primary" size="md" className="mt-4" onClick={sendOtp}>
            {tc("sendOtp")} <Icon name="arrowRight" />
          </Button>

          {onLogin && (
            <button
              type="button"
              onClick={onLogin}
              className="mt-3 block text-sm font-600 text-brand-600 hover:underline"
            >
              {tc("haveAccount")}
            </button>
          )}
        </>
      ) : (
        <form onSubmit={verify}>
          <p className="font-600 text-ink-900">{to("title")}</p>
          <p className="mt-1 text-sm text-ink-600">
            {to("subtitle", { phone: `+66 ${cleanPhone}` })}
          </p>

          <div className="mt-4 flex justify-between gap-2" onPaste={onPaste}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                value={d}
                onChange={(e) => setDigit(i, e.target.value)}
                onKeyDown={(e) => onKeyDown(i, e)}
                inputMode="numeric"
                maxLength={1}
                autoFocus={i === 0}
                className={cn(
                  "field text-center text-xl font-700 tabnum w-full px-0",
                  otpErr && "border-rose-400",
                )}
              />
            ))}
          </div>
          {otpErr && <p className="mt-2 text-xs text-rose-600">{to("error")}</p>}
          <p className="mt-2 text-xs text-ink-400">{to("hint")}</p>

          <Button type="submit" variant="primary" className="mt-4" disabled={code.length !== 6} loading={verifying}>
            {to("verify")}
          </Button>

          <div className="mt-4 flex items-center justify-between text-sm">
            {seconds > 0 ? (
              <span className="text-ink-400 tabnum">{to("resendIn", { seconds })}</span>
            ) : (
              <button
                type="button"
                onClick={resend}
                className="font-600 text-brand-600 hover:underline"
              >
                {to("resend")}
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setPhase("phone");
                setDigits(Array(6).fill(""));
                setOtpErr(false);
              }}
              className="inline-flex items-center gap-1 text-ink-500 hover:text-ink-800"
            >
              <Icon name="arrowRight" size={14} className="rotate-180" />
              {tc("changePhone")}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
