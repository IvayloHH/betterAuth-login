import { AuthForm } from '@/components/AuthForm';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <AuthForm type="sign-in" />
    </div>
  );
}
