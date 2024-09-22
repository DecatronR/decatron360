"use client";
import React from "react";
import { useRouter } from "next/navigation";

const BookingSuccessful = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="max-w-lg p-6 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-semibold mb-4 text-green-600">
          Booking Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you! Your inspection has been successfully booked. We sent you
          an email containing your inspection booking details.
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default BookingSuccessful;
