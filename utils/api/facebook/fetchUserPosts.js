import axios from "axios";

export const fetchUserPosts = async (accessToken) => {
  try {
    const res = await axios.get(`https://graph.facebook.com/v21.0/me/posts`, {
      params: {
        fields: "id,message,created_time,attachments",
        access_token: accessToken,
      },
    });
    return res.data.data;
  } catch (error) {
    console.error(
      "Failed to fetch user posts:",
      error.res?.data || error.message
    );
    throw error;
  }
};
