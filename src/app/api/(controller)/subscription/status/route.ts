import { requireAuth } from '@/app/api/(controller)/_util/auth-guard';
import { prisma } from '@/app/_lib/prisma';
import { NextResponse } from 'next/server';
import { getOrSeedUsage } from '@/app/service/subscription/usage.service';
import { expireSubscriptionIfDue } from '@/app/service/subscription/subscription.service';

export async function GET() {
  try {
    const authResult = await requireAuth();
    if (authResult.error) return authResult.error;
    const userId = authResult.session.user.id;

    // Retrieve subscription from DB
    let subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    // If no subscription exists (e.g. freshly signed up user), create default FREE subscription
    if (!subscription) {
      subscription = await prisma.subscription.create({
        data: {
          userId,
          plan: 'FREE',
          status: 'ACTIVE',
        },
      });
    }

    // Enforce expiry: auto-downgrade to FREE if currentPeriodEnd has passed
    subscription = await expireSubscriptionIfDue(userId, subscription);

    const [resumeUsage, atsUsage, aiUsage, pdfUsage] = await Promise.all([
      getOrSeedUsage(prisma, userId, 'RESUME_CREATE'),
      getOrSeedUsage(prisma, userId, 'ATS_ANALYSIS'),
      getOrSeedUsage(prisma, userId, 'AI_SUGGESTION'),
      getOrSeedUsage(prisma, userId, 'DOWNLOAD_PDF'),
    ]);

    // Define limits based on plan slug
    const planLimits = {
      FREE: { name: 'Free Lifetime' },
      SECOND: { name: 'Professional Plus' },
      THIRD: { name: 'Executive Elite' },
    }[subscription.plan.toUpperCase()] || { name: subscription.plan };

    return NextResponse.json({
      success: true,
      subscription: {
        plan: subscription.plan,
        status: subscription.status,
        planName: planLimits.name,
        currentPeriodStart: subscription.currentPeriodStart,
        currentPeriodEnd: subscription.currentPeriodEnd,
      },
      usage: {
        resumes: {
          current: resumeUsage.used,
          max: resumeUsage.limit,
          percent: resumeUsage.limit === -1 ? 0 : Math.min(100, Math.round((resumeUsage.used / resumeUsage.limit) * 100)),
        },
        aiOptimizations: {
          current: aiUsage.used,
          max: aiUsage.limit,
          percent: aiUsage.limit === -1 ? 0 : Math.min(100, Math.round((aiUsage.used / aiUsage.limit) * 100)),
        },
        atsScans: {
          current: atsUsage.used,
          max: atsUsage.limit,
          percent: atsUsage.limit === -1 ? 0 : Math.min(100, Math.round((atsUsage.used / atsUsage.limit) * 100)),
        },
        pdfDownloads: {
          current: pdfUsage.used,
          max: pdfUsage.limit,
          percent: pdfUsage.limit === -1 ? 0 : Math.min(100, Math.round((pdfUsage.used / pdfUsage.limit) * 100)),
        },
      },
    });
  } catch (err: any) {
    console.error('[GET /api/subscription/status]', err);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}
