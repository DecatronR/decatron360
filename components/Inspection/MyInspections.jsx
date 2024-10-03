"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaClock, FaMapMarkerAlt } from "react-icons/fa";

const MyInspections = ({ property }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const distance = property.inspectionDate - now;

      if (distance < 0) {
        setTimeLeft("Inspection time has passed.");
        clearInterval(intervalId);
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [property.inspectionDate]);

  const handleStartTracking = () => {
    alert("Tracking started!");
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <div className="flex items-start mb-4">
        <Link href={`/properties/${property.id}`} passHref>
          <Image
            src={property.image}
            alt={property.title}
            width={100}
            height={100}
            className="rounded-lg mr-4 cursor-pointer object-cover"
          />
        </Link>
        <Link href={`/properties/${property.id}`} passHref>
          <h1 className="text-2xl font-bold cursor-pointer hover:underline">
            {property.title}
          </h1>
        </Link>
      </div>
      <p className="text-gray-600 mb-4">{property.description}</p>
      <div className="flex items-center text-gray-700 mb-4">
        <FaMapMarkerAlt className="mr-2" />
        <p className="font-semibold">{property.location}</p>{" "}
        {/* Displaying location */}
      </div>
      <div className="flex items-center text-gray-700 mb-4">
        <FaClock className="mr-2" />
        <p>
          Inspection Date:{" "}
          <span className="font-semibold">
            {property.inspectionDate.toLocaleString()}
          </span>
        </p>
      </div>
      <div className="bg-blue-50 p-4 rounded-lg text-blue-700 mb-4">
        <h3 className="text-lg font-semibold mb-2">Time Until Inspection:</h3>
        <p className="text-2xl font-bold">{timeLeft}</p>
      </div>
      <button
        onClick={handleStartTracking}
        className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition duration-300"
      >
        Start Tracking
      </button>
    </div>
  );
};

export default MyInspections;
