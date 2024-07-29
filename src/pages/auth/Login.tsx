import React from "react";
import { Link } from "react-router-dom";

import { useAuthStore } from "../../stores/useAuthStore";

export const Login: React.FC = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    handleLogin,
    loginLoading,
    loginError,
    setLoginError,
  } = useAuthStore();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <h2>Login</h2>
        {loginError && (
          <div style={{ color: "red", marginBottom: "10px" }}>{loginError}</div>
        )}
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setLoginError(null); // Clear error when user starts typing
          }}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setLoginError(null); // Clear error when user starts typing
          }}
          placeholder="Password"
          required
        />
        <button type="submit" disabled={loginLoading}>
          {loginLoading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};
