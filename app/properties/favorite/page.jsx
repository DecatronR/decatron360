"use client";
import { useState, useEffect } from "react";
import Spinner from "@/components/Spinner";
import { addFavoriteProperties } from "@/utils/api/properties/addFavoriteProperties";
import PropertyCard from "@/components/Properties/PropertyCard";

const FavoritePropertiesPage = () => {
  const [userId, setUserId] = useState("");
  const [properties, setProperties] = useState([]);
  const [isFavorite, setIsFavorite] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const id = sessionStorage.getItem("userId");
    setUserId(id);
  }, []);

  useEffect(() => {
    const handleFetchFavoriteProperties = async () => {
      if (userId) {
        try {
          const res = await fetchFavoriteProperties(userId);
          setProperties(res);
          const favoriteIds = res.map((property) => property._id);
          setIsFavorite((prev) =>
            favoriteIds.reduce((acc, id) => ({ ...acc, [id]: true }), {})
          );
        } catch (error) {
          console.error("Failed to fetch favorite properties: ", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        console.log(
          "Failed to fetch favorite properties, user id is not found"
        );
      }
    };
    handleFetchFavoriteProperties();
  }, [userId]);

  const handleToggleFavorite = async (propertyId) => {
    try {
      setIsLoadingFavorite(true);
      if (isFavorite[propertyId]) {
        // Optionally call your removeFavoriteProperties function
        console.log("removed from favorite properties");
        setIsFavorite((prev) => ({ ...prev, [propertyId]: false }));
      } else {
        await addFavoriteProperties(userId, propertyId);
        setIsFavorite((prev) => ({ ...prev, [propertyId]: true }));
      }
    } catch (error) {
      console.log("Error toggling favorite: ", error);
    } finally {
      setIsLoadingFavorite(false);
    }
  };

  return isLoading ? (
    <Spinner loading={isLoading} />
  ) : (
    <section className="px-4 py-6">
      <div className="container-xl lg:container m-auto px-4 py-6">
        <h1 className="text-2xl mb-4">Favorite Properties</h1>
        {properties.length === 0 ? (
          <p>No saved properties</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                isFavorite={isFavorite[property._id]}
                onToggleFavorite={handleToggleFavorite(property._id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FavoritePropertiesPage;
