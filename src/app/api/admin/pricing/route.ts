import { NextResponse } from 'next/server';
import { prisma } from '@/app/_lib/prisma';
import { withAdminAuth } from '@/app/api/admin/_lib/with-admin-auth';
import { logAdminAction } from '@/app/api/admin/_lib/log-admin-action';

export async function GET(request: Request) {
  const auth = await withAdminAuth();
  if (auth instanceof NextResponse) return auth;

  const plans = await prisma.pricingPlan.findMany({
    orderBy: { displayOrder: 'asc' },
    include: { features: { orderBy: { order: 'asc' } } },
  });

  return NextResponse.json({ plans });
}

export async function POST(request: Request) {
  const auth = await withAdminAuth();
  if (auth instanceof NextResponse) return auth;

  const body = await request.json() as {
    name: string; slug: string; description: string; buttonText: string;
    monthlyPrice: number; quarterlyPrice: number; currency: string;
    limitResumeCreate: number; limitAtsAnalysis: number;
    limitAiSuggestion: number; limitDownloadPdf: number;
    isPopular?: boolean; displayOrder?: number;
    features?: Array<{ feature: string; available: boolean; order?: number }>
  };

  const plan = await prisma.pricingPlan.create({
    data: {
      name: body.name,
      slug: body.slug,
      description: body.description,
      buttonText: body.buttonText ?? 'Get Started',
      monthlyPrice: body.monthlyPrice,
      quarterlyPrice: body.quarterlyPrice,
      currency: body.currency,
      limitResumeCreate: body.limitResumeCreate,
      limitAtsAnalysis: body.limitAtsAnalysis,
      limitAiSuggestion: body.limitAiSuggestion,
      limitDownloadPdf: body.limitDownloadPdf,
      isPopular: body.isPopular ?? false,
      displayOrder: body.displayOrder ?? 0,
      isActive: true,
      features: {
        create: (body.features ?? []).map((f, i) => ({
          feature: f.feature,
          available: f.available,
          order: f.order ?? i,
        })),
      },
    },
    include: { features: true },
  });

  await logAdminAction({
    adminId: auth.session.user.id,
    action: 'CREATE_PRICING_PLAN',
    target: plan.id,
    details: { name: plan.name, slug: plan.slug },
    request,
  });

  return NextResponse.json({ success: true, plan }, { status: 201 });
}

export async function PUT(request: Request) {
  const auth = await withAdminAuth();
  if (auth instanceof NextResponse) return auth;

  const body = await request.json() as {
    id: string; name?: string; description?: string; buttonText?: string;
    monthlyPrice?: number; quarterlyPrice?: number;
    limitResumeCreate?: number; limitAtsAnalysis?: number;
    limitAiSuggestion?: number; limitDownloadPdf?: number;
    isPopular?: boolean; displayOrder?: number; isActive?: boolean;
  };

  const { id, ...data } = body;

  const updated = await prisma.pricingPlan.update({ where: { id }, data });

  await logAdminAction({
    adminId: auth.session.user.id,
    action: 'UPDATE_PRICING_PLAN',
    target: id,
    details: data as Record<string, unknown>,
    request,
  });

  return NextResponse.json({ success: true, plan: updated });
}

export async function DELETE(request: Request) {
  const auth = await withAdminAuth();
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ success: false, message: 'Missing plan ID' }, { status: 400 });

  const plan = await prisma.pricingPlan.findUnique({ where: { id }, select: { name: true } });
  await prisma.pricingPlan.delete({ where: { id } });

  await logAdminAction({
    adminId: auth.session.user.id,
    action: 'DELETE_PRICING_PLAN',
    target: id,
    details: { name: plan?.name },
    request,
  });

  return NextResponse.json({ success: true });
}
