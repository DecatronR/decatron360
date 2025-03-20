"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin } from "lucide-react";

const MyInspections = ({ bookings }) => {
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
      return "Inspection time has passed.";
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60 * 60)) / 1000);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const [timeLeft, setTimeLeft] = useState(
    bookings.map((booking) =>
      calculateTimeLeft(booking.booking.bookingDateTime)
    )
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft(
        bookings.map((booking) =>
          calculateTimeLeft(booking.booking.bookingDateTime)
        )
      );
    }, 1000);

    return () => clearInterval(intervalId);
  }, [bookings]);

  return (
    <div className="container mx-auto p-4">
      {bookings.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          No inspections available.
        </p>
      ) : (
        bookings.map((booking, index) => (
          <div
            key={booking.booking._id}
            className="bg-white shadow-lg rounded-lg p-4 mb-6 sm:flex sm:items-center sm:gap-4"
          >
            <Link href={`/properties/${booking.propertyDetails._id}`} passHref>
              <Image
                src={booking.photos[0]?.path || "/placeholder.jpg"}
                alt={booking.propertyDetails.title || "Property image"}
                width={120}
                height={120}
                className="rounded-lg object-cover w-full sm:w-40 h-32 sm:h-40"
              />
            </Link>
            <div className="mt-4 sm:mt-0 sm:flex-1">
              <Link
                href={`/properties/${booking.propertyDetails._id}`}
                passHref
              >
                <h1 className="text-lg sm:text-2xl font-semibold cursor-pointer hover:underline sm:text-left">
                  {booking.propertyDetails.title || "Loading..."}
                </h1>
              </Link>
              <p className="text-gray-600 mt-2 sm:text-left">
                {truncateText(booking.propertyDetails.propertyDetails)}
              </p>
              <div className="flex items-center sm:justify-start text-gray-700 mt-2 text-sm sm:text-base">
                <MapPin className="mr-2 text-blue-500" />
                <p>
                  {booking.propertyDetails.neighbourhood || "Loading..."},{" "}
                  {booking.propertyDetails.lga || "Loading..."},{" "}
                  {booking.propertyDetails.state || "Loading..."}
                </p>
              </div>
              <div className="flex items-center sm:justify-start text-gray-700 mt-3 text-sm sm:text-base">
                <Clock className="mr-2 text-red-500" />
                <p>
                  <span className="font-medium">Inspection Date:</span>{" "}
                  {new Date(booking.booking.bookingDateTime).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  )}{" "}
                  at{" "}
                  {new Date(booking.booking.bookingDateTime).toLocaleTimeString(
                    "en-US",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    }
                  )}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-blue-700 mt-4 text-center">
                <h3 className="text-lg font-semibold">
                  Time Until Inspection:
                </h3>
                <p className="text-xl font-bold">{timeLeft[index]}</p>
              </div>
              <Link
                href={`/inspection/tracking/${booking.booking._id}`}
                passHref
              >
                <button className="w-full bg-green-500 text-white py-3 rounded-full font-semibold hover:bg-green-600 mt-4 transition duration-300">
                  Start Tracking
                </button>
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyInspections;
