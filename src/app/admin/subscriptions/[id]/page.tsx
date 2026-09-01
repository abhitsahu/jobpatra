import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/app/api/(controller)/auth/[...nextauth]/options';
import { prisma } from '@/app/_lib/prisma';
import { ArrowLeft } from 'lucide-react';
import { SubscriptionAdjustForm } from './adjust-form';

export const metadata: Metadata = { title: 'Subscription Details | JobPatra Admin' };

export default async function SubscriptionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/app/dashboard');

  const { id } = await params;

  const sub = await prisma.subscription.findUnique({
    where: { id },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  if (!sub) notFound();

  return (
    <div className="space-y-6 max-w-3xl font-['Hanken_Grotesk']">
      <Link
        href="/admin/subscriptions"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#564240] hover:text-[#7a1f1f] transition-colors"
      >
        <ArrowLeft size={16} /> Back to Subscriptions
      </Link>

      <div className="bg-white border border-[#ddc0bd] rounded-xl p-6 shadow-xs">
        <h2 className="text-xl font-bold text-[#2b1611] font-['Playfair_Display'] mb-4">Subscription Overview</h2>
        <dl className="space-y-3 text-sm divide-y divide-[#ddc0bd]/40">
          {[
            ['Subscriber', `${sub.user.name ?? '—'} (${sub.user.email})`],
            ['Current Plan', sub.snapshotPlanName ?? sub.plan],
            ['Status', sub.status],
            ['Billing Interval', sub.snapshotBillingPeriod ?? '—'],
            ['Amount Paid', sub.snapshotMonthlyPrice != null
              ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: sub.snapshotCurrency ?? 'INR', maximumFractionDigits: 0 }).format(sub.snapshotMonthlyPrice)
              : '—'],
            ['Period Started', new Date(sub.currentPeriodStart).toLocaleDateString('en-IN')],
            ['Period Ending', sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toLocaleDateString('en-IN') : '—'],
            ['Created Date', new Date(sub.createdAt).toLocaleDateString('en-IN')],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-2 pt-2 first:pt-0">
              <dt className="text-[#564240] font-medium">{label}</dt>
              <dd className="text-[#2b1611] font-semibold text-right">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <SubscriptionAdjustForm
        subscriptionId={sub.id}
        currentPlan={sub.plan}
        currentStatus={sub.status}
        currentPeriodEnd={sub.currentPeriodEnd?.toISOString() ?? ''}
      />
    </div>
  );
}
