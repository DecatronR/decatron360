"use client";
import React, { useState, useEffect } from "react";
import UserProfileCard from "@/components/UserProfile/UserProfileCard";
import UserVerificationStatus from "@/components/UserProfile/UserVerificationStatus";
import UserAbout from "@/components/UserProfile/UserAbout";
import UserProperties from "@/components/UserProfile/UserProperties";
import UserReviews from "@/components/UserProfile/UserReviews";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

const UserProfilePage = () => {
  const { user } = useAuth();
  const [userId, setUserId] = useState("");
  const [myProperties, setMyProperties] = useState([]);
  // const [reviews, setReviews] = useState useState([]);
  const [rating, setRating] = useState([]);

  const dummyUser = {
    photo: "/path/to/agent-photo.jpg",
    name: "John Doe",
    rank: "Top Agent",
    reviews: 123,
    ratings: 456,
    joinDate: "2020-01-15",
  };

  useEffect(() => {
    const id = sessionStorage.getItem("userId");
    setUserId(id);
  }, []);

  useEffect(() => {
    const fetchMyProperties = async () => {
      if (userId) {
        const response = await axios.post(
          "http://localhost:8080/propertyListing/myProperty",
          { userID: userId },
          { withCredentials: true }
        );
        console.log("my properties: ", myProperties);
        setMyProperties(response.data);
      }
    };
    fetchMyProperties();
  }, [userId]);

  //reviews need to my tilted towards the user not the property
  // useEffect(() => {
  //   const fetchMyReviews = async () => {
  //     if (userId) {
  //       const response = await axios.post(
  //         "http://localhost:8080/review/getReview",
  //         { userID: userId },
  //         { withCredentials: true }
  //       );
  //       console.log("my reviews: ", myProperties);
  //       setReviews(response.data);
  //     }
  //   };
  //   fetchMyReviews();
  // }, [userId]);

  useEffect(() => {
    const fetchRating = async () => {
      if (userId) {
        const response = await axios.post(
          "http://localhost:8080/users/fetchUserRating",
          { userID: userId },
          { withCredentials: true }
        );
        console.log("my rating: ", rating);
        setRating(response.data);
      }
    };
    fetchRating();
  }, [userId]);

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

  return (
    <div className="bg-gray-100 min-h-screen py-4 md:py-8">
      <div className="flex flex-col md:flex-row max-w-6xl mx-auto">
        {/* Left Column: Profile Info */}
        <div className="w-full md:w-1/3 md:sticky md:top-8 mb-4 md:mb-0">
          <UserProfileCard dummyUser={dummyUser} rating={rating} />
          <div className="mt-6">
            <UserVerificationStatus
              isEmailVerified={isEmailVerified}
              isPhoneVerified={isPhoneVerified}
              isIdentityVerified={isIdentityVerified}
            />
          </div>
        </div>

        {/* Right Column: Scrollable Details */}
        <div className="w-full md:w-2/3 md:ml-8 h-auto md:h-[calc(100vh-4rem)] overflow-y-scroll">
          <UserAbout
            name={user?.data.name}
            description="Hi, I’m John! I love hosting guests from all over the world. My space is a cozy spot in the heart of the city, ideal for travelers who want to explore and feel at home."
          />
          <UserProperties photos={photos} myProperties={myProperties} />
          <UserReviews reviews={reviews} />
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
