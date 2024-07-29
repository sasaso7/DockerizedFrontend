import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { Account } from "@/services/api/api.types";
import { useDashboardStore } from "../dashboard/useDashboardStore";
import CreateAccount from "./CreateAccount";

const AccountManagement: React.FC = () => {
  const { userData, refreshUserData } = useDashboardStore();
  const { setActiveAccount, activeAccount } = useAuthStore();
  const navigate = useNavigate();
  const [showCreateAccount, setShowCreateAccount] = useState(false);

  if (!userData) {
    return <div>Loading user data...</div>;
  }

  const handleAccountClick = (account: Account) => {
    setActiveAccount(account);
  };

  const handleCreateAccountSuccess = () => {
    refreshUserData();
    setShowCreateAccount(false);
  };

  return (
    <div>
      <h1>Account Management</h1>
      <h2>Your Accounts:</h2>
      {userData.accounts.length > 0 ? (
        <ul>
          {userData.accounts.map((account) => (
            <li
              key={account.id}
              onClick={() => handleAccountClick(account)}
              style={{
                fontWeight:
                  account.id === activeAccount?.id ? "bold" : "normal",
                cursor: "pointer",
              }}
            >
              {account.name}{" "}
              {account.id === activeAccount?.id ? "(Active)" : ""}
            </li>
          ))}
        </ul>
      ) : (
        <p>No accounts found.</p>
      )}
      <button onClick={() => setShowCreateAccount(true)}>
        Create New Account
      </button>
      <button onClick={() => navigate("/dashboard")}>Back to Dashboard</button>

      {showCreateAccount && (
        <CreateAccount
          userId={userData.id}
          onSuccess={handleCreateAccountSuccess}
          onCancel={() => setShowCreateAccount(false)}
        />
      )}
    </div>
  );
};

export default AccountManagement;
