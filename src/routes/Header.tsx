import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import styles from './Header.module.less';
import { FishSymbol, House, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const { activeAccount, handleLogout, isLoggedIn } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <NavLink to="/" className={styles.logo} onClick={closeMenu}>
          {isLoggedIn ? <House /> : <div className={styles.fishLogo}><FishSymbol /></div>}
        </NavLink>
        <button onClick={toggleMenu} className={styles.menuButton}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
        <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
          {isLoggedIn ? (
            <>
              <span className={styles.activeAccount}>
                {activeAccount ? activeAccount.name : 'No active account'}
              </span>
              <NavLink to="/account-management" className={styles.navLink} onClick={closeMenu}>
                Accounts
              </NavLink>
              <button onClick={() => { handleLogout(); closeMenu(); }} className={styles.logoutButton}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className={styles.navLink} onClick={closeMenu}>
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;