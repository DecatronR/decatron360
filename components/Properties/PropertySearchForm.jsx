"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchPropertyTypes } from "utils/api/propertyListing/fetchPropertyTypes";

const PropertySearchForm = () => {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [propertyType, setPropertyType] = useState("All");

  useEffect(() => {
    const handleFetchPropertyTypes = async () => {
      try {
        const res = await fetchPropertyTypes();
        console.log("Property types for search: ", res);
        setPropertyTypes(res);
      } catch (error) {
        console.log(error);
      }
    };
    handleFetchPropertyTypes();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (location === "" && propertyType === "All") {
      router.push("/properties");
    } else {
      const query = `?location=${location}&propertyType=${propertyType}`;

      router.push(`/properties/search-results${query}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-3 mx-auto max-w-2xl w-full flex flex-col md:flex-row items-center"
    >
      <div className="w-full md:w-3/5 md:pr-2 mb-4 md:mb-0">
        <label htmlFor="location" className="sr-only">
          Location
        </label>
        <input
          type="text"
          id="location"
          placeholder="Enter Keywords or Location"
          className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring focus:ring-primary-500"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      <div className="w-full md:w-2/5 md:pl-2">
        <label htmlFor="property-type" className="sr-only">
          Property Type
        </label>
        <select
          id="property-type"
          className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring focus:ring-primary-500"
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
        >
          <option value="All">All</option>
          {propertyTypes.length > 0 &&
            propertyTypes.map((type) => (
              <option key={type.id} value={type.propertyType}>
                {type.propertyType}
              </option>
            ))}
        </select>
      </div>
      <button
        type="submit"
        className="md:ml-4 mt-4 md:mt-0 w-full md:w-auto px-6 py-3 rounded-lg bg-primary-600 text-white hover:bg-primary-600 focus:outline-none focus:ring focus:ring-primary-500"
      >
        Search
      </button>
    </form>
  );
};

export default PropertySearchForm;
