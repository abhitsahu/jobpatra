'use client';

import { SheetCard, SectionHeading, PaperInput, PrimaryBtn } from './settings-primitives';

export function ProfileSection() {
  return (
    <SheetCard id="profile" className="relative overflow-hidden">
      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#5b060c]/5 rounded-bl-full pointer-events-none" />

      <SectionHeading>Profile Information</SectionHeading>

      <div className="flex gap-10">
        {/* Passport photo */}
        <div className="flex-shrink-0 text-center">
          <div className="w-32 h-40 border-4 border-white shadow-md rounded-sm overflow-hidden bg-[#ffe9e4] mb-3 mx-auto relative group cursor-pointer">
            {/* Avatar initials fallback */}
            <div className="w-full h-full flex items-center justify-center bg-[#fff0ed]">
              <span
                className="text-[48px] font-bold text-[#5b060c]/30"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                JD
              </span>
            </div>
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-white">photo_camera</span>
            </div>
          </div>
          <span
            className="text-[10px] font-semibold text-[#564240] uppercase tracking-widest"
            style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}
          >
            Passport Size
          </span>
        </div>

        {/* Form fields */}
        <div className="flex-1 grid grid-cols-2 gap-6">
          <PaperInput label="Full Name" defaultValue="John Doe" />
          <PaperInput label="Username" defaultValue="@johndoe" />
          <PaperInput
            label="Professional Email"
            type="email"
            defaultValue="john@example.com"
            colSpan2
          />
          <PaperInput label="Phone Number" defaultValue="+1 (555) 000-0000" />
          <div className="space-y-1">
            <label
              className="text-[12px] leading-[16px] font-semibold text-[#564240] uppercase tracking-[0.05em]"
              style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}
            >
              Country
            </label>
            <select
              className="w-full bg-transparent border-b border-[#ddc0bd] focus:border-[#5b060c] focus:outline-none py-2 text-[#2b1611] appearance-none"
              style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: 15 }}
            >
              <option>India</option>
              <option>United States</option>
              <option>United Kingdom</option>
              <option>Canada</option>
              <option>Australia</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-10 flex justify-end">
        <PrimaryBtn onClick={() => alert('Saved! (placeholder)')}>Save Changes</PrimaryBtn>
      </div>
    </SheetCard>
  );
}
