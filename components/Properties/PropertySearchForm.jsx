"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchPropertyTypes } from "utils/api/propertyListing/fetchPropertyTypes";
import { FaSearch } from "react-icons/fa"; // Import search icon

const PropertySearchForm = () => {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [propertyType, setPropertyType] = useState("All");

  useEffect(() => {
    const handleFetchPropertyTypes = async () => {
      try {
        const res = await fetchPropertyTypes();
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
      className="flex items-center gap-2 bg-white shadow-lg rounded-full px-4 py-2 border border-gray-300 w-full max-w-lg"
    >
      {/* Location Input */}
      <div className="flex-1">
        <label htmlFor="location" className="sr-only">
          Location
        </label>
        <input
          type="text"
          id="location"
          placeholder="Where?"
          className="w-full bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-300"></div>

      {/* Property Type Dropdown */}
      <div>
        <label htmlFor="property-type" className="sr-only">
          Property Type
        </label>
        <select
          id="property-type"
          className="bg-transparent text-gray-800 focus:outline-none cursor-pointer"
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
        >
          <option value="All">All</option>
          {propertyTypes?.length > 0 &&
            propertyTypes.map((type) => (
              <option key={type.id} value={type.propertyType}>
                {type.propertyType}
              </option>
            ))}
        </select>
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-300"></div>

      {/* Search Button */}
      <button
        type="submit"
        className="bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition-all"
      >
        <FaSearch size={16} />
      </button>
    </form>
  );
};

export default PropertySearchForm;
