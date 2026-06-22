"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icon";
import { FieldLabel, TextField, SelectField } from "@/components/ui/Field";
import { WORKER_NATIONALITIES } from "@/config/insurance";
import type { WorkerEntry } from "./WorkerFlow";

export type SingleEntryProps = {
  workers: WorkerEntry[];
  onAdd: () => void;
  onDel: (id: number) => void;
  onSwitchBulk: () => void;
};

export function SingleEntry({
  workers,
  onAdd,
  onDel,
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
          <WorkerCard key={w.id} worker={w} index={i} onDel={onDel} />
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
}: {
  worker: WorkerEntry;
  index: number;
  onDel: (id: number) => void;
}) {
  const t = useTranslations("worker");

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
          <FieldLabel>{t("single.fields.name")}</FieldLabel>
          <TextField defaultValue={worker.name} placeholder={t("single.fields.namePh")} />
        </div>
        <div>
          <FieldLabel>{t("single.fields.passport")}</FieldLabel>
          <TextField
            defaultValue={worker.passport}
            placeholder={t("single.fields.passportPh")}
          />
        </div>
        <div>
          <FieldLabel>{t("single.fields.nationality")}</FieldLabel>
          <SelectField defaultValue={worker.nat}>
            {WORKER_NATIONALITIES.map((code) => (
              <option key={code} value={code}>
                {t(`nat.${code}`)}
              </option>
            ))}
          </SelectField>
        </div>
        <div>
          <FieldLabel>{t("single.fields.dob")}</FieldLabel>
          <TextField type="date" defaultValue={worker.dob} />
        </div>
        <div className="sm:col-span-2">
          <FieldLabel>{t("single.fields.job")}</FieldLabel>
          <TextField defaultValue={worker.job} placeholder={t("single.fields.jobPh")} />
        </div>
      </div>
    </div>
  );
}
