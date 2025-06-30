import React, { useState, useRef, useEffect } from "react";
import { Bell, BellOff, X, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { requestAndSendNotificationPermission } from "../../utils/api/pushNotification/requestPermission";
import { fetchNotifications } from "../../utils/api/pushNotification/fetchNotifications";
import { markNotificationAsRead } from "../../utils/api/pushNotification/markNotificationAsRead";
import { unregisterFcmTokenOnServer } from "../../utils/api/pushNotification/unregisterFcmTokenOnServer";
import { useRouter } from "next/navigation";
import { messaging } from "lib/firebase";
import { SwipeableList, SwipeableListItem } from "react-swipeable-list";
import "react-swipeable-list/dist/styles.css";

// Helper to delete FCM token from client
const deleteFcmTokenLocally = async () => {
  try {
    const currentToken = sessionStorage.getItem("fcmToken");
    if (currentToken && messaging) {
      await messaging.deleteToken(currentToken);
      sessionStorage.removeItem("fcmToken");
    }
  } catch (err) {
    console.error("Error deleting FCM token locally:", err);
  }
};

const NotificationBell = ({ color = null, iconSize = "h-5 w-5" }) => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [muted, setMuted] = useState(false);
  const [permission, setPermission] = useState(
    typeof window !== "undefined" ? Notification.permission : "default"
  );
  const [loading, setLoading] = useState(false);
  const bellRef = useRef(null);
  const [error, setError] = useState("");
  const router = useRouter();
  const [expandedId, setExpandedId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Get userId from sessionStorage (or context if available)
  const userId =
    typeof window !== "undefined" ? sessionStorage.getItem("userId") : null;

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (open && userId) {
      fetchNotifications(userId)
        .then((data) => {
          // Sort by createdAt descending if present
          const sorted = Array.isArray(data)
            ? [...data].sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
              )
            : [];
          setNotifications(sorted);
        })
        .catch((err) => setError("Failed to load notifications"));
    }
  }, [open, userId]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // Set initial mute state based on Notification.permission
  useEffect(() => {
    if (typeof window !== "undefined") {
      setPermission(Notification.permission);
      setMuted(Notification.permission !== "granted");
    }
  }, []);

  useEffect(() => {
    // Detect mobile (tailwind sm: 640px)
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleToggleMute = async () => {
    setError("");
    if (muted) {
      // User wants to enable notifications
      setLoading(true);
      try {
        const token = await requestAndSendNotificationPermission(userId);
        if (token) {
          setMuted(false);
          setPermission("granted");
        } else {
          setPermission(Notification.permission);
          setMuted(true);
          setError(
            "Permission denied. Please enable notifications in your browser settings."
          );
        }
      } catch (err) {
        setError("Error enabling notifications.");
        setMuted(true);
      } finally {
        setLoading(false);
      }
    } else {
      // User wants to mute notifications
      setMuted(true);
      // Remove FCM token locally and on server
      const fcmToken = sessionStorage.getItem("fcmToken");
      await deleteFcmTokenLocally();
      if (userId && fcmToken) {
        try {
          await unregisterFcmTokenOnServer(userId, fcmToken);
        } catch (err) {
          // Optionally show error
        }
      }
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      // Optimistically update UI
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
      );
      try {
        await markNotificationAsRead(notification.id);
      } catch (err) {
        // Optionally revert UI or show error
      }
    }
    if (notification.route) {
      router.push(notification.route);
    }
  };

  // Clear a single notification from the list
  const handleClearNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    // Optionally, call backend to delete notification
  };

  // Clear all notifications
  const handleClearAll = () => {
    setNotifications([]);
    // Optionally, call backend to clear all notifications
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative" ref={bellRef}>
      <button
        className={`group relative p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-200 transition-colors ${
          muted ? "" : "hover:bg-primary-50"
        }`}
        aria-label={muted ? "Notifications muted" : "Show notifications"}
        onClick={() => setOpen((prev) => !prev)}
      >
        {muted ? (
          <BellOff
            className={`${iconSize} transition-colors ${
              color || "text-gray-300"
            } group-hover:text-primary-600 group-focus-within:text-primary-600`}
          />
        ) : (
          <Bell
            className={`${iconSize} transition-colors ${
              color || "text-white"
            } group-hover:text-primary-600 group-focus-within:text-primary-600`}
          />
        )}
        {!muted && unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-5 px-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
            {unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-[320px] sm:w-96 max-w-xs bg-white rounded-xl shadow-lg border border-gray-100 z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="font-semibold text-gray-900 text-base">
              Notifications
            </span>
            <div className="flex items-center gap-2">
              <button
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary-600 p-1 rounded-full"
                aria-label={
                  muted ? "Unmute notifications" : "Mute notifications"
                }
                onClick={handleToggleMute}
                disabled={loading}
              >
                {muted ? (
                  <BellOff className="w-5 h-5" />
                ) : (
                  <Bell className="w-5 h-5" />
                )}
                {loading ? "..." : muted ? "Unmute" : "Mute"}
              </button>
              {notifications.length > 0 && (
                <button
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 p-1 rounded-full"
                  aria-label="Clear all notifications"
                  onClick={handleClearAll}
                >
                  <Trash2 className="w-5 h-5" />
                  Clear All
                </button>
              )}
            </div>
            <button
              className="p-1 rounded-full hover:bg-gray-100 ml-2"
              aria-label="Close notifications"
              onClick={() => setOpen(false)}
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          {error && (
            <div className="px-4 py-2 text-xs text-red-500 text-center bg-red-50 border-b border-red-100">
              {error}
            </div>
          )}
          <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
            {muted ? (
              <div className="p-4 text-center text-gray-400 text-sm">
                Notifications muted
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                No notifications
              </div>
            ) : isMobile ? (
              <SwipeableList threshold={0.25}>
                {notifications.map((n) => {
                  const isUnread = !n.read;
                  const isExpanded = expandedId === n.id;
                  return (
                    <SwipeableListItem
                      key={n.id}
                      swipeLeft={{
                        content: (
                          <div className="flex items-center h-full px-4 bg-red-500 text-white font-bold text-sm">
                            Delete
                          </div>
                        ),
                        action: () => handleClearNotification(n.id),
                      }}
                    >
                      <div
                        className={`group px-4 py-3 flex flex-col gap-1 transition cursor-pointer relative ${
                          isUnread
                            ? "bg-blue-50 border-l-4 border-blue-400 font-semibold"
                            : "bg-white"
                        } hover:bg-primary-50`}
                        onClick={() =>
                          setExpandedId((prev) => (prev === n.id ? null : n.id))
                        }
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`text-gray-800 text-sm truncate ${
                              isUnread ? "font-bold" : "font-medium"
                            }`}
                          >
                            {n.title}
                          </span>
                          <button
                            className="p-1 rounded-full hover:bg-gray-200"
                            aria-label={isExpanded ? "Collapse" : "Expand"}
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedId((prev) =>
                                prev === n.id ? null : n.id
                              );
                            }}
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        <span className="text-xs text-gray-600 truncate">
                          {n.description || n.body}
                        </span>
                        {isExpanded && (
                          <div className="mt-2 text-xs text-gray-700 whitespace-pre-line">
                            {n.body || n.description}
                          </div>
                        )}
                        <span className="text-xs text-gray-400 mt-1">
                          {n.time ||
                            (n.createdAt
                              ? new Date(n.createdAt).toLocaleString()
                              : "")}
                        </span>
                      </div>
                    </SwipeableListItem>
                  );
                })}
              </SwipeableList>
            ) : (
              notifications.map((n) => {
                const isUnread = !n.read;
                const isExpanded = expandedId === n.id;
                return (
                  <div
                    key={n.id}
                    className={`group px-4 py-3 flex flex-col gap-1 transition cursor-pointer relative ${
                      isUnread
                        ? "bg-blue-50 border-l-4 border-blue-400 font-semibold"
                        : "bg-white"
                    } hover:bg-primary-50`}
                    onClick={() =>
                      setExpandedId((prev) => (prev === n.id ? null : n.id))
                    }
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-gray-800 text-sm truncate ${
                          isUnread ? "font-bold" : "font-medium"
                        }`}
                      >
                        {n.title}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          className="p-1 rounded-full hover:bg-gray-200"
                          aria-label="Clear notification"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClearNotification(n.id);
                          }}
                        >
                          <X className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
                        </button>
                        <button
                          className="p-1 rounded-full hover:bg-gray-200"
                          aria-label={isExpanded ? "Collapse" : "Expand"}
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedId((prev) =>
                              prev === n.id ? null : n.id
                            );
                          }}
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <span className="text-xs text-gray-600 truncate">
                      {n.description || n.body}
                    </span>
                    {isExpanded && (
                      <div className="mt-2 text-xs text-gray-700 whitespace-pre-line">
                        {n.body || n.description}
                      </div>
                    )}
                    <span className="text-xs text-gray-400 mt-1">
                      {n.time ||
                        (n.createdAt
                          ? new Date(n.createdAt).toLocaleString()
                          : "")}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
