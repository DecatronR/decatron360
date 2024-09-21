"use client";
import React from "react";

const PropertyInspectionDetails = ({ property }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-10 max-w-md mx-auto">
      <h4 className="text-xl font-bold text-gray-900 mb-4">Property Details</h4>
      <div className="space-y-4">
        {/* Title */}
        <div className="flex items-center">
          <span className="font-semibold text-gray-700 w-1/3">Title:</span>
          <span className="text-gray-900">{property.data.title || "N/A"}</span>
        </div>

        {/* Listing Type */}
        <div className="flex items-center">
          <span className="font-semibold text-gray-700 w-1/3">
            Listing Type:
          </span>
          <span className="text-gray-900">
            {property.data.listingType || "N/A"}
          </span>
        </div>

        {/* Property Type */}
        <div className="flex items-center">
          <span className="font-semibold text-gray-700 w-1/3">
            Property Type:
          </span>
          <span className="text-gray-900">
            {property.propertyType || "N/A"}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center">
          <span className="font-semibold text-gray-700 w-1/3">Location:</span>
          <span className="text-gray-900">
            {property.state || "N/A"}, {property.data.lga || "N/A"},{" "}
            {property.neighbourhood || "N/A"}
          </span>
        </div>

        {/* Size */}
        <div className="flex items-center">
          <span className="font-semibold text-gray-700 w-1/3">Size:</span>
          <span className="text-gray-900">{property.data.size || "N/A"}</span>
        </div>

        {/* Price */}
        <div className="flex items-center">
          <span className="font-semibold text-gray-700 w-1/3">Price:</span>
          <span className="text-gray-900">{property.data.Price || "N/A"}</span>
        </div>

        {/* Property Details */}
        <div className="flex items-center">
          <span className="font-semibold text-gray-700 w-1/3">Details:</span>
          <span className="text-gray-900">
            {property.data.propertyDetails || "N/A"}
          </span>
        </div>

        {/* Photo */}
        {/* {property.photo.length > 0 && (
          <div className="flex flex-col items-center mt-4">
            <h5 className="text-lg font-semibold text-gray-900 mb-2">
              Photos:
            </h5>
            <div className="flex space-x-2 overflow-x-auto">
              {property.photo.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Property photo ${index + 1}`}
                  className="w-24 h-24 object-cover rounded-md border border-gray-300"
                />
              ))}
            </div>
          </div>
        )} */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Features</h2>
          <ul className="list-none space-y-2">
            <li className="flex items-center">
              <FontAwesomeIcon
                icon={faCouch}
                className="text-indigo-600 mr-2"
              />{" "}
              Living Rooms: {property.NoOfLivingRooms}
            </li>
            <li className="flex items-center">
              <FontAwesomeIcon icon={faBed} className="text-indigo-600 mr-2" />{" "}
              Bedrooms: {property.NoOfBedRooms}
            </li>
            <li className="flex items-center">
              <FontAwesomeIcon
                icon={faUtensils}
                className="text-indigo-600 mr-2"
              />{" "}
              Kitchens: {property.NoOfKitchens}
            </li>
            <li className="flex items-center">
              <FontAwesomeIcon icon={faCar} className="text-indigo-600 mr-2" />{" "}
              Parking Spaces: {property.NoOfParkingSpace}
            </li>
            <li className="flex items-center">
              <FontAwesomeIcon
                icon={faRuler}
                className="text-indigo-600 mr-2"
              />{" "}
              Size: {property.size} sqm.
            </li>
          </ul>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h4 className="text-xl font-bold text-gray-900">Meet Your Agent</h4>
        <div className="flex items-center">
          <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
            <Image
              src={photo}
              alt={`${name}'s photo`}
              width={64}
              height={64}
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-800">{name}</p>
            <p className="text-gray-600">{rank}</p>
            <div className="flex items-center text-yellow-500">
              <FaStar className="text-yellow-500" />
              <span className="ml-2">{ratings}</span>
            </div>
            <p className="text-gray-600">{reviews} reviews</p>
            <p className="text-gray-500 text-sm">
              Joined{" "}
              {formatDistanceToNow(new Date(joinDate), { addSuffix: true })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyInspectionDetails;
