import React from "react";
import { Link } from "react-router-dom";
import styles from './Auth.module.less';

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
    <div className={styles.center}>
      <form onSubmit={onSubmit} className={styles.formStyle}>
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
          className={styles.input}
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
          className={styles.input}
        />
        <button type="submit" disabled={loginLoading} className={styles.button}>
          {loginLoading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};
