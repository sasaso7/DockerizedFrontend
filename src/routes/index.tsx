import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Login } from "@/pages/auth/Login";
import { Register } from "@/pages/auth/Register";
import Dashboard from "@/pages/dashboard/Dashboard";
import AccountManagement from "@/pages/account/AccountManagement";
import Layout from "./Layout";
import { withAuth } from "@/services/withAuth";
import { isLoggedIn } from "@/services/api/api";

const ProtectedDashboard = withAuth(Dashboard);
const ProtectedAccountManagement = withAuth(AccountManagement);

export const Router = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const loggedIn = await isLoggedIn();
      setIsAuthenticated(loggedIn);
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Or your custom loading component
  }

  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedDashboard />} />
        <Route path="/account-management" element={<ProtectedAccountManagement />} />
      </Routes>
    </Layout>
  );
};
