// src/components/auth/PhoneField.tsx
// +66 Thai mobile input, auto-formatted as 08x-xxx-xxxx. Stores the formatted
// string; findUserByPhone strips separators when matching demo accounts.

"use client";

import { Field } from "@/components/app/form";
import { formatThaiPhone } from "@/lib/phone";

export function PhoneField({
  label,
  hint,
  error,
  value,
  onChange,
}: {
  label?: string;
  hint?: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field label={label} hint={hint} error={error}>
      <div className="flex">
        <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-ink-200 bg-ink-50 text-ink-600 text-sm font-600">
          +66
        </span>
        <input
          type="tel"
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(formatThaiPhone(e.target.value))}
          placeholder="081-000-0001"
          className="field rounded-l-none"
        />
      </div>
    </Field>
  );
}
