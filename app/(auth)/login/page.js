'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { loginUser } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { PublicGuard } from '../../../components/AuthGuard';
import styles from './Login.module.css';

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await loginUser(email, password);
      login(data.user, data.token);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles['login']}>
      <div className={styles['login-left']}>
        <div className={styles['login-logo']}>
          <img src="/Logo.png" alt="Abricot" />
        </div>

        <div className={styles['login-form-container']}>
          <h1 className={styles['login-title']}>Connexion</h1>

          {error && <p className={styles['login-error']}>{error}</p>}

          <form className={styles['login-form']} onSubmit={handleSubmit}>
            <div className={styles['login-field']}>
              <label className={styles['login-label']} htmlFor="email">Email</label>
              <input
                className={styles['login-input']}
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className={styles['login-field']}>
              <label className={styles['login-label']} htmlFor="password">Mot de passe</label>
              <input
                className={styles['login-input']}
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button className={styles['login-submit']} type="submit">Se connecter</button>
          </form>

          <a href="#forgot" className={styles['login-forgot']} onClick={(e) => e.preventDefault()}>
            Mot de passe oublié?
          </a>
        </div>

        <div className={styles['login-footer']}>
          <span>Pas encore de compte ?</span>{' '}
          <Link href="/signup" className={styles['login-signup-link']}>Créer un compte</Link>
        </div>
      </div>

      <div className={styles['login-right']}>
        <img src="/log-in.jpg" alt="" className={styles['login-image']} />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <PublicGuard>
      <LoginContent />
    </PublicGuard>
  );
}
