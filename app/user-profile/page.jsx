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
  const [userId, setUserId] = useState("");
  const [userProperties, setUserProperties] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [userRating, setUserRating] = useState([]);
  const [userData, setUserData] = useState(null);

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
    const fetchUserData = async () => {
      if (userId) {
        try {
          const res = await axios.post(
            "http://localhost:8080/users/editUsers",
            { id: userId },
            { withCredentials: true }
          );
          console.log("user data: ", res.data);
          setUserData(res.data.data);
        } catch (error) {
          console.log("Issues fetching user data: ", error);
        }
      } else {
        console.log("Could not fetch user data, user id not found");
      }
    };
    fetchUserData();
  }, [userId]);

  useEffect(() => {
    const fetchUserProperties = async () => {
      if (userId) {
        try {
          const response = await axios.post(
            "http://localhost:8080/propertyListing/myProperty",
            { userID: userId },
            { withCredentials: true }
          );
          console.log("my properties: ", response);
          setUserProperties(response.data);
        } catch (error) {
          console.log("Issue fetching user properties");
        }
      } else {
        console.log("Could not fetch user properties, user id not found");
      }
    };
    fetchUserProperties();
  }, [userId]);

  //reviews need to my tilted towards the user not the property
  useEffect(() => {
    const fetchUserReviews = async () => {
      if (userId) {
        try {
          const response = await axios.post(
            "http://localhost:8080/review/getReview",
            { userID: userId },
            { withCredentials: true }
          );
          console.log("user reviews: ", response);
          setUserReviews(response.data);
        } catch (error) {
          console.log("Issue fetching user reviews");
        }
      } else {
        console.log("Could not fetch user reviews, user id not found");
      }
    };
    fetchUserReviews();
  }, [userId]);

  useEffect(() => {
    const fetchUserRating = async () => {
      if (userId) {
        try {
          const response = await axios.post(
            "http://localhost:8080/users/fetchUserRating",
            { userID: userId },
            { withCredentials: true }
          );
          console.log("my rating: ", response);
          setUserRating(response.data);
        } catch (error) {
          console.log("Issue fetching user rating");
        }
      } else {
        console.log("Could not fetch rating, user id not found");
      }
    };
    fetchUserRating();
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
          <UserProfileCard userData={userData} userRating={userRating} />
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
          <UserAbout userData={userData} />
          <UserProperties userProperties={userProperties} />
          <UserReviews userReviews={userReviews} />
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
