"use client";
import React from "react";
import Image from "next/image";
import { Bell, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";

const DashboardHeader = ({ userData, userRole }) => {
  const router = useRouter();

  const getRoleDisplayName = (role) => {
    const roleNames = {
      agent: "Real Estate Agent",
      owner: "Property Owner",
      caretaker: "Property Caretaker",
      "property-manager": "Property Manager",
    };
    return roleNames[role] || role;
  };

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    let timeGreeting = "";

    if (hour < 12) timeGreeting = "Good morning";
    else if (hour < 17) timeGreeting = "Good afternoon";
    else timeGreeting = "Good evening";

    return `${timeGreeting}, ${userData?.name || "there"}!`;
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left side - Welcome and role */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {getWelcomeMessage()}
              </h1>
              <p className="text-sm text-gray-600">
                {getRoleDisplayName(userRole)} • Dashboard
              </p>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400"></span>
            </button>

            {/* Settings */}
            <button
              onClick={() => router.push("/user-profile")}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <Settings className="w-6 h-6" />
            </button>

            {/* User Profile */}
            <button
              onClick={() => router.push("/user-profile")}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary-600">
                  {userData?.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">
                  {userData?.name || "User"}
                </p>
                <p className="text-xs text-gray-500">
                  {getRoleDisplayName(userRole)}
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
