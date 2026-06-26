// src/components/conversion/ProductPlans.tsx
// Phase 18 decision tools, mounted on product/landing pages. Generalizes the auto
// comparison into a reusable PlanCard grid (getPlanCards): highlights, starting
// premium, coupon-on-card, badge, a "ชอบแผนนี้" shortlist (session), buy CTA, and
// a detail modal with a coverage/benefit table. Owns the session shortlist state
// shared with the FitRecommender. Generic PLACEHOLDER plan data only.

"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { AppLink } from "@/components/ui/AppLink";
import { Modal } from "@/components/app/Modal";
import { useBaht } from "@/lib/format";
import { cn } from "@/lib/cn";
import { getPlanCards } from "@/lib/mock/seed";
import type { InsuranceType, PlanCard } from "@/types/portal";
import { FitRecommender } from "./FitRecommender";

export function ProductPlans({
  product,
  chooseHref,
}: {
  product: InsuranceType;
  /** Where the buy CTA routes (privacy-first quote / signup). */
  chooseHref: string;
}) {
  const t = useTranslations("conversion.planCards");
  const baht = useBaht();

  const cards = useMemo(() => getPlanCards(product), [product]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recommendedId, setRecommendedId] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [compareOpen, setCompareOpen] = useState(false);

  if (cards.length === 0) return null;

  const toggleFav = (id: string) =>
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  const detail = cards.find((c) => c.id === detailId) ?? null;
  const shortlisted = cards.filter((c) => favorites.includes(c.id));

  return (
    <div className="space-y-7">
      {/* guided recommender */}
      <FitRecommender product={product} onRecommend={setRecommendedId} />

      {/* plan-card grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((c) => (
          <PlanCardItem
            key={c.id}
            card={c}
            baht={baht}
            recommended={c.id === recommendedId}
            favorited={favorites.includes(c.id)}
            onFav={() => toggleFav(c.id)}
            onDetail={() => setDetailId(c.id)}
            chooseHref={chooseHref}
            t={t}
          />
        ))}
      </div>

      <p className="text-xs text-ink-400 inline-flex items-center gap-1.5">
        <Icon name="info" size={13} /> {t("placeholderNote")}
      </p>

      {/* sticky shortlist bar */}
      {shortlisted.length > 0 && (
        <div className="sticky bottom-4 z-30">
          <div className="card card-lg flex items-center justify-between gap-4 px-5 py-3.5 shadow-lg">
            <p className="text-sm font-600 text-ink-900 inline-flex items-center gap-2">
              <span className="text-rose-500"><Icon name="heart" size={16} /></span>
              {t("shortlist.title", { n: shortlisted.length })}
            </p>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setFavorites([])} className="text-sm text-ink-500 hover:text-ink-700">
                {t("shortlist.clear")}
              </button>
              <Button variant="primary" size="sm" onClick={() => setCompareOpen(true)} disabled={shortlisted.length < 2}>
                {t("shortlist.compare", { n: shortlisted.length })}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* detail modal — coverage / benefit table */}
      <Modal open={!!detail} onClose={() => setDetailId(null)} title={detail?.planName}>
        {detail && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-ink-500">{detail.insurer}</span>
              {detail.badge && <Chip className="bg-brand-50 text-brand-600 text-xs">{detail.badge}</Chip>}
            </div>
            <div className="rounded-xl border border-ink-100 divide-y divide-ink-50 text-sm">
              <Row label={t("modal.insurer")} value={detail.insurer} />
              <Row
                label={t("modal.startingPremium")}
                value={<span className="font-700 text-brand-700 tabnum">{baht(detail.startingPremium)} <span className="text-ink-400 font-500">{detail.period}</span></span>}
              />
              {detail.couponCode && <Row label={t("couponLabel")} value={<span className="font-mono">{detail.couponCode}</span>} />}
            </div>
            <div>
              <p className="text-sm font-600 text-ink-700 mb-2">{t("modal.benefitsTitle")}</p>
              <ul className="space-y-2">
                {detail.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2.5 text-sm text-ink-700">
                    <span className="text-mint-500 shrink-0 mt-0.5"><Icon name="checkCircle" size={16} /></span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-xs text-ink-400">{t("placeholderNote")}</p>
            <AppLink href={chooseHref} className="btn btn-primary btn-md w-full">
              {t("buy")} <Icon name="arrowRight" />
            </AppLink>
          </div>
        )}
      </Modal>

      {/* compare-shortlist modal — side by side */}
      <Modal open={compareOpen} onClose={() => setCompareOpen(false)} title={t("compare.title")} className="max-w-2xl">
        <CompareShortlist plans={shortlisted} baht={baht} chooseHref={chooseHref} t={t} />
      </Modal>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 px-3.5 py-2.5">
      <span className="text-ink-500">{label}</span>
      <span className="font-600 text-ink-900 text-right">{value}</span>
    </div>
  );
}

