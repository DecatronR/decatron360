"use client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns"; // Import date-fns for formatting dates

const UserReviewsCarousel = ({ userReviews = [] }) => {
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
  const currentReviews =
    userReviews?.slice(startIndex, startIndex + reviewsPerPage) || [];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Reviews</h2>
      </div>

      {userReviews.length > 0 ? (
        <div>
          {/* Horizontal Scrollable Reviews */}
          <div className="flex overflow-x-scroll space-x-4 scrollbar-hide">
            {userReviews.map((review, index) => {
              const formattedDate = review.createdAt
                ? format(new Date(review.createdAt), "MMMM dd, yyyy")
                : "Unknown date";

              return (
                <div
                  key={index}
                  className="min-w-[90%] sm:min-w-[45%] lg:min-w-[30%] border rounded-lg p-4 shadow-sm bg-gray-50 transition duration-300 hover:shadow-lg"
                >
                  <p className="text-gray-700 text-sm italic">
                    “{review.comment}”
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    — {review.author},{" "}
                    <span className="font-medium text-xs">{formattedDate}</span>
                  </p>
                </div>
              );
            })}
          </div>

          {/* See More Button */}
          <div className="mt-4 text-right">
            <button className="text-primary-500 font-medium hover:underline">
              See More
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No reviews found.</p>
      )}
    </div>
  );
};

export default UserReviewsCarousel;
