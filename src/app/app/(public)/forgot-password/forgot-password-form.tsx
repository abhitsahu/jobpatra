'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';

import { forgotPasswordSchema } from '@/app/api/model/request/auth/auth';
import type { ForgotPasswordRequest } from '@/app/api/model/request/auth/auth';
import { forgotPasswordClient } from '@/app/api/client/auth/auth-client';
import { AuthCardLayout, AUTH_PAGE_CONFIGS } from '../../_components/auth/auth-card-layout';

export function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordRequest>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordRequest) => {
    try {
      await forgotPasswordClient(data);
    } catch {
      // Always show success — anti-enumeration
    } finally {
      setSubmitted(true);
    }
  };

  return (
    <AuthCardLayout {...AUTH_PAGE_CONFIGS.forgotPassword}>
      {submitted ? (
        <div className="space-y-6 text-center py-4">
          <header className="space-y-3">
            <span
              className="material-symbols-outlined text-[#5b060c] text-5xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              mark_email_read
            </span>
            <h3 className="font-['Playfair_Display'] text-[24px] leading-[32px] font-semibold text-[#2b1611]">
              Check your email
            </h3>
            <p className="font-[#Hanken_Grotesk'] text-[16px] leading-[24px] text-[#564240]">
              If an account exists with that email, we sent a password reset link. It expires in 1
              hour.
            </p>
          </header>
          <div className="pt-4">
            <Link
              className="font-['Hanken_Grotesk'] text-[14px] text-[#5b060c] font-bold border-b border-[#5b060c]/30 hover:border-[#5b060c] transition-all inline-flex items-center gap-1"
              href="/app/login"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Back to login
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-10 text-center md:text-left">
            <h3 className="font-['Playfair_Display'] text-[24px] leading-[32px] font-semibold text-[#2b1611] mb-2">
              Forgot Password
            </h3>
            <p className="text-[#564240] font-['Hanken_Grotesk'] text-[16px] leading-[24px]">
              Enter your email and we&apos;ll send you a reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
            <div className="space-y-1 group">
              <label
                className="font-['Hanken_Grotesk'] text-[14px] leading-[20px] tracking-[0.05em] font-semibold text-[#564240] group-focus-within:text-[#5b060c] group-focus-within:tracking-[0.3em] uppercase tracking-wider transition-all duration-300"
                htmlFor="email"
              >
                Professional Email
              </label>
              <input
                className="w-full auth-input-underline font-['Hanken_Grotesk'] text-[18px] leading-[28px] text-[#2b1611] placeholder:text-[#ddc0bd] py-2 focus:ring-0"
                id="email"
                placeholder="name@company.com"
                type="email"
                autoComplete="email"
                {...register('email')}
              />
              {errors.email?.message && (
                <p className="text-sm text-[#ba1a1a] mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="pt-4">
              <button
                className="w-full bg-[#5b060c] text-white py-4 px-6 font-['Hanken_Grotesk'] text-[14px] leading-[20px] tracking-[0.2em] font-semibold uppercase shadow-lg hover:shadow-xl hover:bg-[#7a1f1f] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                type="submit"
                disabled={isSubmitting}
              >
                <span>{isSubmitting ? 'Sending...' : 'Send Reset Link'}</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </form>

          <div className="mt-12 pt-8 border-t border-[#ddc0bd] text-center">
            <Link
              className="font-['Hanken_Grotesk'] text-[14px] text-[#5b060c] font-bold border-b border-[#5b060c]/30 hover:border-[#5b060c] transition-all inline-flex items-center gap-1"
              href="/app/login"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Back to login
            </Link>
          </div>
        </>
      )}
    </AuthCardLayout>
  );
}
