'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

// Protège les pages privées : redirige vers /login si l'utilisateur n'est pas connecté
export function PrivateGuard({ children }) {
  const { token, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !token) {
      router.replace('/login');
    }
  }, [token, loading, router]);

  if (loading || !token) return null;
  return children;
}

// Protège les pages publiques (login/signup) : redirige vers /dashboard si déjà connecté
export function PublicGuard({ children }) {
  const { token, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && token) {
      router.replace('/dashboard');
    }
  }, [token, loading, router]);

  if (loading || token) return null;
  return children;
}
