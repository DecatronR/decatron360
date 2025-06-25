import axios from "axios";

export const unregisterFcmTokenOnServer = async (userId, fcmToken) => {
  const token = sessionStorage.getItem("token");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  try {
    const response = await axios.post(
      `${baseUrl}/notification/unregister-token`,
      { userId, fcmToken },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error unregistering FCM token on server:", error);
    throw error;
  }
};
