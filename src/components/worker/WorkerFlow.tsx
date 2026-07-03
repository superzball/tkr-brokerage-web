"use client";

import { useReducer, useEffect, useRef, Fragment, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useBaht } from "@/lib/format";
import { cn } from "@/lib/cn";
import {
  workerInsurancePlan,
  WORKER_SAMPLE,
  WORKER_BULK,
  type WorkerTermId,
} from "@/config/insurance";
import type { SingleWorker, WorkerMode, WorkerFlowUI } from "@/types";
import { useWorkerFlowUI } from "@/hooks/useWorkerFlowUI";
import { TermStep } from "./TermStep";
import { SingleEntry } from "./SingleEntry";
import { BulkUpload } from "./BulkUpload";
import { ReviewStep } from "./ReviewStep";
import { PayStep } from "./PayStep";
import { DoneStep } from "./DoneStep";
import { TrustBadge } from "@/components/conversion/TrustBadge";
import { getWorkerFlowUI } from "@/lib/mock/seed";
import { ROUTES } from "@/config/nav";

export type WorkerEntry = SingleWorker & { id: number };

type State = {
  step: number; // 0 term · 1 fill · 2 review · 3 pay · 4 done
  termId: WorkerTermId;
  mode: WorkerMode;
  workers: WorkerEntry[];
  nextId: number;
  guestPhone?: string; // set when a new guest verified at checkout (post-purchase prompt)
};

type Action =
  | { type: "setTerm"; termId: WorkerTermId }
  | { type: "setMode"; mode: WorkerMode }
  | { type: "next" }
  | { type: "back" }
  | { type: "addWorker" }
  | { type: "delWorker"; id: number }
  | { type: "editWorker"; id: number; patch: Partial<SingleWorker> }
  | { type: "setGuest"; phone?: string };

const EMPTY_WORKER: SingleWorker = {
  title: "",
  name: "",
  passport: "",
  nat: "mm",
  dob: "",
  job: "",
  occupation: "",
  address: "",
  phone: "",
};

const initialState: State = {
  step: 0,
  termId: "m12", // default to the 1-year term — the typical annual policy
  mode: "single",
  workers: [{ ...WORKER_SAMPLE, id: 0 }],
  nextId: 1,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "setTerm":
      return { ...state, termId: action.termId };
    case "setMode":
      return { ...state, mode: action.mode };
    case "setGuest":
      return { ...state, guestPhone: action.phone };
    case "next":
      // 0→1→2→3, then 3→4 (done). Never past 4.
      return state.step < 4 ? { ...state, step: state.step + 1 } : state;
    case "back":
      return state.step > 0 ? { ...state, step: state.step - 1 } : state;
    case "addWorker":
      return {
        ...state,
        workers: [...state.workers, { ...EMPTY_WORKER, id: state.nextId }],
        nextId: state.nextId + 1,
      };
    case "delWorker":
      return {
        ...state,
        workers: state.workers.filter((w) => w.id !== action.id),
      };
    case "editWorker":
      return {
        ...state,
        workers: state.workers.map((w) =>
          w.id === action.id ? { ...w, ...action.patch } : w,
        ),
      };
    default:
      return state;
  }
}

const STEP_KEYS = ["term", "fill", "review", "pay"] as const;

