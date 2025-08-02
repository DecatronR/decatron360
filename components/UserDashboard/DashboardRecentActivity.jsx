"use client";
import React from "react";
import {
  Calendar,
  FileText,
  Home,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

const DashboardRecentActivity = ({ userBookings, userContracts }) => {
  const router = useRouter();

  const getActivities = () => {
    const activities = [];

    // Add bookings
    if (userBookings?.length > 0) {
      userBookings.slice(0, 5).forEach((booking) => {
        activities.push({
          id: booking.id,
          type: "inspection",
          title: `Inspection ${booking.status}`,
          description: `Property: ${
            booking.propertyName || "Unknown Property"
          }`,
          time: new Date(booking.createdAt),
          status: booking.status,
          icon: Calendar,
          color: getStatusColor(booking.status),
          bgColor: getStatusBgColor(booking.status),
        });
      });
    }

    // Add contracts
    if (userContracts?.length > 0) {
      userContracts.slice(0, 5).forEach((contract) => {
        activities.push({
          id: contract.id,
          type: "contract",
          title: `Contract ${contract.status}`,
          description: `Property: ${
            contract.propertyName || "Unknown Property"
          }`,
          time: new Date(contract.createdAt),
          status: contract.status,
          icon: FileText,
          color: getStatusColor(contract.status),
          bgColor: getStatusBgColor(contract.status),
        });
      });
    }

    // Sort by time (most recent first)
    return activities.sort((a, b) => b.time - a.time).slice(0, 8);
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: "text-green-600",
      pending: "text-yellow-600",
      completed: "text-blue-600",
      cancelled: "text-red-600",
      active: "text-green-600",
      expired: "text-red-600",
    };
    return colors[status] || "text-gray-600";
  };

  const getStatusBgColor = (status) => {
    const colors = {
      confirmed: "bg-green-50",
      pending: "bg-yellow-50",
      completed: "bg-blue-50",
      cancelled: "bg-red-50",
      active: "bg-green-50",
      expired: "bg-red-50",
    };
    return colors[status] || "bg-gray-50";
  };

  const getStatusIcon = (status) => {
    if (["confirmed", "active", "completed"].includes(status)) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    if (["pending"].includes(status)) {
      return <Clock className="w-4 h-4 text-yellow-500" />;
    }
    return <AlertCircle className="w-4 h-4 text-red-500" />;
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString();
  };

  const activities = getActivities();

  const handleActivityClick = (activity) => {
    if (activity.type === "inspection") {
      router.push(`/my-inspections/${activity.id}`);
    } else if (activity.type === "contract") {
      router.push(`/contract-dashboard/${activity.id}`);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          View all
        </button>
      </div>

      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <div
              key={`${activity.type}-${activity.id}-${index}`}
              onClick={() => handleActivityClick(activity)}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
            >
              {/* Activity Icon */}
              <div
                className={`p-2 rounded-lg ${activity.bgColor} flex-shrink-0`}
              >
                <activity.icon className={`w-4 h-4 ${activity.color}`} />
              </div>

              {/* Activity Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {activity.title}
                  </h4>
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(activity.status)}
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(activity.time)}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1 truncate">
                  {activity.description}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No recent activity</p>
            <p className="text-gray-400 text-xs mt-1">
              Your activities will appear here
            </p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      {activities.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-semibold text-gray-900">
                {
                  activities.filter(
                    (a) => a.status === "confirmed" || a.status === "active"
                  ).length
                }
              </p>
              <p className="text-xs text-gray-600">Active</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">
                {activities.filter((a) => a.status === "pending").length}
              </p>
              <p className="text-xs text-gray-600">Pending</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">
                {activities.filter((a) => a.status === "completed").length}
              </p>
              <p className="text-xs text-gray-600">Completed</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardRecentActivity;
