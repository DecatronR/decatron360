"use client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const AgentReviews = ({ agentReviews }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const reviewsPerPage = 3; // Number of reviews to display at a time

  const handleNext = () => {
    if (currentIndex < Math.ceil(reviews.length / reviewsPerPage) - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Calculate the start and end index for slicing the reviews
  const startIndex = currentIndex * reviewsPerPage;
  const currentReviews = agentReviews.slice(
    startIndex,
    startIndex + reviewsPerPage
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Reviews</h2>
        <button className="text-primary-500 font-medium">See More</button>
      </div>

      <div className="relative">
        <div className="flex space-x-4">
          {currentReviews.map((review, index) => (
            <div key={index} className="border rounded-lg p-4 shadow-md flex-1">
              <p className="text-gray-600">“{review.text}”</p>
              <p className="text-sm text-gray-500">
                — {review.author}, {review.date}
              </p>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="absolute top-1/2 transform -translate-y-1/2 flex justify-between w-full px-4">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="bg-gray-300 text-gray-700 rounded-full p-2 disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <button
            onClick={handleNext}
            disabled={
              currentIndex ===
              Math.ceil(agentReviews.length / reviewsPerPage) - 1
            }
            className="bg-gray-300 text-gray-700 rounded-full p-2 disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentReviews;
