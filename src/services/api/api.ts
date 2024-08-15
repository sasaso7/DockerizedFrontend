import axios, { AxiosInstance } from "axios";
import * as types from "./api.types";
import { loadString, remove, saveString } from "@/utils/storage";
import { useNavigate } from "react-router-dom";
import { getLogoutHandler } from "@/utils/authUtils";
import { RandomFactResponse } from "./api.types";

const CACHE_PREFIX = "api_cache_";
const CACHE_EXPIRATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_LINK,
});

// Request interceptor
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

api.interceptors.request.use(
  async (config) => {
    if (await isLoggedIn()) {
      // Don't intercept the refresh token request or login request
      if (config.url === "/refresh" || config.url === "/login") {
        return config;
      }

      if (await isTokenExpired()) {
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            console.log("Token expired, refreshing...");
            const newToken = await refreshToken();
            isRefreshing = false;
            refreshSubscribers.forEach((callback) => callback(newToken));
            refreshSubscribers = [];
            config.headers["Authorization"] = `Bearer ${newToken}`;
          } catch (error) {
            isRefreshing = false;
            refreshSubscribers = [];

            const logout = getLogoutHandler();
            await logout(); // Force logout on refresh failure
            return Promise.reject(error);
          }
        } else {
          // Wait for the token to be refreshed
          return new Promise((resolve) => {
            refreshSubscribers.push((token) => {
              config.headers["Authorization"] = `Bearer ${token}`;
              resolve(config);
            });
          });
        }
      } else {
        const token = await loadString("accessToken");
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject({
      title: "Request Error",
      detail: error.message,
    });
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/refresh" &&
      originalRequest.url !== "/login" // Add this condition
    ) {
      originalRequest._retry = true;
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newToken = await refreshToken();
          isRefreshing = false;
          refreshSubscribers.forEach((callback) => callback(newToken));
          refreshSubscribers = [];
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          refreshSubscribers = [];

          const logout = getLogoutHandler();
          await logout(); // Force logout on refresh failure

          return Promise.reject({
            title: "Authentication Error",
            detail: "Failed to refresh authentication token",
          });
        }
      } else {
        // Wait for the token to be refreshed
        return new Promise((resolve) => {
          refreshSubscribers.push((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }
    }

    // Your existing error handling
    if (error.response) {
      return Promise.reject({
        title: "Request Failed",
        detail: error.response.data.message || "An error occurred",
      });
    } else if (error.request) {
      return Promise.reject({
        title: "No Response",
        detail: "The server did not respond to the request",
      });
    } else {
      return Promise.reject({
        title: "Request Error",
        detail: error.message,
      });
    }
  }
);
/* CACHE OPERATIONS */
const cacheData = async (key: string, data: any) => {
  const cacheItem = {
    data,
    timestamp: Date.now(),
  };
  await saveString(`${CACHE_PREFIX}${key}`, JSON.stringify(cacheItem));
};

const getCachedData = async (key: string) => {
  const cachedItem = await loadString(`${CACHE_PREFIX}${key}`);
  if (cachedItem) {
    const { data, timestamp } = JSON.parse(cachedItem);
    if (Date.now() - timestamp < CACHE_EXPIRATION) {
      return data;
    }
  }
  return null;
};

const clearCache = async () => {
  return new Promise<void>((resolve) => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    }
    resolve();
  });
};
/* CACHE OPERATIONS END */

// Function to check if token is expired or close to expiring
const isTokenExpired = async (): Promise<boolean> => {
  const expiryString = await loadString("tokenExpiry");
  if (!expiryString) return true;

  const expiry = parseInt(expiryString, 10);
  const currentTime = Date.now();

  // Consider token expired if it's within 5 minutes of expiry
  return expiry - currentTime < 5 * 60 * 1000;
};

// Function to check if user is logged in
export const isLoggedIn = async (): Promise<boolean> => {
  const token = await loadString("accessToken");
  console.log("Checking if logged in, token exists:", !!token);
  return !!token;
};