export function WorkerFlow({
  authed = false,
  onComplete,
}: {
  authed?: boolean;
  /** Fires once when the purchase completes (used by the agent on-behalf flow). */
  onComplete?: (info: { count: number; total: number }) => void;
}) {
  const t = useTranslations("worker");
  const l = useTranslations("learn");
  const baht = useBaht();
  const ui = useWorkerFlowUI();
  const [state, dispatch] = useReducer(reducer, initialState);

  // Admin toggles (WORKER_FLOW_UI) are visual only — the step logic never
  // changes. With the input-method chooser hidden, the mode is pinned to the
  // configured default so the user always lands on a working entry screen.
  const mode = ui.showInputMethod ? state.mode : ui.defaultInputMethod;

  // Single ทิพยประกันภัย coverage package — price comes from the chosen term.
  const term =
    workerInsurancePlan.terms.find((x) => x.id === state.termId) ??
    workerInsurancePlan.terms[0]!;
  const count = mode === "single" ? state.workers.length : WORKER_BULK.valid;
  const total = term.price * count;

  const completed = useRef(false);
  useEffect(() => {
    if (state.step >= 4 && !completed.current) {
      completed.current = true;
      onComplete?.({ count, total });
    }
  }, [state.step, count, total, onComplete]);

  const [workerFlow, setWorkerFlow] = useState<WorkerFlowUI>(() => ({
    ...getWorkerFlowUI(),
  }));

  return (
    <>
      {/* stepper — admin-hideable (visual only; the steps still advance) */}
      {ui.showStepper && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
          <ol className="flex items-center gap-1.5 sm:gap-3 overflow-x-auto no-scrollbar pb-1">
            {STEP_KEYS.map((key, i) => {
              const done = i < state.step;
              const on = i === state.step;
              return (
                <Fragment key={key}>
                  <li className="flex items-center gap-2 shrink-0">
                    {done ? (
                      <span className="w-8 h-8 rounded-full bg-gradient-to-br from-mint-400 to-mint-600 text-white inline-flex items-center justify-center shrink-0 shadow-[0_6px_14px_-6px_rgba(10,138,94,0.6)]">
                        <Icon name="check" strokeWidth={2.6} />
                      </span>
                    ) : (
                      <span
                        className={cn(
                          "w-8 h-8 rounded-full inline-flex items-center justify-center font-600 text-sm shrink-0 transition-all",
                          on
                            ? "bg-gradient-to-br from-brand-500 to-brand-600 text-white ring-4 ring-brand-100 shadow-[0_8px_18px_-8px_rgba(31,102,238,0.7)]"
                            : "bg-white border-2 border-ink-100 text-ink-400",
                        )}
                      >
                        {i + 1}
                      </span>
                    )}
                    <span
                      className={cn(
                        "text-sm hidden sm:block",
                        on
                          ? "font-600 text-ink-900"
                          : done
                            ? "font-500 text-brand-600"
                            : "font-500 text-ink-400",
                      )}
                    >
                      {t(`steps.${key}`)}
                    </span>
                  </li>
                  {i < STEP_KEYS.length - 1 && (
                    <li
                      className={cn(
                        "h-0.5 w-6 sm:w-14 rounded-full shrink-0 transition-colors",
                        i < state.step ? "bg-brand-500" : "bg-ink-100",
                      )}
                    />
                  )}
                </Fragment>
              );
            })}
          </ol>
        </div>
      )}

      {/* body + summary */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid lg:grid-cols-[1fr_340px] gap-7 items-start">
        <div className="min-w-0" key={state.step}>
          {state.step === 0 && (
            <TermStep
              termId={state.termId}
              onTerm={(termId) => dispatch({ type: "setTerm", termId })}
              mode={mode}
              onMode={(m) => dispatch({ type: "setMode", mode: m })}
              showModePicker={ui.showInputMethod}
            />
          )}
          {state.step === 1 &&
            (mode === "single" ? (
              <SingleEntry
                workers={state.workers}
                onAdd={() => dispatch({ type: "addWorker" })}
                onDel={(id) => dispatch({ type: "delWorker", id })}
                onEdit={(id, patch) =>
                  dispatch({ type: "editWorker", id, patch })
                }
                onSwitchBulk={
                  ui.showInputMethod
                    ? () => dispatch({ type: "setMode", mode: "bulk" })
                    : undefined
                }
              />
            ) : (
              <BulkUpload
                onSwitchSingle={
                  ui.showInputMethod
                    ? () => dispatch({ type: "setMode", mode: "single" })
                    : undefined
                }
              />
            ))}
          {state.step === 2 && <ReviewStep count={count} term={term} />}
          {state.step === 3 && (
            <PayStep
              total={total}
              authed={authed}
              onPaid={() => dispatch({ type: "next" })}
              onGuestVerified={(phone) => dispatch({ type: "setGuest", phone })}
            />
          )}
          {state.step >= 4 && (
            <DoneStep count={count} guestPhone={state.guestPhone} />
          )}
        </div>

        {/* summary sidebar */}
        <aside className="lg:sticky lg:top-[84px]">
          {/* Privacy-first: real prices are visible here with zero personal data. */}
          <TrustBadge variant="block" className="mt-4 max-w-md mb-8" />
          <div className="card p-6">
            <h3 className="font-600 text-ink-900 flex items-center gap-2">
              <span className="text-brand-600">
                <Icon name="doc" />
              </span>{" "}
              {t("summary.title")}
            </h3>
            <div className="mt-5 space-y-3.5 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-500">{t("summary.plan")}</span>
                <span className="font-600 text-ink-900 text-right">
                  {t("package.shortName")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-500">{t("summary.insurer")}</span>
                <span className="font-600 text-ink-900 text-right">
                  {t("summary.insurerValue")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-500">{t("summary.term")}</span>
                <span className="font-600 text-ink-900 text-right">
                  {t(`package.terms.${term.id}`)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-500">{t("summary.perPerson")}</span>
                <span className="font-600 text-ink-900 tabnum">
                  {baht(term.price)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-500">{t("summary.count")}</span>
                <span className="font-600 text-ink-900 tabnum">
                  {t("summary.countValue", { n: count })}
                </span>
              </div>
              <div className="h-px bg-ink-100 my-1" />
              <div className="flex justify-between items-center">
                <span className="text-ink-600 font-500">
                  {t("summary.total")}
                </span>
                <span className="font-700 text-2xl text-brand-700 tabnum">
                  {baht(total)}
                </span>
              </div>
            </div>
            <div className="mt-5 rounded-xl bg-sky-100 p-3.5 flex gap-2.5 text-xs text-ink-600">
              <span className="text-brand-600 shrink-0 mt-0.5">
                <Icon name="info" />
              </span>
              <span>{t("summary.info")}</span>
            </div>
            {/* Edit later */}
            {!workerFlow.showInputMethod && (
              <>
                <Button
                  variant="primary"
                  size="md"
                  className="w-full mt-5"
                  href={ROUTES.workerMou}
                  target="_blank"
                >
                  {l("common.startQuoteMou")} <Icon name="arrowRight" />
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  className="w-full mt-5"
                  href={ROUTES.worker24}
                  target="_blank"
                >
                  {l("common.startQuote24")} <Icon name="arrowRight" />
                </Button>
              </>
            )}
            {workerFlow.showInputMethod &&
              state.step < 4 &&
              (authed || state.step !== 3) && (
                <Button
                  variant="primary"
                  size="md"
                  className="w-full mt-5"
                  onClick={() => dispatch({ type: "next" })}
                >
                  {state.step === 3 ? t("summary.pay") : t("summary.next")}{" "}
                  <Icon name="arrowRight" />
                </Button>
              )}
            {state.step > 0 && (
              <Button
                variant="ghost"
                size="md"
                className="w-full mt-2.5"
                onClick={() => dispatch({ type: "back" })}
              >
                {t("summary.back")}
              </Button>
            )}
          </div>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-ink-400">
            <Icon name="lock" /> {t("summary.secure")}
          </div>
        </aside>
      </div>
    </>
  );
}
