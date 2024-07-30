import React, { useState } from "react";
import { useRequest } from "ahooks";
import { createAccount } from "@/services/api/api";
import styles from './AccountManagement.module.less';

interface CreateAccountProps {
  userId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const CreateAccount: React.FC<CreateAccountProps> = ({
  userId,
  onSuccess,
  onCancel,
}) => {
  const [name, setName] = useState("");

  const { run: runCreateAccount, loading } = useRequest(createAccount, {
    manual: true,
    onSuccess: () => {
      onSuccess();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runCreateAccount({ name, userId });
  };

  return (
    <div>
      <h2>Create New Account</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Account Name"
          required
        />
        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? "Creating..." : "Create Account"}
        </button>
        <button type="button" onClick={onCancel} disabled={loading} className={styles.button}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default CreateAccount;
