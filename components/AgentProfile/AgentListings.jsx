"use client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const AgentListings = ({ photos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3; // Number of images shown at once

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - itemsPerPage + photos.length) % photos.length
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + itemsPerPage) % photos.length);
  };

  const visiblePhotos = photos.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">My Listings</h2>
        <button className="text-primary-500 font-medium">See More</button>
      </div>

      <div className="relative">
        {/* Carousel Navigation Buttons */}
        <button
          onClick={handlePrev}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full p-2 shadow-md"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full p-2 shadow-md"
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>

        {/* Display Visible Photos */}
        <div className="grid grid-cols-3 gap-4">
          {visiblePhotos.map((photo, index) => (
            <img
              key={index}
              src={photo}
              alt={`Listing ${currentIndex + index + 1}`}
              className="rounded-lg"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentListings;
