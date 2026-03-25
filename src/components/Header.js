import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

function getInitials(user) {
  if (user.name) {
    return user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  }
  return user.email.slice(0, 2).toUpperCase();
}

function Header() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { user } = useAuth();

  const initials = user ? getInitials(user) : '??';

  return (
    <header className="header">
      <div className="header-content">
        <img src={`${process.env.PUBLIC_URL}/Logo.png`} alt="Abricot" className="header-logo" />
        <nav className="header-nav">
          <Link
            to="/dashboard"
            className={`nav-item ${currentPath === '/dashboard' ? 'nav-item--active' : ''}`}
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
            to="/projects"
            className={`nav-item ${currentPath.startsWith('/projects') ? 'nav-item--active' : ''}`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 4L1 13C1 13.5523 1.44772 14 2 14H14C14.5523 14 15 13.5523 15 13V6C15 5.44772 14.5523 5 14 5H8L6.5 3H2C1.44772 3 1 3.44772 1 4Z" fill="currentColor"/>
            </svg>
            Projets
          </Link>
        </nav>
        <Link
          to="/account"
          className={`header-avatar ${currentPath === '/account' ? 'header-avatar--active' : ''}`}
        >{initials}</Link>
      </div>
    </header>
  );
}

export default Header;
