"use client";
import React from "react";

const UserAbout = ({ userData }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-2xl font-bold text-gray-800">
        About {userData?.name}
      </h2>
      <p className="text-gray-600 mt-2">
        {userData?.bio ? userData.bio : "This user has not added a bio yet."}
      </p>
    </div>
  );
};

export default UserAbout;
