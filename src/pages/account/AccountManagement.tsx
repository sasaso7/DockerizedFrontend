import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Account } from "@/services/api/api.types";
import { useDashboardStore } from "../dashboard/useDashboardStore";
import CreateAccount from "./CreateAccount";
import styles from './AccountManagement.module.less';

const AccountManagement: React.FC = () => {
  const { userData, refreshUserData } = useDashboardStore();
  const { setActiveAccount, activeAccount } = useAuth();
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
      <button onClick={() => setShowCreateAccount(true)} className={styles.button}>
        Create New Account
      </button>
      <button onClick={() => navigate("/dashboard")} className={styles.button}>Back to Dashboard</button>
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
