import type { Metadata } from 'next';
import { AuthLayout } from '../_components/auth/auth-layout';
import { LoginForm } from './login-form';

export const metadata: Metadata = {
  title: 'Sign In — Elevate AI',
  description: 'Sign in to your Elevate AI account to access your dashboard and active resumes.',
};

export default function LoginPage() {
  return (
    <AuthLayout alignment="top">
      <LoginForm />
    </AuthLayout>
  );
}
