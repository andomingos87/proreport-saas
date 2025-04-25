import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export interface FakeUser {
  id: string
  email: string
  name?: string
}

export function useAuth() {
  const [user, setUser] = useState<FakeUser | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Simula login localmente
  const signIn = async (email: string, password: string, name?: string) => {
    setLoading(true);
    // Qualquer email/senha é aceito
    setTimeout(() => {
      setUser({
        id: 'fake-user-id',
        email,
        name: name || 'Usuário Demo',
      });
      setLoading(false);
      router.push('/dashboard');
    }, 500);
  };

  const signOut = async () => {
    setUser(null);
    router.push('/auth/signin');
  };

  return {
    user,
    loading,
    signIn,
    signOut,
  };
}