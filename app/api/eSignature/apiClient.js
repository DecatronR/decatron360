import axios from "axios";
import { getAccessToken, getStoredAccessToken } from "./zohoAuth";

const SIGN_URL = "https://sign.zoho.com/api/v1";

// Create an Axios instance
const apiClient = axios.create({
  baseURL: SIGN_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Axios Request Interceptor: Attach access token
apiClient.interceptors.request.use(
  async (config) => {
    let token = getStoredAccessToken(); // Get token from memory

    if (!token) {
      token = await getAccessToken(); // Fetch new token if missing
    }

    config.headers.Authorization = `Zoho-oauthtoken ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Axios Response Interceptor: Refresh token on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.log("Token Expired! Refreshing...");
      const newToken = await getAccessToken(); // Refresh token
      error.config.headers.Authorization = `Zoho-oauthtoken ${newToken}`;
      return axios(error.config); // Retry request with new token
    }
    return Promise.reject(error);
  }
);

export default apiClient;
