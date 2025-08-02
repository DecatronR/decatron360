"use client";
import React from "react";
import {
  Plus,
  Calendar,
  Clock,
  Users,
  Settings,
  MessageSquare,
  MapPin,
  Home,
  Search,
  FileText,
} from "lucide-react";
import { useRouter } from "next/navigation";

const DashboardQuickActions = ({ userRole, user }) => {
  const router = useRouter();

  const getQuickActions = () => {
    const baseActions = [
      {
        title: "Set Availability",
        description: "Manage your schedule and availability",
        icon: Clock,
        color: "bg-blue-500",
        bgColor: "bg-blue-50",
        textColor: "text-blue-600",
        onClick: () => router.push(`/agent-scheduler/${user?.id}`),
      },
      {
        title: "View Properties",
        description: "Manage your property listings",
        icon: Home,
        color: "bg-purple-500",
        bgColor: "bg-purple-50",
        textColor: "text-purple-600",
        onClick: () => router.push("/properties"),
      },
      {
        title: "View Property Requests",
        description: "Check property requests from clients",
        icon: Search,
        color: "bg-green-500",
        bgColor: "bg-green-50",
        textColor: "text-green-600",
        onClick: () => router.push("/property-requests"),
      },
      {
        title: "Add Property",
        description: "List a new property for rent or sale",
        icon: Plus,
        color: "bg-orange-500",
        bgColor: "bg-orange-50",
        textColor: "text-orange-600",
        onClick: () => router.push("/properties/add/for-rent"),
      },
    ];

    return baseActions;
  };

  const quickActions = getQuickActions();

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          View all
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="flex items-start space-x-3 p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all duration-200 text-left group"
          >
            {/* Action Icon */}
            <div
              className={`p-2 rounded-lg ${action.bgColor} group-hover:scale-110 transition-transform duration-200`}
            >
              <action.icon className={`w-5 h-5 ${action.textColor}`} />
            </div>

            {/* Action Content */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                {action.title}
              </h4>
              <p className="text-xs text-gray-500 mt-1">{action.description}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Additional Resources */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <h4 className="text-sm font-medium text-gray-900 mb-3">
          Help & Resources
        </h4>
        <div className="space-y-2">
          <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-primary-600 transition-colors duration-200">
            <MessageSquare className="w-4 h-4" />
            <span>Contact Support</span>
          </button>
          <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-primary-600 transition-colors duration-200">
            <FileText className="w-4 h-4" />
            <span>View Documentation</span>
          </button>
          <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-primary-600 transition-colors duration-200">
            <Settings className="w-4 h-4" />
            <span>Account Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardQuickActions;
