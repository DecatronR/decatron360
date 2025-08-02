"use client";
import React, { useState } from "react";
import { Search, Filter, Plus, Eye, Edit, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";

const DashboardProperties = ({ userProperties }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const getFilteredProperties = () => {
    let filtered = userProperties || [];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (property) =>
          property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== "all") {
      filtered = filtered.filter(
        (property) => property.listingType === filterType
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "price-high":
          return (b.price || 0) - (a.price || 0);
        case "price-low":
          return (a.price || 0) - (b.price || 0);
        case "name":
          return (a.title || "").localeCompare(b.title || "");
        default:
          return 0;
      }
    });

    return filtered;
  };

  const getStatusColor = (status) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      pending: "bg-yellow-100 text-yellow-800",
      draft: "bg-blue-100 text-blue-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getListingTypeColor = (type) => {
    return type === "for-rent"
      ? "bg-blue-100 text-blue-800"
      : "bg-green-100 text-green-800";
  };

  const formatPrice = (price) => {
    if (!price) return "Price on request";
    return `₦${price.toLocaleString()}`;
  };

  const filteredProperties = getFilteredProperties();

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              My Properties
            </h2>
            <p className="text-sm text-gray-600">
              Manage your property listings ({filteredProperties.length}{" "}
              properties)
            </p>
          </div>
          <button
            onClick={() => router.push("/properties/add/for-rent")}
            className="flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Add Property</span>
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="for-rent">For Rent</option>
            <option value="for-sale">For Sale</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="recent">Most Recent</option>
            <option value="price-high">Price: High to Low</option>
            <option value="price-low">Price: Low to High</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>
      </div>

      {/* Properties Grid */}
      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 overflow-hidden"
            >
              {/* Property Image */}
              <div className="relative h-48 bg-gray-200">
                {property.images?.[0] ? (
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span>No image available</span>
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      property.status
                    )}`}
                  >
                    {property.status}
                  </span>
                </div>

                {/* Type Badge */}
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getListingTypeColor(
                      property.listingType
                    )}`}
                  >
                    {property.listingType === "for-rent" ? "Rent" : "Sale"}
                  </span>
                </div>

                {/* Actions Menu */}
                <div className="absolute top-3 right-3">
                  <button className="p-1 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow duration-200">
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Property Details */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {property.title || "Untitled Property"}
                </h3>

                <p className="text-sm text-gray-600 mb-3 line-clamp-1">
                  {property.location || "Location not specified"}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold text-primary-600">
                    {formatPrice(property.price)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {property.bedrooms || 0} bed • {property.bathrooms || 0}{" "}
                    bath
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => router.push(`/properties/${property.id}`)}
                    className="flex-1 flex items-center justify-center space-x-1 bg-primary-50 text-primary-600 px-3 py-2 rounded-lg hover:bg-primary-100 transition-colors duration-200"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">View</span>
                  </button>
                  <button
                    onClick={() =>
                      router.push(`/properties/${property.id}/edit`)
                    }
                    className="flex-1 flex items-center justify-center space-x-1 bg-gray-50 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="text-sm font-medium">Edit</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No properties found
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || filterType !== "all"
              ? "Try adjusting your search or filter criteria"
              : "Get started by adding your first property"}
          </p>
          {!searchTerm && filterType === "all" && (
            <button
              onClick={() => router.push("/properties/add/for-rent")}
              className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors duration-200"
            >
              Add Your First Property
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardProperties;
