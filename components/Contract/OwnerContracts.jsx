"use client";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { fetchOwnerContracts } from "utils/api/contract/fetchOwnerContracts";
import { fetchPropertyData } from "utils/api/properties/fetchPropertyData";
import { truncateText } from "utils/helpers/truncateText";
import {
  MapPin,
  Wallet,
  Calendar,
  User,
  ArrowRight,
  Filter,
  Search,
  LayoutGrid,
  List as ListIcon,
  ChevronDown,
  Clock,
  CheckCircle,
  AlertCircle,
  X as CloseIcon,
  Loader2,
  ArrowLeft,
} from "lucide-react";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  paid: "bg-blue-100 text-blue-800 border-blue-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

const STATUS_ICONS = {
  pending: Clock,
  paid: CheckCircle,
  completed: CheckCircle,
  cancelled: AlertCircle,
};

const SORT_OPTIONS = [
  { value: "date-desc", label: "Newest First" },
  { value: "date-asc", label: "Oldest First" },
  { value: "price-desc", label: "Price High to Low" },
  { value: "price-asc", label: "Price Low to High" },
  { value: "property-asc", label: "Property A-Z" },
  { value: "property-desc", label: "Property Z-A" },
];

const OwnerContract = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [sortBy, setSortBy] = useState("date-desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [propertyImages, setPropertyImages] = useState({}); // { propertyId: imageUrl }
  const sortDropdownRef = useRef(null);

  useEffect(() => {
    const handleFetchOwnerContract = async () => {
      try {
        setLoading(true);
        const res = await fetchOwnerContracts();
        console.log("Owner contracts: ", res);
        setContracts(res || []);
      } catch (error) {
        console.error("Failed to fetch contracts:", error);
      } finally {
        setLoading(false);
      }
    };

    handleFetchOwnerContract();
  }, []);

  // Fetch property images for contracts
  useEffect(() => {
    const fetchPropertyImages = async () => {
      if (!contracts.length) return;

      const imagesToFetch = {};
      contracts.forEach((contract) => {
        if (contract.propertyId && !propertyImages[contract.propertyId]) {
          imagesToFetch[contract.propertyId] = true;
        }
      });

      const propertyIds = Object.keys(imagesToFetch);
      if (propertyIds.length === 0) return;

      try {
        const imagePromises = propertyIds.map(async (propertyId) => {
          try {
            const propertyData = await fetchPropertyData(propertyId);
            return {
              propertyId,
              imageUrl: propertyData.photos?.[0]?.path || null,
            };
          } catch (error) {
            console.error(`Failed to fetch property ${propertyId}:`, error);
            return { propertyId, imageUrl: null };
          }
        });

        const results = await Promise.all(imagePromises);
        const newImages = {};
        results.forEach(({ propertyId, imageUrl }) => {
          newImages[propertyId] = imageUrl;
        });

        setPropertyImages((prev) => ({ ...prev, ...newImages }));
      } catch (error) {
        console.error("Failed to fetch property images:", error);
      }
    };

    fetchPropertyImages();
  }, [contracts, propertyImages]);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target)
      ) {
        setShowSortDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter contracts
  const filteredContracts = contracts.filter((contract) => {
    // Status filter
    if (
      activeTab !== "All" &&
      contract.status.toLowerCase() !== activeTab.toLowerCase()
    ) {
      return false;
    }

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        contract.propertyName?.toLowerCase().includes(searchLower) ||
        contract.clientName?.toLowerCase().includes(searchLower) ||
        contract.propertyLocation?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Price range filter
    if (priceRange.min && contract.propertyPrice < parseFloat(priceRange.min)) {
      return false;
    }
    if (priceRange.max && contract.propertyPrice > parseFloat(priceRange.max)) {
      return false;
    }

    // Date range filter (if contract has creation date)
    if (dateRange.start && contract.createdAt) {
      const contractDate = new Date(contract.createdAt);
      const startDate = new Date(dateRange.start);
      if (contractDate < startDate) return false;
    }
    if (dateRange.end && contract.createdAt) {
      const contractDate = new Date(contract.createdAt);
      const endDate = new Date(dateRange.end);
      if (contractDate > endDate) return false;
    }

    return true;
  });

  // Sort contracts
  const sortedContracts = [...filteredContracts].sort((a, b) => {
    switch (sortBy) {
      case "date-desc":
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      case "date-asc":
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      case "price-desc":
        return (b.propertyPrice || 0) - (a.propertyPrice || 0);
      case "price-asc":
        return (a.propertyPrice || 0) - (b.propertyPrice || 0);
      case "property-asc":
        return (a.propertyName || "").localeCompare(b.propertyName || "");
      case "property-desc":
        return (b.propertyName || "").localeCompare(a.propertyName || "");
      default:
        return 0;
    }
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusIcon = (status) => {
    const IconComponent = STATUS_ICONS[status] || Clock;
    return <IconComponent className="w-4 h-4" />;
  };

  const clearFilters = () => {
    setSearchTerm("");
    setPriceRange({ min: "", max: "" });
    setDateRange({ start: "", end: "" });
  };

  const hasActiveFilters =
    searchTerm ||
    priceRange.min ||
    priceRange.max ||
    dateRange.start ||
    dateRange.end;

  const FilterSortBar = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 mb-4 sm:mb-6">
      <div className="flex flex-col gap-3 sm:gap-4">
        {/* Search - Full width on mobile */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search properties, clients, locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
          />
        </div>

        {/* Controls Row - Stack on mobile, row on desktop */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1 self-start sm:self-auto">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-white text-primary-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "list"
                  ? "bg-white text-primary-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="relative flex-1 sm:flex-none" ref={sortDropdownRef}>
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="w-full sm:w-auto flex items-center justify-between sm:justify-start space-x-2 px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
            >
              <span className="font-medium text-gray-700 truncate">
                {SORT_OPTIONS.find((option) => option.value === sortBy)
                  ?.label || "Sort by"}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
            </button>

            {showSortDropdown && (
              <div className="absolute left-0 right-0 sm:right-auto top-full mt-1 w-full sm:w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value);
                      setShowSortDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                      sortBy === option.value
                        ? "bg-primary-50 text-primary-600"
                        : "text-gray-700"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center space-x-2 px-3 sm:px-4 py-2.5 sm:py-2 rounded-lg transition-colors text-sm sm:text-base font-medium ${
              showFilters || hasActiveFilters
                ? "bg-primary-100 text-primary-700 border border-primary-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
            )}
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="pt-3 sm:pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Price
                </label>
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange((prev) => ({ ...prev, min: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Price
                </label>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange((prev) => ({ ...prev, max: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange((prev) => ({ ...prev, start: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange((prev) => ({ ...prev, end: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {hasActiveFilters && (
              <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <span className="text-sm text-gray-600">
                  {sortedContracts.length} of {contracts.length} contracts
                </span>
                <button
                  onClick={clearFilters}
                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <CloseIcon className="w-4 h-4" />
                  <span>Clear filters</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderContractCard = (contract) => (
    <Link
      href={`/contract-dashboard/${contract._id}`}
      key={contract._id}
      className="group"
    >
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-primary-200 transition-all duration-200 transform hover:-translate-y-1">
        {/* Property Image */}
        <div className="relative h-48 bg-gray-100">
          {propertyImages[contract.propertyId] ? (
            <Image
              src={propertyImages[contract.propertyId]}
              alt={contract.propertyName}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200">
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-300 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-gray-500" />
                </div>
                <p className="text-sm text-gray-500">Loading image...</p>
              </div>
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <span
              className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${
                STATUS_COLORS[contract.status]
              }`}
            >
              {getStatusIcon(contract.status)}
              <span className="capitalize">{contract.status}</span>
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
            {truncateText(contract.propertyName, 40)}
          </h3>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <User className="w-4 h-4 mr-2 text-gray-400" />
              <span>{truncateText(contract.clientName, 30)}</span>
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2 text-gray-400" />
              <span>{truncateText(contract.propertyLocation, 35)}</span>
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <Wallet className="w-4 h-4 mr-2 text-gray-400" />
              <span className="font-medium text-gray-900">
                {formatCurrency(contract.propertyPrice)}
              </span>
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
              <span>Created {formatDate(contract.createdAt)}</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <span className="text-sm text-primary-600 font-medium">
              View Details
            </span>
            <ArrowRight className="w-4 h-4 text-primary-600 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );

  const renderContractList = (contract) => (
    <Link
      href={`/contract-dashboard/${contract._id}`}
      key={contract._id}
      className="group"
    >
      <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg hover:border-primary-200 transition-all duration-200">
        <div className="flex items-center space-x-4">
          {/* Property Image */}
          <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            {propertyImages[contract.propertyId] ? (
              <Image
                src={propertyImages[contract.propertyId]}
                alt={contract.propertyName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200">
                <MapPin className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                {contract.propertyName}
              </h3>
              <span
                className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ml-2 flex-shrink-0 ${
                  STATUS_COLORS[contract.status]
                }`}
              >
                {getStatusIcon(contract.status)}
                <span className="capitalize">{contract.status}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-600">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2 text-gray-400" />
                <span className="truncate">{contract.clientName}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                <span className="truncate">{contract.propertyLocation}</span>
              </div>
              <div className="flex items-center">
                <Wallet className="w-4 h-4 mr-2 text-gray-400" />
                <span className="font-medium text-gray-900">
                  {formatCurrency(contract.propertyPrice)}
                </span>
              </div>
            </div>

            <div className="flex items-center text-sm text-gray-500 mt-2">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Created {formatDate(contract.createdAt)}</span>
            </div>
          </div>

          {/* Arrow */}
          <ArrowRight className="w-5 h-5 text-primary-600 group-hover:translate-x-1 transition-transform flex-shrink-0" />
        </div>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your contracts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  My Contracts
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Wallet className="w-4 h-4" />
              <span>Contracts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Status Tabs */}
        <div className="flex flex-wrap justify-center gap-1 sm:gap-2 mb-4 sm:mb-6">
          {[
            {
              name: "All",
              color: "bg-gray-100 text-gray-700 border-gray-300",
              activeColor: "bg-gray-600 text-white",
            },
            {
              name: "Pending",
              color: "bg-yellow-100 text-yellow-700 border-yellow-300",
              activeColor: "bg-yellow-500 text-white",
            },
            {
              name: "Paid",
              color: "bg-blue-100 text-blue-700 border-blue-300",
              activeColor: "bg-blue-500 text-white",
            },
            {
              name: "Completed",
              color: "bg-green-100 text-green-700 border-green-300",
              activeColor: "bg-green-500 text-white",
            },
            {
              name: "Cancelled",
              color: "bg-red-100 text-red-700 border-red-300",
              activeColor: "bg-red-500 text-white",
            },
          ].map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 border ${
                activeTab === tab.name
                  ? `${tab.activeColor} shadow-md`
                  : `${tab.color} hover:shadow-sm hover:scale-105`
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Filter and Sort Bar */}
        <FilterSortBar />

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-600">
            {sortedContracts.length} contract
            {sortedContracts.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Contracts Display */}
        {sortedContracts.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {sortedContracts.map((contract) =>
              viewMode === "grid"
                ? renderContractCard(contract)
                : renderContractList(contract)
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md mx-auto">
              <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No contracts found
              </h3>
              <p className="text-gray-600 mb-6">
                {hasActiveFilters
                  ? "Try adjusting your filters to see more results."
                  : "You don't have any contracts yet."}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerContract;
