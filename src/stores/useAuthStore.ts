import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRequest } from "ahooks";
import { login, logout, register } from "@/services/api/api";
import { Account } from "@/services/api/api.types";

const ACTIVE_ACCOUNT_KEY = "activeAccount";

export const useAuthStore = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);
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

  const loginRequest = useRequest(login, {
    manual: true,
    onSuccess: () => {
      setLoginError(null);
      navigate("/dashboard");
    },
    onError: (error) => {
      setLoginError(error.message || "Login failed. Please try again.");
    },
  });

  const registerRequest = useRequest(register, {
    manual: true,
    onSuccess: () => {
      setRegisterError(null);
      navigate("/dashboard");
    },
    onError: (error) => {
      setRegisterError(
        error.message || "Registration failed. Please try again."
      );
    },
  });

  const handleLogin = () => {
    setLoginError(null);
    loginRequest.run({ email, password });
  };

  const handleRegister = () => {
    setRegisterError(null);
    registerRequest.run({ email, password });
  };

  const handleLogout = () => {
    logout();
    setActiveAccount(null);
    localStorage.removeItem(ACTIVE_ACCOUNT_KEY);
    navigate("/login");
  };

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
          // If no active account or the active account is not in the user's accounts, set the first account as active
          setActiveAccount(userData.accounts[0]);
        }
      }
    },
    [navigate, activeAccount, setActiveAccount]
  );

  return {
    email,
    setEmail,
    password,
    setPassword,
    handleLogin,
    handleRegister,
    handleLogout,
    loginLoading: loginRequest.loading,
    registerLoading: registerRequest.loading,
    loginError,
    setLoginError,
    registerError,
    setRegisterError,
    activeAccount,
    setActiveAccount,
    checkAndRedirectIfNoAccounts,
  };
};
