'use client';

import Link from 'next/link';
import { useRef, useCallback } from 'react';

export function LandingHero() {
  const paperRef = useRef<HTMLDivElement>(null);

  const handleEnter = useCallback(() => {
    const el = paperRef.current;
    if (!el) return;
    el.style.transform = 'translateY(-10px) rotate(0deg)';
    el.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    el.style.boxShadow = '0 20px 40px rgba(78, 52, 46, 0.08)';
  }, []);

  const handleLeave = useCallback(() => {
    const el = paperRef.current;
    if (!el) return;
    el.style.transform = 'translateY(0) rotate(-3deg)';
    el.style.boxShadow = '0 4px 20px rgba(78, 52, 46, 0.04)';
  }, []);

  return (
    <header className="relative w-full max-w-7xl mx-auto px-4 md:px-16 py-20 overflow-visible">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        {/* Left: Hero Text */}
        <div className="z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ffe9e4] rounded-full mb-6">
            <span className="material-symbols-outlined text-[#5b060c] text-[18px]">verified</span>
            <span className="font-['Hanken_Grotesk'] text-[12px] leading-[16px] font-medium text-[#5b060c] uppercase tracking-widest">
              Postage Paid • AI Enhanced
            </span>
          </div>

          <h1 className="font-['Playfair_Display'] text-[32px] md:text-[48px] md:leading-[56px] md:tracking-[-0.02em] font-bold text-[#2b1611] mb-8 leading-tight">
            Craft Your <span className="italic text-[#5b060c]">Career Letter</span> With AI
          </h1>

          <p className="font-['Hanken_Grotesk'] text-[18px] leading-[28px] text-[#564240] mb-10 max-w-lg">
            Transform your professional history into a bespoke artifact of value. JobPatra uses
            artisanal AI to weave your experience into a narrative that captures eyes and passes
            every digital gatekeeper.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/app/signup"
              className="bg-[#5b060c] text-white px-8 py-4 rounded-xl font-['Hanken_Grotesk'] text-[14px] leading-[20px] tracking-[0.05em] font-semibold flex items-center gap-3 hover:scale-105 transition-transform shadow-lg"
            >
              Start Drafting <span className="material-symbols-outlined">edit_note</span>
            </Link>
            <button className="border border-[#8a716f] px-8 py-4 rounded-xl font-['Hanken_Grotesk'] text-[14px] leading-[20px] tracking-[0.05em] font-semibold hover:bg-[#ffe9e4] transition-colors text-[#2b1611]">
              View Samples
            </button>
          </div>

          <div className="mt-12 flex items-center gap-6 opacity-60">
            <span className="font-['Hanken_Grotesk'] text-[12px] leading-[16px] font-medium uppercase tracking-widest text-[#564240]">
              Trusted By Leaders At
            </span>
            <div className="flex gap-4 items-center grayscale text-[#564240]">
              <span className="material-symbols-outlined">star</span>
              <span className="material-symbols-outlined">work</span>
              <span className="material-symbols-outlined">group</span>
            </div>
          </div>
        </div>

        {/* Right: Premium Envelope Visual */}
        <div className="relative h-[600px] flex items-center justify-center mt-12 lg:mt-0">
          {/* Dotted Delivery Path */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            overflow="visible"
          >
            <path
              d="M50,450 Q250,400 400,100"
              fill="none"
              stroke="#E5D9C8"
              strokeDasharray="8,8"
              strokeWidth="2"
            />
          </svg>

          {/* Deep Burgundy Envelope */}
          <div className="bg-gradient-to-br from-[#7a1f1f] to-[#5b060c] w-80 h-[450px] relative rounded-lg shadow-2xl flex items-end justify-center p-4 transform rotate-6 hover:rotate-2 transition-transform duration-500">
            {/* Resume Paper sliding out */}
            <div
              ref={paperRef}
              onMouseEnter={handleEnter}
              onMouseLeave={handleLeave}
              className="landing-paper-sheet w-72 h-[500px] absolute -top-40 left-4 transform -rotate-3 z-10 p-8 flex flex-col gap-4"
            >
              <div className="w-12 h-12 bg-[#ffe9e4] rounded-full mb-2" />
              <div className="h-6 w-3/4 bg-[#564240]/10 rounded" />
              <div className="h-4 w-full bg-[#564240]/5 rounded" />
              <div className="h-4 w-5/6 bg-[#564240]/5 rounded" />
              <div className="h-px w-full bg-[#ddc0bd]/30 my-2" />
              <div className="h-4 w-full bg-[#564240]/5 rounded" />
              <div className="h-4 w-2/3 bg-[#564240]/5 rounded" />

              {/* AI Suggestion Note (Yellow Sticky) */}
              <div className="absolute -right-10 top-1/2 bg-[#FFF9C4] p-3 shadow-md w-32 transform rotate-12 landing-float-anim border-l-2 border-[#FBC02D]">
                <div className="flex items-center gap-1 mb-1">
                  <span className="material-symbols-outlined text-[14px] text-[#5b060c]">edit</span>
                  <span className="text-[10px] font-bold uppercase text-[#5b060c]">AI Nib</span>
                </div>
                <p className="text-[11px] leading-tight text-[#5D4037]">
                  &ldquo;Stronger action verb here improves ATS score by 22%.&rdquo;
                </p>
              </div>
            </div>

            {/* Wax Seal */}
            <div className="landing-wax-seal w-20 h-20 absolute bottom-10 right-[-10px] z-20 transform -rotate-12">
              <div className="flex flex-col items-center justify-center text-center px-2">
                <span className="text-[8px] font-extrabold text-[#261a00] leading-none uppercase">
                  ATS
                </span>
                <span className="text-[10px] font-bold text-[#261a00] leading-tight">APPROVED</span>
              </div>
            </div>
          </div>

          {/* Abstract Decorative Elements */}
          <div className="absolute top-20 right-10 w-24 h-24 border border-[#ddc0bd] opacity-20 transform rotate-45" />
          <div className="absolute bottom-20 left-10 w-16 h-16 rounded-full border-2 border-[#5b060c]/10" />
        </div>
      </div>
    </header>
  );
}
