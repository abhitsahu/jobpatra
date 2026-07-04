import React from 'react';

export interface TemplateData {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  previewImage: string;
  atsFriendly: boolean;
  isPremium: boolean;
  usageCount: number;
  tag?: string;
  rotateClass?: string;
}

interface TemplateCardProps {
  template: TemplateData;
  onUseTemplate: (id: string) => void;
  onPreview: (id: string) => void;
}

export function TemplateCard({ template, onUseTemplate, onPreview }: TemplateCardProps) {
  const {
    id,
    name,
    description,
    previewImage,
    tag = template.atsFriendly ? 'ATS OK' : 'DESIGN',
    rotateClass = 'group-hover:rotate-1',
  } = template;

  return (
    <div className="group relative flex flex-col">
      {/* Paper Sheet Wrapper */}
      <div
        className={`sheet paper-texture p-4 aspect-[3/4] flex flex-col transition-all duration-300 group-hover:-translate-y-4 ${rotateClass} group-hover:shadow-2xl overflow-hidden rounded-lg`}
      >
        {/* Inner Preview / Placeholder */}
        <div
          className="w-full h-full bg-cover bg-center bg-white border border-[#ddc0bd]/30 flex flex-col p-6 overflow-hidden relative"
          style={{ backgroundImage: `url('${previewImage}')` }}
        >
          {/* Simulated document decorations if image doesn't load */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/20 pointer-events-none" />
          <div className="h-8 w-1/3 bg-[#5b060c]/5 mb-6 relative z-10"></div>
          <div className="space-y-4 relative z-10">
            <div className="h-2 w-full bg-[#564240]/10"></div>
            <div className="h-2 w-full bg-[#564240]/10"></div>
            <div className="h-2 w-3/4 bg-[#564240]/10"></div>
          </div>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-[#5b060c]/85 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4 p-8 text-center z-20">
          <h4 className="font-['Playfair_Display'] text-[24px] leading-[32px] font-semibold text-white">
            {name}
          </h4>
          <p className="text-white/80 font-['Hanken_Grotesk'] text-[15px] leading-[22px] mb-4">
            {description}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => onUseTemplate(id)}
              className="seal-button px-5 py-2 rounded font-['Hanken_Grotesk'] text-[14px] leading-[20px] tracking-[0.05em] font-semibold text-white cursor-pointer active:scale-95 transition-transform"
            >
              Use Template
            </button>
            <button
              onClick={() => onPreview(id)}
              className="px-5 py-2 border border-white text-white font-['Hanken_Grotesk'] text-[14px] leading-[20px] tracking-[0.05em] font-semibold hover:bg-white/10 cursor-pointer transition-colors"
            >
              Preview
            </button>
          </div>
        </div>
      </div>

      {/* Card Info Footer */}
      <div className="mt-4 flex justify-between items-start">
        <div>
          <h3 className="font-['Playfair_Display'] text-[20px] leading-[28px] font-semibold text-[#2b1611]">
            {name}
          </h3>
          <p className="font-['Hanken_Grotesk'] text-[14px] text-[#564240] mt-0.5">
            {template.category} Template
          </p>
        </div>
        <span className="postal-chip font-['Hanken_Grotesk'] text-[12px] leading-[16px] font-semibold uppercase">
          {tag}
        </span>
      </div>
    </div>
  );
}
