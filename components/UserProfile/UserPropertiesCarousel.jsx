"use client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareAlt } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const UserPropertiesCarousel = ({ userProperties, userId }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - itemsPerPage + userProperties.length) %
        userProperties.length
    );
  };

  const handleNext = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex + itemsPerPage) % userProperties.length
    );
  };

  // Handle cases where there are no properties or no photos
  const visibleProperties = userProperties.slice(
    currentIndex,
    currentIndex + itemsPerPage
  );

  const handleShare = (propertyId) => {
    console.log(`Sharing property ${propertyId}`);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">My Listings</h2>
      </div>

      {userProperties.length > 0 ? (
        <div>
          {/* Display Visible Properties */}
          <div className="flex overflow-x-scroll space-x-4 scrollbar-hide">
            {userProperties.map((property) => (
              <div
                key={property._id}
                className="relative min-w-[90%] sm:min-w-[45%] lg:min-w-[30%] rounded-lg overflow-hidden shadow-sm transition-transform transform hover:scale-105 duration-200"
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

                {/* Share Button - Styled to match PropertyCard */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleShare(property._id);
                  }}
                  className="absolute top-4 right-4 bg-black bg-opacity-60 p-2 rounded-full shadow-md hover:bg-white transition duration-300"
                  title="Share Property"
                >
                  <FontAwesomeIcon
                    icon={faShareAlt}
                    className="text-white text-lg hover:text-gray-700 transition duration-300"
                  />
                </button>

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
            <Link href={`/user-properties/${userId}`}>
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

export default UserPropertiesCarousel;
