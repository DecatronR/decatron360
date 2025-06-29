"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  MapPin,
  Calendar,
  User,
  Building2,
  ArrowRight,
  Play,
  CheckCircle,
  AlertCircle,
  Loader2,
  Archive as ArchiveIcon,
  X as CloseIcon,
  ArrowDownCircle,
  LayoutGrid,
  List as ListIcon,
} from "lucide-react";
import { fetchUserData } from "@/utils/api/user/fetchUserData";

const ARCHIVE_LIMIT = 9;

const ArchiveModal = ({ open, onClose, inspections, renderInspection }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
          aria-label="Close archive"
        >
          <CloseIcon className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <ArchiveIcon className="w-5 h-5 text-primary-600" /> Archive
        </h2>
        {inspections.length === 0 ? (
          <div className="text-center py-8">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No archived inspections.</p>
          </div>
        ) : (
          <div className="space-y-6">{inspections.map(renderInspection)}</div>
        )}
      </div>
    </div>
  );
};

// Add a simple mobile detection hook
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

const MyInspections = ({ bookings, role }) => {
  const [timeLeft, setTimeLeft] = useState({});
  const [loadingStates, setLoadingStates] = useState({});
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const bottomRef = useRef(null);
  const [viewMode, setViewMode] = useState("list"); // "list" or "grid"
  const [userProfiles, setUserProfiles] = useState({}); // { userId: { name, passport } }
  const isMobile = useIsMobile();

  // Split into recent and archived
  const sortedBookings = [...bookings].sort(
    (a, b) =>
      new Date(b.booking.bookingDateTime) - new Date(a.booking.bookingDateTime)
  );

  // Filtering
  const filteredBookings = sortedBookings.filter((booking) => {
    const date = new Date(booking.booking.bookingDateTime);
    let status = "upcoming";
    if (date < new Date()) status = "completed";
    if (statusFilter !== "all" && status !== statusFilter) return false;
    if (dateRange.start && date < new Date(dateRange.start)) return false;
    if (dateRange.end && date > new Date(dateRange.end)) return false;
    return true;
  });

  // Sorting
  const sortedFilteredBookings = [...filteredBookings].sort((a, b) => {
    if (sortBy === "date-desc") {
      return (
        new Date(b.booking.bookingDateTime) -
        new Date(a.booking.bookingDateTime)
      );
    } else if (sortBy === "date-asc") {
      return (
        new Date(a.booking.bookingDateTime) -
        new Date(b.booking.bookingDateTime)
      );
    } else if (sortBy === "property-asc") {
      return (a.propertyDetails.title || "").localeCompare(
        b.propertyDetails.title || ""
      );
    } else if (sortBy === "property-desc") {
      return (b.propertyDetails.title || "").localeCompare(
        a.propertyDetails.title || ""
      );
    }
    return 0;
  });

  const recentInspections = sortedFilteredBookings.slice(0, ARCHIVE_LIMIT);
  const archivedInspections = sortedFilteredBookings.slice(ARCHIVE_LIMIT);

  const truncateText = (text, maxLength = 100) => {
    if (!text) return "Loading...";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const calculateTimeLeft = (inspectionDateTime) => {
    const now = new Date();
    const distance = new Date(inspectionDateTime) - now;

    if (distance < 0) {
      return { status: "expired", text: "Inspection time has passed" };
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60 * 60)) / 1000);

    if (days > 0) {
      return { status: "upcoming", text: `${days}d ${hours}h ${minutes}m` };
    } else if (hours > 0) {
      return { status: "soon", text: `${hours}h ${minutes}m ${seconds}s` };
    } else {
      return { status: "urgent", text: `${minutes}m ${seconds}s` };
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "urgent":
        return "text-red-600 bg-red-50 border-red-200";
      case "soon":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "upcoming":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "expired":
        return "text-gray-600 bg-gray-50 border-gray-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "urgent":
        return <AlertCircle className="w-4 h-4" />;
      case "soon":
        return <Clock className="w-4 h-4" />;
      case "upcoming":
        return <Calendar className="w-4 h-4" />;
      case "expired":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  useEffect(() => {
    const updateTimes = () => {
      const newTimeLeft = {};
      bookings.forEach((booking) => {
        newTimeLeft[booking.booking._id] = calculateTimeLeft(
          booking.booking.bookingDateTime
        );
      });
      setTimeLeft(newTimeLeft);
    };

    updateTimes();
    const intervalId = setInterval(updateTimes, 1000);
    return () => clearInterval(intervalId);
  }, [bookings]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollBtn(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleStartTracking = (bookingId) => {
    setLoadingStates((prev) => ({ ...prev, [bookingId]: true }));
  };

  // Fetch agent/client data for each booking
  useEffect(() => {
    const fetchProfiles = async () => {
      const idsToFetch = new Set();
      bookings.forEach((booking) => {
        if (role === "buyer" && booking.booking.agentID) {
          idsToFetch.add(booking.booking.agentID);
        } else if (
          ["agent", "owner", "property-manager"].includes(role) &&
          booking.booking.userID
        ) {
          idsToFetch.add(booking.booking.userID);
        }
      });
      const idsArray = Array.from(idsToFetch).filter(
        (id) => id && !userProfiles[id]
      );
      if (idsArray.length === 0) return;
      const results = await Promise.all(
        idsArray.map(async (id) => {
          try {
            const data = await fetchUserData(id);
            return [
              id,
              {
                name:
                  data.name ||
                  `${data.firstName || ""} ${data.lastName || ""}`.trim(),
                passport: data.passport,
              },
            ];
          } catch {
            return [id, { name: "Unknown", passport: null }];
          }
        })
      );
      setUserProfiles((prev) => {
        const updated = { ...prev };
        results.forEach(([id, profile]) => {
          updated[id] = profile;
        });
        return updated;
      });
    };
    fetchProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookings, role]);

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 rounded-xl p-8 max-w-md mx-auto">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Inspections Available
          </h3>
          <p className="text-gray-600">
            You don't have any upcoming inspections at the moment.
          </p>
        </div>
      </div>
    );
  }

  // Filter/Sort Bar
  const FilterSortBar = () => (
    <div className="flex flex-col sm:flex-row flex-wrap sm:flex-nowrap gap-3 sm:gap-4 items-stretch sm:items-center justify-between mb-4 bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-100">
      {/* Status Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
        <label className="font-medium text-gray-700">Status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-lg px-2 py-1 text-gray-700 focus:ring-2 focus:ring-primary-500 w-full sm:w-auto"
        >
          <option value="all">All</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      {/* Date Range */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
        <label className="font-medium text-gray-700">From:</label>
        <input
          type="date"
          value={dateRange.start}
          onChange={(e) =>
            setDateRange((r) => ({ ...r, start: e.target.value }))
          }
          className="border rounded-lg px-2 py-1 text-gray-700 focus:ring-2 focus:ring-primary-500 w-full sm:w-auto"
        />
        <label className="font-medium text-gray-700">To:</label>
        <input
          type="date"
          value={dateRange.end}
          onChange={(e) => setDateRange((r) => ({ ...r, end: e.target.value }))}
          className="border rounded-lg px-2 py-1 text-gray-700 focus:ring-2 focus:ring-primary-500 w-full sm:w-auto"
        />
      </div>
      {/* Sort By */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
        <label className="font-medium text-gray-700">Sort by:</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded-lg px-2 py-1 text-gray-700 focus:ring-2 focus:ring-primary-500 w-full sm:w-auto"
        >
          <option value="date-desc">Date (Newest)</option>
          <option value="date-asc">Date (Oldest)</option>
          <option value="property-asc">Property (A-Z)</option>
          <option value="property-desc">Property (Z-A)</option>
        </select>
      </div>
      {/* View Mode Toggle (desktop only) */}
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
              ? "bg-primary-600 text-white border-primary-600"
              : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
          } transition-colors`}
          aria-label="Grid view"
        >
          <LayoutGrid className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  // Render a single inspection card (used for both recent and archive)
  const renderInspection = (booking, mode = viewMode) => {
    const timeInfo = timeLeft[booking.booking._id];
    const isLoading = loadingStates[booking.booking._id];
    // Determine which user to show
    let userIdToShow = null;
    let userRoleLabel = null;
    if (role === "buyer") {
      userIdToShow = booking.booking.agentID;
      userRoleLabel = "Agent";
    } else if (["agent", "owner", "property-manager"].includes(role)) {
      userIdToShow = booking.booking.userID;
      userRoleLabel = "Client";
    }
    const userProfile = userIdToShow ? userProfiles[userIdToShow] : null;

    // Card layout tweaks for grid vs list
    const ProfileBadge = userProfile ? (
      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex items-center gap-2 bg-white/80 rounded-full px-1.5 py-0.5 sm:px-2 sm:py-1 shadow-sm z-10">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
          {userProfile.passport ? (
            <Image
              src={userProfile.passport}
              alt={userProfile.name || "Profile"}
              width={32}
              height={32}
              className="object-cover w-full h-full"
            />
          ) : (
            <Image
              src="/placeholder.jpg"
              alt="Placeholder"
              width={32}
              height={32}
              className="object-cover w-full h-full"
            />
          )}
        </div>
        <span className="text-xs font-medium text-gray-800 truncate max-w-[60px] sm:max-w-[80px]">
          {userProfile.name}
        </span>
      </div>
    ) : null;
    if (mode === "grid") {
      return (
        <div
          key={booking.booking._id}
          className="relative flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
          style={{ minHeight: "460px" }}
        >
          {ProfileBadge}
          <div className="flex-1 flex flex-col p-3 sm:p-4">
            {/* Property Image */}
            <div className="relative w-full h-32 sm:h-36 mb-3 sm:mb-4 rounded-lg overflow-hidden flex-shrink-0">
              <Link
                href={`/properties/${booking.propertyDetails._id}`}
                className="block"
              >
                <Image
                  src={booking.photos[0]?.path || "/placeholder.jpg"}
                  alt={booking.propertyDetails.title || "Property image"}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </Link>
            </div>
            {/* Property Details */}
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <div className="mb-2">
                <Link href={`/properties/${booking.propertyDetails._id}`}>
                  <h2 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors truncate overflow-hidden whitespace-nowrap">
                    {booking.propertyDetails.title || "Loading..."}
                  </h2>
                </Link>
                <p
                  className="text-gray-600 mt-1 text-sm"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {booking.propertyDetails.propertyDetails}
                </p>
              </div>
              {/* Location */}
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="w-4 h-4 mr-2 text-primary-500 flex-shrink-0" />
                <span className="text-sm truncate">
                  {booking.propertyDetails.neighbourhood || "Loading..."},{" "}
                  {booking.propertyDetails.lga || "Loading..."},{" "}
                  {booking.propertyDetails.state || "Loading..."}
                </span>
              </div>
              {/* Inspection Date */}
              <div className="flex items-center text-gray-600 mb-2">
                <Calendar className="w-4 h-4 mr-2 text-purple-500 flex-shrink-0" />
                <span className="text-sm">
                  {new Date(booking.booking.bookingDateTime).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </span>
              </div>
              {/* Inspection Time */}
              <div className="flex items-center text-gray-600 mb-2">
                <Clock className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
                <span className="text-sm">
                  {new Date(booking.booking.bookingDateTime).toLocaleTimeString(
                    "en-US",
                    {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    }
                  )}
                </span>
              </div>
              {/* Time Status */}
              <div className="flex items-center mb-4">
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                    timeInfo?.status
                  )}`}
                >
                  {getStatusIcon(timeInfo?.status)}
                  <span className="ml-1">{timeInfo?.text}</span>
                </div>
              </div>
              {/* Action Button - always at bottom */}
              <div className="mt-auto">
                <Link href={`/inspection/tracking/${booking.booking._id}`}>
                  <button
                    onClick={() => handleStartTracking(booking.booking._id)}
                    disabled={isLoading || timeInfo?.status === "expired"}
                    className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                      timeInfo?.status === "expired"
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-primary-600 hover:bg-primary-700 text-white hover:scale-105 shadow-lg"
                    }`}
                    style={{ minHeight: 44 }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Loading...</span>
                      </>
                    ) : timeInfo?.status === "expired" ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Inspection Completed</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>Start Tracking</span>
                      </>
                    )}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }
    // list mode
    return (
      <div
        key={booking.booking._id}
        className="relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
      >
        {ProfileBadge}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-6 items-start overflow-hidden">
          {/* Property Image */}
          <div className="relative w-full h-32 sm:w-40 sm:h-40 rounded-lg overflow-hidden mb-3 sm:mb-0 flex-shrink-0">
            <Link
              href={`/properties/${booking.propertyDetails._id}`}
              className="block"
            >
              <Image
                src={booking.photos[0]?.path || "/placeholder.jpg"}
                alt={booking.propertyDetails.title || "Property image"}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </Link>
          </div>
          {/* Property Details */}
          <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="mb-2">
              <Link href={`/properties/${booking.propertyDetails._id}`}>
                <h2 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors truncate overflow-hidden whitespace-nowrap">
                  {booking.propertyDetails.title || "Loading..."}
                </h2>
              </Link>
              <p
                className="text-gray-600 mt-1 text-sm line-clamp-2 overflow-hidden"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {booking.propertyDetails.propertyDetails}
              </p>
            </div>
            {/* Location */}
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="w-4 h-4 mr-2 text-primary-500 flex-shrink-0" />
              <span className="text-sm truncate">
                {booking.propertyDetails.neighbourhood || "Loading..."},{" "}
                {booking.propertyDetails.lga || "Loading..."},{" "}
                {booking.propertyDetails.state || "Loading..."}
              </span>
            </div>
            {/* Inspection Date */}
            <div className="flex items-center text-gray-600 mb-2">
              <Calendar className="w-4 h-4 mr-2 text-purple-500 flex-shrink-0" />
              <span className="text-sm">
                {new Date(booking.booking.bookingDateTime).toLocaleDateString(
                  "en-US",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </span>
            </div>
            {/* Inspection Time */}
            <div className="flex items-center text-gray-600 mb-2">
              <Clock className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
              <span className="text-sm">
                {new Date(booking.booking.bookingDateTime).toLocaleTimeString(
                  "en-US",
                  {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  }
                )}
              </span>
            </div>
            {/* Time Status */}
            <div className="flex items-center mb-2">
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                  timeInfo?.status
                )}`}
              >
                {getStatusIcon(timeInfo?.status)}
                <span className="ml-1">{timeInfo?.text}</span>
              </div>
            </div>
            {/* Action Button - always at bottom */}
            <div className="mt-auto pt-2">
              <Link href={`/inspection/tracking/${booking.booking._id}`}>
                <button
                  onClick={() => handleStartTracking(booking.booking._id)}
                  disabled={isLoading || timeInfo?.status === "expired"}
                  className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                    timeInfo?.status === "expired"
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-primary-500 hover:bg-primary-600 text-white hover:scale-105 shadow-lg"
                  }`}
                  style={{ minHeight: 44, maxHeight: 44, overflow: "hidden" }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Loading...</span>
                    </>
                  ) : timeInfo?.status === "expired" ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Inspection Completed</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>Start Tracking</span>
                    </>
                  )}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render inspections as grid or list
  const renderInspections = (inspections) => {
    // Always use grid layout on mobile
    if (isMobile || viewMode === "grid") {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {inspections.map((booking) => renderInspection(booking, "grid"))}
        </div>
      );
    }
    // list mode (desktop only)
    return (
      <div className="space-y-6">
        {inspections.map((booking) => renderInspection(booking, "list"))}
      </div>
    );
  };

  return (
    <div className="space-y-6 relative">
      <FilterSortBar />
      {/* Recent Inspections */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900">
          Recent Inspections
        </h3>
        {archivedInspections.length > 0 && (
          <button
            onClick={() => setArchiveOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-primary-50 hover:bg-primary-100 text-primary-700 font-medium transition-colors"
          >
            <ArchiveIcon className="w-4 h-4" />
            <span>View Archive</span>
          </button>
        )}
      </div>
      {recentInspections.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No inspections found for the selected filters.
        </div>
      ) : (
        renderInspections(recentInspections)
      )}
      {/* Archive Modal */}
      <ArchiveModal
        open={archiveOpen}
        onClose={() => setArchiveOpen(false)}
        inspections={archivedInspections}
        renderInspection={renderInspection}
      />
      {/* Scroll to bottom anchor */}
      <div ref={bottomRef} />
      {/* Floating Scroll-to-Bottom Button */}
      {showScrollBtn && (
        <button
          onClick={handleScrollToBottom}
          className="fixed z-100 bottom-15 right-6 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg p-3 flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-400"
          aria-label="Scroll to bottom"
        >
          <ArrowDownCircle className="w-7 h-7" />
        </button>
      )}
    </div>
  );
};

export default MyInspections;
