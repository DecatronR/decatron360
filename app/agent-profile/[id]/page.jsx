"use client";
import React, { useState, useEffect } from "react";
import AgentProfileCard from "@/components/AgentProfile/AgentProfileCard";
import AgentVerificationStatus from "@/components/AgentProfile/AgentVerficationStatus";
import AgentAbout from "@/components/AgentProfile/AgentAbout";
import AgentProperties from "@/components/AgentProfile/AgentProperties";
import AgentReviews from "@/components/AgentProfile/AgentReviews";
import { useParams } from "next/navigation";
import axios from "axios";

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
    const fetchAgentData = async () => {
      if (id) {
        try {
          const res = await axios.post(
            "http://localhost:8080/users/editUsers",
            { id: id },
            { withCredentials: true }
          );
          console.log("user data: ", res.data);
          setAgentData(res.data);
        } catch (error) {
          console.log("Issues fetching agent details: ", error);
        }
      } else {
        console.log("Could not fetch agent details, user id not found");
      }
    };
    fetchAgentData();
  }, [id]);

  useEffect(() => {
    const fetchAgentProperties = async () => {
      if (id) {
        try {
          const response = await axios.post(
            "http://localhost:8080/propertyListing/myProperty",
            { userID: id },
            { withCredentials: true }
          );
          console.log("agent properties: ", response);
          setAgentProperties(response.data);
        } catch (error) {
          console.log("Issue with fetching agent properties: ", error);
        }
      } else {
        console.log("Could not fetch agent properties, user id not found");
      }
    };
    fetchAgentProperties();
  }, [id]);

  //reviews need to my tilted towards the user not the property
  useEffect(() => {
    const fetchAgentReviews = async () => {
      if (id) {
        try {
          const response = await axios.post(
            "http://localhost:8080/review/getReview",
            { userID: id },
            { withCredentials: true }
          );
          console.log("my reviews: ", myProperties);
          setAgentReviews(response.data);
        } catch (error) {
          console.log("Issues fetching agent reviews: ", error);
        }
      } else {
        console.log("Could not fetch agent reviews, user id not found");
      }
    };
    fetchAgentReviews();
  }, [id]);

  useEffect(() => {
    const fetchAgentRating = async () => {
      if (id) {
        const response = await axios.post(
          "http://localhost:8080/users/fetchUserRating",
          { userID: id },
          { withCredentials: true }
        );
        console.log("my rating: ", rating);
        setAgentRating(response.data);
      }
    };
    fetchAgentRating();
  }, [id]);

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="flex max-w-6xl mx-auto">
        {/* Left Column: Profile Info */}
        <div className="w-1/3">
          {/* Make the left column sticky so it stays in place */}
          <div className="sticky top-8">
            <AgentProfileCard agentData={agentData} agentRating={agentRating} />

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

          <AgentProperties photos={photos} agentProperties={agentProperties} />

          <AgentReviews agentReviews={agentReviews} />
        </div>
      </div>
    </div>
  );
};

export default AgentProfilePage;
