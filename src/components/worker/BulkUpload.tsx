"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { WORKER_BULK } from "@/config/insurance";

type Filter = "all" | "error";

export function BulkUpload({
  onSwitchSingle,
}: {
  /** Omitted when the admin hides the input-method choice (WORKER_FLOW_UI). */
  onSwitchSingle?: () => void;
}) {
  const t = useTranslations("worker");
  const [filter, setFilter] = useState<Filter>("all");
  const [drag, setDrag] = useState(false);

  const rows = WORKER_BULK.rows
    .map((r, i) => ({ row: r, num: i + 1 }))
    .filter(({ row }) => filter === "all" || !row.ok);

  return (
    <div className="animate-fade-up">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display font-700 text-2xl text-ink-900">
            {t("bulk.heading")}
          </h2>
          <p className="text-ink-600 mt-1.5">{t("bulk.sub")}</p>
        </div>
        {onSwitchSingle && (
          <button onClick={onSwitchSingle} className="btn btn-ghost btn-sm">
            <Icon name="user" /> {t("bulk.switchToSingle")}
          </button>
        )}
      </div>

      <div className="mt-6 grid sm:grid-cols-[1fr_auto] gap-4 items-stretch">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
          }}
          className={cn(
            "dz p-8 flex flex-col items-center justify-center text-center cursor-pointer",
            drag && "drag",
          )}
        >
          <span className="w-14 h-14 rounded-2xl bg-white shadow-card text-brand-600 inline-flex items-center justify-center">
            <Icon name="upload" />
          </span>
          <p className="mt-4 font-600 text-ink-900">{t("bulk.dropTitle")}</p>
          <p className="text-sm text-ink-500 mt-1">{t("bulk.dropHint")}</p>
        </div>
        <div className="card p-5 flex flex-col justify-center sm:w-56">
          <span className="text-brand-600">
            <Icon name="file" />
          </span>
          <p className="font-600 text-ink-900 mt-2">{t("bulk.templateTitle")}</p>
          <p className="text-xs text-ink-500 mt-1 mb-3">{t("bulk.templateDesc")}</p>
          <button className="btn btn-ghost btn-sm">
            <Icon name="download" /> {t("bulk.download")}
          </button>
        </div>
      </div>

      {/* uploaded + validation */}
      <div className="mt-6 card overflow-hidden">
        <div className="p-5 flex flex-wrap items-center justify-between gap-3 border-b border-ink-100">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-mint-50 text-mint-600 inline-flex items-center justify-center">
              <Icon name="file" />
            </span>
            <div>
              <p className="font-600 text-ink-900">{t("bulk.fileName")}</p>
              <p className="text-xs text-ink-500">
                {t("bulk.uploadedMeta", { total: WORKER_BULK.total })}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Chip className="bg-mint-50 text-mint-600">
              <Icon name="checkCircle" />{" "}
              {t("bulk.passedChip", { n: WORKER_BULK.valid })}
            </Chip>
            <Chip className="bg-rose-50 text-rose-500">
              <Icon name="alert" />{" "}
              {t("bulk.errorChip", { n: WORKER_BULK.error })}
            </Chip>
          </div>
        </div>

        <div className="px-5 pt-4 flex items-center gap-2 text-sm">
          <button
            onClick={() => setFilter("all")}
            className={cn("vfilter", filter === "all" && "is-on")}
          >
            {t("bulk.filterAll", { n: WORKER_BULK.total })}
          </button>
          <button
            onClick={() => setFilter("error")}
            className={cn("vfilter", filter === "error" && "is-on")}
          >
            {t("bulk.filterError", { n: WORKER_BULK.error })}
          </button>
        </div>

        <div className="overflow-x-auto px-2 pb-2">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-ink-400 text-xs">
                <th className="text-left font-500 px-3 py-2.5 w-10">
                  {t("bulk.table.num")}
                </th>
                <th className="text-left font-500 px-3 py-2.5">
                  {t("bulk.table.name")}
                </th>
                <th className="text-left font-500 px-3 py-2.5">
                  {t("bulk.table.passport")}
                </th>
                <th className="text-left font-500 px-3 py-2.5">
                  {t("bulk.table.nationality")}
                </th>
                <th className="text-left font-500 px-3 py-2.5">
                  {t("bulk.table.dob")}
                </th>
                <th className="text-left font-500 px-3 py-2.5">
                  {t("bulk.table.status")}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ row, num }) => {
                const bad = (c: string) =>
                  !row.ok && row.err === c ? "text-rose-600 font-600" : "text-ink-700";
                return (
                  <tr
                    key={num}
                    className={cn(
                      "border-t border-ink-50",
                      !row.ok && "bg-rose-50/60",
                    )}
                  >
                    <td className="px-3 py-3 text-ink-400 tabnum">{num}</td>
                    <td className="px-3 py-3 font-500 text-ink-900">{row.name}</td>
                    <td className={cn("px-3 py-3 tabnum", bad("pp"))}>{row.pp}</td>
                    <td className={cn("px-3 py-3", bad("nat"))}>
                      {row.nat ? t(`nat.${row.nat}`) : "—"}
                    </td>
                    <td className={cn("px-3 py-3 tabnum", bad("dob"))}>{row.dob}</td>
                    <td className="px-3 py-3">
                      {row.ok ? (
                        <Chip className="bg-mint-50 text-mint-600 text-xs">
                          <Icon name="check" /> {t("bulk.statusOk")}
                        </Chip>
                      ) : (
                        <Chip
                          className="bg-rose-50 text-rose-600 text-xs"
                          title={row.errKey ? t(`bulk.errors.${row.errKey}`) : undefined}
                        >
                          <Icon name="alert" />{" "}
                          {row.errKey ? t(`bulk.errors.${row.errKey}`) : ""}
                        </Chip>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
