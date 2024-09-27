"use client";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const AgentProperties = ({ agentProperties }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - itemsPerPage + agentProperties.length) %
        agentProperties.length
    );
  };

  const handleNext = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex + itemsPerPage) % agentProperties.length
    );
  };

  // Handle cases where there are no properties or no photos
  const visibleProperties = agentProperties.slice(
    currentIndex,
    currentIndex + itemsPerPage
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">My Listings</h2>
        <button className="text-primary-500 font-medium">See More</button>
      </div>

      {agentProperties.length > 0 ? (
        <div className="relative">
          {/* Carousel Navigation Buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full p-2 shadow-md z-10"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full p-2 shadow-md z-10"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>

          {/* Display Visible Properties */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleProperties.map((property, index) => (
              <div key={index} className="rounded-lg overflow-hidden">
                {/* Display property image or a placeholder */}
                {property.photo && property.photo.length > 0 ? (
                  <img
                    src={property.photo[0]} // Display the first photo
                    alt={`Property ${currentIndex + index + 1}`}
                    className="rounded-lg w-full h-auto object-cover"
                  />
                ) : (
                  <div className="bg-gray-200 w-full h-64 flex items-center justify-center">
                    <span>No Image Available</span>
                  </div>
                )}
                <div className="p-2">
                  <h3 className="font-semibold">{property.title}</h3>
                  <p className="text-sm text-gray-500">
                    {property.propertyDetails}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>No properties found.</p>
      )}
    </div>
  );
};

export default AgentProperties;
