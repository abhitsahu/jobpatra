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
  const periodEnd = new Date(now);

  if (billingPeriod === BillingPeriod.QUARTERLY) {
    periodEnd.setMonth(periodEnd.getMonth() + 3);
  } else {
    periodEnd.setMonth(periodEnd.getMonth() + 1);
  }

  // ── Snapshot plan limits BEFORE the transaction ───────────────────────────
  // Must run outside the transaction: getPricingPage may trigger a self-healing
  // seed which cannot safely run inside an interactive transaction.
  const [pricingPage, planLimits] = await Promise.all([
    getPricingPage(currency),
    getPlanLimits(normalizedPlan),
  ]);

  const pricingPlan = pricingPage.plans.find(
    (p) => p.slug.toLowerCase() === planSlug.toLowerCase(),
  );

  const snapshot = {
    snapshotPlanName: pricingPlan?.name ?? planSlug,
    snapshotMonthlyPrice: amount,
    snapshotCurrency: currency,
    snapshotBillingPeriod: billingPeriod as string,
    snapshotLimitResumes: planLimits.limitResumeCreate,
    snapshotLimitAts: planLimits.limitAtsAnalysis,
    snapshotLimitAi: planLimits.limitAiSuggestion,
    snapshotLimitPdf: planLimits.limitDownloadPdf,
  };
  // ──────────────────────────────────────────────────────────────────────────

  const result = await prisma.$transaction(async (tx) => {
    // 1. Guard against duplicate processing (idempotency at payment level)
    const existingPayment = await tx.payment.findUnique({
      where: { razorpayOrderId },
    });
    if (existingPayment?.status === 'COMPLETED') {
      throw new Error('PAYMENT_ALREADY_COMPLETED');
    }

    // 2. Upsert payment record → get its DB id for Invoice FK
    const payment = await tx.payment.upsert({
      where: { razorpayOrderId },
      update: {
        razorpayPaymentId,
        status: 'COMPLETED',
        amount,
        currency,
      },
      create: {
        userId,
        razorpayOrderId,
        razorpayPaymentId,
        amount,
        currency,
        status: 'COMPLETED',
      },
    });

    // 3. Upsert subscription with plan snapshot columns
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

    // 4. Reset all usage counters for the new billing period
    const RESETTABLE_FEATURES = ['RESUME_CREATE', 'ATS_ANALYSIS', 'AI_SUGGESTION', 'DOWNLOAD_PDF'];
    await Promise.all(
      RESETTABLE_FEATURES.map((feature) =>
        tx.$executeRaw`
          INSERT INTO "usage_tracking" ("userId", "feature", "used", "lastResetDate", "createdAt", "updatedAt")
          VALUES (${userId}, ${feature}, 0, ${now}, ${now}, ${now})
          ON CONFLICT ("userId", "feature")
          DO UPDATE SET "used" = 0, "lastResetDate" = ${now}, "updatedAt" = ${now}
        `,
      ),
    );

    // 5. Create invoice record + enqueue background PDF job
    //    pdfData and pdfUrl start as null — the cron job fills them in async.
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

  // Invalidate cached plan limits so the fresh snapshot takes effect immediately
  invalidatePlanLimitsCache();

  // ── Fire-and-forget: trigger cron to generate invoice PDF automatically ──
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
// Called on every GET /api/subscription/status. If the paid period has passed,
// atomically downgrades to FREE and resets usage counters.
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

  const RESETTABLE_FEATURES = ['RESUME_CREATE', 'ATS_ANALYSIS', 'AI_SUGGESTION', 'DOWNLOAD_PDF'];

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

    await Promise.all(
      RESETTABLE_FEATURES.map((feature) =>
        tx.$executeRaw`
          INSERT INTO "usage_tracking" ("userId", "feature", "used", "lastResetDate", "createdAt", "updatedAt")
          VALUES (${userId}, ${feature}, 0, ${now}, ${now}, ${now})
          ON CONFLICT ("userId", "feature")
          DO UPDATE SET "used" = 0, "lastResetDate" = ${now}, "updatedAt" = ${now}
        `,
      ),
    );

    return downgraded;
  });

  invalidatePlanLimitsCache();
  return updated;
}
