import axios from "axios";

export const fetchUserFacebookProfile = async (facebookToken) => {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/me?access_token=${facebookToken}`
    );
    console.log("Facebook profile data:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching Facebook profile:",
      error.response?.data || error.message
    );
    throw error;
  }
};
