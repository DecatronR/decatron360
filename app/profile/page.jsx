import React from "react";
import UserProfileCard from "@/components/UserProfile/UserProfileCard";
import UserVerificationStatus from "@/components/UserProfile/UserVerificationStatus";
import UserAbout from "@/components/UserProfile/UserAbout";
import UserListings from "@/components/UserProfile/UserListings";
import UserReviews from "@/components/UserProfile/UserReviews";

const ProfilePage = () => {
  const agent = {
    photo: "/path/to/agent-photo.jpg",
    name: "John Doe",
    rank: "Top Agent",
    reviews: 123,
    ratings: 456,
    joinDate: "2020-01-15",
  };

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

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="flex max-w-6xl mx-auto">
        {/* Left Column: Profile Info */}
        <div className="w-1/3">
          {/* Make the left column sticky so it stays in place */}
          <div className="sticky top-8">
            <UserProfileCard agent={agent} />

            {/* Verification Status */}
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
        <div className="w-2/3 ml-8 h-[calc(100vh-4rem)] overflow-y-scroll">
          <UserAbout
            name={agent.name}
            description="Hi, I’m John! I love hosting guests from all over the world. My space is a cozy spot in the heart of the city, ideal for travelers who want to explore and feel at home."
          />

          <UserListings photos={photos} />

          <UserReviews reviews={reviews} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
