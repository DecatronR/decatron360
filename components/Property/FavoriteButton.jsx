"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { fetchMyFavorites } from "utils/api/favorites/fetchMyFavorites";
import { createFavorite } from "@/utils/api/favorites/createFavorite";
import { deleteFavorite } from "@/utils/api/favorites/deleteFavorite";

const FavoriteButton = ({ property }) => {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const userId = user?.id;

  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [favoriteId, setFavoriteId] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  console.log("Property Id: ", property);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const checkFavoriteStatus = async () => {
      try {
        const response = await fetchMyFavorites(userId);
        const favorites = response.data;
        const isPropertyFavorited = favorites.some(
          (fav) => fav.propertyListingId === property._id
        );
        setIsFavorited(isPropertyFavorited);
        if (isPropertyFavorited) {
          const favorite = favorites.find(
            (fav) => fav.propertyListingId === property._id
          );
          setFavoriteId(favorite._id);
        }
      } catch (error) {
        console.error("Error checking favorite status:", error);
        enqueueSnackbar("Error checking favorite status", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };

    checkFavoriteStatus();
  }, [property._id, userId]);

  const handleClick = async () => {
    if (!userId) {
      enqueueSnackbar("Please sign in to add properties to favorites", {
        variant: "warning",
        action: (key) => (
          <button
            onClick={() => {
              router.push("/auth/login");
              enqueueSnackbar.dismiss(key);
            }}
            className="text-white underline"
          >
            Sign in
          </button>
        ),
      });
      return;
    }

    try {
      setLoading(true);
      setIsAnimating(true);

      if (isFavorited) {
        await deleteFavorite(favoriteId);
        setIsFavorited(false);
        setFavoriteId(null);
        enqueueSnackbar("Property removed from favorites", {
          variant: "success",
        });
      } else {
        console.log("Property ID being sent:", property.data._id);
        const response = await createFavorite(userId, property.data._id);
        setIsFavorited(true);
        setFavoriteId(response.data._id);
        enqueueSnackbar("Property added to favorites", {
          variant: "success",
        });
      }
    } catch (error) {
      console.error("Error updating favorite:", error);
      enqueueSnackbar(error.message || "Failed to update favorite status", {
        variant: "error",
      });
    } finally {
      setLoading(false);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
      <button
        onClick={handleClick}
        disabled={loading}
        className={`w-full group relative overflow-hidden rounded-lg transition-all duration-300 ${
          isFavorited
            ? "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
            : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
        } ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <div className="flex items-center justify-center py-3 px-4">
          <div className="relative">
            <Heart
              className={`w-6 h-6 transition-all duration-300 ${
                isFavorited
                  ? "text-white fill-white"
                  : "text-gray-600 group-hover:text-pink-500"
              } ${isAnimating ? "scale-125" : "scale-100"}`}
            />
            {isAnimating && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          <span
            className={`ml-3 font-medium transition-colors duration-300 ${
              isFavorited
                ? "text-white"
                : "text-gray-700 group-hover:text-gray-900"
            }`}
          >
            {isFavorited ? "Saved to Favorites" : "Save to Favorites"}
          </span>
        </div>

        {/* Subtle background animation */}
        {!isFavorited && (
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        )}
      </button>
    </div>
  );
};

export default FavoriteButton;
