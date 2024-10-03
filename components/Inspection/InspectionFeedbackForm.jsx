"use client";
import React, { useState } from "react";
import StarRatings from "react-star-ratings"; // Import react-star-ratings

const InspectionFeedbackForm = () => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [dispute, setDispute] = useState("");
  const [isDisputeRaised, setIsDisputeRaised] = useState(false);
  const [inspectionResult, setInspectionResult] = useState(""); // New state for the inspection result

  const changeRating = (newRating) => {
    setRating(newRating);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const feedbackData = {
      rating,
      review,
      inspectionResult, // Include the new field
      dispute: isDisputeRaised ? dispute : null,
    };
    console.log("Feedback submitted:", feedbackData);
    // Submit feedbackData to the server or handle it further
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-6 transition-colors duration-300"
    >
      {/* Inspection Result Section */}
      <div className="mb-4">
        <label className="block text-xl font-semibold text-gray-800 mb-2">
          How was the inspection?
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="inspectionResult"
              value="Successful"
              checked={inspectionResult === "Successful"}
              onChange={(e) => setInspectionResult(e.target.value)}
              className="text-primary-500 focus:ring-primary-500 w-6 h-6"
            />
            <span className="text-gray-800 text-lg font-semibold">
              Successful
            </span>
          </label>
          <label className="flex items-center space-x-4">
            <input
              type="radio"
              name="inspectionResult"
              value="Not Successful"
              checked={inspectionResult === "Not Successful"}
              onChange={(e) => setInspectionResult(e.target.value)}
              className="text-primary-500 focus:ring-primary-500 w-6 h-6"
            />
            <span className="text-gray-800 text-lg font-semibold">
              Not Successful
            </span>{" "}
          </label>
        </div>
      </div>

      {/* Rating Section */}
      <div className="mb-4">
        <label className="block text-xl font-semibold text-gray-800 mb-2">
          Rate the Inspection
        </label>
        <StarRatings
          rating={rating}
          starRatedColor="gold"
          starHoverColor="black"
          changeRating={changeRating}
          numberOfStars={5}
          name="rating"
          starDimension="30px"
          starSpacing="5px"
        />
      </div>

      {/* Review Section */}
      <div className="mb-4">
        <label className="block text-xl font-semibold text-gray-800 mb-2">
          Write a Review
        </label>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-200"
          rows="5"
          placeholder="Describe how the inspection went..."
        ></textarea>
      </div>

      {/* Raise Dispute Section */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            id="raiseDispute"
            checked={isDisputeRaised}
            onChange={() => setIsDisputeRaised(!isDisputeRaised)}
            className="mr-2 text-primary-500 focus:ring-primary-500"
          />
          <label
            htmlFor="raiseDispute"
            className="text-xl font-semibold text-gray-800"
          >
            Raise a Dispute
          </label>
        </div>
        {isDisputeRaised && (
          <textarea
            value={dispute}
            onChange={(e) => setDispute(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-200"
            rows="4"
            placeholder="Explain the issue encountered during the inspection..."
          ></textarea>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-primary-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-primary-600 transition-transform duration-300 ease-in-out transform hover:scale-105 shadow-lg"
      >
        Submit Feedback
      </button>
    </form>
  );
};

export default InspectionFeedbackForm;
