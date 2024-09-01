"use client";
import PropertyCard from "@/components/PropertyCard";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Link from "next/link";

const HomeProperties = async () => {
  const [properties, setProperties] = useState([]);

  const fetchProperties = useCallback(async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/propertyListing/fetchPropertyListing",
        { withCredentials: true }
      );
      console.log("Properties fetched:", res.data);
      setProperties(res.data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  }, []);

  useEffect(
    () => {
      fetchProperties();
    },
    [],
    [properties]
  );

  const recentProperties = properties
    ?.sort(() => Math.random() - Math.random())
    .slice(0, 3);

  return (
    <>
      <section className="px-4 py-6">
        <div className="container-xl lg:container m-auto">
          <h2 className="text-3xl font-bold text-primary-400 mb-6 text-center">
            Recent Properties
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentProperties === 0 ? (
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
          className="block bg-black text-white text-center py-4 px-6 rounded-xl hover:bg-gray-700"
        >
          View All Properties
        </Link>
      </section>
    </>
  );
};

export default HomeProperties;
