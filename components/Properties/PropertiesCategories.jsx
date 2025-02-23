"use client";

import Pagination from "@/components/Pagination";
import PropertyCard from "./PropertyCard";
import Spinner from "components/ui/Spinner";
import { useState } from "react";

const PropertiesCategories = ({ properties, loading }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalItems, setTotalItems] = useState(0);

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

export default PropertiesCategories;
