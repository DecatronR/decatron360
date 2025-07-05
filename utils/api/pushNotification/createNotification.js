import axios from "axios";

export const createNotification = async (notificationData) => {
  const token = sessionStorage.getItem("token");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  try {
    const response = await axios.post(
      `${baseUrl}/notification`,
      notificationData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};
