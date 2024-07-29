import { Account as AccountType } from "@/services/api/api.types";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDashboardStore } from "./useDashboardStore";
import { useAuthStore } from "@/stores/useAuthStore"; // Import useAuthStore
import Account from "./Account";

const Dashboard: React.FC = () => {
  const { userData, loading, error, refreshUserData } = useDashboardStore();
  const { handleLogout, checkAndRedirectIfNoAccounts } = useAuthStore(); // Get the logout function from useAuthStore
  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
      checkAndRedirectIfNoAccounts(userData);
    }
  }, [userData, checkAndRedirectIfNoAccounts]);

  useEffect(() => {
    console.log("Dashboard mounted");
  }, []);

  useEffect(() => {
    console.log("Data changed:", { userData, loading, error });
  }, [userData, loading, error]);

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
      <p>Welcome, {userData.email}!</p>
      <p>Your favorite animal: {userData.favoriteAnimal}</p>
      <h2>Your Accounts:</h2>
      {userData.accounts.length > 0 ? (
        <ul>
          {userData.accounts.map((account) => (
            <Account account={account}/>
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