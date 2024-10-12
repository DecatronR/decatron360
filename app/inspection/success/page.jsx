"use client";
import Link from "next/link";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

const InspectionSuccessPage = () => {
  const [userId, setUserId] = useState("");
  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    setUserId(userId);
  }, []);
  return (
    <section className="flex items-center justify-center min-h-screen px-4 py-8 bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <CheckCircleIcon className="h-16 w-16 text-primary-500" />
        </div>

        {/* Main Heading */}
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Your inspection booking was successful!
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 text-center mb-6">
          We have sent the inspection details to your email.
        </p>

        {/* Button */}
        <div className="flex justify-center">
          <Link
            href={`/my-inspections/${userId}`}
            className="inline-block bg-primary-500 text-white text-center py-3 px-6 rounded-lg shadow transition duration-300 ease-in-out transform hover:scale-105 hover:bg-primary-600"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </section>
  );
};

export default InspectionSuccessPage;
