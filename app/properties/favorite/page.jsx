"use client";
import { useState, useEffect } from "react";
import Spinner from "@/components/Spinner";
import { addFavoriteProperties } from "@/utils/api/properties/addFavoriteProperties";
import { deleteFavoriteProperties } from "utils/api/properties/deleteFavoriteProperties";
import FavoritePropertyCard from "components/Properties/FavoritePropertyCard";
import { fetchFavoriteProperties } from "@/utils/api/properties/fetchFavoriteProperties";
import { fetchPropertyData } from "utils/api/properties/fetchPropertyData";

const FavoritePropertiesPage = () => {
  const [userId, setUserId] = useState("");
  const [properties, setProperties] = useState([]);
  const [isFavorite, setIsFavorite] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState({});

  useEffect(() => {
    const id = sessionStorage.getItem("userId");
    if (id) {
      setUserId(id);
    } else {
      console.warn("User ID not found in session storage");
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleFetchFavoriteProperties = async () => {
      if (userId) {
        try {
          const favoriteProperties = await fetchFavoriteProperties(userId);
          const favoriteIds = favoriteProperties.map(
            (fav) => fav.propertyListingId
          );

          // Fetch full details for each property
          const detailedProperties = await Promise.all(
            favoriteIds.map((id) => fetchPropertyData(id))
          );
          console.log("fetched favorite properties: ", detailedProperties);

          setProperties(detailedProperties);
          setIsFavorite(
            favoriteIds.reduce((acc, id) => ({ ...acc, [id]: true }), {})
          );
        } catch (error) {
          console.error("Failed to fetch favorite properties: ", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    handleFetchFavoriteProperties();
  }, [userId]);

  const handleToggleFavorite = async (propertyId) => {
    try {
      setIsTogglingFavorite((prev) => ({ ...prev, [propertyId]: true }));
      if (isFavorite[propertyId]) {
        // Delete from favorite
        await deleteFavoriteProperties(userId, propertyId);
        setProperties((prev) => prev.filter((prop) => prop._id !== propertyId));
      } else {
        // Add to favorite
        await addFavoriteProperties(userId, propertyId);

        // Fetch the newly added favorite property details
        const newFavorite = await fetchPropertyData(propertyId);
        setProperties((prev) => [...prev, newFavorite]);
      }
      setIsFavorite((prev) => ({ ...prev, [propertyId]: !prev[propertyId] }));
    } catch (error) {
      console.error("Error toggling favorite: ", error);
    } finally {
      setIsTogglingFavorite((prev) => ({ ...prev, [propertyId]: false }));
    }
  };

  return isLoading ? (
    <Spinner loading={isLoading} />
  ) : (
    <section className="px-4 py-6">
      <div className="container-xl lg:container m-auto px-4 py-6">
        <h1 className="text-2xl mb-4">Favorite Properties</h1>
        {properties.length === 0 ? (
          <p>No favorite properties</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {properties.map((property) => (
              <FavoritePropertyCard
                key={property._id}
                property={property}
                isFavorite={isFavorite[property._id]}
                onToggleFavorite={() => handleToggleFavorite(property._id)}
                isToggling={isTogglingFavorite[property._id]}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FavoritePropertiesPage;
