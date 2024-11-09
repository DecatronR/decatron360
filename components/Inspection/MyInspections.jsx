"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaClock, FaMapMarkerAlt } from "react-icons/fa";

const MyInspections = ({ bookings }) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const calculateTimeLeft = (inspectionDateTime) => {
    const now = new Date();
    const distance = new Date(inspectionDateTime) - now;

    if (distance < 0) {
      return "Inspection time has passed.";
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const [timeLeft, setTimeLeft] = useState(
    bookings.map((booking) =>
      calculateTimeLeft(booking.booking.bookingDateTime)
    )
  );

  // Update the time left for each booking every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft(
        bookings.map((booking) =>
          calculateTimeLeft(booking.booking.bookingDateTime)
        )
      );
    }, 1000);

    // Cleanup the interval when component unmounts
    return () => clearInterval(intervalId);
  }, [bookings]);

  return (
    <div className="container mx-auto p-4">
      {bookings.length === 0 ? (
        <p>No inspections available.</p>
      ) : (
        bookings.map((booking, index) => {
          const handleStartTracking = () => {
            alert("Tracking started!");
          };

          return (
            <div
              key={booking.booking._id}
              className="bg-white shadow-md rounded-lg p-6 mb-6"
            >
              <div className="flex items-start mb-4">
                <Link href={""} passHref>
                  <Image
                    src={`${booking.photos[0].path}` || "/placeholder.jpg"}
                    alt={booking.propertyDetails.title || "Property image"}
                    width={100}
                    height={100}
                    className="rounded-lg mr-4 cursor-pointer object-cover"
                  />
                </Link>
                <Link href={``} passHref>
                  <h1 className="text-2xl font-bold cursor-pointer hover:underline">
                    {booking.propertyDetails.title || "Loading..."}
                  </h1>
                </Link>
              </div>
              <p className="text-gray-600 mb-4">
                {booking.propertyDetails.propertyDetails || "Loading..."}
              </p>
              <div className="flex items-center text-gray-700 mb-4">
                <FaMapMarkerAlt className="mr-2" />
                <p className="font-semibold">
                  {booking.propertyDetails.neighbourhood || "Loading..."}{" "}
                  {booking.propertyDetails.lga || "Loading..."}{" "}
                  {booking.propertyDetails.state || "Loading..."}{" "}
                </p>
              </div>
              <div className="flex items-center text-gray-700 mb-4">
                <FaClock className="mr-2" />
                <p>
                  Inspection Date:{" "}
                  <span className="font-semibold">
                    {new Date(
                      booking.booking.bookingDateTime
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}{" "}
                    {new Date(
                      booking.booking.bookingDateTime
                    ).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    }) || "Loading..."}
                  </span>
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-blue-700 mb-4">
                <h3 className="text-lg font-semibold mb-2">
                  Time Until Inspection:
                </h3>
                <p className="text-2xl font-bold">{timeLeft[index]}</p>
              </div>
              <Link href={`/inspection/tracking/${booking.booking._id}`}>
                <button className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition duration-300">
                  Start Tracking
                </button>
              </Link>
            </div>
          );
        })
      )}
    </div>
  );
};

export default MyInspections;
