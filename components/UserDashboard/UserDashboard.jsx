"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { BarChart3, Home, Search, FileText, MessageSquare } from "lucide-react";
import DashboardHeader from "./DashboardHeader";
import DashboardOverview from "./DashboardOverview";
import DashboardStats from "./DashboardStats";
import DashboardRecentActivity from "./DashboardRecentActivity";
import DashboardQuickActions from "./DashboardQuickActions";
import DashboardProperties from "./DashboardProperties";
import DashboardPropertyRequests from "./DashboardPropertyRequests";
import DashboardInspections from "./DashboardInspections";
import DashboardContracts from "./DashboardContracts";
import { fetchUserData } from "@/utils/api/user/fetchUserData";
import { fetchUserProperties } from "@/utils/api/user/fetchUserProperties";
import { fetchUserBookings } from "@/utils/api/inspection/fetchUserBookings";
import { fetchOwnerContracts } from "@/utils/api/contract/fetchOwnerContracts";
import { fetchAgentBookings } from "@/utils/api/inspection/fetchAgentBookings";
import { fetchAllPropertyRequests } from "@/utils/api/propertyRequest/fetchAllPropertyRequests";

const UserDashboard = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [userProperties, setUserProperties] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [userContracts, setUserContracts] = useState([]);
  const [propertyRequests, setPropertyRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);

        // Fetch user data
        const userRes = await fetchUserData(user.id);
        setUserData(userRes);

        // Fetch user properties
        const propertiesRes = await fetchUserProperties(user.id);
        setUserProperties(propertiesRes);

        // Fetch bookings based on user role
        if (user.role === "agent") {
          const bookingsRes = await fetchAgentBookings(user.id);
          setUserBookings(bookingsRes);
        } else {
          const bookingsRes = await fetchUserBookings(user.id);
          setUserBookings(bookingsRes);
        }

        // Fetch contracts for owners
        if (user.role === "owner") {
          const contractsRes = await fetchOwnerContracts(user.id);
          setUserContracts(contractsRes);
        }

        // Fetch property requests
        try {
          const requestsRes = await fetchAllPropertyRequests();
          setPropertyRequests(requestsRes);
        } catch (error) {
          console.error("Error fetching property requests:", error);
          setPropertyRequests([]);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "properties", label: "Properties", icon: Home },
    {
      id: "property-requests",
      label: "Property Requests",
      icon: MessageSquare,
    },
    { id: "inspections", label: "Inspections", icon: Search },
    { id: "contracts", label: "Contracts", icon: FileText },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <DashboardOverview
              userData={userData}
              userProperties={userProperties}
              userBookings={userBookings}
              userContracts={userContracts}
              propertyRequests={propertyRequests}
            />
            <DashboardStats
              userData={userData}
              userProperties={userProperties}
              userBookings={userBookings}
              userContracts={userContracts}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DashboardRecentActivity
                userBookings={userBookings}
                userContracts={userContracts}
              />
              <DashboardQuickActions userRole={user?.role} user={user} />
            </div>
          </div>
        );
      case "properties":
        return <DashboardProperties userProperties={userProperties} />;
      case "property-requests":
        return (
          <DashboardPropertyRequests propertyRequests={propertyRequests} />
        );
      case "inspections":
        return <DashboardInspections userBookings={userBookings} />;
      case "contracts":
        return <DashboardContracts userContracts={userContracts} />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader userData={userData} userRole={user?.role} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-primary-500 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default UserDashboard;
