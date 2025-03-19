"use client";
import React, { useState, useEffect } from "react";
import PropertiesCategories from "components/Properties/PropertiesCategories";
import PropertySearchForm from "@/components/Properties/PropertySearchForm";
import { fetchProperties } from "utils/api/properties/fetchProperties";
import { fetchFavoriteProperties } from "utils/api/properties/fetchFavoriteProperties";

const PropertiesNewlyBuilt = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);

      try {
        // Fetch all properties
        const allProperties = await fetchProperties();

        // Filter properties to include only those in Newly Built
        const newlyBuiltProperties = allProperties.filter(
          (property) => property.propertyCondition === "Newly Built"
        );

        const userId = sessionStorage.getItem("userId");
        if (userId) {
          // Fetch user's favorite properties
          const favoritesResponse = await fetchFavoriteProperties(userId);

          const updatedProperties = newlyBuiltProperties.map((property) => {
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
            newlyBuiltProperties.map((property) => ({
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
  }, [page, pageSize]);

  return (
    <>
      <section className="bg-primary-500 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-start sm:px-6 lg:px-8">
          <h2 className="text2xl font-bold text-white mb-4">
            Newly Built Properties
          </h2>
          <PropertySearchForm />
        </div>
      </section>
      <PropertiesCategories properties={properties} loading={loading} />
    </>
  );
};

export default PropertiesNewlyBuilt;
