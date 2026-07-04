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
  { label: 'ATS Analyzer', href: '/app/ats-workspace', icon: 'analytics' },
  { label: 'Settings', href: '/app/settings', icon: 'settings' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col h-screen fixed left-0 top-0 py-8 w-56 bg-[#fff8f6] border-r border-[#ddc0bd] z-50 hidden md:flex">
      {/* Brand */}
      <div className="px-5 mb-8">
        <h1 className="font-['Playfair_Display'] text-[22px] leading-[30px] font-bold text-[#7a1f1f] mb-1 tracking-tight">
          JobPatra
        </h1>
        <p className="font-['Hanken_Grotesk'] text-[10px] leading-[14px] font-bold text-[#564240]/60 tracking-widest uppercase">
          AI Career Workshop
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
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
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 font-['Hanken_Grotesk'] text-[13px] font-semibold leading-[18px] cursor-pointer",
                isActive
                  ? 'text-white bg-[#7a1f1f] shadow-sm shadow-[#7a1f1f]/10'
                  : 'text-[#564240] hover:bg-[#fff0ed] hover:text-[#7a1f1f] hover:translate-x-0.5',
              )}
            >
              <span
                className="material-symbols-outlined text-[18px]"
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
      <div className="px-3 mt-auto">
        <div className="p-3 bg-[#fff0ed] hover:bg-[#ffe2db]/60 border border-[#ddc0bd]/40 rounded-xl text-center transition-all group">
          <span className="material-symbols-outlined text-[#7a1f1f] mb-1 text-xl group-hover:rotate-12 transition-transform">
            workspace_premium
          </span>
          <p className="font-['Hanken_Grotesk'] text-[10px] leading-[14px] font-bold text-[#7a1f1f] uppercase tracking-widest">
            Pro Plan Active
          </p>
        </div>
      </div>
    </aside>
  );
}
