'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { registerUser } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { PublicGuard } from '../../../components/AuthGuard';
import styles from './Signup.module.css';

function SignupContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await registerUser(email, password);
      login(data.user, data.token);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles['signup']}>
      <div className={styles['signup-left']}>
        <div className={styles['signup-logo']}>
          <img src="/Logo.png" alt="Abricot" />
        </div>

        <div className={styles['signup-form-container']}>
          <h1 className={styles['signup-title']}>Créer un compte</h1>

          {error && <p className={styles['signup-error']}>{error}</p>}

          <form className={styles['signup-form']} onSubmit={handleSubmit}>
            <div className={styles['signup-field']}>
              <label className={styles['signup-label']} htmlFor="signup-email">Email</label>
              <input
                className={styles['signup-input']}
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className={styles['signup-field']}>
              <label className={styles['signup-label']} htmlFor="signup-password">Mot de passe</label>
              <input
                className={styles['signup-input']}
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button className={styles['signup-submit']} type="submit">S&apos;inscrire</button>
          </form>
        </div>

        <div className={styles['signup-footer']}>
          <span>Déjà un compte ?</span>{' '}
          <Link href="/login" className={styles['signup-login-link']}>Se connecter</Link>
        </div>
      </div>

      <div className={styles['signup-right']}>
        <img src="/sign-in.jpg" alt="" className={styles['signup-image']} />
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <PublicGuard>
      <SignupContent />
    </PublicGuard>
  );
}
