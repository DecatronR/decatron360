import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  BellOff,
  X,
  ChevronDown,
  ChevronUp,
  Trash2,
  Info,
  CheckCircle,
  AlertTriangle,
  XCircle,
  User,
  Home,
} from "lucide-react";
import { requestAndSendNotificationPermission } from "../../utils/api/pushNotification/requestPermission";
import { fetchNotifications } from "../../utils/api/pushNotification/fetchNotifications";
import { markNotificationAsRead } from "../../utils/api/pushNotification/markNotificationAsRead";
import { unregisterFcmTokenOnServer } from "../../utils/api/pushNotification/unregisterFcmTokenOnServer";
import { useRouter } from "next/navigation";
import { messaging } from "lib/firebase";
import { SwipeableList, SwipeableListItem } from "react-swipeable-list";
import "react-swipeable-list/dist/styles.css";
import { deleteNotification } from "../../utils/api/pushNotification/deleteNotification";
import { formatDistanceToNow } from "date-fns";
import { useSnackbar } from "notistack";
import { truncateText } from "utils/helpers/truncateText";

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

// Helper: get icon and color for notification type
const getTypeIcon = (type) => {
  switch (type) {
    case "success":
      return {
        icon: <CheckCircle className="text-success w-4 h-4" />,
        color: "bg-success/10",
      };
    case "error":
      return {
        icon: <XCircle className="text-error w-4 h-4" />,
        color: "bg-error/10",
      };
    case "warning":
      return {
        icon: <AlertTriangle className="text-yellow-500 w-4 h-4" />,
        color: "bg-yellow-100",
      };
    case "user":
      return {
        icon: <User className="text-primary-500 w-4 h-4" />,
        color: "bg-primary-100",
      };
    case "property":
      return {
        icon: <Home className="text-primary-400 w-4 h-4" />,
        color: "bg-primary-100",
      };
    default:
      return {
        icon: <Info className="text-primary-400 w-4 h-4" />,
        color: "bg-primary-100",
      };
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
  const [expandedIds, setExpandedIds] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [lastDeleted, setLastDeleted] = useState(null);

  // Get userId from sessionStorage (or context if available)
  const userId =
    typeof window !== "undefined" ? sessionStorage.getItem("userId") : null;

  // Fetch notifications when dropdown opens
  useEffect(() => {
    console.log("[DEBUG] useEffect - open:", open, "userId:", userId);
    if (open && userId) {
      fetchNotifications(userId)
        .then((data) => {
          console.log("[DEBUG] Raw notifications data:", data);
          const sorted = Array.isArray(data)
            ? [...data]
                .map((n) => ({ ...n, id: n._id || n.id }))
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            : [];
          console.log("[DEBUG] After mapping, notifications:", sorted);
          setNotifications(sorted);
        })
        .catch((err) => {
          console.error("[DEBUG] Failed to load notifications:", err);
          setError("Failed to load notifications");
        });
    }
  }, [open, userId]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      console.log(
        "[DEBUG] handleClickOutside - event.target:",
        event.target,
        "bellRef.current:",
        bellRef.current
      );
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        console.log("[DEBUG] Outside click detected, closing dropdown");
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
    console.log("Marking as read:", notification.id, notification.title);
    if (!notification.read && notification.id) {
      // Optimistically update UI
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
      );
      try {
        await markNotificationAsRead(notification.id);
      } catch (err) {
        console.error("Error marking as read:", err);
        // Optionally revert UI or show error
      }
    }
    if (notification.route) {
      router.push(notification.route);
    }
  };

  // Clear a single notification from the list
  const handleClearNotification = async (id) => {
    console.log("[DEBUG] Deleting notification:", id);
    if (!id) {
      console.error("[DEBUG] No notification ID provided");
      return;
    }

    const toDelete = notifications.find((n) => n.id === id);
    if (!toDelete) {
      console.error("[DEBUG] Notification not found:", id);
      return;
    }

    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setLastDeleted(toDelete);
    enqueueSnackbar("Notification deleted", {
      variant: "info",
      action: (key) => (
        <button
          className="text-primary-600 font-semibold ml-2"
          onClick={() => {
            console.log("[DEBUG] Undo delete for notification:", id);
            setNotifications((prev) => [toDelete, ...prev]);
            setLastDeleted(null);
            closeSnackbar(key);
          }}
        >
          Undo
        </button>
      ),
      autoHideDuration: 4000,
      onClose: () => {
        if (lastDeleted && lastDeleted.id) {
          console.log(
            "[DEBUG] Actually deleting from backend:",
            lastDeleted.id
          );
          deleteNotification(lastDeleted.id).catch((err) => {
            console.error("[DEBUG] Error deleting from backend:", err);
          });
          setLastDeleted(null);
        }
      },
    });
  };

  // Clear all notifications
  const handleClearAll = () => {
    setNotifications([]);
    // Optionally, call backend to clear all notifications
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const toggleExpand = (id) => {
    console.log("Toggling expand for:", id);
    if (!id) {
      console.error("No notification ID provided for expand");
      return;
    }
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]
    );
  };

  return (
    <div className="relative" ref={bellRef}>
      <button
        className={`group relative p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-200 transition-colors ${
          muted ? "" : "hover:bg-primary-50"
        } animate-bounce`}
        aria-label={muted ? "Notifications muted" : "Show notifications"}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => {
          console.log(
            "[DEBUG] Bell button clicked, toggling open from",
            open,
            "to",
            !open
          );
          setOpen((prev) => !prev);
        }}
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
          <span className="absolute top-1 right-1 min-w-[18px] h-5 px-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div
          className="fixed sm:absolute left-0 right-0 sm:right-0 sm:left-auto mx-auto sm:mx-0 top-14 sm:top-2 mt-0 sm:mt-2 w-full max-w-xs sm:w-96 bg-white rounded-xl shadow-lg border border-gray-100 z-50 font-sans px-2 sm:px-0 max-h-[80vh] overflow-y-auto overflow-x-hidden"
          role="menu"
          aria-label="Notifications"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 gap-x-2">
            <span className="font-semibold text-gray-900 text-base truncate min-w-0 flex-1">
              Notifications
            </span>
            <div className="flex items-center gap-2 shrink-0">
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
              className="p-1 rounded-full hover:bg-gray-100 ml-2 shrink-0"
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
              <div className="p-6 flex flex-col items-center text-center text-gray-400 text-sm gap-2">
                <BellOff className="w-8 h-8 mb-2" />
                <span>Notifications muted</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 flex flex-col items-center text-center text-gray-500 text-sm gap-2">
                <Bell className="w-8 h-8 mb-2 text-primary-200" />
                <span>No notifications</span>
              </div>
            ) : isMobile ? (
              <SwipeableList threshold={0.25}>
                {notifications.map((n) => {
                  const isUnread = !n.read;
                  const isExpanded = expandedIds.includes(n.id);
                  const { icon, color } = getTypeIcon(n.type);
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
                        className={`group px-2 py-2 text-sm sm:px-4 sm:py-3 sm:text-base flex flex-col gap-1 transition cursor-pointer relative flex-wrap min-w-0`}
                        onClick={() => toggleExpand(n.id)}
                        tabIndex={0}
                        role="menuitem"
                        aria-label={n.title}
                      >
                        <div className="flex items-center justify-between gap-2 min-w-0">
                          <button
                            className="p-2 rounded-full hover:bg-gray-200 shrink-0 min-w-10 min-h-10"
                            aria-label={isExpanded ? "Collapse" : "Expand"}
                            onClick={(e) => {
                              console.log("Expand button clicked for:", n.id);
                              e.stopPropagation();
                              toggleExpand(n.id);
                            }}
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                          <div
                            className={`flex items-center gap-2 ${color} rounded-full p-1 shrink-0`}
                          >
                            {icon}
                          </div>
                          <span className="truncate min-w-0 flex-1 text-gray-800 text-sm font-medium">
                            {n.title}
                          </span>
                          <div className="flex items-center gap-3 ml-2 shrink-0">
                            <button
                              className="p-2 rounded-full hover:bg-gray-200 shrink-0 min-w-10 min-h-10"
                              aria-label="Clear notification"
                              onClick={(e) => {
                                console.log("Delete button clicked for:", n.id);
                                e.stopPropagation();
                                handleClearNotification(n.id);
                              }}
                            >
                              <X className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
                            </button>
                          </div>
                        </div>
                        <span className="truncate min-w-0 flex-1 text-xs text-gray-600">
                          {truncateText(n.body, 50)}
                        </span>
                        {isExpanded && (
                          <div className="mt-2 text-xs text-gray-700 break-words max-w-full">
                            {n.body}
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-400">
                            {n.createdAt
                              ? formatDistanceToNow(new Date(n.createdAt), {
                                  addSuffix: true,
                                })
                              : ""}
                          </span>
                          {isUnread && (
                            <button
                              className="text-primary-600 text-xs font-semibold ml-2 hover:underline"
                              onClick={(e) => {
                                console.log(
                                  "Mark as read button clicked for:",
                                  n.id
                                );
                                e.stopPropagation();
                                handleNotificationClick(n);
                              }}
                            >
                              Mark as Read
                            </button>
                          )}
                        </div>
                      </div>
                    </SwipeableListItem>
                  );
                })}
              </SwipeableList>
            ) : (
              notifications.map((n) => {
                const isUnread = !n.read;
                const isExpanded = expandedIds.includes(n.id);
                const { icon, color } = getTypeIcon(n.type);
                return (
                  <div
                    key={n.id}
                    className={`group px-2 py-2 text-sm sm:px-4 sm:py-3 sm:text-base flex flex-col gap-1 transition cursor-pointer relative flex-wrap min-w-0 ${
                      isUnread
                        ? "bg-blue-50 border-l-4 border-blue-400 font-semibold animate-fade-in"
                        : "bg-white animate-fade-in"
                    } hover:bg-primary-50`}
                    onClick={() => toggleExpand(n.id)}
                    tabIndex={0}
                    role="menuitem"
                    aria-label={n.title}
                  >
                    <div className="flex items-center justify-between gap-2 min-w-0">
                      <button
                        className="p-1 rounded-full hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                        aria-label={isExpanded ? "Collapse" : "Expand"}
                        onClick={(e) => {
                          console.log(
                            "Desktop expand button clicked for:",
                            n.id
                          );
                          e.stopPropagation();
                          toggleExpand(n.id);
                        }}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                      <div
                        className={`flex items-center gap-2 ${color} rounded-full p-1 shrink-0`}
                      >
                        {icon}
                      </div>
                      <span className="truncate min-w-0 flex-1 text-gray-800 text-sm font-medium">
                        {n.title}
                      </span>
                      <div className="flex items-center gap-3 ml-2 shrink-0">
                        <button
                          className="p-1 rounded-full hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                          aria-label="Clear notification"
                          onClick={(e) => {
                            console.log(
                              "Desktop delete button clicked for:",
                              n.id
                            );
                            e.stopPropagation();
                            handleClearNotification(n.id);
                          }}
                        >
                          <X className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
                        </button>
                      </div>
                    </div>
                    <span className="min-w-0 flex-1 text-xs text-gray-600">
                      {truncateText(n.body, 40)}
                    </span>
                    {isExpanded && (
                      <div className="mt-2 text-xs text-gray-700 break-words max-w-full">
                        {n.body}
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-400">
                        {n.createdAt
                          ? formatDistanceToNow(new Date(n.createdAt), {
                              addSuffix: true,
                            })
                          : ""}
                      </span>
                      {isUnread && (
                        <button
                          className="text-primary-600 text-xs font-semibold ml-2 hover:underline"
                          onClick={(e) => {
                            console.log(
                              "Desktop mark as read button clicked for:",
                              n.id
                            );
                            e.stopPropagation();
                            handleNotificationClick(n);
                          }}
                        >
                          Mark as Read
                        </button>
                      )}
                    </div>
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
