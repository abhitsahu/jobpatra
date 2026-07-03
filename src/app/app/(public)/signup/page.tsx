import type { Metadata } from 'next';
import { AuthLayout } from '../../_components/auth/auth-layout';
import { SignupForm } from './signup-form';

export const metadata: Metadata = {
  title: 'Sign Up | JobPatra - AI Career Workshop',
  description: 'Create your JobPatra account to start building resumes that get results.',
};

export default function SignupPage() {
  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  );
}
