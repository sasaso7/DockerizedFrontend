// src/stores/useAuthStore.ts
import { useState } from "react";
import { useRequest } from "ahooks";
import { login, register, logout } from "@/services/api/api";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from "react-router-dom";

export const useAuthStore = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const { activeAccount, handleLogout, checkAndRedirectIfNoAccounts } = useAuth();
  const navigate = useNavigate();

  const loginRequest = useRequest(login, {
    manual: true,
    onSuccess: (userData) => {
      setLoginError(null);
      checkAndRedirectIfNoAccounts(userData);
      navigate("/dashboard");
    },
    onError: (error) => {
      setLoginError(error.message || "Login failed. Please try again.");
    },
  });

  const registerRequest = useRequest(register, {
    manual: true,
    onSuccess: (userData) => {
      setRegisterError(null);
      checkAndRedirectIfNoAccounts(userData);
      navigate("/dashboard");
    },
    onError: (error) => {
      setRegisterError(error.message || "Registration failed. Please try again.");
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
    checkAndRedirectIfNoAccounts,
  };
};