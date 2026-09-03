import { prisma } from '@/app/_lib/prisma';
import { BillingPeriod } from '@/app/api/model/enums/subscription';
import { invalidatePlanLimitsCache, getPlanLimits } from './plan-limit.service';
import { getPricingPage } from '@/app/service/pricing/pricing.service';
import { createInvoice } from './invoice.service';
import type { Subscription } from '@prisma/client';

// ─────────────────────────────────────────────────────────────────────────────
// ACTIVATE / UPGRADE SUBSCRIPTION
// ─────────────────────────────────────────────────────────────────────────────

export async function activateUserSubscription({
  userId,
  planSlug,
  billingPeriod,
  razorpayOrderId,
  razorpayPaymentId,
  amount,
  currency,
}: {
  userId: string;
  planSlug: string;
  billingPeriod: BillingPeriod;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  amount: number;
  currency: string;
}) {
  const normalizedPlan = planSlug.toUpperCase();
  const now = new Date();
  const isFree = normalizedPlan === 'FREE';

  // ── Block FREE downgrade when user has an active paid subscription ─────────
  const existingSubscription = await prisma.subscription.findUnique({
    where: { userId },
    select: { plan: true, status: true, currentPeriodEnd: true },
  });

  const isPaidActive =
    existingSubscription?.plan !== 'FREE' &&
    existingSubscription?.status === 'ACTIVE' &&
    existingSubscription?.currentPeriodEnd &&
    existingSubscription.currentPeriodEnd > now;

  if (isFree && isPaidActive) {
    const err = new Error('Cannot downgrade to Free while on an active paid subscription');
    (err as Error & { code?: string }).code = 'DOWNGRADE_BLOCKED';
    throw err;
  }

  // ── Snapshot plan limits BEFORE the transaction ───────────────────────────
  const [pricingPage, planLimits] = await Promise.all([
    getPricingPage(currency),
    getPlanLimits(normalizedPlan),
  ]);

  const pricingPlan = pricingPage.plans.find(
    (p) => p.slug.toLowerCase() === planSlug.toLowerCase(),
  );

  // Stacking: extend from existing period end ONLY if user has an active PAID subscription
  const baseDate =
    isPaidActive && existingSubscription?.currentPeriodEnd
      ? existingSubscription.currentPeriodEnd
      : now;

  const durationDays = planLimits.durationDays ?? (isFree ? null : 30);

  let periodEnd: Date | null = null;
  if (!isFree && durationDays) {
    periodEnd = new Date(baseDate);
    periodEnd.setDate(periodEnd.getDate() + durationDays);
  }

  const snapshot = {
    snapshotPlanName: pricingPlan?.name ?? planSlug,
    snapshotPriceInr: pricingPlan?.priceInr ?? amount,
    snapshotPriceUsd: pricingPlan?.priceUsd ?? 0,
    snapshotCurrency: currency,
    snapshotBillingPeriod: billingPeriod as string,
    snapshotLimitAts: planLimits.limitAtsAnalysis,
    snapshotLimitAi: planLimits.limitAiSuggestion,
    snapshotTemplateAccess: planLimits.templateAccess,
    snapshotDurationDays: durationDays,
  };

  const result = await prisma.$transaction(async (tx) => {
    // Idempotency guard
    const existingPayment = await tx.payment.findUnique({
      where: { razorpayOrderId },
    });
    if (existingPayment?.status === 'COMPLETED') {
      throw new Error('PAYMENT_ALREADY_COMPLETED');
    }

    const payment = await tx.payment.upsert({
      where: { razorpayOrderId },
      update: { razorpayPaymentId, status: 'COMPLETED', amount, currency },
      create: { userId, razorpayOrderId, razorpayPaymentId, amount, currency, status: 'COMPLETED' },
    });

    const subscription = await tx.subscription.upsert({
      where: { userId },
      update: {
        plan: normalizedPlan,
        status: 'ACTIVE',
        paymentProvider: 'razorpay',
        paymentId: razorpayPaymentId,
        razorpaySubscriptionId: razorpayOrderId,
        razorpayStatus: 'active',
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        cancelAtPeriodEnd: false,
        ...snapshot,
      },
      create: {
        userId,
        plan: normalizedPlan,
        status: 'ACTIVE',
        paymentProvider: 'razorpay',
        paymentId: razorpayPaymentId,
        razorpaySubscriptionId: razorpayOrderId,
        razorpayStatus: 'active',
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        cancelAtPeriodEnd: false,
        ...snapshot,
      },
    });

    // Set hasEverPaid = true on first paid purchase
    if (!isFree) {
      await tx.user.update({
        where: { id: userId },
        data: { hasEverPaid: true },
      });
    }

    // Stacking: accumulate limits for PAID plans.
    // For FREE plan: only seed credits if user has never paid before.
    const user = await tx.user.findUnique({ where: { id: userId }, select: { hasEverPaid: true } });
    const shouldSeedCredits = !isFree || !user?.hasEverPaid;

    if (shouldSeedCredits) {
      const METERED_FEATURES: { feature: string; planLimit: number }[] = [
        { feature: 'ATS_ANALYSIS', planLimit: planLimits.limitAtsAnalysis },
        { feature: 'AI_SUGGESTION', planLimit: planLimits.limitAiSuggestion },
      ];

      for (const { feature, planLimit } of METERED_FEATURES) {
        if (isFree) {
          // Free plan: seed initial credits only (no stacking)
          await tx.$executeRaw`
            INSERT INTO "usage_tracking" ("userId", "feature", "used", "limit", "lastResetDate", "createdAt", "updatedAt")
            VALUES (${userId}, ${feature}, 0, ${planLimit}, ${now}, ${now}, ${now})
            ON CONFLICT ("userId", "feature") DO NOTHING
          `;
        } else {
          // Paid plan: stack/accumulate credits on top of existing balance
          await tx.$executeRaw`
            INSERT INTO "usage_tracking" ("userId", "feature", "used", "limit", "lastResetDate", "createdAt", "updatedAt")
            VALUES (${userId}, ${feature}, 0, ${planLimit}, ${now}, ${now}, ${now})
            ON CONFLICT ("userId", "feature")
            DO UPDATE SET
              "limit" = COALESCE("usage_tracking"."limit", 0) + ${planLimit},
              "updatedAt" = ${now}
          `;
        }
      }
    }

    await createInvoice(tx, {
      userId,
      paymentId: payment.id,
      razorpayOrderId,
      razorpayPaymentId,
      planName: snapshot.snapshotPlanName,
      billingPeriod: billingPeriod as string,
      amount,
      currency,
    });

    return subscription;
  });

  invalidatePlanLimitsCache();
  triggerInvoiceCronAsync();

  return result;
}

