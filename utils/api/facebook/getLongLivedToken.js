import axios from "axios";

export const getLongLivedToken = async ({ shortLivedToken }) => {
  const appId = process.env.NEXT_PUBLIC_FB_APP_ID;
  const appSecret = process.env.NEXT_PUBLIC_FB_APP_SECRET;

  try {
    const res = await axios.get(
      `https://graph.facebook.com/v21.0/oauth/access_token?` +
        `grant_type=fb_exchange_token` +
        `&client_id=${appId}` +
        `&client_secret=${appSecret}` +
        `&fb_exchange_token=${shortLivedToken}`
    );

    return res.data.access_token; // This is the long-lived token
  } catch (error) {
    console.error("Failed to get long-lived fb token:", error);
    throw error;
  }
};
