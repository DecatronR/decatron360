"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchPropertyTypes } from "utils/api/propertyListing/fetchPropertyTypes";
import { Search } from "lucide-react";

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
      className="flex items-center bg-white shadow-lg rounded-full px-3 py-1 md:px-4 md:py-2 border border-gray-300 w-full max-w-lg"
    >
      {/* Mobile Responsive Wrapper */}
      <div className="flex w-full gap-2">
        {/* Location Input - 50% width */}
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
        <div className="hidden md:block w-px h-6 bg-gray-300"></div>

        {/* Property Type Dropdown - 50% width */}
        <div className="flex-1">
          <label htmlFor="property-type" className="sr-only">
            Property Type
          </label>
          <select
            id="property-type"
            className="w-full bg-transparent text-gray-800 focus:outline-none cursor-pointer"
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
      </div>

      {/* Search Button */}
      <button
        type="submit"
        className="bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition-all ml-2"
      >
        <Search size={16} />
      </button>
    </form>
  );
};

export default PropertySearchForm;