function triggerInvoiceCronAsync() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return;
  fetch(`${appUrl}/api/cron/process-invoice-jobs`, {
    method: 'GET',
    headers: { 'x-cron-secret': cronSecret },
  }).catch((err) => {
    console.warn('[AutoCron] Fire-and-forget cron trigger failed:', err?.message);
  });
}


// ─────────────────────────────────────────────────────────────────────────────
// FAIL PAYMENT
// ─────────────────────────────────────────────────────────────────────────────

export async function failUserPayment(razorpayOrderId: string) {
  return prisma.payment.updateMany({
    where: { razorpayOrderId },
    data: { status: 'FAILED' },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// GET SUBSCRIPTION
// ─────────────────────────────────────────────────────────────────────────────

export async function getSubscriptionStatus(userId: string) {
  return prisma.subscription.findUnique({ where: { userId } });
}

// ─────────────────────────────────────────────────────────────────────────────
// LAZY EXPIRY ENFORCEMENT
// ─────────────────────────────────────────────────────────────────────────────

export async function expireSubscriptionIfDue(
  userId: string,
  subscription: Subscription,
): Promise<Subscription> {
  if (subscription.plan === 'FREE' || !subscription.currentPeriodEnd) {
    return subscription;
  }
  if (subscription.status === 'EXPIRED') {
    return subscription;
  }

  const now = new Date();
  if (subscription.currentPeriodEnd >= now) {
    return subscription;
  }

  console.info(
    `[SubscriptionService] Subscription for user ${userId} expired at ${subscription.currentPeriodEnd.toISOString()}. Downgrading to FREE.`,
  );

  const updated = await prisma.$transaction(async (tx) => {
    const downgraded = await tx.subscription.update({
      where: { userId },
      data: {
        plan: 'FREE',
        status: 'EXPIRED',
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
      },
    });

    // Credits are preserved on expiry — users keep remaining balance.

    return downgraded;
  });

  invalidatePlanLimitsCache();
  return updated;
}
