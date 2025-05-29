"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { getMyFavorites } from "@/utils/api/favorites/getMyFavorites";
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

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const checkFavoriteStatus = async () => {
      try {
        const response = await getMyFavorites(userId);
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
      if (isFavorited) {
        await deleteFavorite(favoriteId);
        setIsFavorited(false);
        setFavoriteId(null);
        enqueueSnackbar("Property removed from favorites", {
          variant: "success",
        });
      } else {
        const response = await createFavorite(userId, property._id);
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
    }
  };

  if (loading) {
    return (
      <button
        disabled
        className="transition duration-300 w-full py-2 px-4 rounded-lg flex items-center justify-center text-white font-semibold shadow-md bg-gray-400 cursor-not-allowed"
      >
        <FaHeart className="mr-2 text-white animate-pulse" />
        Loading...
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`transition duration-300 w-full py-2 px-4 rounded-lg flex items-center justify-center text-white font-semibold shadow-md ${
        isFavorited
          ? "bg-pink-500 hover:bg-pink-600"
          : "bg-gray-500 hover:bg-gray-600"
      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <FaHeart className="mr-2 text-white" />
      {isFavorited ? "Remove from Favorites" : "Add to Favorites"}
    </button>
  );
};

export default FavoriteButton;
