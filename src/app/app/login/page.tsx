import type { Metadata } from 'next';
import { AuthLayout } from '../_components/auth/auth-layout';
import { LoginForm } from './login-form';

export const metadata: Metadata = {
  title: 'Login | JobPatra - AI Career Workshop',
  description: 'Sign in to your JobPatra account to access your dashboard and active resumes.',
};

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
