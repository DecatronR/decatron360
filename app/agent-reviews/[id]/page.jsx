"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AgentReview from "@/components/AgentReview/AgentReview";
import { fetchUserReviews } from "@/utils/api/user/fetchUserReviews";
import Spinner from "@/components/Spinner";

const AgentReviewPage = () => {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetchUserReviews(id);
        setReviews(res);
      } catch (err) {
        setError("Failed to fetch reviews.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, [id]);

  if (isLoading) return <Spinner />;
  if (error) return <p>{error}</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Agent Reviews</h1>
      {reviews.length === 0 ? (
        <p>No reviews available for this agent.</p>
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