type T = ReturnType<typeof useTranslations<"conversion.planCards">>;

function PlanCardItem({
  card, baht, recommended, favorited, onFav, onDetail, chooseHref, t,
}: {
  card: PlanCard;
  baht: (n: number) => string;
  recommended: boolean;
  favorited: boolean;
  onFav: () => void;
  onDetail: () => void;
  chooseHref: string;
  t: T;
}) {
  return (
    <div
      id={`plan-${card.id}`}
      className={cn(
        "card card-hover p-5 relative flex flex-col scroll-mt-24",
        recommended && "ring-2 ring-brand-400",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {recommended && (
            <Chip className="bg-brand-500 text-white text-[0.65rem]">{t("recommendedTag")}</Chip>
          )}
          {card.badge && !recommended && (
            <Chip className="bg-gold-100 text-gold-700 text-[0.65rem]">{card.badge}</Chip>
          )}
        </div>
        <button
          type="button"
          onClick={onFav}
          aria-pressed={favorited}
          aria-label={favorited ? t("favorited") : t("favorite")}
          className={cn(
            "w-9 h-9 rounded-full inline-flex items-center justify-center shrink-0 transition-colors",
            favorited ? "bg-rose-50 text-rose-500" : "bg-ink-50 text-ink-400 hover:text-rose-400",
          )}
        >
          <Icon name="heart" size={18} />
        </button>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-100 to-sky-200 text-brand-700 inline-flex items-center justify-center font-display font-700 text-lg shrink-0">
          {card.insurer.charAt(0)}
        </span>
        <div className="min-w-0">
          <p className="font-600 text-ink-900 truncate">{card.planName}</p>
          <p className="text-xs text-ink-500 truncate">{card.insurer}</p>
        </div>
      </div>

      <ul className="mt-4 space-y-2 text-sm text-ink-600 flex-1">
        {card.highlights.map((h) => (
          <li key={h} className="flex items-start gap-2">
            <span className="text-mint-500 shrink-0 mt-0.5"><Icon name="check" size={14} /></span>
            {h}
          </li>
        ))}
      </ul>

      {card.couponCode && (
        <div className="mt-3 inline-flex items-center gap-1.5 self-start chip bg-mint-50 text-mint-600 text-xs">
          <Icon name="gift" size={13} /> {t("couponOnCard", { code: card.couponCode })}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-ink-100">
        <p className="text-xs text-ink-400">{t("from")}</p>
        <p className="font-display font-700 text-2xl text-brand-700 tabnum">
          {baht(card.startingPremium)}
          <span className="text-sm font-500 text-ink-400"> {card.period}</span>
        </p>
        <div className="mt-3 flex gap-2">
          <AppLink href={chooseHref} className="btn btn-primary btn-md flex-1 justify-center">
            {t("buy")}
          </AppLink>
          <button type="button" onClick={onDetail} className="btn btn-ghost btn-md shrink-0">
            {t("detail")}
          </button>
        </div>
      </div>
    </div>
  );
}

function CompareShortlist({
  plans, baht, chooseHref, t,
}: {
  plans: PlanCard[];
  baht: (n: number) => string;
  chooseHref: string;
  t: T;
}) {
  // union of all highlights → rows; ✓ when a plan lists it.
  const rows = Array.from(new Set(plans.flatMap((p) => p.highlights)));
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse min-w-[420px]">
        <thead>
          <tr>
            <th className="text-left text-ink-400 font-500 p-2 align-bottom">{t("compare.benefit")}</th>
            {plans.map((p) => (
              <th key={p.id} className="p-2 text-center align-bottom">
                <p className="font-600 text-ink-900">{p.planName}</p>
                <p className="text-xs text-ink-500 font-400">{p.insurer}</p>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-ink-100">
            <td className="p-2 text-ink-500">{t("compare.startingPremium")}</td>
            {plans.map((p) => (
              <td key={p.id} className="p-2 text-center font-700 text-brand-700 tabnum">{baht(p.startingPremium)}</td>
            ))}
          </tr>
          {rows.map((h) => (
            <tr key={h} className="border-t border-ink-50">
              <td className="p-2 text-ink-600">{h}</td>
              {plans.map((p) => (
                <td key={p.id} className="p-2 text-center">
                  {p.highlights.includes(h) ? (
                    <span className="text-mint-500 inline-flex"><Icon name="checkCircle" size={16} /></span>
                  ) : (
                    <span className="text-ink-300">—</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
          <tr className="border-t border-ink-100">
            <td className="p-2" />
            {plans.map((p) => (
              <td key={p.id} className="p-2 text-center">
                <AppLink href={chooseHref} className="btn btn-primary btn-sm w-full justify-center">{t("buy")}</AppLink>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <p className="text-xs text-ink-400 mt-3">{t("placeholderNote")}</p>
    </div>
  );
}
