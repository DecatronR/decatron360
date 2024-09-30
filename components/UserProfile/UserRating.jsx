"use client";
import React from "react";
import StarRatings from "react-star-ratings";

const UserRating = ({ rating }) => {
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

export default UserRating;
