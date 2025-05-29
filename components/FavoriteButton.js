import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  getMyFavorites,
  createFavorite,
  deleteFavorite,
} from "@/utils/api/favorites/favoriteApi";

const FavoriteButton = ({ propertyListingId }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!user) return;

      try {
        const response = await getMyFavorites(user.id);
        const favorites = response.data;
        const favorite = favorites.find(
          (fav) => fav.propertyListingId === propertyListingId
        );

        if (favorite) {
          setIsFavorite(true);
          setFavoriteId(favorite.id);
        }
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };

    checkFavoriteStatus();
  }, [user, propertyListingId]);

  const handleFavoriteClick = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    try {
      if (isFavorite) {
        await deleteFavorite(favoriteId);
        setIsFavorite(false);
        setFavoriteId(null);
      } else {
        const response = await createFavorite(user.id, propertyListingId);
        setIsFavorite(true);
        setFavoriteId(response.data.id);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleFavoriteClick}
      disabled={isLoading}
      className={`p-2 rounded-full transition-colors ${
        isFavorite
          ? "bg-red-100 text-red-500 hover:bg-red-200"
          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
      }`}
    >
      <Heart
        className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`}
        strokeWidth={2}
      />
    </button>
  );
};

export default FavoriteButton;
