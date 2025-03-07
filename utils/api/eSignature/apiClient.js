const SIGN_URL = "https://sign.zoho.com/api/v1";

// Access token (Replace with your OAuth token retrieval logic)
const ACCESS_TOKEN = "YOUR_ACCESS_TOKEN";

export const apiClient = axios.create({
  baseURL: SIGN_URL,
  headers: {
    Authorization: `Zoho-oauthtoken ${ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  },
});
