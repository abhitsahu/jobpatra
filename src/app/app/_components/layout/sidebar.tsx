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
    <aside className="flex flex-col h-screen fixed left-0 top-0 py-10 w-64 bg-[#fff0ed] border-r border-[#ddc0bd] shadow-sm z-50 hidden md:flex">
      {/* Brand */}
      <div className="px-6 mb-10">
        <h1 className="font-['Playfair_Display'] text-[24px] leading-[32px] font-bold text-[#5b060c] mb-1">
          JobPatra
        </h1>
        <p className="font-['Hanken_Grotesk'] text-[12px] leading-[16px] font-semibold text-[#564240] tracking-wider uppercase">
          AI Career Workshop
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
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
                "flex items-center gap-3 px-4 py-2.5 transition-all font-['Hanken_Grotesk'] text-[14px] font-semibold leading-[20px]",
                isActive
                  ? 'text-white bg-[#5b060c] shadow-md scale-[0.98]'
                  : 'text-[#564240] hover:bg-[#ffe2db] hover:translate-x-0.5'
              )}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Signature Edition Info */}
      <div className="px-6 mt-8">
        <div className="p-4 bg-[#ffe2db]/50 rounded border border-[#ddc0bd]/30 text-center">
          <span className="material-symbols-outlined text-[#5b060c] mb-2 text-2xl">
            history_edu
          </span>
          <p className="font-['Hanken_Grotesk'] text-[12px] leading-[16px] font-semibold text-[#564240] uppercase tracking-wider">
            Signature Edition
          </p>
        </div>
      </div>
    </aside>
  );
}
