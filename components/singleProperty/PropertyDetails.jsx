import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCouch,
  faBed,
  faUtensils,
  faCar,
  faRuler,
} from "@fortawesome/free-solid-svg-icons";

const PropertyDetails = ({ property }) => {
  return (
    <section className="bg-white rounded-lg shadow-md p-6 space-y-6">
      {/* Property Title and Location */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
        <p className="text-gray-500 mt-2">
          {property.neighbourhood}, {property.state}
        </p>
      </div>

      {/* Property Rating */}
      <div className="flex items-center space-x-2 mb-6">
        <span className="text-yellow-500 text-xl">
          ⭐ {property.rating || "4.5"}
        </span>
        <span className="text-gray-600">
          {property.reviews?.length || 10} reviews
        </span>
      </div>

      {/* Property Info and Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Property Information
          </h2>
          <p>
            <strong>Type:</strong> {property.propertyType} -{" "}
            {property.propertySubType}
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
            <strong>Price:</strong> ${property.Price}
          </p>
        </div>

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

      {/* Property Description */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Description
        </h2>
        <p className="text-gray-700">{property.propertyDetails}</p>
      </div>

      {/* Virtual Tour and Video */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Virtual Tour & Video
        </h2>
        <div className="space-y-4">
          {property.virtualTour && (
            <p>
              <strong>Virtual Tour:</strong>{" "}
              <a
                href={property.virtualTour}
                className="text-indigo-500 hover:underline"
              >
                View Tour
              </a>
            </p>
          )}
          {property.video && (
            <div className="rounded-md overflow-hidden shadow-lg">
              <video controls className="w-full h-auto">
                <source src={property.video} type="video/mp4" />
              </video>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PropertyDetails;
