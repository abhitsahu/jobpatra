'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { loginSchema } from '@/app/api/model/request/auth/auth';
import type { LoginRequest } from '@/app/api/model/request/auth/auth';
import { loginClient, googleLoginClient } from '@/app/api/client/auth/auth-client';

import { AuthHeader } from '../_components/auth/auth-header';
import { AuthSocialButton } from '../_components/auth/auth-social-button';
import { AuthDivider } from '../_components/auth/auth-divider';
import { AuthInput } from '../_components/auth/auth-input';
import { PasswordInput } from '../_components/auth/password-input';
import { AuthSubmitButton } from '../_components/auth/auth-submit-button';
import { AuthFooter } from '../_components/auth/auth-footer';

export function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

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
      router.push('/app/dashboard');
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
      await googleLoginClient('/app/dashboard');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <>
      <AuthHeader
        title="Welcome back"
        subtitle="Sign in to access your dashboard and active resumes."
      />

      <AuthSocialButton onClick={handleGoogle} loading={googleLoading} />

      <AuthDivider />

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        {/* Email */}
        <AuthInput
          label="Email Address"
          icon="mail"
          type="email"
          placeholder="name@company.com"
          error={errors.email?.message}
          {...register('email')}
        />

        {/* Password with Forgot link */}
        <div>
          <PasswordInput error={errors.password?.message} {...register('password')} />
          <div className="flex items-center justify-end mt-2 ml-1">
            <Link
              href="/app/public/forgot-password"
              className="font-[Space_Grotesk] text-[12px] leading-[16px] tracking-[0.1em] font-semibold text-[#1a91f0] hover:text-[#a0caff] uppercase transition-colors"
            >
              Forgot?
            </Link>
          </div>
        </div>

        {/* Server-level error */}
        {serverError && (
          <p className="font-[Inter] text-[14px] text-[#ffb4ab] text-center" role="alert">
            {serverError}
          </p>
        )}

        <AuthSubmitButton label="Sign In" loading={isSubmitting} disabled={isSubmitting} />
      </form>

      <AuthFooter prompt="Don't have an account?" linkLabel="Sign up" href="/app/signup" />
    </>
  );
}
