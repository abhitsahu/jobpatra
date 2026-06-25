'use client';

import Link from 'next/link';
import { Button } from '../ui/button';

interface NavbarProps {
  isLoggedIn: boolean;
}

const navLinks = [
  { label: 'Product', href: '#product' },
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'About', href: '#about' },
];

export function Navbar({ isLoggedIn }: NavbarProps) {
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0f1418]/30 backdrop-blur-xl border-b border-[rgba(255,255,255,0.08)]">
      <div className="flex justify-between items-center h-16 px-6 md:px-12 max-w-[1200px] mx-auto">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <span
            className="material-symbols-outlined text-[#1a91f0] text-2xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            bolt
          </span>
          <span className="font-[Space_Grotesk] text-[20px] font-bold text-[#dfe3e9]">
            JobPatra
          </span>
        </Link>

        {/* Nav links — desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-[Inter] text-[16px] text-[#bfc7d4] font-medium hover:text-[#a0caff] transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA — conditional on auth */}
        {isLoggedIn ? (
          <Button href="/app/dashboard" variant="primary">
            Dashboard
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
              arrow_forward
            </span>
          </Button>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/app/login"
              className="hidden sm:block font-[Space_Grotesk] text-[14px] font-medium text-[#bfc7d4] hover:text-[#dfe3e9] transition-colors"
            >
              Login
            </Link>
            <Button href="/app/signup" variant="primary">
              Get Started
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                arrow_forward
              </span>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
