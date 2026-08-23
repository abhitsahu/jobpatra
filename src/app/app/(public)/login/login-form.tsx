'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

import { loginSchema } from '@/app/api/model/request/auth/auth';
import type { LoginRequest } from '@/app/api/model/request/auth/auth';
import { loginClient, googleLoginClient } from '@/app/api/client/auth/auth-client';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  const redirectPath = searchParams.get('redirect');
  const template = searchParams.get('template');
  const targetUrl = redirectPath
    ? `${redirectPath}${template ? `?template=${template}` : ''}`
    : '/app/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginRequest) => {
    setServerError(null);
    try {
      const result = await loginClient(data);
      if (!result.success) {
        setServerError(result.message);
        return;
      }
      router.push(targetUrl);
      router.refresh();
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
    <>
      <main className="relative z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 rounded-lg overflow-hidden shadow-2xl border border-[#ddc0bd]/30">
        {/* Left Column: Brand Illustration */}
        <section className="hidden md:flex flex-col items-center justify-center p-16 bg-[#5b060c] text-white relative">
          {/* Subtle backdrop pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
          <div className="relative z-10 text-center flex flex-col items-center space-y-8">
            {/* Brand Identity */}
            <div className="space-y-2">
              <h1 className="font-['Playfair_Display'] text-[32px] leading-[40px] font-semibold text-white tracking-tight">
                JobPatra
              </h1>
              <p className="font-['Hanken_Grotesk'] text-[14px] leading-[20px] tracking-[0.05em] font-semibold text-[#ffdad7] uppercase tracking-widest opacity-80">
                AI Career Workshop
              </p>
            </div>
            {/* Central Illustration: Wax Sealed Envelope */}
            <div className="relative w-72 h-72 flex items-center justify-center">
              {/* Envelope Shadow */}
              <div className="absolute w-64 h-48 bg-white/5 rounded-sm transform rotate-1"></div>
              {/* The Envelope Base */}
              <div className="w-64 h-48 bg-white rounded-sm shadow-xl flex flex-col items-center justify-center relative overflow-hidden">
                <div
                  className="absolute top-0 w-full h-1/2 bg-[#fff0ed] border-b border-[#ddc0bd]/20"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 50% 60%)' }}
                ></div>
                {/* Decorative Lines */}
                <div className="mt-12 space-y-2 px-8 w-full">
                  <div className="h-1 w-full bg-[#ddc0bd]/20"></div>
                  <div className="h-1 w-3/4 bg-[#ddc0bd]/20"></div>
                  <div className="h-1 w-1/2 bg-[#ddc0bd]/20"></div>
                </div>
                {/* The Wax Seal */}
                <div className="absolute -bottom-4 auth-wax-seal cursor-pointer">
                  <div className="w-16 h-16 rounded-full bg-[#5b060c] flex items-center justify-center border-4 border-[#7a1f1f] shadow-lg">
                    <span
                      className="material-symbols-outlined text-white text-3xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      approval
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="max-w-xs space-y-4 pt-12">
              <h2 className="font-['Playfair_Display'] text-[24px] leading-[32px] font-semibold italic">
                Crafting artifacts of value.
              </h2>
              <p className="font-['Hanken_Grotesk'] text-[16px] leading-[24px] text-white/70">
                Step into your bespoke letterpress workshop. We refine your professional identity
                with the gravity it deserves.
              </p>
            </div>
          </div>
        </section>

        {/* Right Column: Login Form */}
        <section className="auth-sheet-base flex flex-col items-center justify-center p-8 md:p-16 relative">
          {/* Mobile Brand Logo */}
          <div className="md:hidden mb-12 text-center">
            <h1 className="font-['Playfair_Display'] text-[32px] leading-[40px] font-semibold text-[#5b060c]">
              JobPatra
            </h1>
          </div>
          <div className="w-full max-w-sm space-y-10">
            <header className="space-y-2">
              <h2 className="font-['Playfair_Display'] text-[24px] leading-[32px] font-semibold text-[#2b1611]">
                Welcome Back
              </h2>
              <p className="font-['Hanken_Grotesk'] text-[16px] leading-[24px] text-[#564240]">
                Continue your professional journey.
              </p>
            </header>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
              <div className="space-y-4">
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
                    {...register('email')}
                  />
                  {errors.email?.message && (
                    <p className="text-sm text-[#ba1a1a] mt-1">{errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-1 group">
                  <div className="flex justify-between items-center">
                    <label
                      className="font-['Hanken_Grotesk'] text-[14px] leading-[20px] tracking-[0.05em] font-semibold text-[#564240] group-focus-within:text-[#5b060c] uppercase transition-colors duration-300"
                      htmlFor="password"
                    >
                      Security Code
                    </label>
                    <Link
                      className="font-['Hanken_Grotesk'] text-[12px] leading-[16px] font-semibold text-[#5b060c] hover:underline"
                      href="/app/forgot-password"
                    >
                      Forgot?
                    </Link>
                  </div>
                  <input
                    className="w-full py-3 auth-input-underline font-['Hanken_Grotesk'] text-[16px] leading-[24px] text-[#2b1611] placeholder:text-[#ddc0bd]/60 focus:ring-0"
                    id="password"
                    placeholder="••••••••"
                    type="password"
                    {...register('password')}
                  />
                  {errors.password?.message && (
                    <p className="text-sm text-[#ba1a1a] mt-1">{errors.password.message}</p>
                  )}
                </div>
              </div>
              <div className="pt-4 space-y-4">
                {/* Server-level error */}
                {serverError && (
                  <p
                    className="font-['Hanken_Grotesk'] text-[14px] text-[#ba1a1a] text-center"
                    role="alert"
                  >
                    {serverError}
                  </p>
                )}

                {/* Primary Login Button */}
                <button
                  className="w-full bg-[#5b060c] text-white py-4 rounded-none font-['Hanken_Grotesk'] text-[14px] leading-[20px] tracking-[0.05em] font-semibold uppercase tracking-widest shadow-md hover:bg-[#5e0001] transition-all active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-50"
                  type="submit"
                  disabled={isSubmitting}
                >
                  <span>{isSubmitting ? 'Entering...' : 'Enter Workshop'}</span>
                  <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">
                    arrow_right_alt
                  </span>
                </button>
                <div className="relative flex items-center justify-center py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#ddc0bd]/30"></div>
                  </div>
                  <span className="relative bg-[#FFF8EE] px-4 font-['Hanken_Grotesk'] text-[12px] leading-[16px] font-medium text-[#564240] uppercase">
                    Or
                  </span>
                </div>
                {/* Google Social Login */}
                <button
                  onClick={handleGoogle}
                  disabled={googleLoading}
                  className="w-full bg-white border border-[#ddc0bd] text-[#2b1611] py-3 rounded-none font-['Hanken_Grotesk'] text-[14px] leading-[20px] tracking-[0.05em] font-semibold flex items-center justify-center gap-3 hover:bg-[#fff0ed] transition-colors shadow-sm disabled:opacity-50"
                  type="button"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt="Google"
                    className="w-5 h-5"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0pSKr4MQR0C0md8_uOSSQ0xldqkWrtoU42-y0YqMPORRcirjkdDGnRLLhawCEzlhKVM4xiYv0YHiZo5QPiNrmB4B7x2wMT3r1pyH-SFRiLVcG0z0sqc6_-KH1k9dC_CbOeVQN-8ZX90DIXqZ3kD9EmH53s39s87JtG6sk01Dptuf7v2WEsvizQ_01s09JZ96QI3H7xD7yi9jlyvfIyPw6h17nAinPyWnA9d-ApG_lhQ8LO5mMII9LkKKOmm-v2B8s6p6ORQ6i0CVq"
                  />
                  <span>{googleLoading ? 'Connecting...' : 'Continue with Google'}</span>
                </button>
              </div>
            </form>
            <footer className="pt-8 text-center">
              <p className="font-['Hanken_Grotesk'] text-[#564240] text-[16px] leading-[24px]">
                New to the workshop?{' '}
                <Link className="text-[#5b060c] font-bold hover:underline" href="/app/signup">
                  Request Access
                </Link>
              </p>
            </footer>
          </div>
          {/* Footer Decorative Element */}
          <div className="absolute bottom-8 right-8 pointer-events-none opacity-40">
            <div className="flex items-center gap-2 font-['Hanken_Grotesk'] text-[12px] leading-[16px] font-medium text-[#8a716f]">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              <span>Secure Workshop Terminal</span>
            </div>
          </div>
        </section>
      </main>

      {/* Visual Polish: Corner Fold Decoration */}
      <div className="fixed top-0 right-0 w-32 h-32 overflow-hidden pointer-events-none hidden lg:block">
        <div className="absolute top-0 right-0 w-full h-full bg-[#7a1f1f]/10 transform rotate-45 translate-x-1/2 -translate-y-1/2 border-l border-[#ddc0bd]/30"></div>
      </div>
    </>
  );
}
