// src/components/app/rewards/RewardsClient.tsx
// Phase 20 — Customer Rewards hub (individual + guest). Balance + member-tier
// progress, ways-to-earn with CTAs, rewards catalog with a redeem→issue-coupon
// flow, points ledger, referral, and monthly missions. All mutations are mock
// and persisted client-side via @/lib/loyalty/local (merged on top of seed).

"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Chip } from "@/components/ui/Chip";
import { Modal } from "@/components/app/Modal";
import { EmptyState } from "@/components/app/EmptyState";
import { useToast } from "@/components/app/toast";
import { ProgressiveProfile } from "@/components/guest/ProgressiveProfile";
import { cn } from "@/lib/cn";
import type {
  EarnRule, EarnSource, LoyaltyAccount, MemberTier, MemberTierInfo,
  PointsEntry, Redemption, Reward,
} from "@/types/portal";
import { memberTierInfo, nextMemberTier, redeemGuard } from "@/config/loyalty";
import {
  LOYALTY_CHANGE_EVENT, addLocalEarn, addLocalRedemption, effectiveAccount,
  hasEarnedOnce, readLocalEarns, readLocalRedemptions,
} from "@/lib/loyalty/local";

type Props = {
  customerId: string;
  isGuest: boolean;
  seedAccount: LoyaltyAccount | null;
  seedLedger: PointsEntry[];
  rewards: Reward[];
  earnRules: EarnRule[];
  lockedTags: string[]; // once-only earn sources already present in the seed ledger
  referralCode: string;
};

const TIER_ACCENT: Record<MemberTier, { tile: string; bar: string; chip: string }> = {
  bronze:   { tile: "bg-peach-50 text-peach-600",  bar: "bg-peach-400",  chip: "bg-peach-50 text-peach-600" },
  silver:   { tile: "bg-ink-100 text-ink-600",     bar: "bg-ink-400",    chip: "bg-ink-100 text-ink-600" },
  gold:     { tile: "bg-gold-50 text-gold-600",    bar: "bg-gold-400",   chip: "bg-gold-50 text-gold-600" },
  platinum: { tile: "bg-sky-100 text-brand-600",   bar: "bg-brand-500",  chip: "bg-sky-100 text-brand-700" },
};

const REWARD_ICON: Record<Reward["type"], IconName> = {
  voucher: "gift",
  gift: "gift",
  service: "shieldCheck",
  premium_discount: "coins",
  donation: "heart",
};

// CTA behaviour per earn source (sources not listed are passive/automatic).
type Cta =
  | { kind: "link"; href: string; ctaKey: CtaKey; tag?: string }
  | { kind: "earn"; ctaKey: CtaKey; tag?: string }
  | { kind: "anchor"; href: string; ctaKey: CtaKey; tag?: string };
type CtaKey = "profile" | "social" | "buy" | "refer" | "review" | "survey";

const EARN_CTA: Partial<Record<EarnSource, Cta>> = {
  purchase:         { kind: "link", href: "/app/buy", ctaKey: "buy" },
  profile_complete: { kind: "link", href: "/app/settings", ctaKey: "profile", tag: "profile_complete" },
  social_link:      { kind: "earn", ctaKey: "social", tag: "social_link" },
  referral:         { kind: "anchor", href: "#referral", ctaKey: "refer" },
  review:           { kind: "earn", ctaKey: "review", tag: "review" },
  survey:           { kind: "earn", ctaKey: "survey", tag: "survey" },
};

const MISSIONS = [
  { id: "m1", icon: "calendar" as IconName },
  { id: "m2", icon: "shieldCheck" as IconName },
  { id: "m3", icon: "doc" as IconName },
];
const MISSION_POINTS = 20;

