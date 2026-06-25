import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/(controller)/auth/[...nextauth]/options';
import { LogoutButton } from './logout-button';

export const metadata: Metadata = {
  title: 'Dashboard — JobPatra',
  description: 'Your JobPatra dashboard.',
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-[#0f1418] text-[#dfe3e9] flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="font-[Space_Grotesk] text-[48px] font-semibold text-[#dfe3e9]">
            Dashboard
          </h1>
          {session.user?.email && (
            <p className="font-[Inter] text-[16px] text-[#bfc7d4]">
              Welcome back, {session.user.name ?? session.user.email}
            </p>
          )}
        </div>
        <LogoutButton />
      </div>
    </div>
  );
}
