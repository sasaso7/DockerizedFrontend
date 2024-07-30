import { Account as AccountType, Activity } from "@/services/api/api.types";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { getAccountActivites } from "@/services/api/api";

interface AccountProps {
  account: AccountType;
}

const Account: React.FC<AccountProps> = ({ account }) => {
  const { activeAccount } = useAuthStore();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const accountActivities = await getAccountActivites(account.id);
        setActivities(accountActivities);
        setError(null);
      } catch (err) {
        setError("Failed to fetch account activities");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [account.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={() => getAccountActivites(account.id, true)}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="Account">
      <p>{account.name}</p>
      {activities.length > 0 ? (
        <div>
          {activities.map((activity) => (
            <div key={activity.id}>
              <h3>{activity.name}</h3>
              <p>Description: {activity.description}</p>
              <p>Created: {new Date(activity.createDate).toLocaleString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No activities found for this account.</p>
      )}
    </div>
  );
};

export default Account;
