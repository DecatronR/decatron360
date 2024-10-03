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
  // const agent = {
  //   photo: "/path/to/agent-photo.jpg",
  //   name: "John Doe",
  //   rank: "Top Agent",
  //   reviews: 123,
  //   ratings: 456,
  //   joinDate: "2020-01-15",
  // };
  const [agentData, setAgentData] = useState(null);
  const [agentProperties, setAgentProperties] = useState([]);
  const [agentReviews, setAgentReviews] = useState([]);
  const [agentRating, setAgentRating] = useState(null);
  const [loading, setLoading] = useState(true);

  // Example verification statuses
  const isEmailVerified = false;
  const isPhoneVerified = false;
  const isIdentityVerified = true;

  // Example data for listings and reviews
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
          setLoading(false);
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

  //reviews need to my tilted towards the user not the property
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

  if (loading) return <Spinner />;

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="flex max-w-6xl mx-auto">
        {/* Left Column: Profile Info */}
        <div className="w-1/3">
          {/* Make the left column sticky so it stays in place */}
          <div className="sticky top-8">
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
        <div className="w-2/3 ml-8 h-[calc(100vh-4rem)] overflow-y-scroll">
          <AgentAbout agentData={agentData} />
          <AgentPropertiesCarousel
            agentProperties={agentProperties}
            agentId={id}
          />
          <AgentReviewsCarousel agentReviews={agentReviews} agentId={id} />
        </div>
      </div>
    </div>
  );
};

export default AgentProfilePage;
