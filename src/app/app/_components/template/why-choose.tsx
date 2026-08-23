'use client';

import React from 'react';

export function WhyChoose() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-16 py-20">
      <div className="text-center mb-14">
        <span className="font-['Hanken_Grotesk'] text-[12px] uppercase tracking-[0.2em] font-semibold text-[#795900] block mb-2">
          Precision Engineering
        </span>
        <h2 className="font-['Playfair_Display'] text-[32px] md:text-[40px] leading-[40px] md:leading-[48px] font-bold text-[#2b1611]">
          Crafted for Success
        </h2>
        <div className="h-1 w-20 bg-[#5b060c] mx-auto mt-4 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Card 1 */}
        <div className="bg-white p-8 flex flex-col items-center text-center space-y-4 rounded-xl border border-[#E5D9C8] shadow-sm hover:shadow-md transition-shadow">
          <div className="w-16 h-16 rounded-full bg-[#ffe9e5] flex items-center justify-center text-[#5b060c]">
            <span className="material-symbols-outlined text-[32px]">verified</span>
          </div>
          <h3 className="font-['Playfair_Display'] text-[22px] font-semibold text-[#2b1611]">
            ATS Optimized
          </h3>
          <p className="font-['Hanken_Grotesk'] text-[15px] leading-[24px] text-[#564240]">
            Our layouts are rigorously tested against modern parsing systems to ensure your details
            never get lost in applicant tracking software.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-8 flex flex-col items-center text-center space-y-4 rounded-xl border border-[#E5D9C8] shadow-sm hover:shadow-md transition-shadow">
          <div className="w-16 h-16 rounded-full bg-[#ffe9e5] flex items-center justify-center text-[#5b060c]">
            <span className="material-symbols-outlined text-[32px]">edit_note</span>
          </div>
          <h3 className="font-['Playfair_Display'] text-[22px] font-semibold text-[#2b1611]">
            AI Ready
          </h3>
          <p className="font-['Hanken_Grotesk'] text-[15px] leading-[24px] text-[#564240]">
            Integrated with our AI workshop, tailoring every line of experience to match the specific job
            description you&apos;re targeting.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-8 flex flex-col items-center text-center space-y-4 rounded-xl border border-[#E5D9C8] shadow-sm hover:shadow-md transition-shadow">
          <div className="w-16 h-16 rounded-full bg-[#ffe9e5] flex items-center justify-center text-[#5b060c]">
            <span className="material-symbols-outlined text-[32px]">picture_as_pdf</span>
          </div>
          <h3 className="font-['Playfair_Display'] text-[22px] font-semibold text-[#2b1611]">
            Instant Export
          </h3>
          <p className="font-['Hanken_Grotesk'] text-[15px] leading-[24px] text-[#564240]">
            High-resolution vector PDF generation ensures your resume looks as crisp on paper as it does on
            a hiring manager&apos;s screen.
          </p>
        </div>
      </div>
    </section>
  );
}
