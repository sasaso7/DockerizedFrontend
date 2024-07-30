import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";
import styles from './Auth.module.less';

export const Register: React.FC = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    handleRegister,
    registerLoading,
    registerError,
    setRegisterError,
  } = useAuthStore();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleRegister();
  };

  return (
    <div className={styles.center}>
      <form onSubmit={onSubmit} className={styles.formStyle}>
        {registerError && (
          <div style={{ color: "red", marginBottom: "10px" }}>
            {registerError}
          </div>
        )}
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setRegisterError(null); // Clear error when user starts typing
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
            setRegisterError(null); // Clear error when user starts typing
          }}
          placeholder="Password"
          required
          className={styles.input}
        />
        <button type="submit" disabled={registerLoading} className={styles.button}>
          {registerLoading ? "Registering..." : "Register"}
        </button>
      </form>
      <p>
        Already have an account? <Link to="/">Login here</Link>
      </p>
    </div>
  );
};
