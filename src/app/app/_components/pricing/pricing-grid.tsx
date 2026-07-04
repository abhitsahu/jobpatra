import React from 'react';
import { PricingCard } from './pricing-card';
import type { PricingPlanResponse } from '@/app/api/model/response/pricing';

interface PricingGridProps {
  plans: PricingPlanResponse[];
  isYearly: boolean;
  onSelectPlan: (slug: string) => void;
}

export function PricingGrid({ plans, isYearly, onSelectPlan }: PricingGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 items-stretch">
      {plans.map((plan) => (
        <PricingCard key={plan.id} plan={plan} isYearly={isYearly} onSelect={onSelectPlan} />
      ))}
    </div>
  );
}
