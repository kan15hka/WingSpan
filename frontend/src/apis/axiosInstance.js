import axios from "axios";
import {
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
  setUserToLocalStorage,
  getTokenFromCookie,
  setTokenCookie,
  removeTokenCookie,
} from "../helper/auth";

// const API_BASE_URL = "http://127.0.0.1:5000/api";
const API_BASE_URL =
  import.meta.env.VITE_REACT_APP_API_BASE_URL || "http://127.0.0.1:5000/api";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for CORS with credentials
});

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const tokenData = JSON.parse(atob(token.split(".")[1]));
    return tokenData.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

// Request Interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = getTokenFromCookie("accessToken");

    if (accessToken && !isTokenExpired(accessToken)) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = getTokenFromCookie("refreshToken");
    const userData = getUserFromLocalStorage();

    if (
      error.response?.status === 401 &&
      refreshToken &&
      !originalRequest._retry &&
      !isTokenExpired(refreshToken)
    ) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          userData.role == "user"
            ? `${API_BASE_URL}/pass_refresh`
            : `${API_BASE_URL}/auth_refresh`,
          {},
          { headers: { Authorization: `Bearer ${refreshToken}` } }
        );

        const newAccessToken = response.data.access_token;

        // Update token in cookie
        setTokenCookie("accessToken", newAccessToken, 1);

        // Update axios headers
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        removeUserFromLocalStorage();
        removeTokenCookie("accessToken");
        removeTokenCookie("refreshToken");
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
