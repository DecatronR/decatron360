"use client";
import React, { useState } from "react";
import {
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  User,
  MapPin,
} from "lucide-react";
import { useRouter } from "next/navigation";

const DashboardPropertyRequests = ({ propertyRequests }) => {
  const router = useRouter();
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const getFilteredRequests = () => {
    let filtered = propertyRequests || [];

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((request) => request.status === filterStatus);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "date":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "name":
          return (a.clientName || "").localeCompare(b.clientName || "");
        default:
          return 0;
      }
    });

    return filtered;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      completed: "bg-blue-100 text-blue-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "";
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString();
  };

  const filteredRequests = getFilteredRequests();

  const getStats = () => {
    const total = propertyRequests?.length || 0;
    const pending =
      propertyRequests?.filter((r) => r.status === "pending")?.length || 0;
    const approved =
      propertyRequests?.filter((r) => r.status === "approved")?.length || 0;
    const rejected =
      propertyRequests?.filter((r) => r.status === "rejected")?.length || 0;

    return { total, pending, approved, rejected };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Property Requests
            </h2>
            <p className="text-sm text-gray-600">
              Manage property requests from clients ({filteredRequests.length}{" "}
              requests)
            </p>
          </div>
          <button
            onClick={() => router.push("/property-requests")}
            className="flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors duration-200"
          >
            <MessageSquare className="w-4 h-4" />
            <span>View All Requests</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-600">Total</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </p>
            <p className="text-sm text-yellow-600">Pending</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              {stats.approved}
            </p>
            <p className="text-sm text-green-600">Approved</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            <p className="text-sm text-red-600">Rejected</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="recent">Most Recent</option>
            <option value="date">Oldest First</option>
            <option value="name">Client Name</option>
          </select>
        </div>
      </div>

      {/* Property Requests Table */}
      {filteredRequests.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {request.clientName || "Unknown Client"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {request.clientPhone || "No phone"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {request.propertyType || "Not specified"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {request.location || "Location not specified"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ₦{request.budget?.toLocaleString() || "Not specified"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {request.listingType === "for-rent"
                          ? "For Rent"
                          : "For Sale"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(request.status)}
                        <span
                          className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            request.status
                          )}`}
                        >
                          {request.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(request.createdAt)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatTimeAgo(request.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() =>
                          router.push(`/property-requests/${request.id}`)
                        }
                        className="flex items-center space-x-1 text-primary-600 hover:text-primary-900 transition-colors duration-200"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No property requests found
          </h3>
          <p className="text-gray-500 mb-6">
            {filterStatus !== "all"
              ? "Try adjusting your filter criteria"
              : "No property requests have been submitted yet"}
          </p>
          {filterStatus === "all" && (
            <button
              onClick={() => router.push("/property-requests")}
              className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors duration-200"
            >
              View All Requests
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardPropertyRequests;
