import { AuthForm } from '@/components/AuthForm';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <AuthForm type="sign-up" />
    </div>
  );
}
