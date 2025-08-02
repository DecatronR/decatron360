"use client";
import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const DashboardStats = ({
  userData,
  userProperties,
  userBookings,
  userContracts,
}) => {
  const getPropertyStats = () => {
    const total = userProperties?.length || 0;
    const forRent =
      userProperties?.filter((p) => p.listingType === "for-rent")?.length || 0;
    const forSale =
      userProperties?.filter((p) => p.listingType === "for-sale")?.length || 0;
    const active =
      userProperties?.filter((p) => p.status === "active")?.length || 0;

    return {
      total,
      forRent,
      forSale,
      active,
      inactive: total - active,
    };
  };

  const getInspectionStats = () => {
    const total = userBookings?.length || 0;
    const confirmed =
      userBookings?.filter((b) => b.status === "confirmed")?.length || 0;
    const pending =
      userBookings?.filter((b) => b.status === "pending")?.length || 0;
    const completed =
      userBookings?.filter((b) => b.status === "completed")?.length || 0;

    return {
      total,
      confirmed,
      pending,
      completed,
    };
  };

  const getContractStats = () => {
    const total = userContracts?.length || 0;
    const active =
      userContracts?.filter((c) => c.status === "active")?.length || 0;
    const pending =
      userContracts?.filter((c) => c.status === "pending")?.length || 0;
    const expired =
      userContracts?.filter((c) => c.status === "expired")?.length || 0;

    return {
      total,
      active,
      pending,
      expired,
    };
  };

  const propertyStats = getPropertyStats();
  const inspectionStats = getInspectionStats();
  const contractStats = getContractStats();

  const StatCard = ({ title, value, change, changeType, subtitle }) => {
    const getChangeIcon = () => {
      if (changeType === "up")
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      if (changeType === "down")
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      return <Minus className="w-4 h-4 text-gray-400" />;
    };

    const getChangeColor = () => {
      if (changeType === "up") return "text-green-600";
      if (changeType === "down") return "text-red-600";
      return "text-gray-600";
    };

    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          {change && (
            <div
              className={`flex items-center space-x-1 text-xs ${getChangeColor()}`}
            >
              {getChangeIcon()}
              <span>{change}</span>
            </div>
          )}
        </div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
    );
  };

  const ProgressBar = ({ label, value, total, color }) => {
    const percentage = total > 0 ? (value / total) * 100 : 0;

    return (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm text-gray-500">
            {value}/{total}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${color}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Property Statistics */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Property Overview
        </h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatCard
            title="Total Properties"
            value={propertyStats.total}
            subtitle="All listings"
          />
          <StatCard
            title="Active Listings"
            value={propertyStats.active}
            subtitle="Currently available"
          />
        </div>
        <div className="space-y-3">
          <ProgressBar
            label="For Rent"
            value={propertyStats.forRent}
            total={propertyStats.total}
            color="bg-blue-500"
          />
          <ProgressBar
            label="For Sale"
            value={propertyStats.forSale}
            total={propertyStats.total}
            color="bg-green-500"
          />
          <ProgressBar
            label="Active"
            value={propertyStats.active}
            total={propertyStats.total}
            color="bg-primary-500"
          />
        </div>
      </div>

      {/* Inspection & Contract Statistics */}
      <div className="space-y-6">
        {/* Inspection Stats */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Inspection Status
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {inspectionStats.confirmed}
              </p>
              <p className="text-sm text-gray-600">Confirmed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {inspectionStats.pending}
              </p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {inspectionStats.completed}
              </p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </div>
        </div>

        {/* Contract Stats - Only show for owners */}
        {userData?.role === "owner" && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Contract Status
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {contractStats.active}
                </p>
                <p className="text-sm text-gray-600">Active</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {contractStats.pending}
                </p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {contractStats.expired}
                </p>
                <p className="text-sm text-gray-600">Expired</p>
              </div>
            </div>
          </div>
        )}

        {/* Performance Metrics */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Performance
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Response Rate</span>
              <span className="text-sm font-medium text-gray-900">98%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Avg. Response Time</span>
              <span className="text-sm font-medium text-gray-900">
                2.3 hours
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Satisfaction Score</span>
              <span className="text-sm font-medium text-gray-900">4.8/5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
