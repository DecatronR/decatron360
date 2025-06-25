import axios from "axios";

export const sendNotification = async ({ fcmToken, title, body }) => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    console.error("User is not authenticated");
    return;
  }
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await axios.post(
      `${baseUrl}/notification/send-notification`,
      { fcmToken, title, body },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
};
