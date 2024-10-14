"use client";
import React, { useState } from "react";
import StarRatings from "react-star-ratings";
import { rateAndReviewUser } from "@/utils/api/user/rateAndReviewUser";

const InspectionFeedbackForm = () => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [inspectionResult, setInspectionResult] = useState("");

  const changeRating = (newRating) => {
    setRating(newRating);
  };

  //fetch agent id from, booking API

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const reviewerId = sessionStorage.get("userId");
      await rateAndReviewUser(agentId, rating, reviewerId, review);
      enqueueSnackbar("Successfully submitted feedback", {
        variant: "success",
      });
    } catch (error) {
      console.log("Failed to submit feedback");
      enqueueSnackbar(
        "Failed to submit feedback, please contact our customer care",
        { variant: "error" }
      );
    }
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
            <span className="text-gray-800 text-lg font-medium">
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
            <span className="text-gray-800 text-lg font-medium">
              Not Successful
            </span>{" "}
          </label>
        </div>
      </div>

      {/* Rating Section */}
      <div className="mb-4">
        <label className="block text-xl font-semibold text-gray-800 mb-2">
          Rate the Agent
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
          placeholder="Describe how the inspection went with this agent..."
        ></textarea>
      </div>
      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-primary-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-primary-600 transition-transform duration-300 ease-in-out transform hover:scale-85 shadow-lg"
      >
        Submit Feedback
      </button>
    </form>
  );
};

export default InspectionFeedbackForm;
