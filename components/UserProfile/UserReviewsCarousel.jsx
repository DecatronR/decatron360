"use client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const UserReviewsCarousel = ({ userReviews }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const reviewsPerPage = 3;

  const handleNext = () => {
    if (currentIndex < Math.ceil(userReviews.length / reviewsPerPage) - 1) {
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
  const currentReviews = userReviews.slice(
    startIndex,
    startIndex + reviewsPerPage
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Reviews</h2>
      </div>

      <div className="relative">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          {currentReviews.map((review, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 shadow-sm flex-1 bg-gray-50 transition duration-300 hover:shadow-lg"
            >
              <p className="text-gray-700 text-lg italic">“{review.text}”</p>
              <p className="text-sm text-gray-500 mt-2">
                — {review.author},{" "}
                <span className="font-medium">{review.date}</span>
              </p>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="absolute top-1/2 transform -translate-y-1/2 flex justify-between w-full px-4">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`bg-gray-300 text-gray-700 rounded-full p-2 transition duration-300 hover:bg-gray-400 disabled:opacity-50`}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <button
            onClick={handleNext}
            disabled={
              currentIndex ===
              Math.ceil(userReviews.length / reviewsPerPage) - 1
            }
            className={`bg-gray-300 text-gray-700 rounded-full p-2 transition duration-300 hover:bg-gray-400 disabled:opacity-50`}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>

      {/* See More Button */}
      <div className="mt-4 text-right">
        <button className="text-primary-500 font-medium hover:underline">
          See More
        </button>
      </div>
    </div>
  );
};

export default UserReviewsCarousel;
