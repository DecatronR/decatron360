"use client";
import React, { useState, useEffect } from "react";
import AgentProfilePhoto from "@/components/AgentProfile/AgentProfilePhoto";
import AgentVerificationStatus from "@/components/AgentProfile/AgentVerficationStatus";
import AgentAbout from "@/components/AgentProfile/AgentAbout";
import AgentPropertiesCarousel from "@/components/AgentProfile/AgentPropertiesCarousel";
import AgentReviewsCarousel from "@/components/AgentProfile/AgentReviewsCarousel";
import AgentRating from "@/components/AgentProfile/AgentRating";
import { useParams } from "next/navigation";
import axios from "axios";
import { fetchUserData } from "@/utils/api/user/fetchUserData";
import { fetchUserProperties } from "@/utils/api/user/fetchUserProperties";
import { fetchUserReviews } from "@/utils/api/user/fetchUserReviews";
import { fetchUserRating } from "@/utils/api/user/fetchUserRating";
import Spinner from "@/components/Spinner";

const AgentProfilePage = () => {
  const { id } = useParams();
  const [agentData, setAgentData] = useState(null);
  const [agentProperties, setAgentProperties] = useState([]);
  const [agentReviews, setAgentReviews] = useState([]);
  const [agentRating, setAgentRating] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isEmailVerified = false;
  const isPhoneVerified = false;
  const isIdentityVerified = true;

  const photos = [
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150",
  ];

  const reviews = [
    {
      text: "Great host! The space was exactly as described, and John was very helpful throughout our stay.",
      author: "Alice",
      date: "February 2023",
    },
    {
      text: "Very clean, convenient location, and the host was super responsive!",
      author: "Michael",
      date: "March 2023",
    },
  ];

  useEffect(() => {
    const handleFetchAgentData = async () => {
      if (id) {
        try {
          const res = await fetchUserData(id);
          console.log("agent data: ", res);
          setAgentData(res);
        } catch (error) {
          console.log("Issues fetching agent details: ", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        console.log("Could not fetch agent details, user id not found");
      }
    };
    handleFetchAgentData();
  }, [id]);

  useEffect(() => {
    const handleFetchAgentProperties = async () => {
      if (id) {
        try {
          const res = await fetchUserProperties(id);
          console.log("agent properties: ", res);
          setAgentProperties(res);
        } catch (error) {
          console.log("Issue with fetching agent properties: ", error);
        }
      } else {
        console.log("Could not fetch agent properties, user id not found");
      }
    };
    handleFetchAgentProperties();
  }, [id]);

  useEffect(() => {
    const handleFetchAgentReviews = async () => {
      if (id) {
        try {
          const res = await fetchUserReviews(id);
          console.log("agent reviews: ", res);
          setAgentReviews(res);
        } catch (error) {
          console.log("Issues fetching agent reviews: ", error);
        }
      } else {
        console.log("Could not fetch agent reviews, user id not found");
      }
    };
    handleFetchAgentReviews();
  }, [id]);

  useEffect(() => {
    const handleFetchAgentRating = async () => {
      if (id) {
        const res = await fetchUserRating(id);
        console.log("my rating: ", res);
        setAgentRating(res);
      }
    };
    handleFetchAgentRating();
  }, [id]);

  if (isLoading) return <Spinner />;

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="flex flex-col md:flex-row max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Left Column: Profile Info */}
        <div className="md:w-1/3 mb-8 md:mb-0">
          {/* Make the left column sticky so it stays in place */}
          <div className="md:sticky top-8">
            <AgentProfilePhoto />
            <AgentRating />

            {/* Verification Status */}
            <div className="mt-6">
              <AgentVerificationStatus
                isEmailVerified={isEmailVerified}
                isPhoneVerified={isPhoneVerified}
                isIdentityVerified={isIdentityVerified}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Scrollable Details */}
        <div className="md:w-2/3 md:ml-8 h-[calc(100vh-4rem)] overflow-y-scroll">
          <AgentAbout agentData={agentData} />
          <AgentPropertiesCarousel
            agentProperties={agentProperties}
            agentId={id}
            agentData={agentData}
          />
          <AgentReviewsCarousel agentReviews={agentReviews} agentId={id} />
        </div>
      </div>
    </div>
  );
};

export default AgentProfilePage;
