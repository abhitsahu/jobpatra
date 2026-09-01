import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/app/api/(controller)/auth/[...nextauth]/options';
import { prisma } from '@/app/_lib/prisma';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = { title: 'User Details | JobPatra Admin' };

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/app/dashboard');

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
        take: 5,
      },
      payments: {
        select: { id: true, amount: true, currency: true, status: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  });

  if (!user) notFound();

  const fmt = (n: number, currency = 'INR') =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);

  const usageMap = Object.fromEntries(user.usageTracking.map((u) => [u.feature, u.used]));

  return (
    <div className="space-y-6 font-['Hanken_Grotesk']">
      {/* Back */}
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#564240] hover:text-[#7a1f1f] transition-colors"
      >
        <ArrowLeft size={16} /> Back to Users
      </Link>

      {/* Identity Card */}
      <div className="bg-white border border-[#ddc0bd] rounded-xl p-6 flex items-start gap-5 shadow-xs">
        <div className="w-14 h-14 rounded-full bg-[#370003] text-white text-xl font-bold flex items-center justify-center font-['Playfair_Display'] shrink-0 shadow-xs border border-white">
          {user.name?.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('') ?? 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-xl font-bold text-[#2b1611] font-['Playfair_Display']">{user.name ?? '—'}</h2>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${user.role === 'ADMIN' ? 'bg-[#fff0ed] text-[#7a1f1f] border border-[#ddc0bd]' : 'bg-[#f3f4f6] text-[#4b5563]'}`}>
              {user.role}
            </span>
            {user.subscription && user.subscription.plan !== 'FREE' && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#dcfce7] text-[#166534] border border-[#86efac]">
                {user.subscription.plan}
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-[#564240] mt-1">{user.email}</p>
          {(user.jobTitle || user.industry) && (
            <p className="text-xs text-[#564240]/80 mt-1">{[user.jobTitle, user.industry].filter(Boolean).join(' · ')}</p>
          )}
          <p className="text-xs text-[#564240]/70 mt-1">
            Registered on {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Subscription */}
        <div className="bg-white border border-[#ddc0bd] rounded-xl p-5 shadow-xs">
          <p className="text-base font-bold text-[#2b1611] font-['Playfair_Display'] mb-4">Subscription Overview</p>
          {user.subscription ? (
            <dl className="space-y-2.5 text-sm divide-y divide-[#ddc0bd]/40">
              {[
                ['Plan', user.subscription.plan],
                ['Status', user.subscription.status],
                ['Period End', user.subscription.currentPeriodEnd
                  ? new Date(user.subscription.currentPeriodEnd).toLocaleDateString('en-IN')
                  : '—'],
                ['Billing Period', user.subscription.snapshotBillingPeriod ?? '—'],
                ['Amount Paid', user.subscription.snapshotMonthlyPrice != null
                  ? fmt(user.subscription.snapshotMonthlyPrice, user.subscription.snapshotCurrency ?? 'INR')
                  : '—'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-2 pt-2 first:pt-0">
                  <dt className="text-[#564240] font-medium">{label}</dt>
                  <dd className="text-[#2b1611] font-semibold text-right">{value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="text-sm text-[#564240]">Free plan (no active paid subscription)</p>
          )}
        </div>

        {/* Usage */}
        <div className="bg-white border border-[#ddc0bd] rounded-xl p-5 shadow-xs">
          <p className="text-base font-bold text-[#2b1611] font-['Playfair_Display'] mb-4">Usage Metrics</p>
          <dl className="space-y-2.5 text-sm divide-y divide-[#ddc0bd]/40">
            {[
              ['Resumes Created', usageMap['RESUME_CREATE'] ?? 0],
              ['ATS Analyses', usageMap['ATS_ANALYSIS'] ?? 0],
              ['AI Suggestions', usageMap['AI_SUGGESTION'] ?? 0],
              ['PDF Downloads', usageMap['DOWNLOAD_PDF'] ?? 0],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between pt-2 first:pt-0">
                <dt className="text-[#564240] font-medium">{label}</dt>
                <dd className="text-[#2b1611] font-bold">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Resumes */}
      <div className="bg-white border border-[#ddc0bd] rounded-xl p-5 shadow-xs">
        <p className="text-base font-bold text-[#2b1611] font-['Playfair_Display'] mb-4">Resumes ({user.resumes.length})</p>
        {user.resumes.length === 0 ? (
          <p className="text-sm text-[#564240]">No resumes built yet.</p>
        ) : (
          <div className="divide-y divide-[#ddc0bd]/50">
            {user.resumes.map((r) => (
              <div key={r.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#2b1611] font-semibold">{r.title || 'Untitled Resume'}</p>
                  <p className="text-xs text-[#564240]">Template: {r.templateId}</p>
                </div>
                <p className="text-xs text-[#564240] font-medium">
                  {new Date(r.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payments */}
      {user.payments.length > 0 && (
        <div className="bg-white border border-[#ddc0bd] rounded-xl p-5 shadow-xs">
          <p className="text-base font-bold text-[#2b1611] font-['Playfair_Display'] mb-4">Payment Records</p>
          <div className="divide-y divide-[#ddc0bd]/50">
            {user.payments.map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#2b1611] font-bold">{fmt(p.amount, p.currency)}</p>
                  <p className="text-xs text-[#564240]">{new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  p.status === 'COMPLETED' ? 'bg-[#dcfce7] text-[#166534] border border-[#86efac]' : 'bg-[#fff0ed] text-[#564240]'
                }`}>{p.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
