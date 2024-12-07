"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  faCouch,
  faBed,
  faBath,
  faShower,
  faUtensils,
  faCar,
  faRuler,
} from "@fortawesome/free-solid-svg-icons";
import { deletePropertyListing } from "@/utils/api/propertyListing/deletePropertyListing";
import Swal from "sweetalert2";
import ReactPlayer from "react-player";

const PropertyDetails = ({ property, agentId }) => {
  const [isPropertyLister, setIsPropertyLister] = useState(false);
  const [propertyData, setPropertyData] = useState(null);

  console.log("property in Property details: ", property);
  console.log("property Id in Property details: ", property._id);

  // checking if the logged in user is the user who listed the property
  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    const isCurrentUserTheLister = storedUserId === agentId;
    setIsPropertyLister(isCurrentUserTheLister);
  }, [agentId]);

  const handleSoldOutProperty = async () => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you really want to mark this property as sold out? This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, it's sold out!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        //add sold out API call here

        Swal.fire(
          "Sold out!",
          "Your property has been marked as sold out.",
          "success"
        );
      }
    } catch (error) {
      console.error("Failed to mark property as sold out:", error);
      Swal.fire("Failed", "Failed to mark property as sold out!", "error");
    }
  };

  const handleDeleteProperty = async () => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you really want to delete this property? This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        await deletePropertyListing(property._id);

        Swal.fire("Deleted!", "Your property has been deleted.", "success");
      }
    } catch (error) {
      console.error("Failed to delete property:", error);
      Swal.fire("Failed", "Failed to delete property!", "error");
    }
  };

  const getInstagramPostId = (url) => {
    const match = url.match(/instagram\.com\/p\/([^/]+)/);
    return match ? match[1] : null;
  };

  return (
    <section className="bg-white rounded-lg p-6 space-y-6 ">
      {/* Property Title and Location */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
        <p className="text-gray-500 mt-2">
          {property.neighbourhood}, {property.lga}, {property.state}
        </p>
      </div>
      {isPropertyLister && (
        <div className="flex space-x-4">
          <Link
            href={`/properties/${property._id}/edit`}
            className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition duration-200"
            role="editProperty"
          >
            Edit
          </Link>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
            onClick={handleSoldOutProperty}
          >
            Sold out
          </button>
          {/* <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
            onClick={handleDeleteProperty}
          >
            Delete
          </button> */}
        </div>
      )}
      {/* Property Info and Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Property Information
          </h2>
          <p>
            <strong>Type:</strong> {property.propertyType}
            {/* -{" "}
            {property.propertySubType} */}
          </p>
          <p>
            <strong>Listing Type:</strong> {property.listingType}
          </p>
          <p>
            <strong>Condition:</strong> {property.propertyCondition}
          </p>
          <p>
            <strong>Usage Type:</strong> {property.usageType}
          </p>
          <p>
            <strong>Price:</strong> {property.Price}
          </p>
        </div>

        <div className="bg-gray-50 p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Features</h2>
          <ul className="list-none space-y-2">
            {/* <li className="flex items-center">
              <FontAwesomeIcon
                icon={faCouch}
                className="text-indigo-600 mr-2"
              />
              Living Rooms: {property.NoOfLivingRooms}
            </li> */}
            <li className="flex items-center">
              <FontAwesomeIcon icon={faBed} className="text-indigo-600 mr-2" />
              Bedrooms: {property.NoOfBedRooms}
            </li>
            <li className="flex items-center">
              <FontAwesomeIcon
                icon={faShower}
                className="text-indigo-600 mr-2"
              />
              Bathroom: {property.NoOfKitchens}
            </li>
            {/* <li className="flex items-center">
              <FontAwesomeIcon icon={faCar} className="text-indigo-600 mr-2" />
              Parking Spaces: {property.NoOfParkingSpace}
            </li> */}
            <li className="flex items-center">
              <FontAwesomeIcon
                icon={faRuler}
                className="text-indigo-600 mr-2"
              />
              Size: {property.size} sqm.
            </li>
          </ul>
        </div>
      </div>

      {/* Property Description */}
      <div className="bg-gray-50 p-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Description
        </h2>
        <p className="text-gray-700">{property.propertyDetails}</p>
      </div>

      {/* Virtual Tour and Video */}
      {/* Virtual Tour and Video */}
      <div className="bg-gray-50 p-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Virtual Tour
        </h2>
        <div className="space-y-4">
          {property.virtualTour && (
            <div className="rounded-md overflow-hidden">
              {property.virtualTour.includes("youtube") ? (
                <iframe
                  width="560"
                  height="315"
                  src={`${property.virtualTour}?autoplay=1`}
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              ) : property.virtualTour.includes("matterport") ? (
                <iframe
                  width="100%"
                  height="500"
                  src={`${property.virtualTour}&play=1`}
                  frameborder="0"
                  allowfullscreen
                ></iframe>
              ) : property.virtualTour.includes("cloudpano") ? (
                <iframe
                  width="100%"
                  height="500"
                  src={property.virtualTour}
                  frameborder="0"
                  allowfullscreen
                ></iframe>
              ) : (
                <video controls className="w-full h-auto rounded-lg">
                  <source src={property.virtualTour} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          )}
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Video</h2>
          {property.video.includes("instagram") ? (
            <div className="instagram-embed rounded-md overflow-hidden">
              <iframe
                src={`https://www.instagram.com/p/${getInstagramPostId(
                  property.video
                )}/embed`}
                width="100%"
                height="500px"
                frameBorder="0"
                allow="encrypted-media"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <ReactPlayer
              url={property.video}
              width="100%"
              height="500px"
              controls={true}
              playing={false}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default PropertyDetails;
