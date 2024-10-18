"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";

const FavoriteButton = ({ property }) => {
  const { user } = useAuth();
  const userId = user?.id;

  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const checkFavoriteStatus = async () => {
      try {
        const res = await fetch("/api/favorites/check", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            propertyId: property._id,
          }),
        });

        if (res.status === 200) {
          const data = await res.json();
          setIsFavorited(data.isFavorited);
        }
      } catch (error) {
        console.error("Error checking favorite status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkFavoriteStatus();
  }, [property._id, userId]);

  const handleClick = async () => {
    if (!userId) {
      toast.error("You need to sign in to add a property to favorites");
      return;
    }

    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId: property._id,
        }),
      });

      if (res.status === 200) {
        const data = await res.json();
        toast.success(data.message);
        setIsFavorited(data.isFavorited);
      }
    } catch (error) {
      console.error("Error updating favorite:", error);
      toast.error("Something went wrong");
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <button
      onClick={handleClick}
      className={`transition duration-300 w-full py-2 px-4 rounded-lg flex items-center justify-center text-white font-semibold shadow-md ${
        isFavorited
          ? "bg-pink-500 hover:bg-pink-600"
          : "bg-gray-500 hover:bg-gray-600"
      }`}
    >
      <FaHeart
        className={`mr-2 ${isFavorited ? "text-white" : "text-white"}`}
      />
      {isFavorited ? "Remove from Favorites" : "Add to Favorites"}
    </button>
  );
};

export default FavoriteButton;
