'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const navLinks = [
  { label: 'Templates', href: '/app/templates', active: false },
  { label: 'ATS Checker', href: '/app/ats-checker', active: false },
  { label: 'Features', href: '/#features', active: false },
  { label: 'Pricing', href: '/app/pricing', active: false },
  { label: 'Resources', href: '/#resources', active: false },
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
    <nav
      className={`sticky top-0 z-50 w-full border-b border-[#ddc0bd] transition-all duration-300 ${
        scrolled ? 'shadow-sm bg-white/90 backdrop-blur-md' : 'bg-[#FFF8F6]'
      }`}
    >
      <div className="flex justify-between items-center w-full px-4 md:px-16 py-4 max-w-7xl mx-auto">
        {/* Brand */}
        <Link
          href="/"
          className="font-['Playfair_Display'] text-[32px] leading-[40px] font-bold text-[#5b060c]"
        >
          JobPatra
        </Link>

        {/* Nav Links - Desktop */}
        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`font-['Hanken_Grotesk'] text-[14px] leading-[20px] tracking-[0.05em] font-semibold transition-colors ${
                link.active
                  ? 'text-[#5b060c] font-bold border-b-2 border-[#5b060c]'
                  : 'text-[#564240] hover:text-[#5b060c]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        {!isAuthPage ? (
          <div className="flex gap-4 items-center">
            <Link
              href="/app/login"
              className="font-['Hanken_Grotesk'] text-[14px] leading-[20px] tracking-[0.05em] font-semibold text-[#2b1611] hover:opacity-80 transition-opacity"
            >
              Login
            </Link>
            <Link
              href="/app/signup"
              className="bg-[#5b060c] text-white px-6 py-2 rounded-lg font-['Hanken_Grotesk'] text-[14px] leading-[20px] tracking-[0.05em] font-semibold hover:bg-[#7a1f1f] transition-all"
            >
              Get Started
            </Link>
          </div>
        ) : (
          <div className="w-[120px] md:w-[200px]" /> /* spacer to balance layout */
        )}
      </div>
    </nav>
  );
}
