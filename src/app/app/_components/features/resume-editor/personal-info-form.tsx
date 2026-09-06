'use client';

import { useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import type { UpdateResumeDTO } from '@/app/api/model/request/resume/resume';
import { FormInput } from './form-field';
import { IconMapper } from '@/app/_components/icons/IconMapper';

interface PersonalInfoFormProps {
  form: UseFormReturn<UpdateResumeDTO>;
  supportsPhoto?: boolean;
}

export function PersonalInfoForm({ form, supportsPhoto = false }: PersonalInfoFormProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const photoUrl = watch('personalInfo.photoUrl');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Read image file as base64 data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setValue('personalInfo.photoUrl', dataUrl, {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
    };
    reader.readAsDataURL(file);
    // Reset file input value so re-uploading same file triggers change
    e.target.value = '';
  };

  const handleRemovePhoto = () => {
    setValue('personalInfo.photoUrl', '', {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[20px] font-bold text-[#7a1f1f] font-['Playfair_Display']">
          Personal Details
        </h3>
      </div>

      {/* Profile Photo Upload — Only displayed when template supports photo */}
      {supportsPhoto && (
        <div className="bg-[#fff8f6] border border-[#ddc0bd] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-sm">
          <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white border-2 border-[#ddc0bd] flex items-center justify-center shrink-0 shadow-inner group">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="Profile photo"
                className="w-full h-full object-cover"
              />
            ) : (
              <IconMapper name="account_circle" className="text-4xl text-[#ddc0bd]" />
            )}
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#7a1f1f] hover:bg-[#5b060c] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <IconMapper name="add" className="text-sm" />
                {photoUrl ? 'Change Photo' : 'Upload Photo'}
              </button>

              {photoUrl && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="inline-flex items-center gap-1 px-3 py-2 bg-white hover:bg-[#ffe5e0] text-[#7a1f1f] border border-[#ddc0bd] text-xs font-medium rounded-lg transition-colors cursor-pointer"
                >
                  <IconMapper name="remove" className="text-sm" />
                  Remove
                </button>
              )}
            </div>
            <p className="text-[12px] text-[#564240]">
              Recommended: Square JPG, PNG or WebP image, minimum 400x400px.
            </p>
          </div>
        </div>
      )}

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
