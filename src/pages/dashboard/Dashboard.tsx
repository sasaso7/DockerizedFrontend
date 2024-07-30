import { Account as AccountType } from "@/services/api/api.types";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDashboardStore } from "./useDashboardStore";
import { useAuthStore } from "@/stores/useAuthStore"; // Import useAuthStore
import Account from "./Account";
import styles from './Dashboard.module.less';

const Dashboard: React.FC = () => {
  const { userData, loading, error, refreshUserData } = useDashboardStore();
  const { handleLogout, checkAndRedirectIfNoAccounts } = useAuthStore(); // Get the logout function from useAuthStore
  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
      checkAndRedirectIfNoAccounts(userData);
    }
  }, [userData, checkAndRedirectIfNoAccounts]);


  if (loading) {
    return <div>Loading... DASHBOARD</div>;
  }

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={refreshUserData}>Try Again</button>
      </div>
    );
  }

  if (!userData) {
    return <div>No user data available.</div>;
  }

  return (
    <div>
      {userData.accounts.length > 0 ? (
        <div className={styles.flexGrid}>
          {userData.accounts.map((account) => (
            <Account account={account} key={account.id}/>
          ))}
        </div>
      ) : (
        <p>No accounts found.</p>
      )}
      <button onClick={refreshUserData} className={styles.refreshButton}>Refresh Data</button>
      <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
    </div>
  );
};

export default Dashboard;