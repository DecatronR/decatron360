import React, { useEffect, useState } from "react";
import {
  MapPin,
  Wallet,
  CalendarDays,
  Home,
  User,
  Tag,
  Image as ImageIcon,
} from "lucide-react";
import { parseAmount } from "utils/helpers/formatCurrency";
import { fetchPropertyData } from "utils/api/properties/fetchPropertyData";

const PropertyDetails = ({ contract, propertyData }) => {
  const [fullPropertyData, setFullPropertyData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch full property data using property ID
  useEffect(() => {
    const fetchFullPropertyData = async () => {
      if (!contract?.propertyId) return;

      try {
        setLoading(true);
        const res = await fetchPropertyData(contract.propertyId);
        console.log("property data from property: ", res);
        console.log("property data.data: ", res.data);
        console.log("property photos: ", res.photos);
        console.log("first photo: ", res.photos?.[0]);
        console.log("first photo path: ", res.photos?.[0]?.path);
        setFullPropertyData(res);
      } catch (error) {
        console.error("Failed to fetch property data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFullPropertyData();
  }, [contract?.propertyId]);

  const totalAmount = fullPropertyData?.data
    ? parseAmount(fullPropertyData.data.price) +
      parseAmount(fullPropertyData.data.cautionFee) +
      parseAmount(fullPropertyData.data.agencyFee)
    : 0;

  return (
    <div className="space-y-6">
      {/* Property Image */}
      {(() => {
        console.log(
          "Rendering PropertyDetails - fullPropertyData:",
          fullPropertyData
        );
        console.log("fullPropertyData?.photos:", fullPropertyData?.photos);
        console.log("photos length:", fullPropertyData?.photos?.length);
        console.log("first photo path:", fullPropertyData?.photos?.[0]?.path);

        return (
          fullPropertyData?.photos &&
          fullPropertyData.photos.length > 0 && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="relative h-48">
                <img
                  src={fullPropertyData.photos[0].path}
                  alt="Property"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.log(
                      "PropertyDetails image failed to load:",
                      fullPropertyData.photos[0].path
                    );
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                  onLoad={() => {
                    console.log(
                      "PropertyDetails image loaded successfully:",
                      fullPropertyData.photos[0].path
                    );
                  }}
                />
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center hidden">
                  <div className="text-center">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Property Image</p>
                  </div>
                </div>
              </div>
            </div>
          )
        );
      })()}

      {/* Property Information */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
          <Home className="w-4 h-4 text-gray-600 mr-2" />
          Property Information
        </h3>
        <div className="space-y-3">
          {fullPropertyData?.data?.title && (
            <div>
              <p className="font-medium text-gray-800">
                {fullPropertyData.data.title}
              </p>
            </div>
          )}

          <div className="flex items-center text-sm text-gray-700 space-x-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span>
              {fullPropertyData?.data?.neighbourhood &&
              fullPropertyData?.data?.state
                ? `${fullPropertyData.data.neighbourhood}, ${fullPropertyData.data.state}`
                : contract.propertyLocation || "Location not specified"}
            </span>
          </div>

          {fullPropertyData?.data?.listingType && (
            <div className="flex items-center text-sm text-gray-700 space-x-2">
              <Tag className="w-4 h-4 text-gray-500" />
              <span className="capitalize">
                {fullPropertyData.data.listingType}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Financial Details */}
      {fullPropertyData?.data && (
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
            <Wallet className="w-4 h-4 text-gray-600 mr-2" />
            Financial Details
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Rent</p>
              <p className="text-sm font-semibold text-gray-900">
                {fullPropertyData.data.price?.toLocaleString() || "N/A"}
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Caution Fee</p>
              <p className="text-sm font-semibold text-gray-900">
                {fullPropertyData.data.cautionFee?.toLocaleString() || "N/A"}
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Agency Fee</p>
              <p className="text-sm font-semibold text-gray-900">
                {fullPropertyData.data.agencyFee?.toLocaleString() || "N/A"}
              </p>
            </div>
            <div className="text-center p-3 bg-primary-50 rounded-lg border border-primary-200">
              <p className="text-xs text-gray-500 mb-1">Total</p>
              <p className="text-sm font-semibold text-primary-700">
                ₦{totalAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Contract Information */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
          <User className="w-4 h-4 text-gray-600 mr-2" />
          Contract Information
        </h3>
        <div className="space-y-3">
          <div>
            <p className="font-medium text-gray-800">
              Client: {contract.clientName}
            </p>
          </div>

          <div className="flex items-center text-sm text-gray-700 space-x-2">
            <Wallet className="w-4 h-4 text-gray-500" />
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
