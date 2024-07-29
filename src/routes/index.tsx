import { Route, Routes } from "react-router-dom";

import { Demo } from "@/pages/demo/demo";
import { Login } from "@/pages/auth/Login";
import { Register } from "@/pages/auth/Register";
import Dashboard from "@/pages/dashboard/Dashboard";
import AccountManagement from "@/pages/account/AccountManagement";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/account-management" element={<AccountManagement />} />
    </Routes>
  );
};
