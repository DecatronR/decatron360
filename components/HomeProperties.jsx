"use client";
import PropertyCard from "./Properties/PropertyCard";
import { useEffect, useState } from "react";
import Link from "next/link";
import Spinner from "./Spinner";
import { fetchProperties } from "@/utils/api/properties/fetchProperties";
import { addFavoriteProperties } from "utils/api/properties/addFavoriteProperties";
import { fetchFavoriteProperties } from "utils/api/properties/fetchFavoriteProperties";
import { deleteFavoriteProperties } from "utils/api/properties/deleteFavoriteProperties";

const HomeProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);

      try {
        // Fetch all properties (display to all users)
        const allProperties = await fetchProperties();

        const userId = sessionStorage.getItem("userId");
        if (userId) {
          // Fetch user's favorite properties
          const favoritesResponse = await fetchFavoriteProperties(userId);

          const updatedProperties = allProperties.map((property) => {
            const favorite = favoritesResponse.find(
              (fav) => fav.propertyListingId === property._id
            );
            return {
              ...property,
              isFavorite: !!favorite,
              favoriteId: favorite ? favorite._id : null, // Save the favorite object ID
            };
          });

          setProperties(updatedProperties);
        } else {
          // For non-logged-in users, set isFavorite to false
          setProperties(
            allProperties.map((property) => ({
              ...property,
              isFavorite: false,
              favoriteId: null, // No favorite object ID for non-logged-in users
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleToggleFavorite = async (propertyId) => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      console.error("User ID not found.");
      return;
    }

    try {
      const property = properties.find((prop) => prop._id === propertyId);

      if (!property) {
        console.error("Property not found.");
        return;
      }

      if (property.isFavorite) {
        // Remove from favorites
        if (!property.favoriteId) {
          console.error("Favorite ID not found.");
          return;
        }

        const deleteRes = await deleteFavoriteProperties(property.favoriteId); // Use favoriteId

        if (deleteRes.responseCode === 200) {
          setProperties((prevProperties) =>
            prevProperties.map((prop) =>
              prop._id === propertyId
                ? { ...prop, isFavorite: false, favoriteId: null }
                : prop
            )
          );
        }
      } else {
        // Add to favorites
        const addRes = await addFavoriteProperties(userId, propertyId);

        if (addRes.responseCode === 201 && addRes.favoriteId) {
          setProperties((prevProperties) =>
            prevProperties.map((prop) =>
              prop._id === propertyId
                ? { ...prop, isFavorite: true, favoriteId: addRes.favoriteId }
                : prop
            )
          );
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
