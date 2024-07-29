import { useRequest } from "ahooks";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import useCounter from "@/hooks/use-counter";

export const useStore = () => {
  const { count, increment } = useCounter(0);

  const [name, setName] = useState<string>();

  const navigate = useNavigate();

  const onBack = () => navigate("/");


  return {
    name,
    count,
    onBack,
    increment,
  };
};
