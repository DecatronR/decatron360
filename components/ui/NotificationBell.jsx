import React, { useState, useRef, useEffect } from "react";
import { Bell, X } from "lucide-react";

const placeholderNotifications = [
  {
    id: 1,
    title: "New Inspection Scheduled",
    description: "Your inspection for 123 Main St is confirmed for tomorrow.",
    time: "2h ago",
    read: false,
  },
  {
    id: 2,
    title: "Payment Received",
    description: "You have received a payment for contract #456.",
    time: "1d ago",
    read: true,
  },
  {
    id: 3,
    title: "Profile Updated",
    description: "Your profile information was updated successfully.",
    time: "3d ago",
    read: true,
  },
];

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(placeholderNotifications);
  const bellRef = useRef(null);

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

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative" ref={bellRef}>
      <button
        className="relative p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
        aria-label="Show notifications"
        onClick={() => setOpen((prev) => !prev)}
      >
        <Bell className="w-6 h-6 text-white" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 max-w-xs bg-white rounded-xl shadow-lg border border-gray-100 z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="font-semibold text-gray-900 text-base">
              Notifications
            </span>
            <button
              className="p-1 rounded-full hover:bg-gray-100"
              aria-label="Close notifications"
              onClick={() => setOpen(false)}
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                No notifications
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`px-4 py-3 flex flex-col gap-1 hover:bg--50 transition cursor-pointer ${
                    !n.read ? "bg-blue-50" : ""
                  }`}
                >
                  <span className="font-medium text-gray-800 text-sm truncate">
                    {n.title}
                  </span>
                  <span className="text-xs text-gray-600 truncate">
                    {n.description}
                  </span>
                  <span className="text-xs text-gray-400 mt-1">{n.time}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
