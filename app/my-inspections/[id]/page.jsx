"use client";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import Spinner from "@/components/Spinner";
import MyInspections from "@/components/Inspection/MyInspections";
import { fetchUserBookings } from "@/utils/api/inspection/fetchUserBookings";
import { fetchPropertyData } from "@/utils/api/properties/fetchPropertyData";

const MyInspectionPage = () => {
  const { id } = useParams();
  const [bookings, setBookings] = useState([]);
  const [properties, setProperties] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleFetchUserBookings = async () => {
      if (!id) return;
      try {
        const res = await fetchUserBookings(id);
        setBookings(res);
      } catch (error) {
        console.error("Error fetching bookings", error);
      } finally {
        setLoading(false);
      }
    };
    handleFetchUserBookings();
  }, [id]);

  useEffect(() => {
    const fetchAllProperties = async () => {
      const propertyPromises = bookings.map((booking) =>
        fetchPropertyData(booking.propertyId)
      );
      const fetchedProperties = await Promise.all(propertyPromises);

      const propertyMap = bookings.reduce((acc, booking, index) => {
        acc[booking.propertyId] = fetchedProperties[index];
        return acc;
      }, {});

      console.log("properties: ", propertyMap);
      setProperties(propertyMap);
    };

    if (bookings.length > 0) {
      fetchAllProperties();
    }
  }, [bookings]);

  const sortedInspections = bookings.sort(
    (a, b) => new Date(a.inspectionDateTime) - new Date(b.inspectionDateTime)
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
          sortedInspections.map((inspection) => (
            <MyInspections
              key={inspection.id}
              bookings={bookings}
              properties={properties}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default MyInspectionPage;
