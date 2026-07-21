import { prisma } from '@/app/_lib/prisma';
import { getPlanLimits } from './plan-limit.service';

const RESETTABLE_FEATURES = ['ATS_ANALYSIS', 'AI_SUGGESTION', 'DOWNLOAD_PDF'];

export async function checkAndIncrementUsage(
  tx: any,
  userId: string,
  feature: string,
  incrementBy = 1
) {
  // 1. Fetch user subscription to resolve plan
  const subscription = await tx.subscription.findUnique({
    where: { userId },
  });
  const planSlug = subscription?.plan?.toUpperCase() || 'FREE';
  const limits = await getPlanLimits(planSlug);

  const featureLimitMap: Record<string, keyof typeof limits> = {
    RESUME_CREATE: 'limitResumeCreate',
    ATS_ANALYSIS: 'limitAtsAnalysis',
    AI_SUGGESTION: 'limitAiSuggestion',
    DOWNLOAD_PDF: 'limitDownloadPdf',
  };
  const limitKey = featureLimitMap[feature];
  const limit = limits[limitKey];

  const now = new Date();

  // 2. Ensure row exists first via thread-safe INSERT ... ON CONFLICT DO NOTHING
  await tx.$executeRaw`
    INSERT INTO "usage_tracking" ("userId", "feature", "used", "lastResetDate", "createdAt", "updatedAt")
    VALUES (${userId}, ${feature}, 0, ${now}, ${now}, ${now})
    ON CONFLICT ("userId", "feature") DO NOTHING
  `;

  // 3. Acquire pessimistic write lock (FOR UPDATE)
  const lockedRecords = await tx.$queryRaw<any[]>`
    SELECT * FROM "usage_tracking"
    WHERE "userId" = ${userId} AND "feature" = ${feature}
    FOR UPDATE
  `;
  const lockedRecord = lockedRecords[0];
  if (!lockedRecord) {
    throw new Error(`Failed to acquire lock for feature: ${feature}`);
  }

  let currentUsed = lockedRecord.used;
  let lastResetDate = lockedRecord.lastResetDate;

  // 4. Handle anniversary monthly resets for metered features
  if (RESETTABLE_FEATURES.includes(feature)) {
    const cycleStart = new Date(subscription?.currentPeriodStart || now);
    let anniversaryDate = new Date(cycleStart);
    while (anniversaryDate <= now) {
      anniversaryDate.setMonth(anniversaryDate.getMonth() + 1);
    }
    const currentCycleStart = new Date(anniversaryDate);
    currentCycleStart.setMonth(currentCycleStart.getMonth() - 1);

    if (!lastResetDate || lastResetDate < currentCycleStart) {
      currentUsed = 0;
      lastResetDate = now;
    }
  }

  // 5. Assert limits check
  if (limit !== -1 && currentUsed + incrementBy > limit) {
    const err = new Error(`Usage limit exceeded for feature: ${feature}`);
    (err as any).code = 'LIMIT_EXCEEDED';
    throw err;
  }

  // 6. Perform write operations
  return await tx.usageTracking.update({
    where: { userId_feature: { userId, feature } },
    data: {
      used: currentUsed + incrementBy,
      lastResetDate: lastResetDate || now,
    },
  });
}

export async function decrementUsage(tx: any, userId: string, feature: string, decrementBy = 1) {
  const now = new Date();

  // Ensure row exists
  await tx.$executeRaw`
    INSERT INTO "usage_tracking" ("userId", "feature", "used", "lastResetDate", "createdAt", "updatedAt")
    VALUES (${userId}, ${feature}, 0, ${now}, ${now}, ${now})
    ON CONFLICT ("userId", "feature") DO NOTHING
  `;

  const lockedRecords = await tx.$queryRaw<any[]>`
    SELECT * FROM "usage_tracking"
    WHERE "userId" = ${userId} AND "feature" = ${feature}
    FOR UPDATE
  `;
  const lockedRecord = lockedRecords[0];
  if (!lockedRecord) return;

  const newUsed = Math.max(0, lockedRecord.used - decrementBy);

  await tx.usageTracking.update({
    where: { userId_feature: { userId, feature } },
    data: {
      used: newUsed,
    },
  });
}

export async function getOrSeedUsage(tx: any, userId: string, feature: string) {
  // 1. Fetch user plan limits
  const subscription = await tx.subscription.findUnique({
    where: { userId },
  });
  const planSlug = subscription?.plan?.toUpperCase() || 'FREE';
  const limits = await getPlanLimits(planSlug);

  const featureLimitMap: Record<string, keyof typeof limits> = {
    RESUME_CREATE: 'limitResumeCreate',
    ATS_ANALYSIS: 'limitAtsAnalysis',
    AI_SUGGESTION: 'limitAiSuggestion',
    DOWNLOAD_PDF: 'limitDownloadPdf',
  };
  const limitKey = featureLimitMap[feature];
  const limit = limits[limitKey];

  const now = new Date();

  // 2. Fetch/seed usage using thread-safe INSERT ... ON CONFLICT DO NOTHING
  await tx.$executeRaw`
    INSERT INTO "usage_tracking" ("userId", "feature", "used", "lastResetDate", "createdAt", "updatedAt")
    VALUES (${userId}, ${feature}, 0, ${now}, ${now}, ${now})
    ON CONFLICT ("userId", "feature") DO NOTHING
  `;

  let record = await tx.usageTracking.findUniqueOrThrow({
    where: { userId_feature: { userId, feature } },
  });

  // 3. Resettable check
  if (RESETTABLE_FEATURES.includes(feature)) {
    const cycleStart = new Date(subscription?.currentPeriodStart || now);
    let anniversaryDate = new Date(cycleStart);
    while (anniversaryDate <= now) {
      anniversaryDate.setMonth(anniversaryDate.getMonth() + 1);
    }
    const currentCycleStart = new Date(anniversaryDate);
    currentCycleStart.setMonth(currentCycleStart.getMonth() - 1);

    if (!record.lastResetDate || record.lastResetDate < currentCycleStart) {
      record = await tx.usageTracking.update({
        where: { userId_feature: { userId, feature } },
        data: {
          used: 0,
          lastResetDate: now,
        },
      });
    }
  }

  return {
    ...record,
    limit,
  };
}
