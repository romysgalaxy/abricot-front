'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { updateProfile, updatePassword } from '../../../services/api';
import styles from './Account.module.css';

// Page Mon Compte : modification du profil (nom, email) et du mot de passe
export default function Account() {
  const { user, setUser, logout } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Pré-remplit les champs avec les données actuelles de l'utilisateur
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  // Envoie la mise à jour du profil à l'API et met à jour le contexte auth
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    setProfileLoading(true);
    try {
      const data = await updateProfile({ name: name.trim(), email: email.trim() });
      setUser(data.user);
      setProfileSuccess('Informations mises à jour avec succès');
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setProfileLoading(false);
    }
  };

  // Vérifie la correspondance des mots de passe puis envoie le changement à l'API
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    if (newPassword !== confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas');
      return;
    }
    setPasswordLoading(true);
    try {
      await updatePassword(currentPassword, newPassword);
      setPasswordSuccess('Mot de passe mis à jour avec succès');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className={styles['account']}>
      <div className={styles['account-card']}>
        <h1 className={styles['account-title']}>Mon compte</h1>
        <p className={styles['account-subtitle']}>{user?.name || user?.email || ''}</p>

        <form className={styles['account-form']} onSubmit={handleProfileSubmit}>
          <div className={styles['account-field']}>
            <label className={styles['account-label']} htmlFor="name">Nom</label>
            <input
              id="name"
              className={styles['account-input']}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Votre nom"
            />
          </div>

          <div className={styles['account-field']}>
            <label className={styles['account-label']} htmlFor="email">Email</label>
            <input
              id="email"
              className={styles['account-input']}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre email"
              required
            />
          </div>

          {profileError && <p className={styles['account-error']}>{profileError}</p>}
          {profileSuccess && <p className={styles['account-success']}>{profileSuccess}</p>}

          <button className={styles['account-submit']} type="submit" disabled={profileLoading}>
            {profileLoading ? 'Enregistrement...' : 'Modifier les informations'}
          </button>
        </form>
      </div>

      <div className={styles['account-card']}>
        <h2 className={styles['account-title']}>Changer le mot de passe</h2>

        <form className={styles['account-form']} onSubmit={handlePasswordSubmit}>
          <div className={styles['account-field']}>
            <label className={styles['account-label']} htmlFor="currentPassword">Mot de passe actuel</label>
            <input
              id="currentPassword"
              className={styles['account-input']}
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          <div className={styles['account-field']}>
            <label className={styles['account-label']} htmlFor="newPassword">Nouveau mot de passe</label>
            <input
              id="newPassword"
              className={styles['account-input']}
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className={styles['account-field']}>
            <label className={styles['account-label']} htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <input
              id="confirmPassword"
              className={styles['account-input']}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {passwordError && <p className={styles['account-error']}>{passwordError}</p>}
          {passwordSuccess && <p className={styles['account-success']}>{passwordSuccess}</p>}

          <button className={styles['account-submit']} type="submit" disabled={passwordLoading}>
            {passwordLoading ? 'Enregistrement...' : 'Changer le mot de passe'}
          </button>
        </form>
      </div>

      <div className={styles['account-card']}>
        <h2 className={styles['account-title']}>Déconnexion</h2>
        <p className={styles['account-subtitle']}>Vous serez redirigé vers la page de connexion.</p>
        <button className={styles['account-logout']} onClick={logout}>
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
