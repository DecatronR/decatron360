"use client";
import React, { useState, useEffect } from "react";
import UserProfilePhoto from "@/components/UserProfile/UserProfilePhoto";
import UserVerificationStatus from "@/components/UserProfile/UserVerificationStatus";
import UserAbout from "@/components/UserProfile/UserAbout";
import UserPropertiesCarousel from "@/components/UserProfile/UserPropertiesCarousel";
import UserReviewsCarousel from "@/components/UserProfile/UserReviewsCarousel";
import UserRating from "@/components/UserProfile/UserRating";
import { fetchUserData } from "@/utils/api/user/fetchUserData";
import { fetchUserProperties } from "@/utils/api/user/fetchUserProperties";
import { fetchUserReviews } from "@/utils/api/user/fetchUserReviews";
import { fetchUserRating } from "@/utils/api/user/fetchUserRating";

const UserProfilePage = () => {
  const [userId, setUserId] = useState("");
  const [userProperties, setUserProperties] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [userRating, setUserRating] = useState([]);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const id = sessionStorage.getItem("userId");
    setUserId(id);
  }, []);

  useEffect(() => {
    const handleFetchUserData = async () => {
      if (userId) {
        try {
          const res = await fetchUserData(userId);
          console.log("user data: ", res);
          setUserData(res);
        } catch (error) {
          console.log("Issues fetching user data: ", error);
        }
      } else {
        console.log("Could not fetch user data, user id not found");
      }
    };
    handleFetchUserData();
  }, [userId]);

  useEffect(() => {
    const handleFetchUserProperties = async () => {
      if (userId) {
        try {
          const res = await fetchUserProperties(userId);
          console.log("my properties: ", res);
          setUserProperties(res);
        } catch (error) {}
      }
    };
    handleFetchUserProperties();
  }, [userId]);

  useEffect(() => {
    const handleFetchUserReviews = async () => {
      if (userId) {
        try {
          const res = await fetchUserReviews(userId);
          console.log("user reviews: ", res);
          setUserReviews(res);
        } catch (error) {
          console.log("Issue fetching user reviews");
        }
      } else {
        console.log("Could not fetch user reviews, user id not found");
      }
    };
    handleFetchUserReviews();
  }, [userId]);

  useEffect(() => {
    const handleFetchUserRating = async () => {
      if (userId) {
        try {
          const res = await fetchUserRating(userId);
          console.log("my rating: ", res);
          setUserRating(res);
        } catch (error) {
          console.log("Issue fetching user rating");
        }
      } else {
        console.log("Could not fetch rating, user id not found");
      }
    };
    handleFetchUserRating();
  }, [userId]);

  const isEmailVerified = true;
  const isPhoneVerified = false;
  const isIdentityVerified = false;

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="flex flex-col md:flex-row max-w-6xl mx-auto">
        {/* Left Column: Profile Info */}
        <div className="w-full md:w-1/3">
          <div className="md:sticky md:top-8">
            <UserProfilePhoto userId={userId} userData={userData} />
            <UserRating userRating={userRating} />
            <div className="mt-6">
              <UserVerificationStatus
                isEmailVerified={isEmailVerified}
                isPhoneVerified={isPhoneVerified}
                isIdentityVerified={isIdentityVerified}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Scrollable Details */}
        <div className="w-full mt-8 md:mt-0 md:w-2/3 md:ml-8 md:h-[calc(100vh-4rem)] overflow-y-auto">
          <UserAbout userData={userData} />
          <UserPropertiesCarousel
            userProperties={userProperties}
            userId={userId}
          />
          <UserReviewsCarousel userReviews={userReviews} />
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
