"use client";

import { useReducer, useEffect, useRef, Fragment } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useBaht } from "@/lib/format";
import { cn } from "@/lib/cn";
import {
  WORKER_PLANS,
  WORKER_SAMPLE,
  WORKER_BULK,
} from "@/config/insurance";
import type { SingleWorker, WorkerMode, WorkerPlanId } from "@/types";
import { PlanStep } from "./PlanStep";
import { SingleEntry } from "./SingleEntry";
import { BulkUpload } from "./BulkUpload";
import { ReviewStep } from "./ReviewStep";
import { PayStep } from "./PayStep";
import { DoneStep } from "./DoneStep";

export type WorkerEntry = SingleWorker & { id: number };

type State = {
  step: number; // 0 plan · 1 fill · 2 review · 3 pay · 4 done
  plan: WorkerPlanId;
  mode: WorkerMode;
  workers: WorkerEntry[];
  nextId: number;
};

type Action =
  | { type: "setPlan"; plan: WorkerPlanId }
  | { type: "setMode"; mode: WorkerMode }
  | { type: "next" }
  | { type: "back" }
  | { type: "addWorker" }
  | { type: "delWorker"; id: number }
  | { type: "editWorker"; id: number; patch: Partial<SingleWorker> };

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
  plan: "standard",
  mode: "single",
  workers: [{ ...WORKER_SAMPLE, id: 0 }],
  nextId: 1,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "setPlan":
      return { ...state, plan: action.plan };
    case "setMode":
      return { ...state, mode: action.mode };
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

const STEP_KEYS = ["plan", "fill", "review", "pay"] as const;

export function WorkerFlow({
  authed = false,
  onComplete,
}: {
  authed?: boolean;
  /** Fires once when the purchase completes (used by the agent on-behalf flow). */
  onComplete?: (info: { count: number; total: number }) => void;
}) {
  const t = useTranslations("worker");
  const baht = useBaht();
  const [state, dispatch] = useReducer(reducer, initialState);

  const plan = WORKER_PLANS.find((p) => p.id === state.plan)!;
  const count =
    state.mode === "single" ? state.workers.length : WORKER_BULK.valid;
  const total = plan.per * count;

  const completed = useRef(false);
  useEffect(() => {
    if (state.step >= 4 && !completed.current) {
      completed.current = true;
      onComplete?.({ count, total });
    }
  }, [state.step, count, total, onComplete]);
  const pending = {
    product: "worker",
    planLabel: t(`plan.names.${plan.id}`),
    count,
    total,
  };

  return (
    <>
      {/* stepper */}
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
                          ? "font-500 text-mint-600"
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
                      i < state.step ? "bg-mint-400" : "bg-ink-100",
                    )}
                  />
                )}
              </Fragment>
            );
          })}
        </ol>
      </div>

      {/* body + summary */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid lg:grid-cols-[1fr_340px] gap-7 items-start">
        <div className="min-w-0" key={state.step}>
          {state.step === 0 && (
            <PlanStep
              plan={state.plan}
              mode={state.mode}
              onPlan={(p) => dispatch({ type: "setPlan", plan: p })}
              onMode={(m) => dispatch({ type: "setMode", mode: m })}
            />
          )}
          {state.step === 1 &&
            (state.mode === "single" ? (
              <SingleEntry
                workers={state.workers}
                onAdd={() => dispatch({ type: "addWorker" })}
                onDel={(id) => dispatch({ type: "delWorker", id })}
                onEdit={(id, patch) => dispatch({ type: "editWorker", id, patch })}
                onSwitchBulk={() => dispatch({ type: "setMode", mode: "bulk" })}
              />
            ) : (
              <BulkUpload
                onSwitchSingle={() =>
                  dispatch({ type: "setMode", mode: "single" })
                }
              />
            ))}
          {state.step === 2 && <ReviewStep plan={plan} count={count} />}
          {state.step === 3 && (
            <PayStep
              total={total}
              authed={authed}
              pending={pending}
              workers={state.mode === "single" ? state.workers : []}
              onPaid={() => dispatch({ type: "next" })}
            />
          )}
          {state.step >= 4 && <DoneStep count={count} />}
        </div>

        {/* summary sidebar */}
        <aside className="lg:sticky lg:top-[84px]">
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
                  {t(`plan.names.${plan.id}`)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-500">{t("summary.perYear")}</span>
                <span className="font-600 text-ink-900 tabnum">
                  {baht(plan.per)}
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
            {state.step < 4 && (authed || state.step !== 3) && (
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
