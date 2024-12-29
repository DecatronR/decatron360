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

const PropertyCard = ({ property, isFavorite, onToggleFavorite }) => {
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
          <div className="absolute top-4 left-4 bg-black bg-opacity-90 text-white px-2 py-0.5 rounded-full text-[12px] font-medium">
            {property.price && formatPrice(property.price)}
          </div>

          {/* Favorite Button */}
          <button
            className="absolute top-4 right-4 bg-transaprent p-1 rounded-full cursor-pointer hover:bg-white transition duration-300"
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
              <FaHeart className="text-red-500 text-2xl transition duration-300" />
            ) : (
              <FaRegHeart className="text-gray-300 text-2xl transition duration-300" />
            )}
          </button>

          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center gap-2">
            {/* Listed By Role */}
            <div className="bg-green-600 text-white px-2 py-0.5 rounded-full text-[10px] font-medium uppercase shadow-md">
              {property.listedBy === "Owner" ? "Owner" : "Agent"}
            </div>

            {/* Sold Out */}
            {property.isSoldOut === "1" && (
              <div className="bg-red-600 text-white px-2 py-0.5 rounded-full text-[10px] font-medium uppercase shadow-md">
                Sold Out
              </div>
            )}

            {/* For Rent / For Sale */}
            <div className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-[10px] font-medium uppercase shadow-md">
              {property.listingType === "Rent" ? "For Rent" : "For Sale"}
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="mb-2">
            <h2 className="text-sm font-bold text-gray-900 mb-1 truncate">
              {property.title}
            </h2>
            <p className="text-xs text-gray-500 truncate">
              {property.propertyType} in {property.neighbourhood},{" "}
              {property.lga}, {property.state}
            </p>
          </div>
          <div className="flex items-center text-gray-600 text-xs space-x-2 mb-2">
            <p className="flex items-center">
              <FaBed className="mr-1" /> {property.bedrooms} Beds
            </p>
            <p className="flex items-center">
              <FaBath className="mr-1" /> {property.bathrooms} Baths
            </p>
            <p className="flex items-center">
              <FaRulerCombined className="mr-1" /> {property.size} sqft
            </p>
          </div>
          <div className="flex justify-between items-center text-gray-700">
            <p className="flex items-center text-orange-600 text-xs">
              <FaMapMarkerAlt className="mr-1" />
              {property.neighbourhood}, {property.state}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
