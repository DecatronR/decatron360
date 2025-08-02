"use client";
import React, { useState } from "react";
import {
  Home,
  Calendar,
  FileText,
  TrendingUp,
  Users,
  DollarSign,
  MapPin,
  Clock,
  Share2,
  Copy,
  Check,
} from "lucide-react";
import { useRouter } from "next/navigation";

const DashboardOverview = ({
  userData,
  userProperties,
  userBookings,
  userContracts,
  propertyRequests,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const router = useRouter();
  const getMetricCards = () => {
    // Get upcoming inspections (scheduled for future dates)
    const upcomingInspections =
      userBookings?.filter((booking) => {
        if (!booking.inspectionDate) return false;
        const inspectionDate = new Date(booking.inspectionDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return inspectionDate >= today && booking.status !== "cancelled";
      })?.length || 0;

    // Get property requests received
    const propertyRequestsReceived = propertyRequests?.length || 0;

    const baseCards = [
      {
        title: "Total Properties",
        value: userProperties?.length || 0,
        icon: Home,
        color: "bg-blue-500",
        bgColor: "bg-blue-50",
        textColor: "text-blue-600",
      },
      {
        title: "Property Requests Received",
        value: propertyRequestsReceived,
        icon: Users,
        color: "bg-purple-500",
        bgColor: "bg-purple-50",
        textColor: "text-purple-600",
      },
      {
        title: "Upcoming Inspections",
        value: upcomingInspections,
        icon: Calendar,
        color: "bg-green-500",
        bgColor: "bg-green-50",
        textColor: "text-green-600",
      },
      {
        title: "Pending Contracts",
        value:
          userContracts?.filter((contract) => contract.status === "pending")
            ?.length || 0,
        icon: FileText,
        color: "bg-yellow-500",
        bgColor: "bg-yellow-50",
        textColor: "text-yellow-600",
      },
    ];

    return baseCards;
  };

  const getRecentActivity = () => {
    const activities = [];

    // Add recent bookings
    if (userBookings?.length > 0) {
      const recentBookings = userBookings.slice(0, 3);
      recentBookings.forEach((booking) => {
        activities.push({
          type: "inspection",
          title: `Inspection scheduled for ${
            booking.propertyName || "property"
          }`,
          time: new Date(booking.createdAt).toLocaleDateString(),
          icon: Calendar,
          color: "text-blue-500",
        });
      });
    }

    // Add recent contracts
    if (userContracts?.length > 0) {
      const recentContracts = userContracts.slice(0, 2);
      recentContracts.forEach((contract) => {
        activities.push({
          type: "contract",
          title: `Contract ${contract.status} for ${
            contract.propertyName || "property"
          }`,
          time: new Date(contract.createdAt).toLocaleDateString(),
          icon: FileText,
          color: "text-green-500",
        });
      });
    }

    return activities.slice(0, 5);
  };

  const metricCards = getMetricCards();
  const recentActivities = getRecentActivity();

  const handleCopyReferralCode = async () => {
    const referralUrl = `${window.location.origin}?ref=${userData?.referralCode}`;
    try {
      await navigator.clipboard.writeText(referralUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy referral code:", error);
    }
  };

  const handleShareReferral = async () => {
    const referralUrl = `${window.location.origin}?ref=${userData?.referralCode}`;
    const shareText = `Join Decatron360 - Nigeria's premier real estate platform! Use my referral code: ${userData?.referralCode}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join Decatron360",
          text: shareText,
          url: referralUrl,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback to copying to clipboard
      handleCopyReferralCode();
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Welcome back, {userData?.name || "there"}!
            </h2>
            <p className="text-primary-100">
              Here's what's happening with your properties today.
            </p>
          </div>
          <div className="hidden md:block">
            <TrendingUp className="w-16 h-16 text-primary-200" />
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {metricCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                <card.icon className={`w-6 h-6 ${card.textColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {recentActivities.length > 0 ? (
            recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-gray-50`}>
                  <activity.icon className={`w-4 h-4 ${activity.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.title}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No recent activity</p>
            </div>
          )}
        </div>
      </div>

      {/* Airbnb-style Subtle Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Account & Settings
          </h3>
        </div>

        <div className="space-y-4">
          {/* Referral Section - Airbnb Style */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <Share2 className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Invite friends</h4>
                <p className="text-sm text-gray-600">
                  Share Decatron360 and earn rewards
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-right">
                <p className="text-xs text-gray-500">Your code</p>
                <p className="text-sm font-mono font-medium text-gray-900">
                  {userData?.referralCode || "Loading..."}
                </p>
              </div>
              <button
                onClick={handleCopyReferralCode}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                {isCopied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Subscription Section - Airbnb Style */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <span className="text-emerald-600 font-bold">⭐</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">
                  Special Agent Plan
                </h4>
                <p className="text-sm text-gray-600">
                  Unlock premium features and tools
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-right">
                <p className="text-xs text-gray-500">Current plan</p>
                <p className="text-sm font-medium text-gray-900">
                  {userData?.subscriptionTier || "Free"}
                </p>
              </div>
              <button
                onClick={() => router.push("/subscription/upgrade")}
                className="px-4 py-2 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors duration-200"
              >
                Upgrade
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
