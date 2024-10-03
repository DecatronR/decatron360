"use client";
import PropertyCard from "./Properties/PropertyCard";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import FeaturedPropertyCard from "./FeaturedPropertyCard";
import { fetchProperties } from "@/utils/api/properties/fetchProperties";

const HomeProperties = () => {
  const [properties, setProperties] = useState([]);

  const handleFetchProperties = useCallback(async () => {
    try {
      const res = await fetchProperties();
      console.log("Properties fetched:", res);
      setProperties(res);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  }, []);

  useEffect(() => {
    handleFetchProperties();
  }, []);

  const recentProperties = properties
    ?.sort(() => Math.random() - Math.random())
    .slice(0, 16);

  return (
    <>
      <section className="px-4 py-6">
        <div className="container-xl lg:container m-auto">
          <h2 className="text-3xl font-bold text-primary-500 mb-6 text-center">
            Latest Properties
          </h2>
          {/* Adjust grid for 4 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentProperties.length === 0 ? (
              <p>No Properties Found</p>
            ) : (
              recentProperties?.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))
            )}
          </div>
        </div>
      </section>

      <section className="m-auto max-w-lg my-10 px-6">
        <Link
          href="/properties"
          className="block bg-primary-500 text-white text-center py-4 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 hover:bg-primary-600"
        >
          See All Properties
        </Link>
      </section>
    </>
  );
};

export default HomeProperties;
