import axios from "axios";

export const getUserFacebookProfile = async (facebookToken) => {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/me?access_token=${facebookToken}`
    );
    console.log("Facebook profile data:", response.data);
    return response.data; // You can return the profile data to display it in your UI
  } catch (error) {
    console.error(
      "Error fetching Facebook profile:",
      error.response?.data || error.message
    );
    throw error; // Handle the error appropriately
  }
};
