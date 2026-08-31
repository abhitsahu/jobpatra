import { IconMapper } from '@/app/_components/icons/IconMapper';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/app/app/_util/cn';
import { getSubscriptionStatusClient } from '@/app/api/client/payments/payments-client';
import { Logo } from '@/app/app/_components/common/logo';

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/app/dashboard', icon: 'dashboard' },
  { label: 'Build Resume', href: '/app/resume/new', icon: 'edit_note' },
  { label: 'ATS Analyzer', href: '/app/ats-workspace', icon: 'analytics' },
  // { label: 'Feedback', href: '/app/feedback', icon: 'feedback' },
  // { label: 'Settings', href: '/app/settings', icon: 'settings' },
];

import { useUserProfile } from '@/app/app/_hooks/use-user-profile';

export function Sidebar() {
  const pathname = usePathname();
  const [plan, setPlan] = useState<string>('FREE');
  const [loading, setLoading] = useState<boolean>(true);

  const { data: userProfile } = useUserProfile();

  const userName = userProfile?.name || 'User';
  const userEmail = userProfile?.email || '';

  const initials = userName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'U';

  useEffect(() => {
    let active = true;
    async function fetchPlan() {
      try {
        const res = await getSubscriptionStatusClient();
        if (res.success && active) {
          setPlan(res.subscription?.plan || 'FREE');
        }
      } catch (err) {
        console.error('Sidebar: failed to fetch plan status:', err);
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchPlan();
    return () => {
      active = false;
    };
  }, [pathname]);

  return (
    <aside className="flex flex-col h-screen fixed left-0 top-0 py-6 w-56 bg-[#fff8f6] border-r border-[#ddc0bd] z-50 hidden md:flex">
      {/* Brand */}
      <div className="px-5 mb-6">
        <Link href="/">
          <Logo iconClassName="h-7 w-auto" textClassName="font-['Playfair_Display'] text-[20px] font-bold text-[#7a1f1f]" />
        </Link>
        <p className="font-['Hanken_Grotesk'] text-[10px] leading-[14px] font-bold text-[#564240]/60 tracking-widest uppercase mt-1">
          AI Career Workshop
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto no-scrollbar">
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
              <IconMapper name={item.icon} className="text-[18px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section: Profile + Subscription */}
      <div className="px-3 mt-auto pt-3 border-t border-[#ddc0bd]/40 space-y-2.5">
        {/* User Profile Card */}
        <div className="p-2.5 bg-white border border-[#ddc0bd] rounded-xl shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#370003] text-white flex items-center justify-center font-bold text-xs font-['Playfair_Display'] shrink-0 shadow-xs border border-white">
              {userProfile?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={userProfile.image}
                  alt={userName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-['Playfair_Display'] text-[12px] font-bold text-[#2b1611] truncate leading-tight">
                {userName}
              </p>
              <p className="font-['Hanken_Grotesk'] text-[10px] text-[#564240]/80 truncate">
                {userEmail}
              </p>
            </div>
          </div>
          <Link
            href="/app/settings"
            className="mt-2 block text-center text-[11px] font-semibold text-[#7a1f1f] hover:text-[#5b060c] hover:underline pt-1.5 border-t border-[#ddc0bd]/30"
          >
            Edit Profile →
          </Link>
        </div>

        {/* Subscription Status Card */}
        {loading ? (
          <div className="p-3 bg-[#fff0ed] animate-pulse rounded-xl h-12 border border-[#ddc0bd]/40" />
        ) : plan === 'FREE' ? (
          <Link
            href="/app/subscription"
            className="block p-2.5 bg-[#f6be39] hover:bg-[#e0ab2b] border border-[#ddc0bd]/40 rounded-xl text-center transition-all group shadow-xs cursor-pointer"
          >
            <div className="flex items-center justify-center gap-1.5">
              <IconMapper name="workspace_premium" className="text-[#261a00] text-sm group-hover:scale-110 transition-transform" />
              <span className="font-['Hanken_Grotesk'] text-[11px] font-bold text-[#261a00] uppercase tracking-wider">
                Upgrade to Pro
              </span>
            </div>
          </Link>
        ) : (
          <Link
            href="/app/settings?section=subscription"
            className="block p-2.5 bg-[#fff0ed] hover:bg-[#ffe2db]/60 border border-[#ddc0bd]/40 rounded-xl text-center transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-center gap-1.5">
              <IconMapper name="verified" className="text-[#7a1f1f] text-sm group-hover:rotate-12 transition-transform" />
              <span className="font-['Hanken_Grotesk'] text-[11px] font-bold text-[#7a1f1f] uppercase tracking-wider">
                Pro Active
              </span>
            </div>
          </Link>
        )}
      </div>
    </aside>
  );
}
