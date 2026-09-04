import { prisma } from '@/app/_lib/prisma';
import type { Prisma } from '@prisma/client';

interface PlanLimits {
  limitAtsAnalysis: number;
  limitAiSuggestion: number;
  durationDays: number | null;
  templateAccess: string;
}

interface CacheEntry {
  value: PlanLimits;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

type PlanLimitClient = typeof prisma | Prisma.TransactionClient;

export async function getPlanLimits(
  planSlug: string,
  db: PlanLimitClient = prisma,
): Promise<PlanLimits> {
  const normalized = planSlug.toLowerCase();
  const now = Date.now();

  const cached = cache.get(normalized);
  if (cached && now < cached.expiresAt) {
    return cached.value;
  }

  let plan = await db.pricingPlan.findUnique({
    where: { slug: normalized },
  });

  if (!plan) {
    console.warn(
      `[PlanLimitService] Plan '${planSlug}' not found in database. Triggering pricing seed...`,
    );
    if (db !== prisma) {
      throw new Error(`Plan limits configuration not found for plan slug: ${planSlug}`);
    }

    const { seedPricingData } = await import('@/app/service/pricing/pricing.service');
    await seedPricingData();

    plan = await db.pricingPlan.findUnique({
      where: { slug: normalized },
    });
  }

  if (!plan) {
    throw new Error(`Plan limits configuration not found in database for plan slug: ${planSlug}`);
  }

  const limits: PlanLimits = {
    limitAtsAnalysis: plan.limitAtsAnalysis,
    limitAiSuggestion: plan.limitAiSuggestion,
    durationDays: plan.durationDays,
    templateAccess: plan.templateAccess,
  };

  cache.set(normalized, {
    value: limits,
    expiresAt: now + CACHE_TTL_MS,
  });

  return limits;
}

export function invalidatePlanLimitsCache() {
  cache.clear();
}
