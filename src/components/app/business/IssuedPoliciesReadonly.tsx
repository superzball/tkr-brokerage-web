// src/components/app/business/IssuedPoliciesReadonly.tsx
// Read-only surface of worker-insurance policies issued for this customer (from
// the admin Issue-Policy run). Customers can view + download their certificates
// but cannot edit anything here — the issuance lifecycle lives in the back
// office. Locally-issued rows are merged on top of the seed.

"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icon";
import type { IssuedPolicy } from "@/types/portal";
import { mergeIssued } from "@/lib/mock/local-crm";

export function IssuedPoliciesReadonly({
  seedIssued,
  customerId,
}: {
  seedIssued: IssuedPolicy[];
  customerId: string;
}) {
  const t = useTranslations("business.issued");
  const tc = useTranslations("admin.crm");
  const [rows, setRows] = useState<IssuedPolicy[]>(seedIssued);
  useEffect(
    () => setRows(mergeIssued(seedIssued).filter((p) => p.customerId === customerId)),
    [seedIssued, customerId],
  );

  if (rows.length === 0) return null;

  return (
    <section className="mt-8">
      <div className="flex items-center gap-2 mb-3">
        <Icon name="shieldCheck" size={18} className="text-brand-600" />
        <h2 className="font-700 text-ink-900">{t("title")}</h2>
        <span className="text-xs text-ink-400 tabnum">({rows.length})</span>
      </div>
      <p className="text-sm text-ink-500 mb-3">{t("desc")}</p>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-100 bg-sky-50/60 text-ink-600">
                <th className="px-4 py-3 text-left font-600">{t("col.policyNo")}</th>
                <th className="px-4 py-3 text-left font-600">{t("col.product")}</th>
                <th className="px-4 py-3 text-left font-600">{t("col.insured")}</th>
                <th className="px-4 py-3 text-left font-600">{t("col.coverage")}</th>
                <th className="px-4 py-3 text-right font-600">{t("col.certificate")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="border-b border-ink-50 last:border-0">
                  <td className="px-4 py-3 tabnum font-600 text-ink-900">{p.policyNumber}</td>
                  <td className="px-4 py-3">{tc(`product.${p.product}`)}</td>
                  <td className="px-4 py-3 tabnum">{p.insuredIdNumber}</td>
                  <td className="px-4 py-3 tabnum">{p.startDate} – {p.expiryDate}</td>
                  <td className="px-4 py-3 text-right">
                    <a href={p.pdfUrl} onClick={(e) => e.preventDefault()} className="inline-flex items-center gap-1 text-brand-600 font-600 hover:underline">
                      <Icon name="download" size={14} /> PDF
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
