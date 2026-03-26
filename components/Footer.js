'use client';

import React from 'react';
import styles from './Footer.module.css';

function Footer() {
  return (
    <footer className={styles['footer']}>
      <div className={styles['footer-content']}>
        <img src="/Logo-black.png" alt="Abricot" className={styles['footer-logo']} />
        <div className={styles['footer-text']}>Abricot 2025</div>
      </div>
    </footer>
  );
}

export default Footer;
