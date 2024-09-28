"use client";

import Pagination from "@/components/Pagination";
import PropertyCard from "@/components/PropertyCard";
import Spinner from "@/components/Spinner";
import { useEffect, useState } from "react";
import axios from "axios";
import { fetchProperties } from "@/utils/api/properties/fetchProperties";

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const handleFetchProperties = async () => {
      try {
        const res = await fetchProperties();
        setProperties(res);
        setTotalItems(res.length);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    handleFetchProperties();
  }, [page, pageSize]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return loading ? (
    <Spinner />
  ) : (
    <section className="px-4 py-6">
      <div className="container-xl lg:container m-auto px-4 py-6">
        {properties.length === 0 ? (
          <p>No properties found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
        <Pagination
          page={page}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={handlePageChange}
        />
      </div>
    </section>
  );
};

export default Properties;
