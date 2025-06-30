import axios from "axios";

export const deleteNotification = async (notificationId) => {
  const token = sessionStorage.getItem("token");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  try {
    const response = await axios.delete(
      `${baseUrl}/notifications/${notificationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
};
