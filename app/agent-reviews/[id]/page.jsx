"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AgentReview from "@/components/AgentReview/AgentReview";
import { fetchUserRatingAndReviews } from "utils/api/user/fetchUserRatingAndReviews";
import Spinner from "@/components/Spinner";

const AgentReviewPage = () => {
  const { id } = useParams(); // Ensure `id` matches your dynamic route
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const res = await fetchUserRatingAndReviews(id);
        if (res?.ratings) {
          setReviews(res.ratings);
        } else {
          throw new Error("Invalid API response.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch reviews.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchReviews(); // Fetch only if `id` is available
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Agent Reviews</h1>
      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews available for this agent.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <AgentReview key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentReviewPage;
