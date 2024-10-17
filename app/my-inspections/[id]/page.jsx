"use client";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import Spinner from "@/components/Spinner";
import MyInspections from "@/components/Inspection/MyInspections";
import { fetchUserBookings } from "@/utils/api/inspection/fetchUserBookings";

const MyInspectionPage = () => {
  const { id } = useParams();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleFetchUserBookings = async () => {
      if (!id) return;
      try {
        const res = await fetchUserBookings(id);
        console.log("User bookings: ", res);
        setBookings(res);
      } catch (error) {
        console.error("Error fetching bookings", error);
      } finally {
        setLoading(false);
      }
    };
    handleFetchUserBookings();
  }, [id]);

  const sortedInspections = bookings.sort(
    (a, b) =>
      new Date(a.booking.bookingDateTime) - new Date(b.booking.bookingDateTime)
  );

  if (loading) {
    return <Spinner />;
  }

  return (
    <section className="bg-blue-50 min-h-screen flex items-center">
      <div className="container mx-auto max-w-3xl p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">My Inspections</h1>
        {sortedInspections.length === 0 ? (
          <p className="text-center text-gray-600">No upcoming inspections.</p>
        ) : (
          // Pass the sorted bookings to MyInspections component
          <MyInspections bookings={sortedInspections} />
        )}
      </div>
    </section>
  );
};

export default MyInspectionPage;
