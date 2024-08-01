import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import styles from './Header.module.less';
import { House } from 'lucide-react';
import { isLoggedIn } from '@/services/api/api';

const Header: React.FC = () => {
  const { activeAccount, handleLogout, isLoggedIn } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <NavLink to="/" className={styles.logo}><House /></NavLink>
        <nav className={styles.nav}>
          {isLoggedIn ? (
            <>
              <span className={styles.activeAccount}>
                {activeAccount ? activeAccount.name : 'No active account'}
              </span>
              <NavLink to="/account-management" className={styles.navLink}>Accounts</NavLink>
              <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
            </>
          ) : (
            <Link to="/login" className={styles.navLink}>Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;