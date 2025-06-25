import axios from "axios";

export const fetchNotifications = async (userId) => {
  const token = sessionStorage.getItem("token");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  try {
    const response = await axios.get(
      `${baseUrl}/notification?userId=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.notifications || response.data; // Adjust based on API response
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};
