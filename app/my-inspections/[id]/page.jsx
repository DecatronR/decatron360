"use client";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Building2, Calendar, ArrowLeft, Loader2 } from "lucide-react";
import MyInspections from "@/components/Inspection/MyInspections";
import { fetchUserBookings } from "@/utils/api/inspection/fetchUserBookings";
import { fetchAgentBookings } from "utils/api/inspection/fetchAgentBookings";
import { fetchUserData } from "utils/api/user/fetchUserData";
import { useRouter } from "next/navigation";

const MyInspectionPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const [userData, setUserData] = useState(null);

  // Fetch user data
  useEffect(() => {
    const handleFetchUserRole = async () => {
      const userId = sessionStorage.getItem("userId");
      try {
        const res = await fetchUserData(userId);
        setRole(res.role);
        setUserData(res);
      } catch (error) {
        console.log("Failed to fetch user data:", error);
      }
    };
    handleFetchUserRole();
  }, []);

  // Fetch bookings based on role
  useEffect(() => {
    const handleFetchBookings = async () => {
      if (!id || !role) return;

      try {
        let res;
        if (
          role === "agent" ||
          role === "owner" ||
          role === "property-manager"
        ) {
          res = await fetchAgentBookings(id);
        } else {
          res = await fetchUserBookings(id);
        }
        setBookings(res);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    handleFetchBookings();
  }, [id, role]);

  const sortedInspections = bookings.sort(
    (a, b) =>
      new Date(a.booking.bookingDateTime) - new Date(b.booking.bookingDateTime)
  );

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your inspections...</p>
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
                onClick={handleBack}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  My Inspections
                </h1>
                {/* <p className="text-sm text-gray-600">
                  {userData?.firstName ? `${userData.firstName}'s` : "Your"}{" "}
                  upcoming property inspections
                </p> */}
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>
                {sortedInspections.length} inspection
                {sortedInspections.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {sortedInspections.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md mx-auto">
              <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Upcoming Inspections
              </h3>
              <p className="text-gray-600 mb-6">
                You don't have any scheduled property inspections at the moment.
              </p>
              <button
                onClick={handleBack}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        ) : (
          <MyInspections bookings={sortedInspections} role={role} />
        )}
      </div>
    </div>
  );
};

export default MyInspectionPage;
