import { QueryProvider } from '@/app/app/providers/query-provider';
import { Sidebar } from '@/app/app/_components/layout/sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <div className="flex h-screen overflow-hidden bg-surface-charcoal text-on-surface antialiased">
        <Sidebar />
        <main className="md:ml-64 flex-1 flex flex-col h-full overflow-hidden">{children}</main>
      </div>
    </QueryProvider>
  );
}
