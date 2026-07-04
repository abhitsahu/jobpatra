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
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[20px] font-bold text-[#7a1f1f] font-['Playfair_Display']">
          Personal Details
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-6">
        {/* Full Name */}
        <div className="col-span-2 md:col-span-1 flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-[#564240] uppercase tracking-wider">
            Full Name
          </label>
          <input
            id="personalInfo-fullName"
            type="text"
            {...register('personalInfo.fullName')}
            className="w-full bg-white border border-[#ddc0bd] rounded-lg px-4 py-2.5 text-[#2b1611] text-[15px] focus:outline-none focus:border-[#7a1f1f] focus:ring-4 focus:ring-[#7a1f1f]/5 transition-all font-['Hanken_Grotesk']"
            placeholder="Alex Morgan"
          />
          {errors.personalInfo?.fullName && (
            <span className="text-xs text-[#7a1f1f] mt-1">
              {errors.personalInfo.fullName.message}
            </span>
          )}
        </div>

        {/* Job Title */}
        <div className="col-span-2 md:col-span-1 flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-[#564240] uppercase tracking-wider">
            Professional Title
          </label>
          <input
            id="personalInfo-jobTitle"
            type="text"
            {...register('personalInfo.jobTitle')}
            className="w-full bg-white border border-[#ddc0bd] rounded-lg px-4 py-2.5 text-[#2b1611] text-[15px] focus:outline-none focus:border-[#7a1f1f] focus:ring-4 focus:ring-[#7a1f1f]/5 transition-all font-['Hanken_Grotesk']"
            placeholder="Senior Product Designer"
          />
        </div>

        {/* Email */}
        <div className="col-span-2 md:col-span-1 flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-[#564240] uppercase tracking-wider">
            Email Address
          </label>
          <input
            id="personalInfo-email"
            type="email"
            {...register('personalInfo.email')}
            className="w-full bg-white border border-[#ddc0bd] rounded-lg px-4 py-2.5 text-[#2b1611] text-[15px] focus:outline-none focus:border-[#7a1f1f] focus:ring-4 focus:ring-[#7a1f1f]/5 transition-all font-['Hanken_Grotesk']"
            placeholder="alex.morgan@design.co"
          />
          {errors.personalInfo?.email && (
            <span className="text-xs text-[#7a1f1f] mt-1">{errors.personalInfo.email.message}</span>
          )}
        </div>

        {/* Phone */}
        <div className="col-span-2 md:col-span-1 flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-[#564240] uppercase tracking-wider">
            Phone Number
          </label>
          <input
            id="personalInfo-phone"
            type="text"
            {...register('personalInfo.phone')}
            className="w-full bg-white border border-[#ddc0bd] rounded-lg px-4 py-2.5 text-[#2b1611] text-[15px] focus:outline-none focus:border-[#7a1f1f] focus:ring-4 focus:ring-[#7a1f1f]/5 transition-all font-['Hanken_Grotesk']"
            placeholder="+1 (555) 019-2834"
          />
        </div>

        {/* Location */}
        <div className="col-span-2 md:col-span-1 flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-[#564240] uppercase tracking-wider">
            Location
          </label>
          <input
            id="personalInfo-location"
            type="text"
            {...register('personalInfo.location')}
            className="w-full bg-white border border-[#ddc0bd] rounded-lg px-4 py-2.5 text-[#2b1611] text-[15px] focus:outline-none focus:border-[#7a1f1f] focus:ring-4 focus:ring-[#7a1f1f]/5 transition-all font-['Hanken_Grotesk']"
            placeholder="San Francisco, CA"
          />
        </div>

        {/* Website */}
        <div className="col-span-2 md:col-span-1 flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-[#564240] uppercase tracking-wider">
            Portfolio / Website URL
          </label>
          <input
            id="personalInfo-website"
            type="text"
            {...register('personalInfo.website')}
            className="w-full bg-white border border-[#ddc0bd] rounded-lg px-4 py-2.5 text-[#2b1611] text-[15px] focus:outline-none focus:border-[#7a1f1f] focus:ring-4 focus:ring-[#7a1f1f]/5 transition-all font-['Hanken_Grotesk']"
            placeholder="https://alexmorgan.co"
          />
          {errors.personalInfo?.website && (
            <span className="text-xs text-[#7a1f1f] mt-1">
              {errors.personalInfo.website.message}
            </span>
          )}
        </div>

        {/* LinkedIn */}
        <div className="col-span-2 md:col-span-1 flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-[#564240] uppercase tracking-wider">
            LinkedIn Profile
          </label>
          <input
            id="personalInfo-linkedin"
            type="text"
            {...register('personalInfo.linkedin')}
            className="w-full bg-white border border-[#ddc0bd] rounded-lg px-4 py-2.5 text-[#2b1611] text-[15px] focus:outline-none focus:border-[#7a1f1f] focus:ring-4 focus:ring-[#7a1f1f]/5 transition-all font-['Hanken_Grotesk']"
            placeholder="https://linkedin.com/in/alexmorgan"
          />
        </div>

        {/* GitHub */}
        <div className="col-span-2 md:col-span-1 flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-[#564240] uppercase tracking-wider">
            GitHub Profile
          </label>
          <input
            id="personalInfo-github"
            type="text"
            {...register('personalInfo.github')}
            className="w-full bg-white border border-[#ddc0bd] rounded-lg px-4 py-2.5 text-[#2b1611] text-[15px] focus:outline-none focus:border-[#7a1f1f] focus:ring-4 focus:ring-[#7a1f1f]/5 transition-all font-['Hanken_Grotesk']"
            placeholder="https://github.com/alexmorgan"
          />
        </div>
      </div>
    </div>
  );
}
