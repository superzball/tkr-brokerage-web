"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icon";
import { FieldLabel, TextField, SelectField } from "@/components/ui/Field";
import { WORKER_NATIONALITIES, TITLE_PREFIXES } from "@/config/insurance";
import type { SingleWorker } from "@/types";
import type { WorkerEntry } from "./WorkerFlow";

/** Whole years between `dob` and today; null for empty/invalid input. */
function ageFromDob(dob: string): number | null {
  if (!dob) return null;
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age >= 0 && age < 150 ? age : null;
}

export type SingleEntryProps = {
  workers: WorkerEntry[];
  onAdd: () => void;
  onDel: (id: number) => void;
  onEdit: (id: number, patch: Partial<SingleWorker>) => void;
  onSwitchBulk: () => void;
};

export function SingleEntry({
  workers,
  onAdd,
  onDel,
  onEdit,
  onSwitchBulk,
}: SingleEntryProps) {
  const t = useTranslations("worker");

  return (
    <div className="animate-fade-up">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display font-700 text-2xl text-ink-900">
            {t("single.heading")}
          </h2>
          <p className="text-ink-600 mt-1.5">{t("single.sub")}</p>
        </div>
        <button
          onClick={onSwitchBulk}
          className="btn btn-ghost btn-sm"
        >
          <Icon name="users" /> {t("single.switchToBulk")}
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {workers.map((w, i) => (
          <WorkerCard key={w.id} worker={w} index={i} onDel={onDel} onEdit={onEdit} />
        ))}
      </div>

      <button
        onClick={onAdd}
        className="btn btn-ghost btn-md mt-4 w-full border-dashed"
      >
        <Icon name="plus" /> {t("single.addWorker")}
      </button>
    </div>
  );
}

function WorkerCard({
  worker,
  index,
  onDel,
  onEdit,
}: {
  worker: WorkerEntry;
  index: number;
  onDel: (id: number) => void;
  onEdit: (id: number, patch: Partial<SingleWorker>) => void;
}) {
  const t = useTranslations("worker");
  // Controlled so the data survives a navigation (e.g. the sign-in detour) and
  // the age stays derived live from the date of birth.
  const edit = (patch: Partial<SingleWorker>) => onEdit(worker.id, patch);
  const age = ageFromDob(worker.dob);

  return (
    <div className="card p-5 relative">
      <div className="flex items-center justify-between mb-4">
        <p className="font-600 text-ink-900 flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-brand-50 text-brand-600 inline-flex items-center justify-center text-sm font-700">
            {index + 1}
          </span>{" "}
          {t("single.workerN", { n: index + 1 })}
        </p>
        {index > 0 && (
          <button
            onClick={() => onDel(worker.id)}
            className="w-8 h-8 rounded-lg hover:bg-rose-50 text-ink-300 hover:text-rose-500 inline-flex items-center justify-center"
          >
            <Icon name="x" />
          </button>
        )}
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel>{t("single.fields.title")}</FieldLabel>
          <SelectField
            value={worker.title}
            onChange={(e) => edit({ title: e.target.value as SingleWorker["title"] })}
          >
            <option value="">—</option>
            {TITLE_PREFIXES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </SelectField>
        </div>
        <div>
          <FieldLabel>{t("single.fields.name")}</FieldLabel>
          <TextField
            value={worker.name}
            onChange={(e) => edit({ name: e.target.value })}
            placeholder={t("single.fields.namePh")}
          />
        </div>
        <div>
          <FieldLabel>{t("single.fields.passport")}</FieldLabel>
          <TextField
            value={worker.passport}
            onChange={(e) => edit({ passport: e.target.value })}
            placeholder={t("single.fields.passportPh")}
          />
        </div>
        <div>
          <FieldLabel>{t("single.fields.nationality")}</FieldLabel>
          <SelectField
            value={worker.nat}
            onChange={(e) => edit({ nat: e.target.value as SingleWorker["nat"] })}
          >
            {WORKER_NATIONALITIES.map((code) => (
              <option key={code} value={code}>
                {t(`nat.${code}`)}
              </option>
            ))}
          </SelectField>
        </div>
        <div>
          <FieldLabel>{t("single.fields.dob")}</FieldLabel>
          <TextField
            type="date"
            value={worker.dob}
            onChange={(e) => edit({ dob: e.target.value })}
          />
        </div>
        <div>
          <FieldLabel>{t("single.fields.age")}</FieldLabel>
          <TextField
            readOnly
            value={age != null ? t("single.fields.ageYears", { n: age }) : ""}
            placeholder={t("single.fields.agePh")}
          />
        </div>
        <div>
          <FieldLabel>{t("single.fields.occupation")}</FieldLabel>
          <TextField
            value={worker.occupation}
            onChange={(e) => edit({ occupation: e.target.value })}
            placeholder={t("single.fields.occupationPh")}
          />
        </div>
        <div>
          <FieldLabel>{t("single.fields.phone")}</FieldLabel>
          <TextField
            type="tel"
            value={worker.phone}
            onChange={(e) => edit({ phone: e.target.value })}
            placeholder={t("single.fields.phonePh")}
          />
        </div>
        <div className="sm:col-span-2">
          <FieldLabel>{t("single.fields.job")}</FieldLabel>
          <TextField
            value={worker.job}
            onChange={(e) => edit({ job: e.target.value })}
            placeholder={t("single.fields.jobPh")}
          />
        </div>
        <div className="sm:col-span-2">
          <FieldLabel>{t("single.fields.address")}</FieldLabel>
          <TextField
            value={worker.address}
            onChange={(e) => edit({ address: e.target.value })}
            placeholder={t("single.fields.addressPh")}
          />
        </div>
      </div>
    </div>
  );
}
