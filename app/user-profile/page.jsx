"use client";
import React from "react";
import UserProfileCard from "@/components/UserProfile/UserProfileCard";
import UserVerificationStatus from "@/components/UserProfile/UserVerificationStatus";
import UserAbout from "@/components/UserProfile/UserAbout";
import UserListings from "@/components/UserProfile/UserListings";
import UserReviews from "@/components/UserProfile/UserReviews";
import { useAuth } from "@/context/AuthContext";

const UserProfilePage = () => {
  const { user } = useAuth();
  const dummyUser = {
    photo: "/path/to/agent-photo.jpg",
    name: "John Doe",
    rank: "Top Agent",
    reviews: 123,
    ratings: 456,
    joinDate: "2020-01-15",
  };

  console.log("User: ", user);

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
          <UserProfileCard dummyUser={dummyUser} />
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
          <UserListings photos={photos} />
          <UserReviews reviews={reviews} />
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
