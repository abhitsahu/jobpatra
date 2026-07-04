import React from 'react';

export function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 py-8 items-center">
      <div className="space-y-6 lg:col-span-2">
        <div className="inline-flex items-center gap-2 text-[#795900] font-['Hanken_Grotesk'] text-[14px] leading-[20px] tracking-[0.05em] font-semibold border-b border-[#795900] pb-1">
          <span className="material-symbols-outlined text-[18px]">edit_note</span>
          THE ARCHIVE
        </div>
        <h1 className="font-['Playfair_Display'] text-[32px] md:text-[48px] leading-[40px] md:leading-[56px] tracking-[-0.02em] font-bold text-[#5b060c] leading-tight">
          Choose Your <br />
          Resume Template
        </h1>
        <p className="font-['Hanken_Grotesk'] text-[18px] leading-[28px] font-normal text-[#564240] max-w-lg">
          Discover a curated collection of professional artifacts designed to stand out. Each
          template is precision-engineered for ATS systems and aesthetic excellence.
        </p>
      </div>
      <div className="relative flex justify-center lg:justify-end min-h-[360px] items-center">
        {/* Floating Stack */}
        <div className="floating-stack relative w-64 h-80 bg-white shadow-xl border border-[#ddc0bd] rotate-[-3deg] transform z-10 paper-texture p-6 flex flex-col justify-between">
          <div>
            <div className="w-1/2 h-4 bg-[#5b060c]/10 mb-4"></div>
            <div className="w-full h-2 bg-[#564240]/5 mb-2"></div>
            <div className="w-full h-2 bg-[#564240]/5 mb-2"></div>
            <div className="w-2/3 h-2 bg-[#564240]/5"></div>
          </div>
          <div className="absolute bottom-4 right-4 text-[#5b060c] opacity-20">
            <span className="material-symbols-outlined text-[48px]">history_edu</span>
          </div>
        </div>
        <div className="absolute w-64 h-80 bg-white/80 shadow-lg border border-[#ddc0bd] rotate-[6deg] translate-x-12 translate-y-4 paper-texture"></div>
        <div className="absolute w-64 h-80 bg-white/60 shadow-md border border-[#ddc0bd] rotate-[-8deg] -translate-x-8 translate-y-8 paper-texture"></div>
      </div>
    </section>
  );
}
