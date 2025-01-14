"use client";
import React, { useState, useEffect } from "react";
import UserProfilePhoto from "@/components/UserProfile/UserProfilePhoto";
import UserVerificationStatus from "@/components/UserProfile/UserVerificationStatus";
import UserAbout from "@/components/UserProfile/UserAbout";
import UserPropertiesCarousel from "@/components/UserProfile/UserPropertiesCarousel";
import UserReviewsCarousel from "@/components/UserProfile/UserReviewsCarousel";
import UserRating from "@/components/UserProfile/UserRating";
import OwnerRequests from "components/UserProfile/OwnerRequests";
import AgentRequests from "components/UserProfile/AgentRequests";
import { fetchUserData } from "@/utils/api/user/fetchUserData";
import { fetchUserProperties } from "@/utils/api/user/fetchUserProperties";
import { fetchUserRatingAndReviews } from "utils/api/user/fetchUserRatingAndReviews";
import Spinner from "components/Spinner";

const UserProfilePage = () => {
  const [userId, setUserId] = useState("");
  const [userData, setUserData] = useState(null);
  const [userProperties, setUserProperties] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [userRating, setUserRating] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const isEmailVerified = true;
  const isPhoneVerified = false;
  const isIdentityVerified = false;

  const sampleRequests = [
    { id: 1, propertyName: "Greenwood Apartments - Unit 4B" },
    { id: 2, propertyName: "Downtown Plaza - Office 201" },
    { id: 3, propertyName: "Seaside Villa - Room 102" },
    { id: 4, propertyName: "Hilltop Condos - Suite 3C" },
    { id: 5, propertyName: "Greenwood Apartments - Unit 4B" },
    { id: 6, propertyName: "Downtown Plaza - Office 201" },
    { id: 7, propertyName: "Seaside Villa - Room 102" },
    { id: 8, propertyName: "Hilltop Condos - Suite 3C" },
  ];

  const handleCancel = (id) => {
    console.log(`Canceled request with id: ${id}`);
  };

  useEffect(() => {
    const id = sessionStorage.getItem("userId");
    setUserId(id);
  }, []);

  const handleFetchUserData = async () => {
    if (userId) {
      try {
        const res = await fetchUserData(userId);
        console.log("user data: ", res);
        setUserData(res);
      } catch (error) {
        console.log("Issues fetching user data: ", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log("Could not fetch user data, user id not found");
    }
  };

  useEffect(() => {
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
    const handleFetchUserRatingAndReviews = async () => {
      if (userId) {
        try {
          const res = await fetchUserRatingAndReviews(userId);
          console.log("user rating and reviews: ", res.averageRating);
          setUserRating(res.averageRating || 0);
          setUserReviews(res.ratings || []);
        } catch (error) {
          console.log("Issue fetching user reviews");
        }
      } else {
        console.log("Could not fetch user reviews, user id not found");
      }
    };
    handleFetchUserRatingAndReviews();
  }, [userId]);

  if (isLoading) return <Spinner />;

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="flex flex-col md:flex-row max-w-6xl mx-auto">
        {/* Left Column: Profile Info */}
        <div className="w-full md:w-1/3 md:max-h-[calc(100vh-4rem)] overflow-hidden">
          <div className="md:sticky md:top-8 flex flex-col h-full">
            <UserProfilePhoto
              userId={userId}
              userData={userData}
              onUserDataUpdate={handleFetchUserData}
            />
            <UserRating userRating={userRating} />
            <div className="mt-6 flex-1 overflow-y-auto">
              <UserVerificationStatus
                isEmailVerified={isEmailVerified}
                isPhoneVerified={isPhoneVerified}
                isIdentityVerified={isIdentityVerified}
              />
              {userData.role === "owner" && <OwnerRequests />}
              {userData.role === "agent" && (
                <AgentRequests
                  requests={sampleRequests}
                  onCancel={handleCancel}
                />
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Scrollable Details */}
        <div className="w-full mt-8 md:mt-0 md:w-2/3 md:ml-8 md:h-[calc(100vh-4rem)] overflow-y-auto">
          <UserAbout userData={userData} />
          <UserPropertiesCarousel
            userProperties={userProperties}
            userId={userId}
            userData={userData}
          />
          <UserReviewsCarousel userReviews={userReviews} />
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
