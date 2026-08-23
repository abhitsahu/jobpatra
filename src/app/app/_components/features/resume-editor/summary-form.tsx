'use client';

import { UseFormReturn } from 'react-hook-form';
import type { UpdateResumeDTO } from '@/app/api/model/request/resume/resume';
import { FormTextarea } from './form-field';

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
        <h3 className="text-[20px] font-bold text-[#7a1f1f] font-['Playfair_Display'] mb-2">
          Professional Summary
        </h3>
        <p className="text-[13px] text-[#564240]">
          Write a short, engaging summary about your skills, experience, and what drives you.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <FormTextarea
          id="personalInfo-summary-standalone"
          label="Summary"
          rows={8}
          registration={register('personalInfo.summary')}
          error={errors.personalInfo?.summary}
          placeholder="e.g. Forward-thinking Senior Product Designer with 6+ years of experience..."
        />
        <div className="flex justify-end mt-2">
          <button
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#fff0ed] hover:bg-[#ffe2db] text-[#7a1f1f] border border-[#ddc0bd]/60 rounded-full transition-all group shadow-sm text-[11px] font-bold uppercase tracking-wider cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] group-hover:rotate-12 transition-transform">
              auto_fix
            </span>
            <span>AI Improve</span>
          </button>
        </div>
      </div>
    </div>
  );
}
