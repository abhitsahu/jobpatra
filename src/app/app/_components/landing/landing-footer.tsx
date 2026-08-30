'use client';
import { IconMapper } from '@/app/_components/icons/IconMapper';

import Link from 'next/link';
import { Logo } from '@/app/app/_components/common/logo';

export function LandingFooter() {
  return (
    <footer className="w-full bg-[#fff0ee] border-t border-[#E5D9C8] py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Logo iconClassName="h-6 w-auto" textClassName="font-['Playfair_Display'] text-xl font-semibold text-[#370003]" />
            </Link>
            <p className="text-[#564240] font-['Hanken_Grotesk'] text-sm">
              Elevating professional storytelling through the digital nib.
            </p>
          </div>

          {/* Product Links */}
          <div className="flex flex-col gap-3">
            <h4 className="font-['Hanken_Grotesk'] text-xs font-semibold text-[#370003] uppercase tracking-widest mb-2">
              Product
            </h4>
            <Link
              className="text-[#564240] font-['Hanken_Grotesk'] text-sm hover:text-[#370003] transition-colors"
              href="/app/templates"
            >
              Templates
            </Link>
            <Link
              className="text-[#564240] font-['Hanken_Grotesk'] text-sm hover:text-[#370003] transition-colors"
              href="/#features"
            >
              AI Editor
            </Link>
            <Link
              className="text-[#564240] font-['Hanken_Grotesk'] text-sm hover:text-[#370003] transition-colors"
              href="/app/ats-checker"
            >
              ATS Score
            </Link>
          </div>

          {/* Company Links */}
          <div className="flex flex-col gap-3">
            <h4 className="font-['Hanken_Grotesk'] text-xs font-semibold text-[#370003] uppercase tracking-widest mb-2">
              Company
            </h4>
            <Link
              className="text-[#564240] font-['Hanken_Grotesk'] text-sm hover:text-[#370003] transition-colors"
              href="/#features"
            >
              About Us
            </Link>
            <Link
              className="text-[#564240] font-['Hanken_Grotesk'] text-sm hover:text-[#370003] transition-colors"
              href="/#features"
            >
              Careers
            </Link>
            <Link
              className="text-[#564240] font-['Hanken_Grotesk'] text-sm hover:text-[#370003] transition-colors"
              href="/#features"
            >
              Privacy
            </Link>
          </div>

          {/* Connect */}
          <div className="flex flex-col gap-3">
            <h4 className="font-['Hanken_Grotesk'] text-xs font-semibold text-[#370003] uppercase tracking-widest mb-2">
              Connect
            </h4>
            <div className="flex gap-4">
              <IconMapper name="share" className="text-[#370003] cursor-pointer hover:scale-110 transition-transform" />
              <IconMapper name="mail" className="text-[#370003] cursor-pointer hover:scale-110 transition-transform" />
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[#E5D9C8] flex flex-col sm:flex-row justify-between gap-4 text-[#564240] font-['Hanken_Grotesk'] text-xs">
          <p>© 2026 JobPatra. All rights reserved.</p>
          <p>Crafted for the modern professional.</p>
        </div>
      </div>
    </footer>
  );
}
