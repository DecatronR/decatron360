import React from "react";
import { MapPin, Wallet, CalendarDays } from "lucide-react";

const PropertyDetails = ({ contract }) => {
  return (
    <div className="space-y-3 md:space-y-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-4">Property Details</h3>
        <div className="space-y-3">
          <div>
            <span>
              {" "}
              <p className="font-medium text-gray-800">
                Client: {contract.clientName}
              </p>
            </span>
          </div>

          <div className="flex items-center text-sm md:text-base text-gray-700 space-x-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="text-sm md:text-base">
              {contract.propertyLocation}
            </span>
          </div>

          <div className="flex items-center text-sm md:text-base text-gray-700 space-x-2">
            <Wallet className="w-4 h-4 text-green-600" />
            <span className="text-sm md:text-base">
              NGN {new Intl.NumberFormat().format(contract.propertyPrice)}
            </span>
          </div>

          <div className="flex items-center text-sm md:text-base text-gray-700 space-x-2">
            <CalendarDays className="w-4 h-4 text-gray-500" />
            <span className="text-sm md:text-base">
              {new Date(contract.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          <span
            className={`inline-block mt-2 px-3 py-1 text-xs font-medium text-white rounded-full w-max ${
              STATUS_COLORS[contract.status]
            }`}
          >
            {contract.status}
          </span>
        </div>
      </div>
    </div>
  );
};

const STATUS_COLORS = {
  pending: "bg-yellow-500",
  paid: "bg-blue-500",
  completed: "bg-green-500",
  cancelled: "bg-red-500",
};

export default PropertyDetails;
