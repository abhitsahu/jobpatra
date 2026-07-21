import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/(controller)/auth/[...nextauth]/options';
import { PricingClient } from '../../(public)/pricing/pricing-client';

export const metadata: Metadata = {
  title: 'Upgrade Plan — JobPatra',
  description: 'Select the perfect plan for your career growth.',
};

export default async function ProtectedSubscriptionPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/app/login');

  return (
    <div className="h-full overflow-y-auto">
      <PricingClient />
    </div>
  );
}
