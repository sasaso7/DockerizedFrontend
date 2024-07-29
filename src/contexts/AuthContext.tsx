// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Account } from "@/services/api/api.types";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  activeAccount: Account | null;
  setActiveAccount: (account: Account | null) => void;
  handleLogout: () => void;
  checkAndRedirectIfNoAccounts: (userData: any) => void;
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

  const navigate = useNavigate();

  useEffect(() => {
    if (activeAccount) {
      localStorage.setItem(ACTIVE_ACCOUNT_KEY, JSON.stringify(activeAccount));
    } else {
      localStorage.removeItem(ACTIVE_ACCOUNT_KEY);
    }
  }, [activeAccount]);

  const handleLogout = useCallback(() => {
    setActiveAccount(null);
    localStorage.removeItem(ACTIVE_ACCOUNT_KEY);
    navigate("/login");
  }, [navigate]);

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
    },
    [navigate, activeAccount, setActiveAccount]
  );

  const value = {
    activeAccount,
    setActiveAccount,
    handleLogout,
    checkAndRedirectIfNoAccounts,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};