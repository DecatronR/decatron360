"use client";
import React from "react";
import StarRatings from "react-star-ratings";

const AgentRating = ({ userRating }) => {
  return (
    <div className="flex justify-center items-center">
      <StarRatings
        rating={3}
        starRatedColor="gold"
        numberOfStars={5}
        starDimension="20px"
        starSpacing="2px"
        name="rating"
      />
    </div>
  );
};

export default AgentRating;
