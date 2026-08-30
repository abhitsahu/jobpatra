'use client';

import { useQuery } from '@tanstack/react-query';
import { getPricingClient } from '@/app/api/client/pricing/pricing-client';

// ─────────────────────────────────────────────────────────────────────────────
// QUERY KEYS — centralised to prevent typos and enable precise invalidation
// ─────────────────────────────────────────────────────────────────────────────

export const pricingKeys = {
  all: ['pricing'] as const,
  page: () => [...pricingKeys.all, 'page'] as const,
};

// ─────────────────────────────────────────────────────────────────────────────
// usePricing
//
// Returns the complete pricing page dataset (plans, comparison, testimonials).
// Data is cached for 10 minutes — pricing rarely changes.
// ─────────────────────────────────────────────────────────────────────────────

export function usePricing() {
  return useQuery({
    queryKey: pricingKeys.page(),
    queryFn: getPricingClient,
    staleTime: 10 * 60 * 1000, // 10 min — pricing data rarely changes
    gcTime: 30 * 60 * 1000, // keep in cache for 30 min after component unmounts
  });
}