export function RewardsClient({
  customerId, isGuest, seedAccount, seedLedger, rewards,
  earnRules, lockedTags, referralCode,
}: Props) {
  const t = useTranslations("loyalty");
  const { toast } = useToast();

  // local (mock) earns/redemptions merged on top of seed; refreshed on change.
  const [localEarns, setLocalEarns] = useState<PointsEntry[]>([]);
  const [localReds, setLocalReds] = useState<Redemption[]>([]);
  const mine = (id: string) => id === customerId || id === "self";
  useEffect(() => {
    const refresh = () => {
      setLocalEarns(readLocalEarns().filter((e) => mine(e.customerId)));
      setLocalReds(readLocalRedemptions().filter((r) => mine(r.customerId)));
    };
    refresh(); // hydrate from localStorage after mount (avoids SSR mismatch)
    window.addEventListener(LOYALTY_CHANGE_EVENT, refresh);
    return () => window.removeEventListener(LOYALTY_CHANGE_EVENT, refresh);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);

  const account = useMemo(() => {
    const base: LoyaltyAccount =
      seedAccount ?? { customerId, balance: 0, lifetimePoints: 0, tier: "bronze" };
    return effectiveAccount(base, localEarns, localReds);
  }, [seedAccount, customerId, localEarns, localReds]);
  const tierInfo = memberTierInfo(account.tier);
  const next = nextMemberTier(account.tier);
  const mult = tierInfo.earnMultiplier;

  const ledger = useMemo(
    () => [...localEarns, ...seedLedger].sort((a, b) => (a.date < b.date ? 1 : -1)),
    [localEarns, seedLedger],
  );

  const tagDone = (tag?: string) =>
    !!tag && (lockedTags.includes(tag) || hasEarnedOnce(tag));

  // ---- earn (mock) ----
  function grantEarn(source: EarnSource, base: number, tag?: string) {
    const points = Math.round(base * mult);
    addLocalEarn({
      customerId,
      source,
      points,
      description: t(`earn.${earnLabelKey(source)}` as "earn.earnReview"),
      currentBalance: account.balance,
      tag,
    });
    toast(t("earn.earned", { n: points }), "success");
  }

  // ---- redeem (mock) ----
  const [confirming, setConfirming] = useState<Reward | null>(null);
  const [issued, setIssued] = useState<{ reward: Reward; code?: string } | null>(null);

  function doRedeem(reward: Reward) {
    const red = addLocalRedemption({ customerId, reward, currentBalance: account.balance });
    setConfirming(null);
    setIssued({ reward, code: red.code });
    toast(t("redeemModal.toast", { name: t(`rw.${reward.name}` as "rw.rwCoffee") }), "success");
  }

  return (
    <div className="space-y-6">
      {/* guest nudge — ties loyalty to guest→active conversion (+100 on profile) */}
      {isGuest && !tagDone("profile_complete") && (
        <section className="card overflow-hidden border-gold-200">
          <div className="bg-gradient-to-r from-gold-50 to-peach-50 p-5 flex items-start gap-3">
            <span className="w-10 h-10 rounded-xl bg-gold-400 text-white flex items-center justify-center shrink-0">
              <Icon name="gift" size={20} />
            </span>
            <div className="min-w-0">
              <h2 className="font-700 text-ink-900">{t("guestNudge.title")}</h2>
              <p className="mt-1 text-sm text-ink-600">{t("guestNudge.desc")}</p>
            </div>
          </div>
          <div className="p-5 pt-4">
            <ProgressiveProfile />
          </div>
        </section>
      )}

      {/* balance + member-tier progress */}
      <section className="grid gap-5 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-sky-50" aria-hidden />
          <div className="relative flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-ink-500">{t("balance.title")}</p>
              <p className="mt-1 text-4xl font-700 text-ink-900 tabnum font-display">
                {account.balance.toLocaleString()}
                <span className="ml-2 text-lg font-600 text-ink-400">{t("balance.points", { n: "" })}</span>
              </p>
              <p className="mt-1 text-xs text-ink-400">
                {t("balance.lifetime", { n: account.lifetimePoints.toLocaleString() })}
              </p>
            </div>
            <TierBadge tier={account.tier} label={t("tier.label")} name={t(`tier.name.${account.tier}` as "tier.name.gold")} mult={mult} multLabel={t("tier.multiplier", { mult })} />
          </div>

          {/* progress bar to next tier */}
          <div className="relative mt-6">
            {next ? (
              <>
                <div className="flex items-center justify-between text-xs text-ink-500 mb-1.5">
                  <span>{t(`tier.name.${account.tier}` as "tier.name.gold")}</span>
                  <span>{t(`tier.name.${next.tier}` as "tier.name.gold")}</span>
                </div>
                <div className="h-2.5 rounded-full bg-ink-100 overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all", TIER_ACCENT[account.tier].bar)}
                    style={{ width: `${tierProgress(account.lifetimePoints, tierInfo, next)}%` }}
                  />
                </div>
                <p className="mt-2 text-sm text-ink-600">
                  {t("tier.progressTo", {
                    n: Math.max(0, next.threshold - account.lifetimePoints).toLocaleString(),
                    tier: t(`tier.name.${next.tier}` as "tier.name.gold"),
                  })}
                </p>
              </>
            ) : (
              <p className="text-sm font-600 text-brand-600">{t("tier.maxed")}</p>
            )}
          </div>
        </div>

        {/* tier perks */}
        <div className="card p-6">
          <h3 className="font-700 text-ink-900 mb-3 flex items-center gap-2">
            <Icon name="sparkle" size={16} className="text-gold-500" /> {t("tier.perksTitle")}
          </h3>
          <ul className="space-y-2.5">
            {tierInfo.perksKeys.map((k) => (
              <li key={k} className="flex items-center gap-2.5 text-sm text-ink-700">
                <Icon name="checkCircle" size={16} className="text-mint-500 shrink-0" />
                {t(`perk.${k}` as "perk.perkBaseEarn")}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ways to earn */}
      <section className="card p-6">
        <div className="mb-4">
          <h2 className="font-700 text-ink-900">{t("earn.title")}</h2>
          <p className="text-sm text-ink-500">{t("earn.desc")}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {earnRules.map((rule) => (
            <EarnRow
              key={rule.source}
              rule={rule}
              done={tagDone(EARN_CTA[rule.source]?.tag)}
              onEarn={(base, tag) => grantEarn(rule.source, base, tag)}
            />
          ))}
        </div>
      </section>

      {/* rewards catalog */}
      <section>
        <div className="mb-4">
          <h2 className="font-700 text-ink-900">{t("catalog.title")}</h2>
          <p className="text-sm text-ink-500">{t("catalog.desc")}</p>
        </div>
        {rewards.length === 0 ? (
          <EmptyState icon="gift" title={t("catalog.empty")} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rewards.map((r) => (
              <RewardCard key={r.id} reward={r} guard={redeemGuard(account, r)} onRedeem={() => setConfirming(r)} />
            ))}
          </div>
        )}
      </section>

      {/* referral + missions */}
      <section className="grid gap-5 lg:grid-cols-2">
        <ReferralBlock code={referralCode} />
        <MissionsBlock onClaim={(id) => grantEarn("mission", MISSION_POINTS, `mission:${id}`)} doneTag={tagDone} />
      </section>

      {/* points history */}
      <LedgerBlock ledger={ledger} />

      <p className="text-xs text-ink-400 leading-relaxed">{t("disclaimer")}</p>

      {/* redeem confirm */}
      <Modal
        open={!!confirming}
        onClose={() => setConfirming(null)}
        title={t("redeemModal.title")}
        footer={
          confirming && (
            <>
              <Button variant="ghost" size="md" onClick={() => setConfirming(null)}>
                {t("redeemModal.cancel")}
              </Button>
              <Button variant="primary" size="md" onClick={() => doRedeem(confirming)}>
                {t("redeemModal.confirm")}
              </Button>
            </>
          )
        }
      >
        {confirming && (
          <div className="space-y-2 text-sm">
            <p className="text-ink-800">
              {t("redeemModal.confirmText", {
                name: t(`rw.${confirming.name}` as "rw.rwCoffee"),
                cost: confirming.cost.toLocaleString(),
              })}
            </p>
            <p className="text-ink-500">
              {t("redeemModal.balanceAfter", { n: (account.balance - confirming.cost).toLocaleString() })}
            </p>
          </div>
        )}
      </Modal>

      {/* issued coupon */}
      <Modal
        open={!!issued}
        onClose={() => setIssued(null)}
        title={t("redeemModal.issuedTitle")}
        footer={
          <Button variant="primary" size="md" onClick={() => setIssued(null)}>
            {t("redeemModal.close")}
          </Button>
        }
      >
        {issued && (
          <div className="text-center py-2">
            <span className="inline-flex w-14 h-14 rounded-full bg-mint-50 text-mint-500 items-center justify-center mb-3">
              <Icon name="checkCircle" size={30} />
            </span>
            {issued.code ? (
              <>
                <p className="text-sm text-ink-500">{t("redeemModal.issuedCode")}</p>
                <code className="mt-1 block text-xl font-700 tracking-wider text-brand-700">{issued.code}</code>
                <p className="mt-3 text-xs text-ink-400 max-w-xs mx-auto">{t("redeemModal.issuedNote")}</p>
              </>
            ) : (
              <p className="text-sm text-ink-700 max-w-xs mx-auto">{t("redeemModal.donateNote")}</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

// ---- helpers / subcomponents ----

function earnLabelKey(source: EarnSource): string {
  const r = EARN_RULE_LABEL[source];
  return r ?? "earnMission";
}
const EARN_RULE_LABEL: Record<EarnSource, string> = {
  purchase: "earnPurchase", profile_complete: "earnProfile", social_link: "earnSocial",
  renewal: "earnRenewal", no_claim: "earnNoClaim", referral: "earnReferral",
  review: "earnReview", survey: "earnSurvey", birthday: "earnBirthday", mission: "earnMission",
};

function tierProgress(lifetime: number, cur: MemberTierInfo, next: MemberTierInfo): number {
  const span = next.threshold - cur.threshold;
  if (span <= 0) return 100;
  return Math.min(100, Math.max(0, ((lifetime - cur.threshold) / span) * 100));
}

function TierBadge({ tier, label, name, mult, multLabel }: {
  tier: MemberTier; label: string; name: string; mult: number; multLabel: string;
}) {
  const a = TIER_ACCENT[tier];
  return (
    <div className={cn("rounded-xl px-4 py-3 text-right", a.chip)}>
      <p className="text-[11px] font-600 uppercase tracking-wide opacity-80">{label}</p>
      <p className="text-lg font-700 flex items-center justify-end gap-1.5">
        <Icon name="medal" size={18} /> {name}
      </p>
      {mult > 1 && <p className="text-xs font-600 mt-0.5">{multLabel}</p>}
    </div>
  );
}

function EarnRow({ rule, done, onEarn }: {
  rule: EarnRule; done: boolean; onEarn: (base: number, tag?: string) => void;
}) {
  const t = useTranslations("loyalty");
  const cta = EARN_CTA[rule.source];
  const pointsLabel =
    rule.unit === "per_100_thb" ? t("earn.perThb")
    : rule.unit === "per_channel" ? t("earn.perChannel", { n: rule.points })
    : t("earn.plus", { n: rule.points });

  return (
    <div className="flex items-center gap-3 rounded-xl border border-ink-100 p-3.5">
      <span className="w-9 h-9 rounded-lg bg-sky-100 text-brand-600 flex items-center justify-center shrink-0">
        <Icon name="coins" size={18} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-600 text-ink-900 text-sm truncate">
          {t(`earn.${EARN_RULE_LABEL[rule.source]}` as "earn.earnPurchase")}
        </p>
        <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
          <span className="text-xs font-600 text-brand-600">{pointsLabel}</span>
          {rule.oncePerCustomer && <Chip className="bg-ink-50 text-ink-500 text-[10px]">{t("earn.onceBadge")}</Chip>}
          {rule.annual && <Chip className="bg-ink-50 text-ink-500 text-[10px]">{t("earn.annualBadge")}</Chip>}
        </div>
      </div>
      {cta && (
        done ? (
          <span className="text-xs font-600 text-mint-600 flex items-center gap-1 shrink-0">
            <Icon name="check" size={14} /> {t("earn.cta.done")}
          </span>
        ) : cta.kind === "earn" ? (
          <Button variant="ghost" size="sm" onClick={() => onEarn(rule.points, cta.tag)}>
            {t(`earn.cta.${cta.ctaKey}` as "earn.cta.social")}
          </Button>
        ) : cta.kind === "anchor" ? (
          <a href={cta.href} className="shrink-0 text-xs font-600 text-brand-600 hover:underline px-2 py-1">
            {t(`earn.cta.${cta.ctaKey}` as "earn.cta.refer")}
          </a>
        ) : (
          <Button href={cta.href} variant="ghost" size="sm">
            {t(`earn.cta.${cta.ctaKey}` as "earn.cta.buy")}
          </Button>
        )
      )}
    </div>
  );
}

function RewardCard({ reward, guard, onRedeem }: {
  reward: Reward; guard: ReturnType<typeof redeemGuard>; onRedeem: () => void;
}) {
  const t = useTranslations("loyalty");
  const disabled = guard !== "ok";
  return (
    <div className="card p-5 flex flex-col">
      <div className="flex items-start justify-between gap-2">
        <span className="w-11 h-11 rounded-xl bg-gold-50 text-gold-600 flex items-center justify-center shrink-0">
          <Icon name={REWARD_ICON[reward.type]} size={22} />
        </span>
        <Chip className="bg-sky-100 text-ink-600 text-xs">{t(`rwType.${reward.type}` as "rwType.voucher")}</Chip>
      </div>
      <h3 className="mt-3 font-700 text-ink-900 leading-snug">{t(`rw.${reward.name}` as "rw.rwCoffee")}</h3>
      {reward.value != null && (
        <p className="mt-0.5 text-xs text-ink-400">{t("catalog.worth", { n: reward.value.toLocaleString() })}</p>
      )}
      {reward.minTier && (
        <p className="mt-2 text-xs text-gold-600 flex items-center gap-1">
          <Icon name="medal" size={13} /> {t("catalog.tierLocked", { tier: t(`tier.name.${reward.minTier}` as "tier.name.gold") })}
        </p>
      )}
      <div className="mt-auto pt-4 flex items-center justify-between gap-2">
        <span className="font-700 text-brand-700 tabnum">{t("catalog.cost", { n: reward.cost.toLocaleString() })}</span>
        <Button variant={disabled ? "ghost" : "primary"} size="sm" disabled={disabled} onClick={onRedeem}>
          {guard === "insufficient" ? t("catalog.insufficient")
            : guard === "tier" ? t("catalog.tierLocked", { tier: t(`tier.name.${reward.minTier!}` as "tier.name.gold") })
            : t("catalog.redeem")}
        </Button>
      </div>
    </div>
  );
}

function ReferralBlock({ code }: { code: string }) {
  const t = useTranslations("loyalty");
  const { toast } = useToast();
  function copy() {
    const link = typeof window !== "undefined" ? `${window.location.origin}/signup?ref=${code}` : `?ref=${code}`;
    if (navigator?.clipboard) navigator.clipboard.writeText(link).catch(() => {});
    toast(t("referral.copied"), "success");
  }
  return (
    <div id="referral" className="card p-6 scroll-mt-24">
      <h2 className="font-700 text-ink-900 flex items-center gap-2">
        <Icon name="users" size={18} className="text-brand-600" /> {t("referral.title")}
      </h2>
      <p className="mt-1 text-sm text-ink-500">{t("referral.desc")}</p>
      <div className="mt-4 flex items-center gap-2">
        <code className="flex-1 rounded-lg border border-ink-100 bg-ink-50/60 px-3 py-2.5 text-sm font-600 text-ink-800 truncate">
          {code}
        </code>
        <Button variant="primary" size="md" onClick={copy}>
          <Icon name="copy" size={15} /> {t("referral.copy")}
        </Button>
      </div>
      <p className="mt-2 text-xs text-ink-400">{t("referral.code", { code })}</p>
    </div>
  );
}

function MissionsBlock({ onClaim, doneTag }: {
  onClaim: (id: string) => void; doneTag: (tag?: string) => boolean;
}) {
  const t = useTranslations("loyalty");
  const doneCount = MISSIONS.filter((m) => doneTag(`mission:${m.id}`)).length;
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-700 text-ink-900 flex items-center gap-2">
          <Icon name="target" size={18} className="text-peach-500" /> {t("missions.title")}
        </h2>
        <span className="text-xs font-600 text-ink-500">{t("missions.progress", { done: doneCount, total: MISSIONS.length })}</span>
      </div>
      <p className="mt-1 text-sm text-ink-500">{t("missions.desc")}</p>
      <ul className="mt-4 space-y-2.5">
        {MISSIONS.map((m) => {
          const done = doneTag(`mission:${m.id}`);
          return (
            <li key={m.id} className="flex items-center gap-3 rounded-xl border border-ink-100 p-3">
              <span className="w-8 h-8 rounded-lg bg-peach-50 text-peach-600 flex items-center justify-center shrink-0">
                <Icon name={m.icon} size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-ink-800 truncate">{t(`missions.${m.id}` as "missions.m1")}</p>
                <span className="text-xs font-600 text-brand-600">{t("missions.reward", { n: MISSION_POINTS })}</span>
              </div>
              {done ? (
                <span className="text-xs font-600 text-mint-600 flex items-center gap-1">
                  <Icon name="check" size={14} /> {t("missions.claimed")}
                </span>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => onClaim(m.id)}>{t("missions.claim")}</Button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function LedgerBlock({ ledger }: { ledger: PointsEntry[] }) {
  const t = useTranslations("loyalty");
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? ledger : ledger.slice(0, 6);
  return (
    <section className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-700 text-ink-900">{t("ledger.title")}</h2>
          <p className="text-sm text-ink-500">{t("ledger.desc")}</p>
        </div>
        {ledger.length > 6 && (
          <button type="button" onClick={() => setExpanded((v) => !v)} className="text-xs font-600 text-brand-600 hover:underline shrink-0">
            {expanded ? t("ledger.showLess") : t("ledger.viewAll")}
          </button>
        )}
      </div>
      {ledger.length === 0 ? (
        <p className="text-sm text-ink-400 py-4 text-center">{t("ledger.empty")}</p>
      ) : (
        <ul className="divide-y divide-ink-50">
          {shown.map((e) => (
            <li key={e.id} className="flex items-center gap-3 py-3">
              <span className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                e.points >= 0 ? "bg-mint-50 text-mint-600" : "bg-peach-50 text-peach-600",
              )}>
                <Icon name={e.points >= 0 ? "plus" : "gift"} size={15} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-ink-800 truncate">{e.description}</p>
                <p className="text-xs text-ink-400">{e.date} · {t(`ledger.type.${e.type}` as "ledger.type.earn")}</p>
              </div>
              <span className={cn("tabnum font-700 text-sm shrink-0", e.points >= 0 ? "text-mint-600" : "text-peach-600")}>
                {e.points >= 0 ? "+" : ""}{e.points.toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
