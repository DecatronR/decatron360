import axios from "axios";

export const fetchUserToken = async ({ authCode }) => {
  const appId = process.env.NEXT_PUBLIC_FB_APP_ID;
  const domainUrl = process.env.NEXT_PUBLIC_DOMAIN;
  const appSecret = process.env.NEXT_PUBLIC_FB_APP_SECRET;

  try {
    const res = await axios.get(
      `https://graph.facebook.com/v21.0/oauth/access_token?` +
        `client_id=${appId}` +
        `&redirect_uri=${encodeURIComponent(
          domainUrl
        )}/properties/add/facebook` +
        `&client_secret=${appSecret}` +
        `&code=${authCode}`
    );

    return res.data.access_token;
  } catch (error) {
    if (error.response.data.error.code === 100) {
      // If authorization code has been used, return an error message
      throw new Error("Authorization code has already been used.");
    } else {
      console.error("Failed to get fb token:", error);
      throw error;
    }
  }
};
