// src/components/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import styles from './Header.module.less';

const Header: React.FC = () => {
  const { activeAccount, handleLogout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>MyApp</Link>
        <nav className={styles.nav}>
          {activeAccount ? (
            <>
              <span className={styles.activeAccount}>
                {activeAccount ? activeAccount.name : 'No active account'}
              </span>
              <Link to="/account-management" className={styles.navLink}>Accounts</Link>
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