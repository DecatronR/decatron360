import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  Bath,
  BedSingle,
  MapPin,
  Ruler,
  Heart,
  HeartOff,
  Share2,
} from "lucide-react";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { fetchUserData } from "utils/api/user/fetchUserData";

const PropertyCard = ({ property, isFavorite, onToggleFavorite }) => {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [isCopied, setIsCopied] = useState(false);
  const [referralCode, setReferralCode] = useState();

  useEffect(() => {
    const handleFetchUserData = async () => {
      const userId = sessionStorage.getItem("userId");
      if (!userId) return;

      const res = await fetchUserData(userId);
      setReferralCode(res?.referralCode);
    };

    handleFetchUserData();
  }, []);

  const shareUrl = `${window.location.origin}/properties/${property._id}${
    referralCode ? `?ref=${referralCode}` : ""
  }`;

  const formatPrice = (price) => `${price.toLocaleString()}`;

  const handleAuthCheck = (callback) => {
    const userId = sessionStorage.getItem("userId");

    if (!userId) {
      enqueueSnackbar("Please login to perform this action", {
        variant: "warning",
        action: (key) => (
          <button
            onClick={() => {
              router.push("/auth/login");
              enqueueSnackbar.closeSnackbar(key);
            }}
            className="text-primary-500 font-semibold underline mr-4"
          >
            Login
          </button>
        ),
      });
      return false;
    }

    return callback();
  };

  const handleShareBtn = (e) => {
    e.preventDefault();
    e.stopPropagation();

    handleAuthCheck(() => {
      if (navigator.share) {
        navigator
          .share({
            title: property.title,
            text: "Check out this property!",
            url: shareUrl,
          })
          .catch((error) => console.log("Error sharing:", error));
      } else {
        navigator.clipboard.writeText(shareUrl).then(() => {
          setIsCopied(true);
          enqueueSnackbar("Property link copied to clipboard!", {
            variant: "success",
          });
          setTimeout(() => setIsCopied(false), 2000);
        });
      }
    });
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
                handleAuthCheck(() => onToggleFavorite());
              }}
              aria-label={
                isFavorite ? "Remove from favorites" : "Add to favorites"
              }
            >
              {isFavorite ? (
                <Heart
                  className="text-red-500 text-sm transition duration-300"
                  size={16}
                />
              ) : (
                <HeartOff
                  className="text-gray-500 text-sm transition duration-300"
                  size={16}
                />
              )}
            </button>

            {/* Share Button */}
            <button
              className="p-2 rounded-full bg-white bg-opacity-90 shadow-md transition hover:bg-gray-100"
              onClick={handleShareBtn}
              title="Share Property"
            >
              <Share2
                className="text-gray-500 text-sm hover:text-gray-700 transition duration-300"
                size={16}
              />
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
              <BedSingle className="mr-1" size={16} /> {property.bedrooms} Beds
            </p>
            <p className="flex items-center">
              <Bath className="mr-1" size={16} /> {property.bathrooms} Baths
            </p>
            <p className="flex items-center">
              <Ruler className="mr-1" size={16} /> {property.size} sqft
            </p>
          </div>

          <div className="flex justify-between items-center text-gray-700 mt-2">
            <p className="flex items-center text-orange-600 text-xs font-medium">
              <MapPin className="mr-1" size={16} />
              {property.neighbourhood}, {property.state}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
