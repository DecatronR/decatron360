import axios from "axios";

export const markNotificationAsRead = async (notificationId) => {
  const token = sessionStorage.getItem("token");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  try {
    const response = await axios.patch(
      `${baseUrl}/notification/${notificationId}/read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};
