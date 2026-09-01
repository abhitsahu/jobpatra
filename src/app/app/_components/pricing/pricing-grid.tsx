import React from 'react';
import { PricingCard } from './pricing-card';
import type { PricingPlanResponse } from '@/app/api/model/response/pricing';

interface PricingGridProps {
  plans: PricingPlanResponse[];
  isYearly: boolean;
  onSelectPlan: (slug: string) => void;
}

export function PricingGrid({ plans, isYearly, onSelectPlan }: PricingGridProps) {
  // Dynamically center and scale the grid based on the number of plans (1, 2, 3, 4+)
  const getContainerLayout = (count: number) => {
    switch (count) {
      case 1:
        return 'grid grid-cols-1 max-w-md';
      case 2:
        return 'grid grid-cols-1 md:grid-cols-2 max-w-4xl';
      case 3:
        return 'grid grid-cols-1 md:grid-cols-3 max-w-6xl';
      case 4:
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl';
      default:
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl';
    }
  };

  return (
    <div className={`mx-auto ${getContainerLayout(plans.length)} gap-8 mb-24 items-stretch justify-center w-full`}>
      {plans.map((plan) => (
        <PricingCard key={plan.id} plan={plan} isYearly={isYearly} onSelect={onSelectPlan} />
      ))}
    </div>
  );
}
