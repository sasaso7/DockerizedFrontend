import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Account as AccountType } from "@/services/api/api.types";
import { useDashboardStore } from "../dashboard/useDashboardStore";
import CreateAccount from "./CreateAccount";
import styles from './AccountManagement.module.less';
import Account from "./Account";

const AccountManagement: React.FC = () => {
  const { userData, refreshUserData } = useDashboardStore();
  const { setActiveAccount, activeAccount } = useAuth();
  const navigate = useNavigate();
  const [showCreateAccount, setShowCreateAccount] = useState(false);

  if (!userData) {
    return <div>Loading user data...</div>;
  }

  const handleAccountClick = (account: AccountType) => {
    setActiveAccount(account);
  };

  const handleCreateAccountSuccess = () => {
    refreshUserData();
    setShowCreateAccount(false);
  };

  return (
    <div>
      {userData.accounts.length > 0 ? (
        <div className={styles.flexGrid}>
          {userData.accounts.map((account) => (
            <Account account={account} onClick={() => handleAccountClick(account)} key={account.id} selected={account.id == activeAccount?.id} />
          ))}
        </div>
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
