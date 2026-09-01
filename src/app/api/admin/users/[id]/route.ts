import { NextResponse } from 'next/server';
import { prisma } from '@/app/_lib/prisma';
import { withAdminAuth } from '@/app/api/admin/_lib/with-admin-auth';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await withAdminAuth();
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      jobTitle: true,
      industry: true,
      createdAt: true,
      subscription: true,
      usageTracking: true,
      resumes: {
        select: { id: true, title: true, templateId: true, updatedAt: true },
        orderBy: { updatedAt: 'desc' },
        take: 10,
      },
      atsAnalyses: {
        select: { id: true, overallScore: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      _count: { select: { resumes: true, atsAnalyses: true, payments: true } },
    },
  });

  if (!user) {
    return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ user });
}
