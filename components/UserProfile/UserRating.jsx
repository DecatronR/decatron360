"use client";
import React from "react";
import StarRatings from "react-star-ratings";

const UserRating = ({ userRating }) => {
  const rating = Number(userRating);
  return (
    <div className="flex justify-center items-center">
      <StarRatings
        rating={rating}
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
