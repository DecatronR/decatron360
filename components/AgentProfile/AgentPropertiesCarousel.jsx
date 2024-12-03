"use client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const AgentPropertiesCarousel = ({ agentProperties, agentId, agentData }) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
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
    <div
      className="bg-white p-6 rounded-lg shadow-md mb-6 relative"
      style={{ zIndex: 0 }}
    >
      {/* Adding relative position ensures the z-index hierarchy is correct */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {agentData?.name}'s Listings
        </h2>
      </div>

      {agentProperties.length > 0 ? (
        <div>
          {/* Horizontal Scroll Container */}
          <div className="flex overflow-x-scroll space-x-4 scrollbar-hide">
            {agentProperties.map((property) => (
              <div
                key={property._id}
                className="min-w-[90%] sm:min-w-[45%] lg:min-w-[30%] rounded-lg overflow-hidden shadow-sm transition-transform transform hover:scale-105 duration-200"
              >
                <Link href={`/properties/${property._id}`}>
                  {/* Display property image or a placeholder */}
                  {property.photos && property.photos.length > 0 ? (
                    <img
                      src={
                        `${property.photos[0].path}` ||
                        "/path/to/default/profile.png"
                      }
                      alt={`Property ${property.title}`}
                      className="rounded-lg w-full h-48 object-cover cursor-pointer"
                    />
                  ) : (
                    <div className="bg-gray-200 w-full h-48 flex items-center justify-center cursor-pointer">
                      <span className="text-gray-500">No Image Available</span>
                    </div>
                  )}
                </Link>
                <div className="p-4">
                  <Link href={`/properties/${property._id}`}>
                    <h3 className="font-semibold text-sm text-gray-800 cursor-pointer hover:text-primary-500">
                      {property.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-500 mt-1 truncate">
                    {property.propertyDetails}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* See More Button */}
          <div className="mt-4 text-right">
            <Link href={`/agent-properties/${agentId}`}>
              <button className="text-primary-500 font-medium hover:underline">
                See More
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No properties found.</p>
      )}
    </div>
  );
};

export default AgentPropertiesCarousel;
