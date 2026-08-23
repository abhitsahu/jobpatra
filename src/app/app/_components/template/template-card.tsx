'use client';

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
    atsFriendly,
    isPremium,
  } = template;

  return (
    <div className="group relative flex flex-col gap-5 cursor-pointer">
      {/* Frame Container */}
      <div className="relative w-full aspect-[3/4] bg-white p-2 shadow-sm transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-xl group-hover:shadow-[#5b060c]/10 rounded-sm border border-[#E5D9C8] overflow-hidden">
        <div className="absolute inset-0 border border-[#E5D9C8]/60 m-2 pointer-events-none z-10"></div>
        
        {/* Preview Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={previewImage}
          alt={name}
          className="w-full h-full object-cover rounded-sm transition-transform duration-700 group-hover:scale-[1.02]"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-[#FFF8EE]/90 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4 m-2 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUseTemplate(id);
            }}
            className="bg-[#5b060c] text-white font-['Hanken_Grotesk'] text-[12px] font-semibold uppercase tracking-[0.15em] px-8 py-3 rounded-full transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 delay-75 shadow-lg hover:bg-[#7a1f1f] cursor-pointer active:scale-95"
          >
            Use Design
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPreview(id);
            }}
            className="text-[#5b060c] font-['Hanken_Grotesk'] text-[12px] font-semibold uppercase tracking-[0.15em] border border-[#5b060c]/30 bg-white px-8 py-3 rounded-full transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 delay-150 hover:bg-[#fff0ed] cursor-pointer active:scale-95"
          >
            Preview
          </button>
        </div>

        {/* Badge Seal */}
        {isPremium ? (
          <div className="absolute -right-3 -top-3 w-12 h-12 bg-[#f6be39] rounded-full flex items-center justify-center shadow-md rotate-12 group-hover:rotate-0 transition-transform duration-500 z-30">
            <span
              className="material-symbols-outlined text-[#2b1611] text-sm"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              workspace_premium
            </span>
          </div>
        ) : atsFriendly ? (
          <div className="absolute -right-3 -top-3 w-12 h-12 bg-[#2a7040] text-white rounded-full flex items-center justify-center shadow-md -rotate-6 group-hover:rotate-0 transition-transform duration-500 z-30">
            <span
              className="material-symbols-outlined text-sm"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
          </div>
        ) : null}
      </div>

      {/* Info Header */}
      <div className="flex flex-col gap-1.5 px-1">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-['Playfair_Display'] text-[20px] font-semibold text-[#2b1611] group-hover:text-[#5b060c] transition-colors leading-snug">
            {name}
          </h3>
          <span className="font-['Hanken_Grotesk'] text-[11px] font-semibold uppercase tracking-widest bg-[#ffe9e5] text-[#5b060c] px-2.5 py-1 rounded-sm shrink-0">
            {isPremium ? 'Premium' : 'Free'}
          </span>
        </div>
        <p className="font-['Hanken_Grotesk'] text-[14px] leading-[20px] text-[#564240] line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  );
}
