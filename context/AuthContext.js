'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getProfile } from '../services/api';

const AuthContext = createContext(null);

// Fournisseur d'authentification global, enveloppe toute l'application
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // true tant que la vérification du token n'est pas terminée
  const router = useRouter();

  // Au chargement : vérifie si un token existe dans localStorage et le valide via l'API
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      getProfile()
        .then((data) => setUser(data.user))
        .catch(() => {
          // Token invalide ou expiré : on le supprime
          localStorage.removeItem('token');
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Stocke le token et les données utilisateur, puis redirige vers le dashboard
  const login = (userData, newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
    router.push('/dashboard');
  };

  // Supprime le token, vide l'état et redirige vers la page de connexion
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personnalisé pour accéder au contexte d'authentification depuis n'importe quel composant
export function useAuth() {
  return useContext(AuthContext);
}
