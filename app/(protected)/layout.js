'use client';

import { PrivateGuard } from '../../components/AuthGuard';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import styles from './layout.module.css';

export default function ProtectedLayout({ children }) {
  return (
    <PrivateGuard>
      <div className={styles['App']}>
        <Header />
        <main className={styles['main-content']}>
          {children}
        </main>
        <Footer />
      </div>
    </PrivateGuard>
  );
}
