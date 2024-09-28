"use client";
import React, { useState, useEffect } from "react";
import FeaturedPropertyCard from "./FeaturedPropertyCard";
import { fetchProperties } from "@/utils/api/properties/fetchProperties";
import { useAuth } from "@/context/AuthContext";

const FeaturedProperties = async () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState();

  useEffect(() => {
    const handleFetchProperties = async () => {
      if (user) {
        try {
          const response = await fetchProperties();
          setProperties(response);
        } catch (error) {
          console.error("Issue with fetching featured properties: ", error);
        }
      } else {
        console.log("Could not fetch properties, user id not found");
      }
    };
    handleFetchProperties();
  });

  return (
    properties.length > 0 && (
      <section className="bg-primary-100 px-4 pt-6 pb-10">
        <div className="container-xl lg:container m-auto">
          <h2 className="text-3xl font-bold text-primary-500 mb-6 text-center">
            Featured Properties
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {properties.map((property) => (
              <FeaturedPropertyCard key={property._id} property={property} />
            ))}
          </div>
        </div>
      </section>
    )
  );
};

export default FeaturedProperties;
