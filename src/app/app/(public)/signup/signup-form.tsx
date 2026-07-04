'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

import { signupSchema } from '@/app/api/model/request/auth/auth';
import { signupClient, googleLoginClient } from '@/app/api/client/auth/auth-client';

import { PasswordStrength } from '../../_components/auth/password-strength';
import { PasswordRequirements } from '../../_components/auth/password-requirements';
import { ConfirmPasswordStatus } from '../../_components/auth/confirm-password-status';
import { allSatisfied } from '../../_components/auth/password-rules';

// Extend the base signup schema with confirm password validation
const signupFormSchema = signupSchema
  .extend({
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignupFormValues = z.infer<typeof signupFormSchema>;

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  const redirectPath = searchParams.get('redirect');
  const template = searchParams.get('template');
  const targetUrl = redirectPath
    ? `${redirectPath}${template ? `?template=${template}` : ''}`
    : '/app/dashboard';

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    mode: 'onChange',
  });

  // Watch both password fields live for strength/requirement checklist
  const password = watch('password') ?? '';
  const confirmPassword = watch('confirmPassword') ?? '';

  // Submit is disabled until all 5 password rules pass AND passwords match
  const passwordReady = allSatisfied(password) && password === confirmPassword;

  const onSubmit = async (data: SignupFormValues) => {
    setServerError(null);
    setServerSuccess(null);

    try {
      const { confirmPassword: _, ...signupRequest } = data;
      void _;

      const result = await signupClient(signupRequest);

      if (!result.success) {
        setServerError(result.message);
        return;
      }

      setServerSuccess('Account created! Please check your email to verify your account.');
      const loginUrl = `/app/login${redirectPath ? `?redirect=${encodeURIComponent(redirectPath)}${template ? `&template=${encodeURIComponent(template)}` : ''}` : ''}`;
      setTimeout(() => router.push(loginUrl), 2500);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.',
      );
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await googleLoginClient(targetUrl);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col justify-between relative z-20">
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col md:flex-row gap-12 items-stretch py-12">
        {/* Branding & Benefits Section */}
        <div className="flex-1 flex flex-col justify-center space-y-8 pr-0 md:pr-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[1px] bg-[#5b060c]"></span>
              <span className="font-['Hanken_Grotesk'] text-[14px] leading-[20px] tracking-[0.2em] font-semibold text-[#5b060c] uppercase">
                The AI Workshop
              </span>
            </div>
            <h2 className="font-['Playfair_Display'] text-[32px] md:text-[48px] md:leading-[56px] md:tracking-[-0.02em] font-bold leading-tight text-[#2b1611]">
              Crafting your <br /> professional <br />{' '}
              <span className="italic text-[#5b060c]">artifact.</span>
            </h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="mt-1 flex-shrink-0 w-6 h-6 flex items-center justify-center border border-[#ddc0bd] rounded-full">
                <span className="material-symbols-outlined text-[16px] text-[#795900]">
                  history_edu
                </span>
              </div>
              <div>
                <p className="font-['Hanken_Grotesk'] text-[14px] leading-[20px] tracking-[0.05em] font-bold text-[#2b1611]">
                  Premium Typography
                </p>
                <p className="text-[#564240] font-['Hanken_Grotesk'] text-[16px] leading-[24px]">
                  Your career story deserves more than a standard font. We treat every resume like a
                  bespoke letterpress workshop.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-1 flex-shrink-0 w-6 h-6 flex items-center justify-center border border-[#ddc0bd] rounded-full">
                <span className="material-symbols-outlined text-[16px] text-[#795900]">mail</span>
              </div>
              <div>
                <p className="font-['Hanken_Grotesk'] text-[14px] leading-[20px] tracking-[0.05em] font-bold text-[#2b1611]">
                  Delivering Opportunity
                </p>
                <p className="text-[#564240] font-['Hanken_Grotesk'] text-[16px] leading-[24px]">
                  JobPatra isn&apos;t just a builder; it&apos;s a delivery mechanism for your next
                  high-stakes career introduction.
                </p>
              </div>
            </div>
          </div>

          {/* Decorative Postal Stamp */}
          <div className="pt-8 opacity-45 grayscale hover:grayscale-0 transition-all duration-500 hidden md:block">
            <div className="w-32 h-40 bg-[#ffe9e4] border-[3px] border-dashed border-[#ddc0bd] p-4 flex flex-col justify-between">
              <div className="flex justify-end">
                <div className="w-8 h-8 rounded-full bg-[#ddc0bd]/30"></div>
              </div>
              <div className="text-[10px] font-['Hanken_Grotesk'] leading-tight text-[#564240]">
                EST. 2024
                <br />
                CAREER ARCHIVE
                <br />
                OFFICIAL SEAL
              </div>
            </div>
          </div>
        </div>

        {/* Sign Up Sheet */}
        <div className="flex-1 flex items-center justify-center">
          <div className="auth-sheet-base auth-sheet p-8 md:p-12 w-full max-w-[480px] mx-auto rounded-none">
            <div className="mb-10 text-center md:text-left">
              <h3 className="font-['Playfair_Display'] text-[24px] leading-[32px] font-semibold text-[#2b1611] mb-2">
                Create your account
              </h3>
              <p className="text-[#564240] font-['Hanken_Grotesk'] text-[16px] leading-[24px]">
                Join the workshop and start building.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
              <div className="space-y-1 group">
                <label
                  className="font-['Hanken_Grotesk'] text-[14px] leading-[20px] tracking-[0.05em] font-semibold text-[#564240] group-focus-within:text-[#5b060c] group-focus-within:tracking-[0.3em] uppercase tracking-wider transition-all duration-300"
                  htmlFor="full_name"
                >
                  Full Name
                </label>
                <input
                  className="w-full auth-input-underline font-['Hanken_Grotesk'] text-[18px] leading-[28px] text-[#2b1611] placeholder:text-[#ddc0bd] py-2 focus:ring-0"
                  id="full_name"
                  placeholder="Johnathan Doe"
                  type="text"
                  {...register('name')}
                />
                {errors.name?.message && (
                  <p className="text-sm text-[#ba1a1a] mt-1">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-1 group">
                <label
                  className="font-['Hanken_Grotesk'] text-[14px] leading-[20px] tracking-[0.05em] font-semibold text-[#564240] group-focus-within:text-[#5b060c] group-focus-within:tracking-[0.3em] uppercase tracking-wider transition-all duration-300"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <input
                  className="w-full auth-input-underline font-['Hanken_Grotesk'] text-[18px] leading-[28px] text-[#2b1611] placeholder:text-[#ddc0bd] py-2 focus:ring-0"
                  id="email"
                  placeholder="john@example.com"
                  type="email"
                  {...register('email')}
                />
                {errors.email?.message && (
                  <p className="text-sm text-[#ba1a1a] mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1 group">
                <label
                  className="font-['Hanken_Grotesk'] text-[14px] leading-[20px] tracking-[0.05em] font-semibold text-[#564240] group-focus-within:text-[#5b060c] group-focus-within:tracking-[0.3em] uppercase tracking-wider transition-all duration-300"
                  htmlFor="password"
                >
                  Create Password
                </label>
                <input
                  className="w-full auth-input-underline font-['Hanken_Grotesk'] text-[18px] leading-[28px] text-[#2b1611] placeholder:text-[#ddc0bd] py-2 focus:ring-0"
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  {...register('password')}
                />
                {errors.password?.message && (
                  <p className="text-sm text-[#ba1a1a] mt-1">{errors.password.message}</p>
                )}
                {/* Requirements components styled with cream theme */}
                <PasswordStrength password={password} />
                <PasswordRequirements password={password} />
              </div>

              <div className="space-y-1 group">
                <label
                  className="font-['Hanken_Grotesk'] text-[14px] leading-[20px] tracking-[0.05em] font-semibold text-[#564240] group-focus-within:text-[#5b060c] group-focus-within:tracking-[0.3em] uppercase tracking-wider transition-all duration-300"
                  htmlFor="confirmPassword"
                >
                  Confirm Password
                </label>
                <input
                  className="w-full auth-input-underline font-['Hanken_Grotesk'] text-[18px] leading-[28px] text-[#2b1611] placeholder:text-[#ddc0bd] py-2 focus:ring-0"
                  id="confirmPassword"
                  placeholder="••••••••"
                  type="password"
                  {...register('confirmPassword')}
                />
                <ConfirmPasswordStatus password={password} confirmPassword={confirmPassword} />
              </div>

              {/* Server feedback */}
              {serverError && (
                <p
                  className="font-['Hanken_Grotesk'] text-[14px] text-[#ba1a1a] text-center"
                  role="alert"
                >
                  {serverError}
                </p>
              )}
              {serverSuccess && (
                <p
                  className="font-['Hanken_Grotesk'] text-[14px] text-[#2a7040] text-center"
                  role="status"
                >
                  {serverSuccess}
                </p>
              )}

              <div className="pt-4">
                <button
                  className="w-full bg-[#5b060c] text-white py-4 px-6 font-['Hanken_Grotesk'] text-[14px] leading-[20px] tracking-[0.2em] font-semibold uppercase shadow-lg hover:shadow-xl hover:bg-[#7a1f1f] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  type="submit"
                  disabled={isSubmitting || !passwordReady}
                >
                  {isSubmitting ? 'Registering...' : 'Start Building'}
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </form>

            <div className="mt-12 pt-8 border-t border-[#ddc0bd]">
              <div className="flex flex-col gap-4 text-center">
                <p className="text-[12px] leading-[16px] font-medium text-[#564240] tracking-wider uppercase">
                  OR REGISTER WITH
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleGoogle}
                    disabled={googleLoading}
                    className="p-3 border border-[#ddc0bd] hover:bg-[#fff0ed] transition-colors flex items-center justify-center disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[#2b1611]">google</span>
                  </button>
                </div>
                <p className="mt-6 text-[#564240] font-['Hanken_Grotesk'] text-[16px] leading-[24px]">
                  Already have an account?{' '}
                  <Link
                    className="text-[#5b060c] font-bold border-b border-[#5b060c]/30 hover:border-[#5b060c] transition-all"
                    href="/app/login"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </div>

            {/* Nib Icon Detail */}
            <div className="absolute -bottom-6 -right-6 hidden md:block">
              <div className="w-12 h-12 auth-wax-seal rounded-full flex items-center justify-center bg-gradient-to-br from-[#795900] to-[#a23c39] shadow-lg">
                <span className="material-symbols-outlined text-white text-xl">edit_note</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
