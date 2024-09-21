import React from "react";

const UserReviews = ({ reviews }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Reviews</h2>
        <button className="text-blue-500 font-medium">See More</button>
      </div>
      <div className="space-y-6">
        {reviews.map((review, index) => (
          <div key={index} className="border-t pt-4">
            <p className="text-gray-600">“{review.text}”</p>
            <p className="text-sm text-gray-500">
              — {review.author}, {review.date}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserReviews;
