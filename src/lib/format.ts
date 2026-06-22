import { useFormatter } from "next-intl";

/**
 * Returns a ฿ formatter backed by next-intl. Uses THB with the narrow symbol
 * (฿) so the baht glyph shows in every locale while digit grouping localizes —
 * replacing the original `'฿' + Number(n).toLocaleString('th-TH')`.
 */
export function useBaht() {
  const format = useFormatter();
  return (amount: number) =>
    format.number(amount, {
      style: "currency",
      currency: "THB",
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: 0,
    });
}
