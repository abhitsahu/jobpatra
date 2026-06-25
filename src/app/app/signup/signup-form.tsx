'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

import { signupSchema } from '@/app/api/model/request/auth/auth';
import { signupClient, googleLoginClient } from '@/app/api/client/auth/auth-client';

import { AuthHeader } from '../_components/auth/auth-header';
import { AuthSocialButton } from '../_components/auth/auth-social-button';
import { AuthDivider } from '../_components/auth/auth-divider';
import { AuthInput } from '../_components/auth/auth-input';
import { PasswordInput } from '../_components/auth/password-input';
import { PasswordStrength } from '../_components/auth/password-strength';
import { PasswordRequirements } from '../_components/auth/password-requirements';
import { ConfirmPasswordStatus } from '../_components/auth/confirm-password-status';
import { AuthSubmitButton } from '../_components/auth/auth-submit-button';
import { AuthFooter } from '../_components/auth/auth-footer';
import { allSatisfied } from '../_components/auth/password-rules';

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
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    // onChange — validate and update live as the user types
    mode: 'onChange',
  });

  // Watch both password fields live for the sub-components.
  // These subscriptions are cheap — react-hook-form diffs internally.
  const password = watch('password') ?? '';
  const confirmPassword = watch('confirmPassword') ?? '';

  // Submit is disabled until all 5 password rules pass AND passwords match.
  const passwordReady = allSatisfied(password) && password === confirmPassword;

  const onSubmit = async (data: SignupFormValues) => {
    setServerError(null);
    setServerSuccess(null);

    try {
      // Strip confirmPassword before sending to API
      const { confirmPassword: _, ...signupRequest } = data;
      void _;

      const result = await signupClient(signupRequest);

      if (!result.success) {
        setServerError(result.message);
        return;
      }

      setServerSuccess('Account created! Please check your email to verify your account.');
      // Redirect to login after a brief moment so the user reads the message
      setTimeout(() => router.push('/app/login'), 2500);
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
      <AuthHeader title="Create your account" subtitle="Start building resumes that get results." />

      <AuthSocialButton
        onClick={handleGoogle}
        loading={googleLoading}
        label="Sign up with Google"
      />

      <AuthDivider />

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {/* Full name */}
        <AuthInput
          label="Full Name"
          icon="person"
          type="text"
          placeholder="Jane Smith"
          error={errors.name?.message}
          {...register('name')}
        />

        {/* Email */}
        <AuthInput
          label="Email Address"
          icon="mail"
          type="email"
          placeholder="name@company.com"
          error={errors.email?.message}
          {...register('email')}
        />

        {/* Password */}
        <div className="space-y-1">
          <PasswordInput
            label="Password"
            error={errors.password?.message}
            {...register('password')}
          />
          {/* Strength bar appears as soon as the user starts typing */}
          <PasswordStrength password={password} />
          {/* Requirements checklist */}
          <PasswordRequirements password={password} />
        </div>

        {/* Confirm password */}
        <div className="space-y-1">
          <PasswordInput label="Confirm Password" {...register('confirmPassword')} />
          {/* Match/mismatch shown as soon as confirm field has content */}
          <ConfirmPasswordStatus password={password} confirmPassword={confirmPassword} />
        </div>

        {/* Server feedback */}
        {serverError && (
          <p className="font-[Inter] text-[14px] text-[#ffb4ab] text-center" role="alert">
            {serverError}
          </p>
        )}
        {serverSuccess && (
          <p className="font-[Inter] text-[14px] text-[#34A853] text-center" role="status">
            {serverSuccess}
          </p>
        )}

        {/*
          Submit is disabled until:
            1. All 5 password rules are satisfied
            2. Passwords match
          This mirrors the Zod validation so the button never fires a doomed request.
        */}
        <AuthSubmitButton
          label="Create Account"
          loading={isSubmitting}
          disabled={isSubmitting || !passwordReady}
        />
      </form>

      <AuthFooter prompt="Already have an account?" linkLabel="Sign in" href="/app/login" />
    </>
  );
}
