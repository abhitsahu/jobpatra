'use client';

import { useState, useEffect, useRef } from 'react';
import type { Session } from 'next-auth';
import { cn } from '@/app/app/_util/cn';

import { ProfileSection } from '@/app/app/_components/settings/profile-section';
import { AccountSection } from '@/app/app/_components/settings/account-section';
import { SubscriptionSection } from '@/app/app/_components/settings/subscription-section';
import { NotificationsSection } from '@/app/app/_components/settings/notifications-section';
import { ResumePrefsSection } from '@/app/app/_components/settings/resume-prefs-section';
import { AIPreferencesSection } from '@/app/app/_components/settings/ai-preferences-section';
import { PrivacySection } from '@/app/app/_components/settings/privacy-section';
import { ConnectedAccountsSection } from '@/app/app/_components/settings/connected-accounts-section';
import { ExportDefaultsSection } from '@/app/app/_components/settings/export-defaults-section';
import { DangerZoneSection } from '@/app/app/_components/settings/danger-zone-section';

const NAV_ITEMS = [
  { id: 'profile', label: 'Profile', icon: 'person' },
  { id: 'account', label: 'Account', icon: 'manage_accounts' },
  { id: 'subscription', label: 'Subscription', icon: 'workspace_premium' },
  { id: 'notifications', label: 'Notifications', icon: 'notifications' },
  { id: 'resume-prefs', label: 'Resume Prefs', icon: 'article' },
  { id: 'ai-prefs', label: 'AI Preferences', icon: 'history_edu' },
  { id: 'privacy', label: 'Privacy & Security', icon: 'security' },
  { id: 'connected', label: 'Connected Accounts', icon: 'link' },
  { id: 'export', label: 'Export Defaults', icon: 'file_download' },
  { id: 'danger', label: 'Danger Zone', icon: 'dangerous', danger: true },
];

export default function SettingsClient({ session }: { session: Session }) {
  const [activeId, setActiveId] = useState('profile');
  const mainRef = useRef<HTMLDivElement>(null);

  // Scroll-spy: watch which section is nearest the top
  useEffect(() => {
    const container = mainRef.current;
    if (!container) return;

    const handleScroll = () => {
      for (const item of [...NAV_ITEMS].reverse()) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 160) {
          setActiveId(item.id);
          break;
        }
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveId(id);
  };

  return (
    <div ref={mainRef} className="flex-1 overflow-y-auto" style={{ background: '#F8F2E8' }}>
      {/* Paper texture */}
      <div
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{
          backgroundImage: "url('https://www.transparenttextures.com/patterns/natural-paper.png')",
          opacity: 0.03,
        }}
      />

      <div className="relative z-[2] max-w-6xl mx-auto px-10 py-10">
        {/* ── Page Header ──────────────────────────────────────────────────── */}
        <header className="mb-10 flex items-end justify-between border-b border-[#ddc0bd] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1
                className="text-[32px] leading-[40px] font-semibold text-[#5b060c]"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Settings
              </h1>
              <span className="material-symbols-outlined text-[#8a716f] rotate-45 text-xl">
                attach_file
              </span>
            </div>
            <p
              className="text-[16px] text-[#564240]"
              style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}
            >
              Manage your account, preferences and subscription.
            </p>
          </div>
          {/* User chip */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#fff0ed] border border-[#ddc0bd] flex items-center justify-center">
              <span
                className="text-[14px] font-bold text-[#5b060c]"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {session.user?.name?.[0]?.toUpperCase() ?? 'U'}
              </span>
            </div>
            <p
              className="text-[13px] font-semibold text-[#2b1611]"
              style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}
            >
              {session.user?.name ?? session.user?.email}
            </p>
          </div>
        </header>

        {/* ── Body grid ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-12 gap-6 items-start">
          {/* Sticky side nav */}
          <nav className="col-span-3 sticky top-4 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[14px] font-semibold transition-all text-left',
                    item.danger
                      ? isActive
                        ? 'bg-[#ba1a1a] text-white shadow-sm'
                        : 'text-[#ba1a1a] hover:bg-[#ffdad6]/40'
                      : isActive
                        ? 'bg-[#5b060c] text-white shadow-sm'
                        : 'text-[#564240] hover:bg-[#ffe9e4]',
                  )}
                  style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Content sections */}
          <div className="col-span-9 space-y-10">
            <ProfileSection />
            <AccountSection />
            <SubscriptionSection />
            <NotificationsSection />
            <ResumePrefsSection />
            <AIPreferencesSection />
            <PrivacySection />
            <ConnectedAccountsSection />
            <ExportDefaultsSection />
            <DangerZoneSection />

            {/* Footer */}
            <footer className="py-8 border-t border-[#ddc0bd]/40 flex justify-between items-center opacity-60">
              <p
                className="text-[12px] text-[#564240]"
                style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}
              >
                © {new Date().getFullYear()} JobPatra. Crafted with professional precision.
              </p>
              <div className="flex gap-6">
                {['Terms', 'Privacy', 'Support'].map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="text-[12px] text-[#564240] hover:text-[#5b060c] transition-colors"
                    style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}
                  >
                    {link}
                  </a>
                ))}
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
