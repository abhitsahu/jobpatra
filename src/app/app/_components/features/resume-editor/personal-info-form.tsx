'use client';

import { UseFormReturn } from 'react-hook-form';
import type { UpdateResumeDTO } from '@/app/api/model/request/resume/resume';

interface PersonalInfoFormProps {
  form: UseFormReturn<UpdateResumeDTO>;
}

export function PersonalInfoForm({ form }: PersonalInfoFormProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[20px] font-bold text-white font-[Space_Grotesk]">
          Personal Information
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="col-span-2 md:col-span-1 flex flex-col gap-1.5">
          <label className="text-[11px] tracking-wider font-semibold text-on-surface-variant uppercase">
            Full Name
          </label>
          <input
            id="personalInfo-fullName"
            type="text"
            {...register('personalInfo.fullName')}
            className="w-full bg-surface-container-low border border-glass-border rounded-lg px-4 py-2.5 text-on-surface text-[15px] focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue transition-all"
            placeholder="Alex Morgan"
          />
          {errors.personalInfo?.fullName && (
            <span className="text-xs text-error">{errors.personalInfo.fullName.message}</span>
          )}
        </div>

        {/* Job Title */}
        <div className="col-span-2 md:col-span-1 flex flex-col gap-1.5">
          <label className="text-[11px] tracking-wider font-semibold text-on-surface-variant uppercase">
            Job Title
          </label>
          <input
            id="personalInfo-jobTitle"
            type="text"
            {...register('personalInfo.jobTitle')}
            className="w-full bg-surface-container-low border border-glass-border rounded-lg px-4 py-2.5 text-on-surface text-[15px] focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue transition-all"
            placeholder="Senior Product Designer"
          />
        </div>

        {/* Email */}
        <div className="col-span-2 md:col-span-1 flex flex-col gap-1.5">
          <label className="text-[11px] tracking-wider font-semibold text-on-surface-variant uppercase">
            Email Address
          </label>
          <input
            id="personalInfo-email"
            type="email"
            {...register('personalInfo.email')}
            className="w-full bg-surface-container-low border border-glass-border rounded-lg px-4 py-2.5 text-on-surface text-[15px] focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue transition-all"
            placeholder="alex.morgan@design.co"
          />
          {errors.personalInfo?.email && (
            <span className="text-xs text-error">{errors.personalInfo.email.message}</span>
          )}
        </div>

        {/* Phone */}
        <div className="col-span-2 md:col-span-1 flex flex-col gap-1.5">
          <label className="text-[11px] tracking-wider font-semibold text-on-surface-variant uppercase">
            Phone Number
          </label>
          <input
            id="personalInfo-phone"
            type="text"
            {...register('personalInfo.phone')}
            className="w-full bg-surface-container-low border border-glass-border rounded-lg px-4 py-2.5 text-on-surface text-[15px] focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue transition-all"
            placeholder="+1 (555) 019-2834"
          />
        </div>

        {/* Location */}
        <div className="col-span-2 md:col-span-1 flex flex-col gap-1.5">
          <label className="text-[11px] tracking-wider font-semibold text-on-surface-variant uppercase">
            Location
          </label>
          <input
            id="personalInfo-location"
            type="text"
            {...register('personalInfo.location')}
            className="w-full bg-surface-container-low border border-glass-border rounded-lg px-4 py-2.5 text-on-surface text-[15px] focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue transition-all"
            placeholder="San Francisco, CA"
          />
        </div>

        {/* Website */}
        <div className="col-span-2 md:col-span-1 flex flex-col gap-1.5">
          <label className="text-[11px] tracking-wider font-semibold text-on-surface-variant uppercase">
            Portfolio / Website URL
          </label>
          <input
            id="personalInfo-website"
            type="text"
            {...register('personalInfo.website')}
            className="w-full bg-surface-container-low border border-glass-border rounded-lg px-4 py-2.5 text-on-surface text-[15px] focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue transition-all"
            placeholder="https://alexmorgan.co"
          />
          {errors.personalInfo?.website && (
            <span className="text-xs text-error">{errors.personalInfo.website.message}</span>
          )}
        </div>

        {/* LinkedIn */}
        <div className="col-span-2 md:col-span-1 flex flex-col gap-1.5">
          <label className="text-[11px] tracking-wider font-semibold text-on-surface-variant uppercase">
            LinkedIn Profile
          </label>
          <input
            id="personalInfo-linkedin"
            type="text"
            {...register('personalInfo.linkedin')}
            className="w-full bg-surface-container-low border border-glass-border rounded-lg px-4 py-2.5 text-on-surface text-[15px] focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue transition-all"
            placeholder="https://linkedin.com/in/alexmorgan"
          />
        </div>

        {/* GitHub */}
        <div className="col-span-2 md:col-span-1 flex flex-col gap-1.5">
          <label className="text-[11px] tracking-wider font-semibold text-on-surface-variant uppercase">
            GitHub Profile
          </label>
          <input
            id="personalInfo-github"
            type="text"
            {...register('personalInfo.github')}
            className="w-full bg-surface-container-low border border-glass-border rounded-lg px-4 py-2.5 text-on-surface text-[15px] focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue transition-all"
            placeholder="https://github.com/alexmorgan"
          />
        </div>
      </div>
    </div>
  );
}
