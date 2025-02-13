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
  FaShareAlt,
} from "react-icons/fa";

const PropertyCard = ({ property, isFavorite, onToggleFavorite }) => {
  const formatPrice = (price) => {
    return `${price.toLocaleString()}`;
  };

  const handleShareBtn = () => {
    console.log("Share button triggered");
  };

  return (
    <Link href={`/properties/${property._id}`} passHref>
      <div className="relative cursor-pointer rounded-lg shadow-lg bg-white transition hover:shadow-xl transform hover:scale-105 duration-300 overflow-hidden">
        <div className="relative">
          {property?.photos?.length > 0 && (
            <Image
              src={property.photos[0].path || "/path/to/default/profile.png"}
              alt={property.title}
              height={0}
              width={0}
              sizes="100vw"
              className="w-full h-48 object-cover rounded-t-lg"
            />
          )}

          {/* Top Price Tag */}
          <div className="absolute top-4 left-4 bg-black bg-opacity-90 text-white px-3 py-1 rounded-full text-[12px] font-semibold shadow-md">
            {property.price && formatPrice(property.price)}
          </div>

          {/* Action Buttons (Favorite & Share) */}
          <div className="absolute top-4 right-4 flex space-x-2">
            {/* Favorite Button */}
            <button
              className="p-2 rounded-full bg-white bg-opacity-90 shadow-md transition hover:bg-gray-100"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleFavorite();
              }}
              aria-label={
                isFavorite ? "Remove from favorites" : "Add to favorites"
              }
            >
              {isFavorite ? (
                <FaHeart className="text-red-500 text-xl transition duration-300" />
              ) : (
                <FaRegHeart className="text-gray-500 text-xl transition duration-300" />
              )}
            </button>

            {/* Share Button */}
            <button
              className="p-2 rounded-full bg-white bg-opacity-90 shadow-md transition hover:bg-gray-100"
              onClick={handleShareBtn}
              title="Share Property"
            >
              <FaShareAlt className="text-gray-500 text-xl hover:text-gray-700 transition duration-300" />
            </button>
          </div>

          {/* Bottom Tags */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center gap-2">
            <div className="bg-green-600 text-white px-3 py-1 rounded-full text-[10px] font-semibold uppercase shadow-md">
              {property.listedBy === "Owner" ? "Owner" : "Agent"}
            </div>

            {property.isSoldOut === "1" && (
              <div className="bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-semibold uppercase shadow-md">
                Sold Out
              </div>
            )}

            <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-semibold uppercase shadow-md">
              {property.listingType === "Rent" ? "For Rent" : "For Sale"}
            </div>
          </div>
        </div>

        <div className="p-4">
          <h2 className="text-sm font-bold text-gray-900 mb-1 truncate">
            {property.title}
          </h2>
          <p className="text-xs text-gray-500 truncate">
            {property.propertyType} in {property.neighbourhood}, {property.lga},{" "}
            {property.state}
          </p>

          <div className="flex items-center text-gray-600 text-xs space-x-3 mt-2">
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

          <div className="flex justify-between items-center text-gray-700 mt-2">
            <p className="flex items-center text-orange-600 text-xs font-medium">
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
