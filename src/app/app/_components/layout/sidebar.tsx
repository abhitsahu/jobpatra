'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/app/app/_util/cn';

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/app/dashboard', icon: 'dashboard' },
  { label: 'Build Resume', href: '/app/resume/new', icon: 'edit_note' },
  { label: 'ATS Analyzer', href: '/app/ats', icon: 'analytics' },
  { label: 'My Resumes', href: '/app/resumes', icon: 'description' },
  { label: 'Settings', href: '/app/settings', icon: 'settings' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-full w-64 fixed left-0 top-0 z-40 bg-surface-container-low/80 backdrop-blur-2xl border-r border-glass-border flex flex-col py-8 px-4 hidden md:flex">
      {/* Brand */}
      <div className="mb-12 px-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-gradient-to-br from-deep-indigo to-electric-blue flex items-center justify-center shadow-[0_0_15px_rgba(26,145,240,0.4)] shrink-0">
          <span className="material-symbols-outlined text-white text-[18px]">bolt</span>
        </div>
        <div>
          <h1 className="text-[20px] leading-tight font-bold text-on-surface tracking-tight font-[Space_Grotesk]">
            Elevate AI
          </h1>
          <p className="text-[11px] tracking-widest font-semibold text-electric-blue uppercase">
            Pro Plan
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === '/app/dashboard'
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-[14px] font-medium transition-all duration-200',
                isActive
                  ? 'bg-secondary-container/30 text-primary border-r-2 border-primary'
                  : 'text-on-surface-variant hover:bg-white/5 hover:translate-x-0.5',
              )}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade CTA */}
      <div className="mt-auto">
        <button className="w-full py-3 rounded-lg border border-glass-border bg-white/5 hover:bg-white/10 text-on-surface text-[14px] font-medium transition-colors flex justify-center items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
          Upgrade to Pro
        </button>
      </div>
    </aside>
  );
}
