"use client";

import Pagination from "@/components/Pagination";
import PropertyCard from "./PropertyCard";
import Spinner from "@/components/Spinner";
import { useEffect, useState } from "react";
import { fetchProperties } from "@/utils/api/properties/fetchProperties";
import { addFavoriteProperties } from "utils/api/properties/addFavoriteProperties";
import { fetchFavoriteProperties } from "utils/api/properties/fetchFavoriteProperties";
import { deleteFavoriteProperties } from "utils/api/properties/deleteFavoriteProperties";

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);

      try {
        // Fetch all properties (display to all users)
        const allProperties = await fetchProperties();
        console.log("Properties fetched:", allProperties);

        const userId = sessionStorage.getItem("userId");
        if (userId) {
          // Fetch user's favorite properties
          const favoritesResponse = await fetchFavoriteProperties(userId);
          console.log("Favorite properties fetched:", favoritesResponse);

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
  }, [page, pageSize]);

  const handleToggleFavorite = async (propertyId) => {
    console.log("Toggling favorite for:", propertyId);
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      console.error("User ID not found.");
      return;
    }

    try {
      const property = properties.find((prop) => prop._id === propertyId);
      console.log("Property to toggle favorite:", property);

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
        console.log("Delete favorite res:", deleteRes.responseCode);

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
        console.log("Add favorite res:", addRes.responseCode);

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

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <section className="px-4 py-6">
      <div className="container-xl lg:container m-auto px-4 py-6">
        {loading ? (
          <Spinner />
        ) : properties.length === 0 ? (
          <p>No properties found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {properties.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                isFavorite={property.isFavorite}
                onToggleFavorite={() => handleToggleFavorite(property._id)}
              />
            ))}
          </div>
        )}
        {!loading && properties.length > 0 && (
          <Pagination
            page={page}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </section>
  );
};

export default Properties;
