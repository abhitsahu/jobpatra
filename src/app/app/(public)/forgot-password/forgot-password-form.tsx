'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';

import { forgotPasswordSchema } from '@/app/api/model/request/auth/auth';
import type { ForgotPasswordRequest } from '@/app/api/model/request/auth/auth';
import { forgotPasswordClient } from '@/app/api/client/auth/auth-client';

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
            <div className="relative w-72 h-72 flex items-center justify-center">
              <div className="absolute w-64 h-48 bg-white/5 rounded-sm transform rotate-1"></div>
              <div className="w-64 h-48 bg-white rounded-sm shadow-xl flex flex-col items-center justify-center relative overflow-hidden">
                <div
                  className="absolute top-0 w-full h-1/2 bg-[#fff0ed] border-b border-[#ddc0bd]/20"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 50% 60%)' }}
                ></div>
                <div className="mt-12 space-y-2 px-8 w-full">
                  <div className="h-1 w-full bg-[#ddc0bd]/20"></div>
                  <div className="h-1 w-3/4 bg-[#ddc0bd]/20"></div>
                  <div className="h-1 w-1/2 bg-[#ddc0bd]/20"></div>
                </div>
                <div className="absolute -bottom-4 auth-wax-seal">
                  <div className="w-16 h-16 rounded-full bg-[#5b060c] flex items-center justify-center border-4 border-[#7a1f1f] shadow-lg">
                    <span
                      className="material-symbols-outlined text-white text-3xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      lock_reset
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="max-w-xs space-y-4 pt-12">
              <h2 className="font-['Playfair_Display'] text-[24px] leading-[32px] font-semibold italic">
                Recover your access.
              </h2>
              <p className="font-['Hanken_Grotesk'] text-[16px] leading-[24px] text-white/70">
                We&apos;ll send a secure link to your registered email so you can set a new
                security code.
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

          <div className="w-full max-w-sm space-y-10">
            {submitted ? (
              <div className="space-y-6 text-center">
                <header className="space-y-2">
                  <span
                    className="material-symbols-outlined text-[#5b060c] text-5xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    mark_email_read
                  </span>
                  <h2 className="font-['Playfair_Display'] text-[24px] leading-[32px] font-semibold text-[#2b1611]">
                    Check your email
                  </h2>
                  <p className="font-['Hanken_Grotesk'] text-[16px] leading-[24px] text-[#564240]">
                    If an account exists with that email, we sent a password reset link. It expires
                    in 1 hour.
                  </p>
                </header>
                <Link
                  className="inline-flex items-center gap-2 font-['Hanken_Grotesk'] text-[14px] font-semibold text-[#5b060c] hover:underline"
                  href="/app/login"
                >
                  <span className="material-symbols-outlined text-lg">arrow_back</span>
                  Back to login
                </Link>
              </div>
            ) : (
              <>
                <header className="space-y-2">
                  <h2 className="font-['Playfair_Display'] text-[24px] leading-[32px] font-semibold text-[#2b1611]">
                    Forgot Password
                  </h2>
                  <p className="font-['Hanken_Grotesk'] text-[16px] leading-[24px] text-[#564240]">
                    Enter your email and we&apos;ll send you a reset link.
                  </p>
                </header>

                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
                  <div className="space-y-1 group">
                    <label
                      className="font-['Hanken_Grotesk'] text-[14px] leading-[20px] tracking-[0.05em] font-semibold text-[#564240] group-focus-within:text-[#5b060c] uppercase transition-colors duration-300"
                      htmlFor="email"
                    >
                      Professional Email
                    </label>
                    <input
                      className="w-full py-3 auth-input-underline font-['Hanken_Grotesk'] text-[16px] leading-[24px] text-[#2b1611] placeholder:text-[#ddc0bd]/60 focus:ring-0"
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

                  <div className="pt-4 space-y-4">
                    <button
                      className="w-full bg-[#5b060c] text-white py-4 rounded-none font-['Hanken_Grotesk'] text-[14px] leading-[20px] tracking-[0.05em] font-semibold uppercase tracking-widest shadow-md hover:bg-[#5e0001] transition-all active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-50"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      <span>{isSubmitting ? 'Sending...' : 'Send Reset Link'}</span>
                      <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">
                        send
                      </span>
                    </button>
                  </div>
                </form>

                <footer className="pt-4 text-center">
                  <Link
                    className="font-['Hanken_Grotesk'] text-[14px] text-[#5b060c] font-semibold hover:underline inline-flex items-center gap-1"
                    href="/app/login"
                  >
                    <span className="material-symbols-outlined text-base">arrow_back</span>
                    Back to login
                  </Link>
                </footer>
              </>
            )}
          </div>

          <div className="absolute bottom-8 right-8 pointer-events-none opacity-40">
            <div className="flex items-center gap-2 font-['Hanken_Grotesk'] text-[12px] leading-[16px] font-medium text-[#8a716f]">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              <span>Secure Workshop Terminal</span>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed top-0 right-0 w-32 h-32 overflow-hidden pointer-events-none hidden lg:block">
        <div className="absolute top-0 right-0 w-full h-full bg-[#7a1f1f]/10 transform rotate-45 translate-x-1/2 -translate-y-1/2 border-l border-[#ddc0bd]/30"></div>
      </div>
    </>
  );
}
