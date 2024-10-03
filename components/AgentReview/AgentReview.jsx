import React from "react";

const AgentReview = ({ review }) => {
  const { reviewerName, comment, rating, date } = review;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold">{reviewerName}</h2>
      <p className="text-sm text-gray-600">
        {new Date(date).toLocaleDateString()}
      </p>
      <p className="mt-2 text-gray-800">{comment}</p>
      <div className="mt-4">
        <span className="text-yellow-500">Rating: </span>
        <span className="font-bold">{rating}/5</span>
      </div>
    </div>
  );
};

export default AgentReview;
