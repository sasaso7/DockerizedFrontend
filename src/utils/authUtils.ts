let logoutHandler: (() => Promise<void>) | null = null;

export const setLogoutHandler = (handler: () => Promise<void>) => {
  logoutHandler = handler;
};

export const getLogoutHandler = () => {
  if (!logoutHandler) {
    throw new Error("Logout handler not set");
  }
  return logoutHandler;
};
