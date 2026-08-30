'use client';
import { IconMapper } from '@/app/_components/icons/IconMapper';

import React from 'react';
import type { TemplateData } from './template-card';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: TemplateData | null;
  onUseTemplate: (id: string) => void;
}

export function PreviewModal({ isOpen, onClose, template, onUseTemplate }: PreviewModalProps) {
  if (!isOpen || !template) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        className="relative w-full max-w-4xl bg-[#FFF8EE] border border-[#E5D9C8] rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-white/90 hover:bg-[#5b060c] hover:text-white border border-[#E5D9C8] text-[#564240] transition-colors cursor-pointer"
        >
          <IconMapper name="close" className="text-[20px]" />
        </button>

        {/* Left: Template Preview Image */}
        <div className="flex-1 bg-white border-r border-[#E5D9C8] p-6 flex items-center justify-center overflow-y-auto max-h-[45vh] md:max-h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={template.previewImage}
            alt={`${template.name} Template Preview`}
            className="max-w-full max-h-[65vh] object-contain shadow-md border border-[#E5D9C8]/60 rounded-sm"
          />
        </div>

        {/* Right: Template Details */}
        <div className="w-full md:w-80 p-8 flex flex-col justify-between bg-[#FFF8EE] relative">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-[#795900] font-['Hanken_Grotesk'] text-[12px] uppercase tracking-wider font-semibold">
              <IconMapper name="bookmark" className="text-[16px]" />
              {template.category}
            </div>

            <h3 className="font-['Playfair_Display'] text-[28px] leading-tight font-bold text-[#2b1611]">
              {template.name}
            </h3>

            <p className="font-['Hanken_Grotesk'] text-[15px] leading-[22px] text-[#564240]">
              {template.description}
            </p>

            <div className="space-y-3 pt-4 border-t border-[#E5D9C8]">
              <div className="flex justify-between text-[14px]">
                <span className="text-[#564240] font-medium">ATS Compatibility</span>
                <span className="font-semibold text-[#5b060c]">
                  {template.atsFriendly ? 'High (ATS Ready)' : 'Standard'}
                </span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-[#564240] font-medium">Layout Style</span>
                <span className="font-semibold text-[#2b1611]">Bespoke Letterpress</span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-[#564240] font-medium">Pricing Tier</span>
                <span className="font-semibold text-[#795900]">
                  {template.isPremium ? 'Premium Plan' : 'Free Plan'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-8 space-y-3">
            <button
              onClick={() => {
                onUseTemplate(template.id);
                onClose();
              }}
              className="w-full py-3.5 bg-[#5b060c] text-white font-['Hanken_Grotesk'] text-[13px] font-semibold uppercase tracking-[0.15em] rounded-full shadow-md hover:bg-[#7a1f1f] cursor-pointer active:scale-95 transition-all text-center"
            >
              Use This Template
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 border border-[#E5D9C8] hover:bg-[#ffe2db] text-[#564240] font-['Hanken_Grotesk'] text-[13px] font-semibold uppercase tracking-wider rounded-full transition-colors cursor-pointer"
            >
              Back to Gallery
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
