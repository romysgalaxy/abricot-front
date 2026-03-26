'use client';

import React from 'react';
import styles from './Account.module.css';

export default function Account() {
  return (
    <div className={styles['account']}>
      <div className={styles['account-card']}>
        <h1 className={styles['account-title']}>Mon compte</h1>
        <p className={styles['account-subtitle']}>Amélie Dupont</p>

        <div className={styles['account-form']}>
          <div className={styles['account-field']}>
            <label className={styles['account-label']}>Nom</label>
            <div className={styles['account-input']}>Amélie</div>
          </div>

          <div className={styles['account-field']}>
            <label className={styles['account-label']}>Prénom</label>
            <div className={styles['account-input']}>Amélie</div>
          </div>

          <div className={styles['account-field']}>
            <label className={styles['account-label']}>Email</label>
            <div className={styles['account-input']}>a.dupont@mail.com</div>
          </div>

          <div className={styles['account-field']}>
            <label className={styles['account-label']}>Mot de passe</label>
            <div className={styles['account-input']}>●●●●●●●●●●●</div>
          </div>

          <button className={styles['account-submit']}>Modifier les informations</button>
        </div>
      </div>
    </div>
  );
}
