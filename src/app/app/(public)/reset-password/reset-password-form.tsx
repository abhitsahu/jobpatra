'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';

import { resetPasswordSchema } from '@/app/api/model/request/auth/auth';
import { resetPasswordClient } from '@/app/api/client/auth/auth-client';
import { PasswordStrength } from '../../_components/auth/password-strength';
import { PasswordRequirements } from '../../_components/auth/password-requirements';
import { ConfirmPasswordStatus } from '../../_components/auth/confirm-password-status';
import { allSatisfied } from '../../_components/auth/password-rules';

const resetFormSchema = resetPasswordSchema
  .extend({
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ResetFormValues = z.infer<typeof resetFormSchema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetFormSchema),
    defaultValues: { token: token ?? '' },
    mode: 'onChange',
  });

  const password = watch('password') ?? '';
  const confirmPassword = watch('confirmPassword') ?? '';
  const passwordReady = allSatisfied(password) && password === confirmPassword;

  const onSubmit = async (data: ResetFormValues) => {
    setServerError(null);

    try {
      const result = await resetPasswordClient({
        token: data.token,
        password: data.password,
      });

      if (!result.success) {
        setServerError(result.message);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push('/app/login'), 2500);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.',
      );
    }
  };

  if (!token) {
    return (
      <main className="relative z-10 w-full max-w-lg auth-sheet-base rounded-lg overflow-hidden shadow-2xl border border-[#ddc0bd]/30 p-8 md:p-12">
        <div className="space-y-6 text-center">
          <span className="material-symbols-outlined text-[#ba1a1a] text-5xl">link_off</span>
          <header className="space-y-2">
            <h2 className="font-['Playfair_Display'] text-[24px] leading-[32px] font-semibold text-[#2b1611]">
              Invalid reset link
            </h2>
            <p className="font-['Hanken_Grotesk'] text-[16px] leading-[24px] text-[#564240]">
              This password reset link is missing or invalid. Please request a new one.
            </p>
          </header>
          <Link
            className="inline-flex items-center gap-2 font-['Hanken_Grotesk'] text-[14px] font-semibold text-[#5b060c] hover:underline"
            href="/app/forgot-password"
          >
            Request a new link
          </Link>
        </div>
      </main>
    );
  }

  if (success) {
    return (
      <main className="relative z-10 w-full max-w-lg auth-sheet-base rounded-lg overflow-hidden shadow-2xl border border-[#ddc0bd]/30 p-8 md:p-12">
        <div className="space-y-6 text-center">
          <span
            className="material-symbols-outlined text-[#2a7040] text-5xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            check_circle
          </span>
          <header className="space-y-2">
            <h2 className="font-['Playfair_Display'] text-[24px] leading-[32px] font-semibold text-[#2b1611]">
              Password updated
            </h2>
            <p className="font-['Hanken_Grotesk'] text-[16px] leading-[24px] text-[#564240]">
              Your password has been reset successfully. Redirecting to login...
            </p>
          </header>
          <Link
            className="inline-flex items-center gap-2 font-['Hanken_Grotesk'] text-[14px] font-semibold text-[#5b060c] hover:underline"
            href="/app/login"
          >
            Log in now
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="relative z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 rounded-lg overflow-hidden shadow-2xl border border-[#ddc0bd]/30">
        <section className="hidden md:flex flex-col items-center justify-center p-16 bg-[#5b060c] text-white relative">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
          <div className="relative z-10 text-center flex flex-col items-center space-y-8">
            <div className="space-y-2">
              <h1 className="font-['Playfair_Display'] text-[32px] leading-[40px] font-semibold text-white tracking-tight">
                JobPatra
              </h1>
              <p className="font-['Hanken_Grotesk'] text-[14px] leading-[20px] tracking-[0.05em] font-semibold text-[#ffdad7] uppercase tracking-widest opacity-80">
                AI Career Workshop
              </p>
            </div>
            <div className="max-w-xs space-y-4 pt-12">
              <h2 className="font-['Playfair_Display'] text-[24px] leading-[32px] font-semibold italic">
                Set a new security code.
              </h2>
              <p className="font-['Hanken_Grotesk'] text-[16px] leading-[24px] text-white/70">
                Choose a strong password to protect your workshop account.
              </p>
            </div>
          </div>
        </section>

        <section className="auth-sheet-base flex flex-col items-center justify-center p-8 md:p-16 relative">
          <div className="md:hidden mb-12 text-center">
            <h1 className="font-['Playfair_Display'] text-[32px] leading-[40px] font-semibold text-[#5b060c]">
              JobPatra
            </h1>
          </div>

          <div className="w-full max-w-sm space-y-8">
            <header className="space-y-2">
              <h2 className="font-['Playfair_Display'] text-[24px] leading-[32px] font-semibold text-[#2b1611]">
                Reset Password
              </h2>
              <p className="font-['Hanken_Grotesk'] text-[16px] leading-[24px] text-[#564240]">
                Enter your new password below.
              </p>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
              <input type="hidden" {...register('token')} />

              <div className="space-y-1 group">
                <label
                  className="font-['Hanken_Grotesk'] text-[14px] leading-[20px] tracking-[0.05em] font-semibold text-[#564240] group-focus-within:text-[#5b060c] uppercase transition-colors duration-300"
                  htmlFor="password"
                >
                  New Password
                </label>
                <input
                  className="w-full py-3 auth-input-underline font-['Hanken_Grotesk'] text-[16px] leading-[24px] text-[#2b1611] placeholder:text-[#ddc0bd]/60 focus:ring-0"
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  autoComplete="new-password"
                  {...register('password')}
                />
                {errors.password?.message && (
                  <p className="text-sm text-[#ba1a1a] mt-1">{errors.password.message}</p>
                )}
                <PasswordStrength password={password} />
                <PasswordRequirements password={password} />
              </div>

              <div className="space-y-1 group">
                <label
                  className="font-['Hanken_Grotesk'] text-[14px] leading-[20px] tracking-[0.05em] font-semibold text-[#564240] group-focus-within:text-[#5b060c] uppercase transition-colors duration-300"
                  htmlFor="confirmPassword"
                >
                  Confirm Password
                </label>
                <input
                  className="w-full py-3 auth-input-underline font-['Hanken_Grotesk'] text-[16px] leading-[24px] text-[#2b1611] placeholder:text-[#ddc0bd]/60 focus:ring-0"
                  id="confirmPassword"
                  placeholder="••••••••"
                  type="password"
                  autoComplete="new-password"
                  {...register('confirmPassword')}
                />
                <ConfirmPasswordStatus password={password} confirmPassword={confirmPassword} />
              </div>

              {serverError && (
                <p
                  className="font-['Hanken_Grotesk'] text-[14px] text-[#ba1a1a] text-center"
                  role="alert"
                >
                  {serverError}
                </p>
              )}

              <div className="pt-2 space-y-4">
                <button
                  className="w-full bg-[#5b060c] text-white py-4 rounded-none font-['Hanken_Grotesk'] text-[14px] leading-[20px] tracking-[0.05em] font-semibold uppercase tracking-widest shadow-md hover:bg-[#5e0001] transition-all active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-50"
                  type="submit"
                  disabled={isSubmitting || !passwordReady}
                >
                  <span>{isSubmitting ? 'Updating...' : 'Reset Password'}</span>
                  <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">
                    lock_reset
                  </span>
                </button>
              </div>
            </form>

            <footer className="text-center">
              <Link
                className="font-['Hanken_Grotesk'] text-[14px] text-[#5b060c] font-semibold hover:underline inline-flex items-center gap-1"
                href="/app/login"
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                Back to login
              </Link>
            </footer>
          </div>
        </section>
      </main>

      <div className="fixed top-0 right-0 w-32 h-32 overflow-hidden pointer-events-none hidden lg:block">
        <div className="absolute top-0 right-0 w-full h-full bg-[#7a1f1f]/10 transform rotate-45 translate-x-1/2 -translate-y-1/2 border-l border-[#ddc0bd]/30"></div>
      </div>
    </>
  );
}
