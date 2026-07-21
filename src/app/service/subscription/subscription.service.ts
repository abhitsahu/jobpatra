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
