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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      {/* Modal Container */}
      <div
        className="relative w-full max-w-4xl bg-[#FFF8EE] border border-[#E5D9C8] rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] paper-texture animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-white/80 hover:bg-[#5b060c] hover:text-white border border-[#E5D9C8] text-[#564240] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Left: Template Preview Image */}
        <div className="flex-1 bg-white border-r border-[#E5D9C8] p-6 flex items-center justify-center overflow-y-auto max-h-[40vh] md:max-h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={template.previewImage}
            alt={`${template.name} Template Preview`}
            className="max-w-full max-h-[60vh] object-contain shadow-md border border-[#ddc0bd]/40"
          />
        </div>

        {/* Right: Template Details */}
        <div className="w-full md:w-80 p-8 flex flex-col justify-between bg-[#fff8f6] relative">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-[#795900] font-['Hanken_Grotesk'] text-[12px] uppercase tracking-wider font-semibold">
              <span className="material-symbols-outlined text-[16px]">bookmark</span>
              {template.category}
            </div>

            <h3 className="font-['Playfair_Display'] text-[28px] leading-tight font-bold text-[#2b1611]">
              {template.name}
            </h3>

            <p className="font-['Hanken_Grotesk'] text-[15px] leading-[22px] text-[#564240]">
              {template.description}
            </p>

            <div className="space-y-3 pt-4 border-t border-[#ddc0bd]">
              <div className="flex justify-between text-[14px]">
                <span className="text-[#564240] font-medium">ATS Score Compatibility</span>
                <span className="font-semibold text-[#5b060c]">
                  {template.atsFriendly ? 'High (ATS Friendly)' : 'Medium'}
                </span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-[#564240] font-medium">Layout Style</span>
                <span className="font-semibold text-[#2b1611]">Professional Artifact</span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-[#564240] font-medium">Pricing tier</span>
                <span className="font-semibold text-[#795900]">
                  {template.isPremium ? 'Premium Plan' : 'Free Plan'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-8 space-y-3">
            <button
              onClick={() => onUseTemplate(template.id)}
              className="seal-button w-full py-3 rounded-lg font-['Playfair_Display'] text-[18px] font-semibold text-white cursor-pointer active:scale-95 transition-transform text-center"
            >
              Use This Template
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 border border-[#ddc0bd] hover:bg-[#ffe2db] text-[#564240] font-['Hanken_Grotesk'] text-[14px] font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Back to Gallery
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
