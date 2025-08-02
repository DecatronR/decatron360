"use client";
import React, { useState } from "react";
import {
  FileText,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";

const DashboardContracts = ({ userContracts }) => {
  const router = useRouter();
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const getFilteredContracts = () => {
    let filtered = userContracts || [];

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(
        (contract) => contract.status === filterStatus
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "date":
          return new Date(a.startDate) - new Date(b.startDate);
        case "amount":
          return (b.rentAmount || 0) - (a.rentAmount || 0);
        case "property":
          return (a.propertyName || "").localeCompare(b.propertyName || "");
        default:
          return 0;
      }
    });

    return filtered;
  };

  const getStatusColor = (status) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      expired: "bg-red-100 text-red-800",
      completed: "bg-blue-100 text-blue-800",
      cancelled: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "expired":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-gray-500" />;
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

  const formatCurrency = (amount) => {
    if (!amount) return "Not specified";
    return `₦${amount.toLocaleString()}`;
  };

  const getContractDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return "Not specified";
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());
    return `${months} months`;
  };

  const filteredContracts = getFilteredContracts();

  const getStats = () => {
    const total = userContracts?.length || 0;
    const active =
      userContracts?.filter((c) => c.status === "active")?.length || 0;
    const pending =
      userContracts?.filter((c) => c.status === "pending")?.length || 0;
    const expired =
      userContracts?.filter((c) => c.status === "expired")?.length || 0;
    const totalRevenue =
      userContracts?.reduce(
        (sum, contract) => sum + (contract.rentAmount || 0),
        0
      ) || 0;

    return { total, active, pending, expired, totalRevenue };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Contracts</h2>
            <p className="text-sm text-gray-600">
              Manage your rental agreements ({filteredContracts.length}{" "}
              contracts)
            </p>
          </div>
          <button
            onClick={() => router.push("/rental-agreement/form")}
            className="flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors duration-200"
          >
            <FileText className="w-4 h-4" />
            <span>Create Contract</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-600">Total</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            <p className="text-sm text-green-600">Active</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </p>
            <p className="text-sm text-yellow-600">Pending</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
            <p className="text-sm text-red-600">Expired</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-lg font-bold text-blue-600">
              {formatCurrency(stats.totalRevenue)}
            </p>
            <p className="text-sm text-blue-600">Total Revenue</p>
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
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="recent">Most Recent</option>
            <option value="date">Start Date</option>
            <option value="amount">Rent Amount</option>
            <option value="property">Property Name</option>
          </select>
        </div>
      </div>

      {/* Contracts Table */}
      {filteredContracts.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tenant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rent Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContracts.map((contract) => (
                  <tr key={contract.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {contract.propertyName || "Unknown Property"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {contract.propertyLocation ||
                              "Location not specified"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <Users className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {contract.tenantName || "Not specified"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {contract.tenantPhone || "No phone"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(contract.rentAmount)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {contract.paymentFrequency || "Monthly"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(contract.startDate)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {getContractDuration(
                          contract.startDate,
                          contract.endDate
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(contract.status)}
                        <span
                          className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            contract.status
                          )}`}
                        >
                          {contract.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() =>
                          router.push(`/contract-dashboard/${contract.id}`)
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
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No contracts found
          </h3>
          <p className="text-gray-500 mb-6">
            {filterStatus !== "all"
              ? "Try adjusting your filter criteria"
              : "Get started by creating your first rental agreement"}
          </p>
          {filterStatus === "all" && (
            <button
              onClick={() => router.push("/rental-agreement/form")}
              className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors duration-200"
            >
              Create Contract
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardContracts;
