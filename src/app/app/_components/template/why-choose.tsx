import React from 'react';

export function WhyChoose() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-16 py-24">
      <div className="text-center mb-16">
        <h2 className="font-['Playfair_Display'] text-[32px] leading-[40px] font-semibold text-[#5b060c]">
          Crafted for Success
        </h2>
        <div className="h-1 w-24 bg-[#795900] mx-auto mt-4"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="sheet paper-texture p-8 flex flex-col items-center text-center space-y-4 rounded-xl">
          <div className="w-16 h-16 rounded-full bg-[#5b060c]/5 flex items-center justify-center text-[#5b060c]">
            <span className="material-symbols-outlined text-[32px]">verified</span>
          </div>
          <h3 className="font-['Playfair_Display'] text-[24px] leading-[32px] font-semibold text-[#2b1611]">
            ATS Optimized
          </h3>
          <p className="font-['Hanken_Grotesk'] text-[16px] leading-[24px] text-[#564240]">
            Our layouts are rigorously tested against modern parsing systems to ensure your details
            never get lost in the machine.
          </p>
        </div>

        {/* Card 2 */}
        <div className="sheet paper-texture p-8 flex flex-col items-center text-center space-y-4 rounded-xl">
          <div className="w-16 h-16 rounded-full bg-[#5b060c]/5 flex items-center justify-center text-[#5b060c]">
            <span className="material-symbols-outlined text-[32px] nib-icon">edit_square</span>
          </div>
          <h3 className="font-['Playfair_Display'] text-[24px] leading-[32px] font-semibold text-[#2b1611]">
            AI Ready
          </h3>
          <p className="font-['Hanken_Grotesk'] text-[16px] leading-[24px] text-[#564240]">
            Integrated with our proprietary AI workshop, tailoring every word to the specific job
            description you're targeting.
          </p>
        </div>

        {/* Card 3 */}
        <div className="sheet paper-texture p-8 flex flex-col items-center text-center space-y-4 rounded-xl">
          <div className="w-16 h-16 rounded-full bg-[#5b060c]/5 flex items-center justify-center text-[#5b060c]">
            <span className="material-symbols-outlined text-[32px]">picture_as_pdf</span>
          </div>
          <h3 className="font-['Playfair_Display'] text-[24px] leading-[32px] font-semibold text-[#2b1611]">
            Instant Export
          </h3>
          <p className="font-['Hanken_Grotesk'] text-[16px] leading-[24px] text-[#564240]">
            High-resolution PDF generation ensures your resume looks as crisp on paper as it does on
            a recruiter's high-res screen.
          </p>
        </div>
      </div>
    </section>
  );
}
