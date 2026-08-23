import { prisma } from '@/app/_lib/prisma';
import type { Prisma } from '@prisma/client';

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

type PlanLimitClient = typeof prisma | Prisma.TransactionClient;

export async function getPlanLimits(
  planSlug: string,
  db: PlanLimitClient = prisma,
): Promise<PlanLimits> {
  const normalized = planSlug.toLowerCase();
  const now = Date.now();

  // Check cache
  const cached = cache.get(normalized);
  if (cached && now < cached.expiresAt) {
    return cached.value;
  }

  // Query Database
  let plan = await db.pricingPlan.findUnique({
    where: { slug: normalized },
  });

  // Self-healing check: if the database is unpopulated or missing plans
  if (!plan) {
    console.warn(
      `[PlanLimitService] Plan '${planSlug}' not found in database. Triggering pricing seed...`,
    );
    // Seeding performs multiple independent writes and must never run inside
    // an interactive transaction. A missing plan is a configuration error for
    // transactional callers, not something they can safely repair.
    if (db !== prisma) {
      throw new Error(`Plan limits configuration not found for plan slug: ${planSlug}`);
    }

    const { seedPricingData } = await import('@/app/service/pricing/pricing.service');
    await seedPricingData();

    // Re-query database
    plan = await db.pricingPlan.findUnique({
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
