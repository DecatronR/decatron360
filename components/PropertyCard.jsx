import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaBath, FaBed, FaMapMarkerAlt, FaRulerCombined } from "react-icons/fa";

const PropertyCard = ({ property }) => {
  const formatPrice = (price) => {
    return `$${price.toLocaleString()}`;
  };

  return (
    <Link href={`/properties/${property._id}`} passHref>
      <div className="cursor-pointer rounded-lg shadow-lg overflow-hidden bg-white transition hover:shadow-2xl transform hover:scale-[1.02] duration-300">
        <div className="relative">
          {property.photos.length > 0 && (
            <Image
              src={property.photos[0].path}
              alt={property.title}
              height={0}
              width={0}
              sizes="100vw"
              className="w-full h-48 object-cover rounded-t-lg" // Reduce height for smaller cards
            />
          )}
          <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg text-sm font-semibold">
            {property.Price && formatPrice(property.Price)}
          </div>
        </div>

        <div className="p-4">
          {" "}
          {/* Reduce padding for smaller cards */}
          <div className="mb-2">
            {" "}
            {/* Adjust margins */}
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              {property.title}
            </h2>
            <p className="text-xs text-gray-500">
              {property.propertyType} in {property.neighbourhood},{" "}
              {property.state}
            </p>
          </div>
          <div className="flex items-center text-gray-600 text-xs space-x-2 mb-2">
            {" "}
            {/* Smaller text */}
            <p className="flex items-center">
              <FaBed className="mr-1" /> {property.NoOfBedRooms} Beds
            </p>
            <p className="flex items-center">
              <FaBath className="mr-1" /> {property.NoOfKitchens} Baths
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
