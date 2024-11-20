import React from "react";

const AgentReview = ({ review }) => {
  const { reviewerName, comment, rating, createdAt, ratedBy } = review; // Assuming 'ratedBy' represents the name of the person who gave the rating.

  // Ensure the date is valid and properly formatted
  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold">{reviewerName}</h2>
      <p className="text-sm text-gray-600">
        {/* Check if the date is valid before rendering */}
        {isNaN(new Date(createdAt)) ? "Invalid date" : formattedDate}
      </p>
      <p className="mt-2 text-gray-800">{comment}</p>
      <div className="mt-4">
        <span className="text-yellow-500">Rating: </span>
        <span className="font-bold">{rating}/5</span>
      </div>

      {/* Add a space to display who gave the rating */}
      {ratedBy && (
        <p className="text-sm text-gray-500 mt-2">
          <span className="font-medium">Rated by:</span> {ratedBy}
        </p>
      )}
    </div>
  );
};

export default AgentReview;
