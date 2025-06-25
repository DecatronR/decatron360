"use client";
import { useEffect } from "react";
import { useSnackbar } from "notistack";
import { onMessage } from "firebase/messaging";
import { messaging } from "lib/firebase";
import { useRouter } from "next/navigation";

const NotificationListener = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();

  useEffect(() => {
    if (!messaging) return;

    const unsubscribe = onMessage(messaging, (payload) => {
      // Always use route from payload.data.route if present
      const route = payload.data?.route || getRouteFromType(payload.data?.type);
      enqueueSnackbar(
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            closeSnackbar();
            if (route) router.push(route);
          }}
        >
          <strong>{payload.notification?.title}</strong>
          <div>{payload.notification?.body}</div>
        </div>,
        {
          variant: "info",
          autoHideDuration: 8000,
        }
      );
    });

    return () => {
      unsubscribe(); // Cleanup listener on unmount
    };
  }, [enqueueSnackbar, closeSnackbar, router]);

  // Helper: fallback if route is not provided
  function getRouteFromType(type) {
    switch (type) {
      case "inspection":
        return "/my-inspections";
      case "payment":
        return "/payments";
      // Add more cases as needed
      default:
        return "/";
    }
  }

  return null; // This component doesn't render any UI itself
};

export default NotificationListener;
