import React from "react";
import { MapPin, Wallet, CalendarDays, Home, User, Tag } from "lucide-react";
import { parseAmount } from "utils/helpers/formatCurrency";

const PropertyDetails = ({ contract, propertyData }) => {
  const totalAmount = propertyData?.data
    ? parseAmount(propertyData.data.price) +
      parseAmount(propertyData.data.cautionFee) +
      parseAmount(propertyData.data.agencyFee)
    : 0;

  return (
    <div className="space-y-4">
      {/* Property Information */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <Home className="w-5 h-5 text-blue-600 mr-2" />
          Property Information
        </h3>
        <div className="space-y-3">
          {propertyData?.data?.title && (
            <div>
              <p className="font-medium text-gray-800 text-lg">
                {propertyData.data.title}
              </p>
            </div>
          )}

          <div className="flex items-center text-sm text-gray-700 space-x-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>
              {propertyData?.data?.neighbourhood && propertyData?.data?.state
                ? `${propertyData.data.neighbourhood}, ${propertyData.data.state}`
                : contract.propertyLocation || "Location not specified"}
            </span>
          </div>

          {propertyData?.data?.listingType && (
            <div className="flex items-center text-sm text-gray-700 space-x-2">
              <Tag className="w-4 h-4 text-green-600" />
              <span className="capitalize">
                {propertyData.data.listingType}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Financial Details */}
      {propertyData?.data && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <Wallet className="w-5 h-5 text-green-600 mr-2" />
            Financial Details
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-white rounded-lg border border-green-200">
              <p className="text-xs text-gray-500 mb-1">Rent</p>
              <p className="text-sm font-semibold text-gray-900">
                {propertyData.data.price?.toLocaleString() || "N/A"}
              </p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-green-200">
              <p className="text-xs text-gray-500 mb-1">Caution Fee</p>
              <p className="text-sm font-semibold text-gray-900">
                {propertyData.data.cautionFee?.toLocaleString() || "N/A"}
              </p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-green-200">
              <p className="text-xs text-gray-500 mb-1">Agency Fee</p>
              <p className="text-sm font-semibold text-gray-900">
                {propertyData.data.agencyFee?.toLocaleString() || "N/A"}
              </p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-green-200">
              <p className="text-xs text-gray-500 mb-1">Total</p>
              <p className="text-sm font-semibold text-green-600">
                ₦{totalAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Contract Information */}
      <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <User className="w-5 h-5 text-purple-600 mr-2" />
          Contract Information
        </h3>
        <div className="space-y-3">
          <div>
            <p className="font-medium text-gray-800">
              Client: {contract.clientName}
            </p>
          </div>

          <div className="flex items-center text-sm text-gray-700 space-x-2">
            <Wallet className="w-4 h-4 text-green-600" />
            <span>
              NGN {new Intl.NumberFormat().format(contract.propertyPrice)}
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-700 space-x-2">
            <CalendarDays className="w-4 h-4 text-gray-500" />
            <span>
              {new Date(contract.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          <span
            className={`inline-block px-3 py-1 text-xs font-medium text-white rounded-full w-max ${
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
