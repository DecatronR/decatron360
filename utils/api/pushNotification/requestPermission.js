import { getToken } from "firebase/messaging";
import { messaging } from "config/firebaseConfig";
import axios from "axios";

export const requestAndSendNotificationPermission = async (userId) => {
  const token = sessionStorage.getItem("token");

  if (!token) {
    console.error("User is not authenticated");
    return;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const fcmToken = await getToken(messaging, {
        vapidKey:
          "BGAq-sbSTG7pHkYNSZHCB_cR3OEbLQ_6Q1U7J8QJYDsN4yD3eLP0iB6Et0zbJene7bLCOmI4XgyUiggcz0r4Mis", //safe to expose
      });

      console.log("FCM Token:", fcmToken);

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const response = await axios.post(
        `${baseUrl}/users/update-fcm-token`,
        { userId, fcmToken },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Token saved successfully:", response.data);
      return fcmToken;
    } else {
      console.warn("Permission not granted for notifications");
    }
  } catch (error) {
    console.error("Error getting permission or token", error);
  }
};
