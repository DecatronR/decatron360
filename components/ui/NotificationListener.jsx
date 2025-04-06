"use client";
import { useEffect } from "react";
import { useSnackbar } from "notistack";
import { onMessage } from "firebase/messaging";
import { messaging } from "config/firebaseConfig";

const NotificationListener = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar(); // Snackbar methods

  useEffect(() => {
    if (!messaging) return;

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("[Foreground] Message received:", payload);

      // Show notification using SnackbarProvider
      enqueueSnackbar(payload.notification?.title, {
        variant: "info", // Choose variant (success, error, info, etc.)
        action: (key) => (
          <button
            onClick={() => closeSnackbar(key)} // Close notification on button click
            style={{ color: "white", fontWeight: "bold" }}
          >
            Close
          </button>
        ),
      });
    });

    return () => {
      unsubscribe(); // Cleanup listener on unmount
    };
  }, [enqueueSnackbar, closeSnackbar]);

  return null; // This component doesn't render any UI itself
};

export default NotificationListener;
