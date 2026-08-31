'use client';

import { Sidebar } from '@/app/app/_components/layout/sidebar';
import { Toaster } from 'sonner';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F2E8] text-[#2b1611] antialiased relative">
      {/* Paper Texture Overlay */}
      <div className="fixed inset-0 auth-paper-texture pointer-events-none z-50"></div>
      <Toaster position="top-right" richColors />
      <Sidebar />
      <main className="md:ml-56 flex-1 flex flex-col h-full overflow-hidden relative z-10">
        {children}
      </main>
    </div>
  );
}
