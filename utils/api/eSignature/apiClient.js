import axios from "axios";
import { getAccessToken } from "./zohoAuth";

const SIGN_URL = "https://sign.zoho.com/api/v1";

// Create an Axios instance
const apiClient = axios.create({
  baseURL: SIGN_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Axios Interceptor: Automatically refresh token on 401
apiClient.interceptors.request.use(
  async (config) => {
    if (!accessToken) {
      accessToken = await getAccessToken(); // Get new token if not set
    }
    config.headers.Authorization = `Zoho-oauthtoken ${accessToken}`;
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.log("🔄 Token Expired! Refreshing...");
      accessToken = await getAccessToken();
      error.config.headers.Authorization = `Zoho-oauthtoken ${accessToken}`;
      return axios(error.config);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
