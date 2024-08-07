import { Account as AccountType } from "@/services/api/api.types";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDashboardStore } from "./useDashboardStore";
import { useAuthStore } from "@/stores/useAuthStore"; // Import useAuthStore
import Account from "../account/Account";
import styles from './Dashboard.module.less';
import Kanye from "/kanye.svg";
import NavigationDiv from "@/components/NavigationDiv";
import { BadgeHelp } from "lucide-react";

const Dashboard: React.FC = () => {
  const { userData, loading, error, refreshUserData } = useDashboardStore();
  const { handleLogout, checkAndRedirectIfNoAccounts } = useAuthStore(); // Get the logout function from useAuthStore
  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
      checkAndRedirectIfNoAccounts(userData);
    }
  }, [userData, checkAndRedirectIfNoAccounts]);

  const handleKanyeClick = () => {
    navigate("/kanye-quote");
  }
  const handleFactClick = () => {
    navigate("/random-fact");
  }



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

  return (
    <div className={styles.dashboardContainer}>
      <NavigationDiv width="15%" image={Kanye} hoverText="Quotes by Kanye West are brought into real life pictures!" onClick={handleKanyeClick} />
      <NavigationDiv width="15%" image={BadgeHelp} hoverText="Expand your knowledge with random facts" onClick={handleFactClick} />
    </div>
  );
};

export default Dashboard;