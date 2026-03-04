import axios from "axios";
import TokenService from "./TokenService";
import { LOGIN_URL } from "../../urlConfig";

const axiosInstance = axios.create();

// ── Request interceptor: attach access token to every request ────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token = TokenService.getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: silently refresh on 401 ────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt a refresh once per request (avoid infinite loops)
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      // Try to get a new access token using the refresh token cookie
      const newAccessToken = await TokenService.refreshToken();

      if (newAccessToken) {
        // Update the Authorization header and retry the original request
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      }

      // Refresh also failed — clear all tokens and send user to login
      TokenService.clearAll();
      window.location.href = LOGIN_URL;
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
