// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Account } from "@/services/api/api.types";
import { useNavigate } from "react-router-dom";
import { setLogoutHandler } from '@/utils/authUtils';

interface AuthContextType {
  activeAccount: Account | null;
  setActiveAccount: (account: Account | null) => void;
  handleLogout: () => void;
  checkAndRedirectIfNoAccounts: (userData: any) => void;
  setIsLoggedIn: (account: boolean) => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const ACTIVE_ACCOUNT_KEY = "activeAccount";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeAccount, setActiveAccount] = useState<Account | null>(() => {
    const savedAccount = localStorage.getItem(ACTIVE_ACCOUNT_KEY);
    return savedAccount ? JSON.parse(savedAccount) : null;
  });

  // Add this new state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (activeAccount) {
      localStorage.setItem(ACTIVE_ACCOUNT_KEY, JSON.stringify(activeAccount));
    } else {
      localStorage.removeItem(ACTIVE_ACCOUNT_KEY);
    }
  }, [activeAccount]);

  // Add this new effect
  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn.toString());
  }, [isLoggedIn]);

  const handleLogout = useCallback(async () => {
    setActiveAccount(null);
    setIsLoggedIn(false);
    localStorage.removeItem(ACTIVE_ACCOUNT_KEY);
    localStorage.removeItem('isLoggedIn');
    navigate("/login");
  }, [navigate]);

  useEffect(() => {
    setLogoutHandler(handleLogout);
  }, [handleLogout]);

  const checkAndRedirectIfNoAccounts = useCallback(
    (userData: any) => {
      if (userData && userData.accounts.length === 0) {
        navigate("/account-management");
      } else if (userData && userData.accounts.length > 0) {
        if (
          !activeAccount ||
          !userData.accounts.some(
            (account: { id: string }) => account.id === activeAccount.id
          )
        ) {
          setActiveAccount(userData.accounts[0]);
        }
      }
      setIsLoggedIn(true);  // Add this line
    },
    [navigate, activeAccount, setActiveAccount]
  );

  const value = {
    activeAccount,
    setActiveAccount,
    isLoggedIn,
    setIsLoggedIn,
    handleLogout,
    checkAndRedirectIfNoAccounts,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;