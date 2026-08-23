import { prisma } from '@/app/_lib/prisma';
import { BillingPeriod } from '@/app/api/model/enums/subscription';
import { invalidatePlanLimitsCache } from './plan-limit.service';

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

  // Execute database updates inside a single transactional block
  const result = await prisma.$transaction(async (tx) => {
    // 1. Read existing payment record to check status
    const existingPayment = await tx.payment.findUnique({
      where: { razorpayOrderId },
    });

    if (existingPayment?.status === 'COMPLETED') {
      throw new Error('PAYMENT_ALREADY_COMPLETED');
    }

    // Check if payment record exists or create/update it
    await tx.payment.upsert({
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

    // 2. Upsert the user's subscription status
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
      },
    });

    // 3. Reset all usage counters for the new billing period.
    //    This ensures re-subscribing always starts fresh at 0 —
    //    the anniversary logic handles mid-period resets month-to-month.
    const RESETTABLE_FEATURES_ON_SUBSCRIBE = ['RESUME_CREATE', 'ATS_ANALYSIS', 'AI_SUGGESTION', 'DOWNLOAD_PDF'];
    await Promise.all(
      RESETTABLE_FEATURES_ON_SUBSCRIBE.map((feature) =>
        tx.$executeRaw`
          INSERT INTO "usage_tracking" ("userId", "feature", "used", "lastResetDate", "createdAt", "updatedAt")
          VALUES (${userId}, ${feature}, 0, ${now}, ${now}, ${now})
          ON CONFLICT ("userId", "feature")
          DO UPDATE SET "used" = 0, "lastResetDate" = ${now}, "updatedAt" = ${now}
        `
      )
    );

    return subscription;
  });

  // Invalidate limits cache after successful activation/upgrade
  invalidatePlanLimitsCache();

  return result;
}

export async function failUserPayment(razorpayOrderId: string) {
  return await prisma.payment.updateMany({
    where: { razorpayOrderId },
    data: {
      status: 'FAILED',
    },
  });
}

export async function getSubscriptionStatus(userId: string) {
  return await prisma.subscription.findUnique({
    where: { userId },
  });
}
