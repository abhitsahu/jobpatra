import type { Metadata } from 'next';
import { AuthLayout } from '../_components/auth/auth-layout';
import { SignupForm } from './signup-form';

export const metadata: Metadata = {
  title: 'Create Account — Elevate AI',
  description: 'Create your free Elevate AI account and start building resumes that get results.',
};

export default function SignupPage() {
  return (
    <AuthLayout alignment="top">
      <SignupForm />
    </AuthLayout>
  );
}
