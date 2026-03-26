'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import styles from './Header.module.css';

function getInitials(user) {
  if (user.name) {
    return user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  }
  return user.email.slice(0, 2).toUpperCase();
}

function Header() {
  const currentPath = usePathname();
  const { user } = useAuth();

  const initials = user ? getInitials(user) : '??';

  return (
    <header className={styles['header']}>
      <div className={styles['header-content']}>
        <img src="/Logo.png" alt="Abricot" className={styles['header-logo']} />
        <nav className={styles['header-nav']}>
          <Link
            href="/dashboard"
            className={`${styles['nav-item']} ${currentPath === '/dashboard' ? styles['nav-item--active'] : ''}`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="1" width="6" height="6" rx="1" fill="currentColor"/>
              <rect x="9" y="1" width="6" height="6" rx="1" fill="currentColor"/>
              <rect x="1" y="9" width="6" height="6" rx="1" fill="currentColor"/>
              <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor"/>
            </svg>
            Tableau de bord
          </Link>
          <Link
            href="/projects"
            className={`${styles['nav-item']} ${currentPath.startsWith('/projects') ? styles['nav-item--active'] : ''}`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 4L1 13C1 13.5523 1.44772 14 2 14H14C14.5523 14 15 13.5523 15 13V6C15 5.44772 14.5523 5 14 5H8L6.5 3H2C1.44772 3 1 3.44772 1 4Z" fill="currentColor"/>
            </svg>
            Projets
          </Link>
        </nav>
        <Link
          href="/account"
          className={`${styles['header-avatar']} ${currentPath === '/account' ? styles['header-avatar--active'] : ''}`}
        >{initials}</Link>
      </div>
    </header>
  );
}

export default Header;
