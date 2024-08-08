// src/stores/useAuthStore.ts
import { useState } from "react";
import { useRequest } from "ahooks";
import { login, register } from "@/services/api/api";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const useAuthStore = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const {
    activeAccount,
    handleLogout,
    checkAndRedirectIfNoAccounts,
    isLoggedIn,
    setIsLoggedIn,
  } = useAuth();
  const navigate = useNavigate();

  const loginRequest = useRequest(login, {
    manual: true,
    onSuccess: () => {
      setLoginError(null);
      setIsLoggedIn(true); // Set isLoggedIn to true on successful login
      navigate("/dashboard");
    },
    onError: (error) => {
      setLoginError(error.message || "Login failed. Please try again.");
      setIsLoggedIn(false); // Ensure isLoggedIn is false on login failure
    },
  });

  const registerRequest = useRequest(register, {
    manual: true,
    onSuccess: () => {
      setRegisterError(null);
      setIsLoggedIn(true); // Set isLoggedIn to true on successful registration
      navigate("/dashboard");
    },
    onError: (error) => {
      setRegisterError(
        error.message || "Registration failed. Please try again."
      );
      setIsLoggedIn(false); // Ensure isLoggedIn is false on registration failure
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
    isLoggedIn,
    setIsLoggedIn,
  };
};
