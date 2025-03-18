"use client";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import Spinner from "components/ui/Spinner";
import MyInspections from "@/components/Inspection/MyInspections";
import { fetchUserBookings } from "@/utils/api/inspection/fetchUserBookings";
import { fetchAgentBookings } from "utils/api/inspection/fetchAgentBookings";
import { fetchUserData } from "utils/api/user/fetchUserData";

const MyInspectionPage = () => {
  const { id } = useParams();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");

  //fetch user data
  useEffect(() => {
    const handleFetchUserRole = async () => {
      const userId = sessionStorage.getItem("userId");
      try {
        const res = await fetchUserData(userId);
        setRole(res.role);
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
        if (role === "agent") {
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

  if (loading) {
    return <Spinner />;
  }

  return (
    <section className="bg-white min-h-screen flex items-center">
      <div className="container mx-auto max-w-3xl p-4">
        <h2 className="text-2xl font-bold mb-6 text-center">My Inspections</h2>
        {sortedInspections.length === 0 ? (
          <p className="text-center text-gray-600">No upcoming inspections.</p>
        ) : (
          <MyInspections bookings={sortedInspections} />
        )}
      </div>
    </section>
  );
};

export default MyInspectionPage;
