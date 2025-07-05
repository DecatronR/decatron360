import axios from "axios";

export const clearAllNotifications = async (userId) => {
  const token = sessionStorage.getItem("token");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  try {
    const response = await axios.delete(
      `${baseUrl}/notification/clear/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error clearing all notifications:", error);
    throw error;
  }
};
