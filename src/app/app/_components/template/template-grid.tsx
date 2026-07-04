import React from 'react';
import { TemplateCard } from './template-card';
import type { TemplateData } from './template-card';

interface TemplateGridProps {
  templates: TemplateData[];
  onUseTemplate: (id: string) => void;
  onPreview: (id: string) => void;
}

export function TemplateGrid({ templates, onUseTemplate, onPreview }: TemplateGridProps) {
  if (templates.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 md:px-16 py-16 text-center">
        <div className="sheet paper-texture p-12 max-w-xl mx-auto rounded-xl border border-[#ddc0bd] shadow-sm">
          <span className="material-symbols-outlined text-[64px] text-[#5b060c] opacity-40 mb-4">
            find_in_page
          </span>
          <h3 className="font-['Playfair_Display'] text-[24px] leading-[32px] font-semibold text-[#2b1611] mb-2">
            No templates found
          </h3>
          <p className="font-['Hanken_Grotesk'] text-[16px] text-[#564240]">
            Try adjusting your search terms or category filters to find the perfect style.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 py-8">
      {templates.map((tpl) => (
        <TemplateCard
          key={tpl.id}
          template={tpl}
          onUseTemplate={onUseTemplate}
          onPreview={onPreview}
        />
      ))}
    </section>
  );
}
