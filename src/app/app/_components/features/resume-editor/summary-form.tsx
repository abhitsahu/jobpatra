'use client';

import { UseFormReturn } from 'react-hook-form';
import type { UpdateResumeDTO } from '@/app/api/model/request/resume/resume';

interface SummaryFormProps {
  form: UseFormReturn<UpdateResumeDTO>;
}

export function SummaryForm({ form }: SummaryFormProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[20px] font-bold text-white font-[Space_Grotesk] mb-2">
          Professional Summary
        </h3>
        <p className="text-[13px] text-on-surface-variant">
          Write a short, engaging summary about your skills, experience, and what drives you.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] tracking-wider font-semibold text-on-surface-variant uppercase">
          Summary
        </label>
        <textarea
          id="personalInfo-summary-standalone"
          rows={10}
          {...register('personalInfo.summary')}
          className="w-full bg-surface-container-low border border-glass-border rounded-lg px-4 py-3 text-on-surface text-[14px] leading-relaxed focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue transition-all resize-none"
          placeholder="e.g. Forward-thinking Senior Product Designer with 6+ years of experience..."
        />
        {errors.personalInfo?.summary && (
          <span className="text-xs text-error">{errors.personalInfo.summary.message}</span>
        )}
      </div>
    </div>
  );
}
