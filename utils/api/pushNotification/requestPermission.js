// utils/requestPermission.ts
import { getToken } from "firebase/messaging";
import { messaging } from "../firebase/firebase-config";

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: "YOUR_PUBLIC_VAPID_KEY",
      });

      console.log("FCM Token:", token);

      // Send token to backend here
      await fetch("/api/save-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      return token;
    } else {
      console.warn("Permission not granted for notifications");
    }
  } catch (error) {
    console.error("Error getting permission or token", error);
  }
};
