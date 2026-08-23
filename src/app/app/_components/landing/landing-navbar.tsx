'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Logo } from '@/app/app/_components/common/logo';

const navLinks = [
  { label: 'Templates', href: '/app/templates' },
  { label: 'ATS Checker', href: '/app/ats-checker' },
  { label: 'Features', href: '/#features' },
  { label: 'Pricing', href: '/app/pricing' },
  { label: 'Resources', href: '/#resources' },
];

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAuthPage = pathname === '/app/login' || pathname === '/app/signup';

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-[#E5D9C8]/40 ${
        scrolled
          ? 'bg-[#FFF8F6]/75 backdrop-blur-md shadow-[0_4px_20px_rgba(55,0,3,0.06)]'
          : 'bg-[#FFF8F6]/60 backdrop-blur-md shadow-[0_2px_10px_rgba(55,0,3,0.03)]'
      }`}
    >
      <div className="h-16 max-w-7xl mx-auto px-4 md:px-16 flex items-center justify-between">
        <Link href="/">
          <Logo />
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`font-['Hanken_Grotesk'] text-[14px] leading-[20px] tracking-[0.05em] font-semibold transition-colors ${
                  isActive
                    ? 'text-[#370003] font-semibold underline decoration-[#f6be39] decoration-2 underline-offset-8'
                    : 'text-[#564240] hover:text-[#370003]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {!isAuthPage ? (
          <div className="flex items-center gap-4">
            <Link
              href="/app/login"
              className="font-['Hanken_Grotesk'] text-[14px] leading-[20px] tracking-[0.05em] font-semibold text-[#564240] px-4 py-2 hover:text-[#370003] transition-colors"
            >
              Login
            </Link>
            <Link
              href="/app/signup"
              className="bg-[#370003] text-white font-['Hanken_Grotesk'] text-[14px] leading-[20px] tracking-[0.05em] font-semibold px-6 py-2 rounded-full hover:scale-105 transition-transform shadow-lg"
            >
              Get Started
            </Link>
          </div>
        ) : (
          <div className="w-[120px] md:w-[200px]" />
        )}
      </div>
    </header>
  );
}
