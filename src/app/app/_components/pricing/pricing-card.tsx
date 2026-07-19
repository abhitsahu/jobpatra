import React from 'react';
import type { PricingPlanResponse } from '@/app/api/model/response/pricing';

interface PricingCardProps {
  plan: PricingPlanResponse;
  isYearly: boolean;
  onSelect: (slug: string) => void;
}

const PLAN_ICONS: Record<string, string> = {
  free: 'draft',
  enterprise: 'corporate_fare',
};

export function PricingCard({ plan, isYearly, onSelect }: PricingCardProps) {
  const {
    name,
    slug,
    monthlyPrice,
    yearlyPrice,
    currency,
    description,
    buttonText,
    buttonVariant,
    isPopular,
    features,
  } = plan;

  // Currency symbol mapper
  const getCurrencySymbol = (code: string) => {
    if (code === 'USD') return '$';
    if (code === 'INR') return '₹';
    if (code === 'EUR') return '€';
    return code + ' ';
  };

  // Determine monthly rate or yearly rate divided by 12, or total yearly rate
  const symbol = getCurrencySymbol(currency);

  // Design specifies monthlyPrice as monthly rate (e.g. $19),
  // and yearly rate can be displayed as yearlyPrice/12 or as it is.
  // The design for Pro has: "$19" -> "/month".
  // If yearly is active, let's display the yearly price adjusted to monthly equivalent or direct yearly total.
  // The design: "$19" /month. If yearly, we can show:
  // (yearlyPrice / 12) or the yearlyPrice. Let's calculate the display price:
  const displayPrice = isYearly
    ? slug === 'free'
      ? 0
      : Math.round(yearlyPrice / 12)
    : monthlyPrice;
  const billingIntervalLabel =
    slug === 'free' ? '/forever' : isYearly ? '/month (billed yearly)' : '/month';

  return (
    <div
      className={`sheet-bg p-8 rounded-lg flex flex-col sheet-shadow relative overflow-hidden group transition-all duration-300 ${
        isPopular
          ? 'border-2 border-[#5b060c] scale-105 z-10 ring-4 ring-[#5b060c]/5'
          : 'border border-[#ddc0bd]'
      }`}
    >
      {/* Premium / Wax Seal Badge */}
      {isPopular ? (
        <div className="absolute -top-3 -right-3 w-20 h-20 wax-seal rounded-full flex items-center justify-center transform rotate-12 shadow-xl border-4 border-[#5b060c] z-20 select-none pointer-events-none">
          <span
            className="material-symbols-outlined text-white text-2xl font-filled"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            workspace_premium
          </span>
        </div>
      ) : (
        slug in PLAN_ICONS && (
          <div className="absolute top-0 right-0 p-4 select-none pointer-events-none">
            <span className="material-symbols-outlined text-[#ddc0bd] text-2xl">
              {PLAN_ICONS[slug]}
            </span>
          </div>
        )
      )}

      {/* Plan Title */}
      <h3
        className={`font-['Playfair_Display'] text-[24px] leading-[32px] font-semibold mb-2 ${
          isPopular ? 'text-[#5b060c]' : 'text-[#2b1611]'
        }`}
      >
        {name}
      </h3>

      {/* Pricing display */}
      <div className="flex items-baseline mb-6">
        <span className="text-4xl font-bold font-['Playfair_Display'] text-[36px] text-[#5b060c]">
          {symbol}
          {displayPrice}
        </span>
        <span className="text-[#564240] ml-2 font-['Hanken_Grotesk'] text-[14px] leading-[20px] tracking-[0.05em] font-semibold">
          {billingIntervalLabel}
        </span>
      </div>

      {/* Description */}
      <p className="text-[#564240] mb-8 font-['Hanken_Grotesk'] text-[16px] leading-[24px]">
        {description}
      </p>

      {/* Features list */}
      <ul className="space-y-4 mb-10 flex-grow">
        {features.map((feat) => (
          <li key={feat.id} className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#5b060c] text-lg select-none">
              {feat.available ? 'check' : 'close'}
            </span>
            <span
              className={`font-['Hanken_Grotesk'] text-[16px] leading-[24px] ${
                feat.highlight ? 'font-semibold text-[#2b1611]' : 'text-[#564240]'
              }`}
            >
              {feat.feature}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <button
        onClick={() => onSelect(slug)}
        className={`w-full py-3 font-['Hanken_Grotesk'] text-[14px] leading-[20px] tracking-[0.05em] font-semibold rounded-lg transition-all active:scale-[0.98] cursor-pointer ${
          buttonVariant === 'solid' || isPopular
            ? 'bg-[#5b060c] text-white shadow-lg hover:brightness-110'
            : 'border border-[#5b060c] text-[#5b060c] hover:bg-[#5b060c]/5'
        }`}
      >
        {buttonText}
      </button>
    </div>
  );
}