/* AUTH OPERATIONS BEGIN */
export const login = async (
  loginInfo: types.Login
): Promise<types.LoginResult> => {
  try {
    const response = await api.post<types.LoginResult>("login", loginInfo);

    console.log(response.data);

    await saveString("accessToken", response.data.accessToken);
    await saveString("refreshToken", response.data.refreshToken);
    await saveString(
      "tokenExpiry",
      (Date.now() + response.data.expiresIn * 1000).toString()
    );

    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const register = async (
  registerInfo: types.Register
): Promise<types.LoginResult> => {
  try {
    await api.post("register", registerInfo);
    // Registration successful, now attempt to log in
    console.log("Registration successful, attempting to login");

    return await login({
      email: registerInfo.email,
      password: registerInfo.password,
    });
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

const refreshToken = async (): Promise<string> => {
  try {
    console.log("Refreshing token");
    const refreshToken = await loadString("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await api.post<types.LoginResult>("/refresh", {
      refreshToken,
    });

    if (!response || !response.data) {
      throw new Error("Invalid response from server");
    }

    await saveString("accessToken", response.data.accessToken);
    await saveString("refreshToken", response.data.refreshToken);
    await saveString(
      "tokenExpiry",
      (Date.now() + response.data.expiresIn * 1000).toString()
    );

    console.log("Token refreshed successfully");
    return response.data.accessToken;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    throw error;
  }
};
/* AUTH OPERATIONS END */

/* ACCOUNT OPERATIONS BEGIN */
export const createAccount = async (
  accountInfo: types.AccountCreate
): Promise<void> => {
  try {
    await api.post("/Account", accountInfo);
    console.log("Account created successfully");
  } catch (error) {
    console.error("Account creation error:", error);
    throw error;
  }
};

export const uploadAccountPicture = async (
  params: types.AccountPictureCreate
): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append("file", params.file);

    await api.post(`/Account/${params.accountId}/UploadPicture`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Picture uploaded successfully");
  } catch (error) {
    console.error("Picture upload error:", error);
    throw error;
  }
};

export const deleteAccount = async (
  params: types.AccountDelete
): Promise<void> => {
  try {
    await api.delete(`/Account/${params.accountId}`);
    console.log("Account deleted successfully");
  } catch (error) {
    console.error("Account deletion error:", error);
    throw error;
  }
};
/* ACCOUNT OPERATIONS END */

/* USER OPERATIONS BEGIN */
export const getUser = async (
  forceRefresh = false
): Promise<types.UserResponse> => {
  if (!forceRefresh) {
    const cachedData = await getCachedData("user");
    if (cachedData) {
      return cachedData;
    }
  }

  try {
    const response = await api.get<types.FullUserResponse>("/User");

    const userData: types.UserResponse = {
      id: response.data.id,
      email: response.data.email,
      favoriteAnimal: response.data.favoriteAnimal,
      accounts: response.data.accounts || [],
    };

    await cacheData("user", userData);
    return userData;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

/* USER OPERATIONS END */

/* ACTIVITY OPERATIONS START */
export const getAccountActivites = async (
  accountId: string,
  forceRefresh = false
): Promise<types.Activity[]> => {
  if (!forceRefresh) {
    const cachedData = await getCachedData(`activities_${accountId}`);
    if (cachedData) {
      return cachedData;
    }
  }

  try {
    const response = await api.get<types.FullActivityResponse[]>(
      `/Activity/all/${accountId}`
    );

    const arrayToReturn: types.Activity[] = response.data.map((activity) => ({
      id: activity.id,
      accountId: activity.accountId,
      name: activity.name,
      description: activity.description,
      createDate: new Date(activity.created),
    }));

    await cacheData(`activities_${accountId}`, arrayToReturn);
    return arrayToReturn;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const createActivity = async (
  activityInfo: types.CreateActivity
): Promise<types.Activity> => {
  try {
    const response = await api.post<types.Activity>("/Activity", activityInfo);
    console.log("Activity created successfully");
    return response.data;
  } catch (error) {
    console.error("Activity creation error:", error);
    throw error;
  }
};
/* ACTIVITY OPERATIONS END */

/* EXTERNAL API OPERATIONS START */
export const getKanyeQuoteAndCreateActivity = async (
  params: types.KanyeQuoteRequest
): Promise<string> => {
  try {
    const response = await api.post<string>("/ExternalAPI/quote", params);
    return response.data;
  } catch (error) {
    console.error("Error fetching Kanye quote and creating activity:", error);
    throw error;
  }
};

export const getRandomFactAndCreateActivity = async (
  params: types.RandomFactRequest
): Promise<RandomFactResponse> => {
  try {
    const response = await api.post<RandomFactResponse>(
      "/ExternalAPI/randomfact",
      params
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching random fact and creating activity:", error);
    throw error;
  }
};
/* EXTERNAL API OPERATIONS END */
