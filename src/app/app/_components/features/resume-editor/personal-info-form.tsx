'use client';

import { UseFormReturn } from 'react-hook-form';
import type { UpdateResumeDTO } from '@/app/api/model/request/resume/resume';
import { FormInput } from './form-field';

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
        <FormInput
          id="personalInfo-fullName"
          label="Full Name"
          registration={register('personalInfo.fullName')}
          error={errors.personalInfo?.fullName}
          placeholder="Alex Morgan"
        />
        <FormInput
          id="personalInfo-jobTitle"
          label="Professional Title"
          registration={register('personalInfo.jobTitle')}
          placeholder="Senior Product Designer"
        />
        <FormInput
          id="personalInfo-email"
          type="email"
          label="Email Address"
          registration={register('personalInfo.email')}
          error={errors.personalInfo?.email}
          placeholder="alex.morgan@design.co"
        />
        <FormInput
          id="personalInfo-phone"
          label="Phone Number"
          registration={register('personalInfo.phone')}
          placeholder="+1 (555) 019-2834"
        />
        <FormInput
          id="personalInfo-location"
          label="Location"
          registration={register('personalInfo.location')}
          placeholder="San Francisco, CA"
        />
        <FormInput
          id="personalInfo-website"
          label="Portfolio / Website URL"
          registration={register('personalInfo.website')}
          error={errors.personalInfo?.website}
          placeholder="https://alexmorgan.co"
        />
        <FormInput
          id="personalInfo-linkedin"
          label="LinkedIn Profile"
          registration={register('personalInfo.linkedin')}
          placeholder="https://linkedin.com/in/alexmorgan"
        />
        <FormInput
          id="personalInfo-github"
          label="GitHub Profile"
          registration={register('personalInfo.github')}
          placeholder="https://github.com/alexmorgan"
        />
      </div>
    </div>
  );
}
