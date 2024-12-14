"use client";
import PropertyCard from "./Properties/PropertyCard";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Spinner from "./Spinner";
import { fetchProperties } from "@/utils/api/properties/fetchProperties";
import { addFavoriteProperties } from "utils/api/properties/addFavoriteProperties";
import { fetchFavoriteProperties } from "utils/api/properties/fetchFavoriteProperties";
import { deleteFavoriteProperties } from "utils/api/properties/deleteFavoriteProperties";

const HomeProperties = () => {
  const [properties, setProperties] = useState([]);
  const [favoriteProperties, setFavoriteProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleFetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchProperties();
      console.log("Properties fetched:", res);
      setProperties(res);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFetchFavoriteProperties = async () => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      console.error("User ID not found.");
      return;
    }
    try {
      const res = await fetchFavoriteProperties(userId);
      console.log("Favorite properties: ", res);
    } catch (error) {
      console.error("Failed to fetch user favorite properties");
    }
  };

  useEffect(() => {
    handleFetchProperties();
    handleFetchFavoriteProperties();
  }, [handleFetchProperties]);

  const handleToggleFavorite = async (propertyId) => {
    console.log("Toggling favorite for:", propertyId);
    const userId = sessionStorage.getItem("userId");

    if (!userId) {
      console.error("User ID not found.");
      return;
    }

    try {
      // Fetch favorites to check if the property is already marked as favorite
      const favoritesResponse = await fetchFavoriteProperties(userId);
      console.log("fetch favorite res: ", favoritesResponse);
      if (!favoritesResponse) {
        console.error("Failed to fetch favorites.");
        return;
      }

      // Find if the property is in the list of favorites
      const favoriteItem = favoritesResponse.find(
        (favorite) => favorite.propertyListingId === propertyId
      );

      if (favoriteItem) {
        // Property is already marked as favorite, so trigger the delete function
        const deleteRes = await deleteFavoriteProperties(favoriteItem._id);
        console.log("Delete favorite res:", deleteRes.responseCode);

        if (deleteRes.responseCode === 200) {
          setProperties((prevProperties) =>
            prevProperties.map((property) =>
              property._id === propertyId
                ? { ...property, isFavorite: false }
                : property
            )
          );
        } else {
          console.error("Failed to remove favorite.");
        }
      } else {
        // Property is not marked as favorite, so trigger the add function
        const addRes = await addFavoriteProperties(userId, propertyId);
        console.log("Add favorite res:", addRes.responseCode);

        if (addRes.responseCode === 201) {
          setProperties((prevProperties) =>
            prevProperties.map((property) =>
              property._id === propertyId
                ? { ...property, isFavorite: true }
                : property
            )
          );
        } else {
          console.error("Failed to add favorite.");
        }
      }
    } catch (error) {
      console.error("Error toggling favorite status:", error);
    }
  };

  const recentProperties = properties
    ?.sort(() => Math.random() - Math.random())
    .slice(0, 16);

  return (
    <>
      <section className="px-4 py-6">
        <div className="container-xl lg:container m-auto">
          <h2 className="text-3xl font-bold text-primary-500 mb-4 text-center">
            Latest Properties
          </h2>
          {loading ? (
            <div className="flex justify-center items-center py-2">
              <Spinner />
            </div>
          ) : recentProperties.length === 0 ? (
            <p className="text-center">No Properties Found</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentProperties.map((property) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                  isFavorite={property.isFavorite}
                  onToggleFavorite={() => handleToggleFavorite(property._id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {!loading && (
        <section className="m-auto max-w-lg my-10 px-6">
          <Link
            href="/properties"
            className="block bg-primary-500 text-white text-center py-4 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 hover:bg-primary-600"
          >
            See All Properties
          </Link>
        </section>
      )}
    </>
  );
};

export default HomeProperties;
