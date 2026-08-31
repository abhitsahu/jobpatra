'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from '@/app/app/_components/layout/sidebar';
import { Header } from '@/app/app/_components/layout/header';
import { Toaster } from 'sonner';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isResumeEditor = pathname?.startsWith('/app/resume/') && pathname !== '/app/resume/new';

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F2E8] text-[#2b1611] antialiased relative">
      {/* Paper Texture Overlay */}
      <div className="fixed inset-0 auth-paper-texture pointer-events-none z-50"></div>
      <Toaster position="top-right" richColors />
      {!isResumeEditor && <Sidebar />}
      <main
        className={`${
          !isResumeEditor ? 'md:ml-56' : ''
        } flex-1 flex flex-col h-full overflow-hidden relative z-10`}
      >
        <Header />
        {isResumeEditor ? (
          <div className="flex-1 overflow-hidden flex flex-col w-full h-full">
            {children}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto w-full no-scrollbar">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
              {children}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
