import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  FaBath,
  FaBed,
  FaMapMarkerAlt,
  FaRulerCombined,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";

const FavoritePropertyCard = ({ property, isFavorite, onToggleFavorite }) => {
  const formatPrice = (price) => {
    return `${price.toLocaleString()}`;
  };

  return (
    <Link href={`/properties/${property._id}`} passHref>
      <div className="relative cursor-pointer rounded-lg shadow-lg bg-white transition hover:shadow-2xl transform hover:scale-[1.02] duration-300 max-h-80 overflow-hidden">
        <div className="relative">
          {property?.photos?.length > 0 && (
            <Image
              src={
                `${property.photos[0].path}` || "/path/to/default/profile.png"
              }
              alt={property.title}
              height={0}
              width={0}
              sizes="100vw"
              className="w-full h-48 object-cover rounded-t-lg"
            />
          )}

          {/* Top Tags */}
          <div className="absolute top-4 left-4 bg-black bg-opacity-100 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {property.data.Price && formatPrice(property.data.Price)}
          </div>
          <button
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-200 transition duration-300"
            onClick={(e) => {
              e.preventDefault(); // Prevent navigation on click
              e.stopPropagation(); // Stop click from bubbling to the parent
              onToggleFavorite();
            }}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            {isFavorite ? (
              <FaHeart className="text-red-500 text-xl transition duration-300" />
            ) : (
              <FaRegHeart className="text-white text-2xl transition duration-300" />
            )}
          </button>

          {/* Bottom Tags */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center gap-4">
            {/* Listed By Role */}
            <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase shadow-lg">
              {property.data.listedBy === "Owner" ? "Owner" : "Agent"}
            </div>

            {/* Sold Out */}
            {property.data.isSoldOut === "1" && (
              <div className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase shadow-lg">
                Sold Out
              </div>
            )}

            {/* For Rent / For Sale */}
            <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase shadow-lg">
              {property.data.listingType === "Rent" ? "For Rent" : "For Sale"}
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="mb-2">
            <h2 className="text-sm font-bold text-gray-900 mb-1 truncate">
              {property.data.title}
            </h2>
            <p className="text-xs text-gray-500 truncate">
              {property.data.propertyType} in {property.data.neighbourhood},
              {property.data.lga}, {property.data.state}
            </p>
          </div>
          <div className="flex items-center text-gray-600 text-xs space-x-2 mb-2">
            <p className="flex items-center">
              <FaBed className="mr-1" /> {property.data.NoOfBedRooms} Beds
            </p>
            <p className="flex items-center">
              <FaBath className="mr-1" /> {property.data.NoOfKitchens} Baths
            </p>
            <p className="flex items-center">
              <FaRulerCombined className="mr-1" /> {property.data.size} sqft
            </p>
          </div>
          <div className="flex justify-between items-center text-gray-700">
            <p className="flex items-center text-orange-600 text-xs">
              <FaMapMarkerAlt className="mr-1" />
              {property.data.neighbourhood}, {property.data.state}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FavoritePropertyCard;
