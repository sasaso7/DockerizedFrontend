import { Account as AccountType, Activity } from "@/services/api/api.types";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { getAccountActivites } from "@/services/api/api";
import styles from "./AccountManagement.module.less";
import { CircleCheck } from "lucide-react";

interface AccountProps {
  account: AccountType;
  selected: boolean;
  onClick?: () => void;
}

const Account: React.FC<AccountProps> = ({ account, onClick, selected }) => {
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
    <div className={styles.Account} id={selected ? styles.chosen : undefined} onClick={() => onClick ? onClick() : null}>
      {selected ? <div className={styles.tick}><CircleCheck /></div> : null}
      <p>{account.name}</p>
      {activities.length > 0 ? (
        <div>
          {activities
            .sort((a, b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime())
            .slice(0, 3)
            .map((activity) => (
              <div key={activity.id}>
                <h3>{activity.name}</h3>
                <p>Description: {activity.description}</p>
                <p>Created: {new Date(activity.createDate).toLocaleString()}</p>
              </div>
            ))}
        </div>
      ) : (
        <p>No activities found for this account.</p>
      )
      }
    </div >
  );
};

export default Account;
