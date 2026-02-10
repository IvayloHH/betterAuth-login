'use client';

import { signOutAction } from '@/lib/actions/auth-actions';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOutAction();
    router.push('/sign-in');
    router.refresh();
  };

  return (
    <div>
      <h1>Home page</h1>
      <button onClick={handleSignOut} style={{ padding: '10px', marginTop: '20px' }}>
        Sign Out
      </button>
    </div>
  );
}
