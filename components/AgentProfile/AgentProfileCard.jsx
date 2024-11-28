"use client";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import StarRatings from "react-star-ratings";

const AgentProfileCard = ({ agentData, agentRating }) => {
  const { user } = useAuth();
  const [photo, setPhoto] = useState(agentData?.photo || "/default-avatar.png"); // Default avatar image
  const rating = Number(agentRating);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg space-y-4 transition duration-300 hover:shadow-xl">
      <div className="flex flex-col sm:flex-row items-center">
        <div className="w-24 h-24 sm:w-20 sm:h-20 rounded-full overflow-hidden mr-4 cursor-pointer shadow-lg transition-transform duration-200 transform hover:scale-105">
          <Image
            src={photo}
            alt={`${agentData?.name}'s photo`}
            width={80}
            height={80}
            className="object-cover"
            onClick={() => document.getElementById("fileInput").click()} // Trigger file input on image click
          />
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
        <div>
          <p className="text-xl font-semibold text-gray-800">
            {agentData?.name}
          </p>
          <div className="flex items-center">
            <StarRatings
              rating={rating}
              starRatedColor="gold"
              numberOfStars={5}
              starDimension="20px"
              starSpacing="2px"
              name="rating"
            />
          </div>
          {/* <p className="text-gray-500 text-sm">
            Joined{" "}
            {formatDistanceToNow(new Date(agentData?.joinDate), {
              addSuffix: true,
            })}
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default AgentProfileCard;
