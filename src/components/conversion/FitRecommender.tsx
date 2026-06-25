// src/components/conversion/FitRecommender.tsx
// Guided product-fit recommender (getFitQuestions): a short Q&A that ends in a
// recommended plan. Reusable across products — filters to the questions whose
// options point at the given product's plan cards (e.g. "which worker plan",
// "which auto class"). Calls onRecommend(planId) so the host grid can highlight
// it. Question/option copy is generic PLACEHOLDER seed text (Thai); chrome is i18n'd.

"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { getFitQuestions, getPlanCards } from "@/lib/mock/seed";
import type { InsuranceType, PlanCard } from "@/types/portal";

export function FitRecommender({
  product,
  onRecommend,
}: {
  product: InsuranceType;
  /** Plan id the answers point to — host highlights/scrolls to it. */
  onRecommend?: (planId: string | null) => void;
}) {
  const t = useTranslations("conversion.recommender");

  const cards = useMemo(() => getPlanCards(product), [product]);
  const cardById = useMemo(() => new Map(cards.map((c) => [c.id, c])), [cards]);
  // Only the questions whose every option recommends a plan in THIS product.
  const questions = useMemo(
    () =>
      getFitQuestions().filter((q) =>
        q.options.every((o) => cardById.has(o.recommends)),
      ),
    [cardById],
  );

  const [step, setStep] = useState(0);
  const [votes, setVotes] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [bestId, setBestId] = useState<string | null>(null);

  if (questions.length === 0) return null;

  const total = questions.length;
  const current = questions[step];

  function choose(recommends: string) {
    const nextVotes = [...votes, recommends];
    if (step + 1 < total) {
      setVotes(nextVotes);
      setStep(step + 1);
    } else {
      // tally votes; highest-voted plan wins (ties → first answered)
      const tally = new Map<string, number>();
      nextVotes.forEach((v) => tally.set(v, (tally.get(v) ?? 0) + 1));
      let best: string | null = null;
      let bestN = 0;
      nextVotes.forEach((v) => {
        const n = tally.get(v) ?? 0;
        if (n > bestN) { bestN = n; best = v; }
      });
      setVotes(nextVotes);
      setBestId(best);
      setDone(true);
      onRecommend?.(best);
    }
  }

  function restart() {
    setStep(0);
    setVotes([]);
    setBestId(null);
    setDone(false);
    onRecommend?.(null);
  }

  const recommended: PlanCard | undefined = done && bestId
    ? cardById.get(bestId)
    : undefined;

  return (
    <div className="card card-lg p-6 sm:p-8 bg-gradient-to-br from-sky-50 to-white">
      <div className="flex items-start gap-3">
        <span className="w-11 h-11 rounded-xl bg-brand-500 text-white inline-flex items-center justify-center shrink-0">
          <Icon name="sparkle" />
        </span>
        <div>
          <h3 className="font-display font-700 text-xl text-ink-900">{t("title")}</h3>
          <p className="text-sm text-ink-600 mt-0.5">{t("sub")}</p>
        </div>
      </div>

      {!done && current ? (
        <div className="mt-6">
          <p className="text-xs font-600 text-brand-600 mb-2">
            {t("progress", { n: step + 1, total })}
          </p>
          <p className="font-600 text-ink-900 text-lg">{current.question}</p>
          <div className="mt-4 grid sm:grid-cols-2 gap-3">
            {current.options.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => choose(o.recommends)}
                className="seg !items-start text-left"
              >
                <span className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-lg bg-sky-100 text-brand-600 inline-flex items-center justify-center shrink-0">
                    <Icon name="target" size={18} />
                  </span>
                  <span className="font-600 text-ink-900">{o.label}</span>
                </span>
              </button>
            ))}
          </div>
          {step > 0 && (
            <button
              type="button"
              onClick={() => { setStep(step - 1); setVotes(votes.slice(0, -1)); }}
              className="mt-4 inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-700"
            >
              <Icon name="chevR" size={14} className="rotate-180" /> {t("back")}
            </button>
          )}
        </div>
      ) : recommended ? (
        <div className="mt-6 rounded-2xl border border-brand-200 bg-white p-5">
          <p className="text-xs font-600 text-emerald-600 inline-flex items-center gap-1.5">
            <Icon name="checkCircle" size={15} /> {t("recommendedTitle")}
          </p>
          <p className="mt-2 font-display font-700 text-2xl text-ink-900">{recommended.planName}</p>
          <p className="text-sm text-ink-500">{recommended.insurer}</p>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {recommended.highlights.map((h) => (
              <li key={h} className="chip bg-sky-50 text-ink-600 text-[0.7rem] !py-0.5 !px-2">
                <span className="text-emerald-500"><Icon name="check" size={12} /></span>
                {h}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button href={`#plan-${recommended.id}`} variant="primary" size="md">
              {t("viewPlan")} <Icon name="arrowRight" />
            </Button>
            <button type="button" onClick={restart} className="inline-flex items-center gap-1.5 text-sm font-600 text-brand-600 hover:underline">
              <Icon name="refresh" size={15} /> {t("restart")}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
