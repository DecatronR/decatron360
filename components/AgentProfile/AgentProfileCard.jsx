"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import StarRatings from "react-star-ratings";
import { User } from "lucide-react";

const AgentProfileCard = ({ agentData, agentRating }) => {
  const [photo, setPhoto] = useState(null);
  const rating = Number(agentRating);

  useEffect(() => {
    if (agentData?.passport) {
      setPhoto(agentData.passport);
    }
  }, [agentData?.passport]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result); // Update the local preview
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg space-y-4 transition duration-300 hover:shadow-xl mb-4">
      <div className="flex flex-col sm:flex-row items-center">
        <div className="w-24 h-24 sm:w-20 sm:h-20 rounded-full overflow-hidden mr-4 cursor-pointer shadow-lg transition-transform duration-200 transform hover:scale-105 bg-gray-100 flex items-center justify-center">
          {photo ? (
            <Image
              src={photo}
              alt={`${agentData?.name}'s photo`}
              width={80}
              height={80}
              className="object-cover w-full h-full"
              onClick={() => document.getElementById("fileInput").click()}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center bg-gray-100 cursor-pointer"
              onClick={() => document.getElementById("fileInput").click()}
            >
              <User size={40} className="text-gray-400" />
            </div>
          )}
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
          <p className="text-m font-normal text-gray-800">
            {agentData?.role?.charAt(0).toUpperCase() +
              agentData?.role?.slice(1)}
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
        </div>
      </div>
    </div>
  );
};

export default AgentProfileCard;
