import React, { useState, useEffect, useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Login } from "@/pages/auth/Login";
import { Register } from "@/pages/auth/Register";
import Dashboard from "@/pages/dashboard/Dashboard";
import AccountManagement from "@/pages/account/AccountManagement";
import Layout from "./Layout";
import { withAuth } from "@/services/withAuth";
import { isLoggedIn } from "@/services/api/api";
import KanyeQuotePage from "@/pages/action-pages/KanyeQuotePage";
import { useAuth } from "../contexts/AuthContext";

const ProtectedDashboard = withAuth(Dashboard);
const ProtectedAccountManagement = withAuth(AccountManagement);

export const Router = () => {
  const { isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Or your custom loading component
  }

  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedDashboard />} />
        <Route path="/account-management" element={<ProtectedAccountManagement />} />
        <Route path="/kanye-quote" element={<KanyeQuotePage />} />
      </Routes>
    </Layout>
  );
};