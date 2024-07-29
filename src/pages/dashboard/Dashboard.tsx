import { Account } from "@/services/api/api.types";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDashboardStore } from "./useDashboardStore";
import { useAuthStore } from "@/stores/useAuthStore"; // Import useAuthStore
import CreateAccount from "../account/CreateAccount";

const Dashboard: React.FC = () => {
  const { userData, loading, error, refreshUserData } = useDashboardStore();
  const { handleLogout, checkAndRedirectIfNoAccounts } = useAuthStore(); // Get the logout function from useAuthStore
  const navigate = useNavigate();
  const [showCreateAccount, setShowCreateAccount] = React.useState(false);

  useEffect(() => {
    if (userData) {
      checkAndRedirectIfNoAccounts(userData);
    }
  }, [userData, checkAndRedirectIfNoAccounts]);

  if (loading) {
    return <div>Loading...</div>;
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

  const handleAccountClick = (account: Account) => {
    navigate(`/account/${account.id}`, { state: { account } });
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {userData.email}!</p>
      <p>Your favorite animal: {userData.favoriteAnimal}</p>
      <h2>Your Accounts:</h2>
      {userData.accounts.length > 0 ? (
        <ul>
          {userData.accounts.map((account) => (
            <li key={account.id} onClick={() => handleAccountClick(account)}>
              {account.name}
            </li>
          ))}
        </ul>
      ) : (
        <p>No accounts found.</p>
      )}
      <button onClick={refreshUserData}>Refresh Data</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
