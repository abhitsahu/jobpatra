'use client';
import { IconMapper } from '@/app/_components/icons/IconMapper';

import React from 'react';

interface CtaSectionProps {
  onStartBuilding: () => void;
  onBrowsePlans: () => void;
}

export function CtaSection({ onStartBuilding, onBrowsePlans }: CtaSectionProps) {
  return (
    <section className="relative py-24 px-4 md:px-16 flex items-center justify-center overflow-hidden rounded-3xl bg-white border border-[#E5D9C8] my-12 max-w-7xl mx-auto shadow-sm">
      {/* Background Radial Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 50%, rgba(91, 6, 12, 0.08) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
        {/* Icon Badge */}
        <div className="w-16 h-16 bg-[#ffe9e5] rounded-full flex items-center justify-center mb-6 shadow-sm text-[#5b060c]">
          <IconMapper name="history_edu" className="text-3xl" />
        </div>

        <h2 className="font-['Playfair_Display'] text-[32px] md:text-[48px] leading-[40px] md:leading-[56px] font-bold text-[#2b1611] mb-6 tracking-tight">
          Ready to Build a Better Job Search?
        </h2>

        <p className="font-['Hanken_Grotesk'] text-[16px] md:text-[18px] leading-[26px] md:leading-[28px] text-[#564240] mb-10 max-w-xl">
          Select a template above or let our AI guide you to the perfect format based on your industry
          and experience level.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full sm:w-auto">
          <button
            onClick={onStartBuilding}
            className="bg-[#5b060c] text-white font-['Hanken_Grotesk'] text-[14px] leading-[20px] tracking-[0.15em] font-semibold uppercase px-10 py-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:bg-[#7a1f1f] transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer w-full sm:w-auto"
          >
            Start Writing
            <IconMapper name="arrow_forward" className="text-sm" />
          </button>

          <button
            onClick={onBrowsePlans}
            className="border border-[#5b060c]/30 text-[#5b060c] bg-white font-['Hanken_Grotesk'] text-[14px] leading-[20px] tracking-[0.15em] font-semibold uppercase px-8 py-4 rounded-full hover:bg-[#ffe9e5] transition-all duration-300 flex items-center justify-center cursor-pointer w-full sm:w-auto"
          >
            Browse Pro Plans
          </button>
        </div>
      </div>
    </section>
  );
}
