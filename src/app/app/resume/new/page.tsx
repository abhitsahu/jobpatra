import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/(controller)/auth/[...nextauth]/options';
import NewResumeClient from './new-client';

export const metadata: Metadata = {
  title: 'Choose Template — Elevate AI',
  description: 'Choose a template for your new resume.',
};

export default async function NewResumePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/app/login');

  return <NewResumeClient />;
}
