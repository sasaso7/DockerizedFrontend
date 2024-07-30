import { useState } from "react";
import { useRequest } from "ahooks";
import { getUser } from "@/services/api/api"; // Assuming this is where your getUser function is located
import { UserResponse } from "@/services/api/api.types";

export const useDashboardStore = () => {
  const [userData, setUserData] = useState<UserResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const userDataRequest = useRequest(getUser, {
    manual: false,
    onSuccess: (data) => {
      setUserData(data);
      setError(null);
    },
    onError: (error) => {
      console.error("Error fetching user data:", error);
      setError(error.message || "Failed to fetch user data. Please try again.");
    },
  });

  const refreshUserData = () => {
    setError(null);
    userDataRequest.run(true);
  };

  return {
    userData,
    loading: userDataRequest.loading,
    error,
    refreshUserData,
  };
};
