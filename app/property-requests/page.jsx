"use client";
import React from "react";
import PropertyRequestList from "@/components/PropertyRequest/PropertyRequestList";

const PropertyRequestsPage = () => {
  return (
    <section className="bg-blue-50 min-h-screen">
      <div className="container m-auto max-w-6xl py-12 px-2 sm:px-6 lg:px-8">
        <div className="bg-white px-4 py-6 mb-4 shadow-md rounded-xl border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">
            All Property Requests
          </h2>
          <PropertyRequestList />
        </div>
      </div>
    </section>
  );
};

export default PropertyRequestsPage;
