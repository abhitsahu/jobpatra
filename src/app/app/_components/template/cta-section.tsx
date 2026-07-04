import React from 'react';

interface CtaSectionProps {
  onStartBuilding: () => void;
  onBrowsePlans: () => void;
}

export function CtaSection({ onStartBuilding, onBrowsePlans }: CtaSectionProps) {
  return (
    <section className="relative overflow-hidden bg-[#5b060c] text-white py-24 px-4 md:px-16">
      {/* Decorative Envelope Flap */}
      <div
        className="absolute top-0 left-0 w-full h-16 bg-[#F8F2E8]"
        style={{ clipPath: 'polygon(0 0, 50% 100%, 100% 0)' }}
      ></div>

      <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8 mt-4">
        <h2 className="font-['Playfair_Display'] text-[32px] md:text-[48px] leading-[40px] md:leading-[56px] tracking-[-0.02em] font-bold text-white">
          Find the Perfect Resume <br />
          for Your Next Opportunity
        </h2>
        <p className="font-['Hanken_Grotesk'] text-[18px] leading-[28px] font-normal text-white/80 max-w-2xl mx-auto">
          Join over 50,000 professionals who have advanced their careers using JobPatra&apos;s
          precision-crafted resume workshop.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={onStartBuilding}
            className="seal-button px-10 py-4 rounded-lg font-['Playfair_Display'] text-[20px] font-semibold text-white cursor-pointer active:scale-95 transition-transform w-full sm:w-auto"
          >
            Start Building for Free
          </button>
          <button
            onClick={onBrowsePlans}
            className="px-10 py-4 border border-white/30 rounded-lg font-['Playfair_Display'] text-[20px] font-semibold hover:bg-white/10 cursor-pointer transition-colors w-full sm:w-auto"
          >
            Browse Pro Plans
          </button>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute -bottom-10 -right-10 opacity-10 pointer-events-none select-none">
        <span className="material-symbols-outlined text-[300px]">mail</span>
      </div>
    </section>
  );
}
