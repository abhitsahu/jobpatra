import { prisma } from '@/app/_lib/prisma';

interface PlanLimits {
  limitResumeCreate: number;
  limitAtsAnalysis: number;
  limitAiSuggestion: number;
  limitDownloadPdf: number;
}

interface CacheEntry {
  value: PlanLimits;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function getPlanLimits(planSlug: string): Promise<PlanLimits> {
  const normalized = planSlug.toLowerCase();
  const now = Date.now();

  // Check cache
  const cached = cache.get(normalized);
  if (cached && now < cached.expiresAt) {
    return cached.value;
  }

  // Query Database
  let plan = await prisma.pricingPlan.findUnique({
    where: { slug: normalized },
  });

  // Self-healing check: if the database is unpopulated or missing plans
  if (!plan) {
    console.warn(`[PlanLimitService] Plan '${planSlug}' not found in database. Triggering pricing seed...`);
    const { seedPricingData } = await import('@/app/service/pricing/pricing.service');
    await seedPricingData();

    // Re-query database
    plan = await prisma.pricingPlan.findUnique({
      where: { slug: normalized },
    });
  }

  if (!plan) {
    throw new Error(`Plan limits configuration not found in database for plan slug: ${planSlug}`);
  }

  const limits: PlanLimits = {
    limitResumeCreate: plan.limitResumeCreate,
    limitAtsAnalysis: plan.limitAtsAnalysis,
    limitAiSuggestion: plan.limitAiSuggestion,
    limitDownloadPdf: plan.limitDownloadPdf,
  };

  // Write to cache
  cache.set(normalized, {
    value: limits,
    expiresAt: now + CACHE_TTL_MS,
  });

  return limits;
}

export function invalidatePlanLimitsCache() {
  cache.clear();
}
