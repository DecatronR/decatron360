"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSnackbar } from "notistack";
import { fetchAllPropertyRequests } from "@/utils/api/propertyRequest/fetchAllPropertyRequests";
import {
  Building2,
  MapPin,
  Calendar,
  User,
  DollarSign,
  Filter,
  Search,
  Loader2,
  LayoutGrid,
  List as ListIcon,
  Archive as ArchiveIcon,
  X,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const PropertyRequestList = () => {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("list"); // "list" or "grid"
  const [filters, setFilters] = useState({
    status: "all",
    state: "",
    lga: "",
    category: "",
    propertyType: "",
    propertyUsage: "",
    phone: "",
    user: "",
  });
  const [sortBy, setSortBy] = useState("createdAt");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [archiveOpen, setArchiveOpen] = useState(false);

  const fetchRequests = async (page = 1, append = false) => {
    try {
      setLoading(true);

      // Only include non-empty filter values
      const cleanFilters = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "" && value !== "all") {
          cleanFilters[key] = value;
        }
      });

      const params = {
        page,
        limit: 10,
        ...cleanFilters,
        sortBy,
        order: sortBy === "createdAt" ? "desc" : "asc",
      };

      console.log("Fetching with params:", params); // Debug the request parameters
      const response = await fetchAllPropertyRequests(params);
      console.log("API Response:", response); // Debug the response structure

      // Extract data from the correct response structure
      const responseData = response.requests || [];
      const total = response.total || 0;

      console.log("Extracted data:", responseData); // Debug the extracted data
      console.log("Total:", total); // Debug the total count

      if (append) {
        setRequests((prev) => [...(prev || []), ...responseData]);
      } else {
        setRequests(responseData);
      }

      setHasMore(responseData.length === 10 && page * 10 < total);
      setCurrentPage(page);
    } catch (error) {
      console.error("Failed to fetch property requests:", error);
      enqueueSnackbar("Failed to load property requests", { variant: "error" });
      setRequests([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(1, false);
  }, [filters, sortBy]);

  const handleLoadMore = () => {
    fetchRequests(currentPage + 1, true);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      status: "all",
      state: "",
      lga: "",
      category: "",
      propertyType: "",
      propertyUsage: "",
      phone: "",
      user: "",
    });
    setCurrentPage(1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "in_progress":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "completed":
        return "text-green-600 bg-green-50 border-green-200";
      case "cancelled":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  // Filter/Sort Bar
  const FilterSortBar = () => (
    <div className="flex flex-col sm:flex-row flex-wrap sm:flex-nowrap gap-3 sm:gap-4 items-stretch sm:items-center justify-between mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      {/* Status Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
        <label className="font-medium text-gray-700">Status:</label>
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className="border rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
        <label className="font-medium text-gray-700">Search:</label>
        <input
          type="text"
          placeholder="Search by phone or user..."
          value={filters.phone || filters.user}
          onChange={(e) => {
            const value = e.target.value;
            handleFilterChange("phone", value);
            handleFilterChange("user", value);
          }}
          className="border rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
        />
      </div>

      {/* Sort By */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
        <label className="font-medium text-gray-700">Sort by:</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
        >
          <option value="createdAt">Date (Newest)</option>
          <option value="createdAt-asc">Date (Oldest)</option>
          <option value="budget">Budget (High to Low)</option>
          <option value="budget-asc">Budget (Low to High)</option>
        </select>
      </div>

      {/* View Mode Toggle */}
      <div className="hidden sm:flex items-center gap-2 ml-auto">
        <button
          onClick={() => setViewMode("list")}
          className={`p-2 rounded-lg border ${
            viewMode === "list"
              ? "bg-primary-600 text-white border-primary-600"
              : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
          } transition-colors`}
          aria-label="List view"
        >
          <ListIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => setViewMode("grid")}
          className={`p-2 rounded-lg border ${
            viewMode === "grid"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
          } transition-colors`}
          aria-label="Grid view"
        >
          <LayoutGrid className="w-5 h-5" />
        </button>
      </div>

      {/* Clear Filters */}
      <button
        onClick={clearFilters}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <X className="w-4 h-4" />
        Clear Filters
      </button>
    </div>
  );

  // Render a single property request card
  const renderRequestCard = (request) => {
    const isGrid = viewMode === "grid";

    return (
      <div
        key={request._id}
        className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 ${
          isGrid ? "flex flex-col h-full" : ""
        }`}
      >
        <div
          className={`${
            isGrid
              ? "flex-1 flex flex-col p-4"
              : "flex flex-col sm:flex-row gap-4 p-6"
          }`}
        >
          {/* Request Details */}
          <div className={`${isGrid ? "flex-1" : "flex-1 min-w-0"}`}>
            {/* Header */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  Property Request
                </h3>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                    request.status
                  )}`}
                >
                  {request.status?.replace("_", " ").toUpperCase() || "PENDING"}
                </span>
              </div>

              {/* User Info */}
              <div className="flex items-center text-gray-600 mb-2">
                <User className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
                <span className="text-sm">
                  {request.name} • {request.role}
                </span>
              </div>

              {/* Contact Info */}
              <div className="flex items-center text-gray-600 mb-2">
                <span className="text-sm">
                  📧 {request.email} • 📞 {request.phone}
                </span>
              </div>
            </div>

            {/* Property Details */}
            <div className="space-y-2 mb-3">
              <div className="flex items-center text-gray-600">
                <Building2 className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                <span className="text-sm">
                  {request.category} • {request.propertyType} •{" "}
                  {request.propertyUsage}
                </span>
              </div>

              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2 text-red-500 flex-shrink-0" />
                <span className="text-sm">
                  {request.neighbourhood}, {request.lga}, {request.state}
                </span>
              </div>

              <div className="flex items-center text-gray-600">
                <DollarSign className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                <span className="text-sm font-medium">
                  Budget: {formatCurrency(request.budget)}
                </span>
              </div>
            </div>

            {/* Notes */}
            {request.note && (
              <div className="mb-3">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {truncateText(request.note, 120)}
                </p>
              </div>
            )}

            {/* Date */}
            <div className="flex items-center text-gray-500 text-sm">
              <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>
                {formatDistanceToNow(new Date(request.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading && (!requests || requests.length === 0)) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 rounded-xl p-8 max-w-md mx-auto">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Property Requests Found
          </h3>
          <p className="text-gray-600">
            There are no property requests matching your criteria.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FilterSortBar />

      {/* Property Requests List/Grid */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map(renderRequestCard)}
        </div>
      ) : (
        <div className="space-y-6">{requests.map(renderRequestCard)}</div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default PropertyRequestList;
