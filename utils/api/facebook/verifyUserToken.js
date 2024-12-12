import axios from "axios";

export const verifyUserToken = async ({ userToken }) => {
  const appId = process.env.NEXT_PUBLIC_FB_APP_ID;
  const appSecret = process.env.NEXT_PUBLIC_FB_APP_SECRET;

  try {
    const appAccessToken = `${appId}|${appSecret}`;
    const res = await axios.get(
      `https://graph.facebook.com/debug_token?` +
        `input_token=${userToken}` +
        `&access_token=${appAccessToken}`
    );

    return res.data.data; // Contains details like is_valid, expires_at, scopes, etc.
  } catch (error) {
    console.error("Failed to verify fb token:", error);
    throw error;
  }
};
