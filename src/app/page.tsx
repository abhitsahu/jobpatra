import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import type { Metadata } from 'next';

import { authOptions } from '@/app/api/(controller)/auth/[...nextauth]/options';
import { Navbar } from '@/app/app/_components/layout/navbar';
import { Hero } from '@/app/app/_components/landing/hero';
import { Footer } from '@/app/app/_components/layout/footer';

export const metadata: Metadata = {
  title: 'JobPatra — AI Resume Builder & ATS Analyzer',
  description:
    'Land more interviews with surgically precise resumes. Our AI analyzes job descriptions and tailors your experience to bypass ATS filters with maximum impact.',
};

export default async function RootPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/app/dashboard');
  }

  return (
    <div className="bg-[#0f1418] text-[#dfe3e9] min-h-screen overflow-x-hidden selection:bg-[rgba(26,145,240,0.3)] selection:text-white antialiased">
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#1a91f0]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[60%] bg-[#a855f7]/10 blur-[150px] rounded-full" />
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <Navbar isLoggedIn={false} />

      <main className="relative z-10">
        <Hero isLoggedIn={false} />
      </main>

      <Footer />
    </div>
  );
}
