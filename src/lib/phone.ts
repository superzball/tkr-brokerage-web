// src/lib/phone.ts
// Thai mobile number formatting helpers (display as 08x-xxx-xxxx behind a fixed
// +66 prefix). The seed phones are stored 0xx-xxx-xxxx; findUserByPhone strips
// separators, so the formatted value still matches.

/** Keep only digits, cap at 10 (Thai mobile length incl. leading 0). */
export function digitsOnly(input: string): string {
  return input.replace(/\D/g, "").slice(0, 10);
}

/** Group digits as 3-3-4 → "081-000-0001". */
export function formatThaiPhone(input: string): string {
  const d = digitsOnly(input);
  const a = d.slice(0, 3);
  const b = d.slice(3, 6);
  const c = d.slice(6, 10);
  return [a, b, c].filter(Boolean).join("-");
}

/** A complete Thai mobile number has 10 digits. */
export function isCompleteThaiPhone(input: string): boolean {
  return digitsOnly(input).length === 10;
}
