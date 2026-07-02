'use client';

import { usePathname } from 'next/navigation';
import { QueryProvider } from '@/app/app/providers/query-provider';
import { Sidebar } from '@/app/app/_components/layout/sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute =
    pathname === '/app/login' ||
    pathname === '/app/signup' ||
    pathname?.startsWith('/app/public');

  if (isAuthRoute) {
    return <QueryProvider>{children}</QueryProvider>;
  }

  return (
    <QueryProvider>
      <div className="flex h-screen overflow-hidden bg-[#F8F2E8] text-[#2b1611] antialiased relative">
        {/* Paper Texture Overlay */}
        <div className="fixed inset-0 auth-paper-texture pointer-events-none z-50"></div>
        <Sidebar />
        <main className="md:ml-64 flex-1 flex flex-col h-full overflow-hidden relative z-10">{children}</main>
      </div>
    </QueryProvider>
  );
}
