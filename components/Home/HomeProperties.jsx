"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PropertyCard from "../Properties/PropertyCard";
import HomePropertiesSkeleton from "components/ui/HomePropertiesSkeleton";
import { fetchProperties } from "@/utils/api/properties/fetchProperties";
import { addFavoriteProperties } from "utils/api/properties/addFavoriteProperties";
import { fetchFavoriteProperties } from "utils/api/properties/fetchFavoriteProperties";
import { deleteFavoriteProperties } from "utils/api/properties/deleteFavoriteProperties";
import AddPropertyAction from "components/ui/AddPropertyAction";
import { useAuth } from "context/AuthContext";
import { trackVisitor } from "utils/api/analytics/trackVisitor";
import { getOrCreateVisitorId } from "utils/api/analytics/getVisitor";
import { shouldNotifyAgain } from "utils/api/analytics/shouldNotify";

const HomeProperties = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8);

  const privilegedRoles = ["agent", "owner", "property-manager", "admin"];
  const isPrivilegedUser = user && privilegedRoles.includes(user.role);

  //track visitor
  useEffect(() => {
    const getVisitorData = async () => {
      const ipResponse = await fetch("https://api.ipify.org?format=json");
      const ipData = await ipResponse.json();
      const ip = ipData.ip;
      const visitorId = getOrCreateVisitorId();
      const notify = shouldNotifyAgain();

      const userAgent = window.navigator.userAgent;
      try {
        const res = await trackVisitor(ip, visitorId, notify, userAgent);
        // console.log("Visitor tracked successfully!: ", res);
      } catch (error) {
        console.error("Error tracking visitor:", error);
      }
    };

    getVisitorData();
  }, []);
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);

      try {
        const allProperties = await fetchProperties();

        // Ensure allProperties is an array
        if (!Array.isArray(allProperties)) {
          console.error("Properties data is not an array:", allProperties);
          setProperties([]);
          return;
        }

        const userId = sessionStorage.getItem("userId");

        if (userId) {
          const favoritesResponse = await fetchFavoriteProperties(userId);
          const updatedProperties = allProperties.map((property) => {
            const favorite = favoritesResponse.find(
              (fav) => fav.propertyListingId === property._id
            );
            return {
              ...property,
              isFavorite: !!favorite,
              favoriteId: favorite ? favorite._id : null,
            };
          });

          updatedProperties.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );

          setProperties(updatedProperties);
        } else {
          setProperties(
            allProperties.map((property) => ({
              ...property,
              isFavorite: false,
              favoriteId: null,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setProperties([]);
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
        if (!property.favoriteId) {
          console.error("Favorite ID not found.");
          return;
        }
        const deleteRes = await deleteFavoriteProperties(property.favoriteId);
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

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 8);
  };

  const handleAddProperty = () => {
    router.push("properties/add/for-rent");
  };

  return (
    <>
      <section className="px-4 py-6">
        <div className="container-xl lg:container m-auto">
          <h2 className="text-2xl font-bold text-primary-500 mb-4 text-center">
            Latest Properties
          </h2>
          {loading ? (
            <div className="flex justify-center items-center py-2">
              <HomePropertiesSkeleton />
            </div>
          ) : properties.length === 0 ? (
            <p className="text-center">No Properties Found</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {properties.slice(0, visibleCount).map((property) => (
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

      {!loading && properties.length > visibleCount && (
        <section className="m-auto max-w-xs my-10 px-6">
          <button
            onClick={handleLoadMore}
            className="block w-full bg-primary-500 text-white text-center py-4 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 hover:bg-primary-600"
          >
            See more
          </button>
        </section>
      )}
      {user && isPrivilegedUser && <AddPropertyAction isFloating={true} />}
    </>
  );
};

export default HomeProperties;
